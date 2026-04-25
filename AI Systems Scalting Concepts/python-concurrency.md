# 🚀 Mastering Python Concurrency: From Event Loops to Load Testing

This documentation explains how to build a high-performance Python server capable of handling **Heavy Compute (LLM)**, **Blocking I/O (Legacy APIs)**, and **Async Tasks** simultaneously without crashing.

---

## 🏗️ 1. The Architectural Pillars

To build a scalable server, you must use the right "worker" for the right job.

| Component | Analogy | Best For... | Why? |
| --- | --- | --- | --- |
| **Event Loop** | The Manager | Coordination & Async I/O | Fast, single-threaded, handles 10k+ "waits" easily. |
| **Process Pool** | Separate Offices | CPU-Bound (LLM, Math) | Bypasses the **GIL**; uses multiple CPU cores. |
| **Thread Pool** | Multiple Desks | Blocking I/O (requests) | Cheap; threads "sleep" during network waits. |

### The Core Difference: `run_in_executor` vs. Pool Creation

* **The Pool (`Executor`)**: This is the **infrastructure**. You create it once (e.g., `ProcessPoolExecutor(max_workers=4)`).
* **`run_in_executor`**: This is the **command**. It tells the Event Loop to take a specific function and "toss it over the wall" to the pool so the main thread doesn't freeze.

---

## ⚡ 2. Solving the "Blocking" Problem

### The Problem with Synchronous Libraries

If you use a library like `requests` directly in an `async` function, the **entire server stops**. No other users can connect until that one request finishes.

### The Optimal Solution: Hybrid Concurrency

We wrap blocking calls in a **Thread Pool** and reuse connections via a `Session`.

```python
# Optimal Pattern for Blocking I/O
session = requests.Session()
adapter = HTTPAdapter(pool_connections=50, pool_maxsize=100)
session.mount("http://", adapter)

async def blocking_io_route():
    loop = asyncio.get_running_loop()
    # Offload to threads so the Event Loop stays responsive
    result = await loop.run_in_executor(thread_pool, sync_function, session)
    return result

```

---

## 📊 3. Load Testing with Locust

When you run a load test, the Locust dashboard reveals your server's hidden bottlenecks.

### What to look for on the Dashboard:

1. **Response Time (Median vs. P95)**:
* If **P95** is much higher than the median, your **Pools** are saturated. Requests are sitting in a queue waiting for a free worker.


2. **RPS (Requests Per Second)**:
* If RPS flattens out while CPU is at 100%, you have reached your physical hardware limit for LLM/Compute work.


3. **Failures**:
* **SSLErrors / Connection Refused**: Usually means you aren't reusing connections (use a `Session`) or the external API is rate-limiting you.



### Understanding `@task(x)`

The number `x` is the **weight**.

* `@task(3)` on `/fast` and `@task(1)` on `/heavy` means 75% of your users will hit the fast route and 25% will hit the heavy route. This simulates real-world user behavior.

---

## 🛠️ 4. Debugging Common Pitfalls

### "Max Retries Exceeded" & SSL Errors

This happens during high load because:

* You are opening too many new connections too fast.
* **Fix**: Use a `requests.Session()` with an `HTTPAdapter` to keep connections alive and reuse them.

### Why use a Mock Server?

When testing I/O performance, public APIs (like `httpbin.org`) will block you. A local **Mock Server** (FastAPI with `asyncio.sleep`) allows you to test your server's threading limits without network interference or SSL overhead.

---

## 📋 5. Summary Code Template

```python
import asyncio
from fastapi import FastAPI
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

app = FastAPI()
cpu_pool = ProcessPoolExecutor(max_workers=4)    # For LLM/Math
io_pool = ThreadPoolExecutor(max_workers=20)      # For Blocking Libraries

@app.get("/heavy")
async def heavy():
    # HANDOFF to Process Pool (Parallelism)
    return await asyncio.get_running_loop().run_in_executor(cpu_pool, cpu_bound_func)

@app.get("/legacy-api")
async def legacy():
    # HANDOFF to Thread Pool (Concurrency)
    return await asyncio.get_running_loop().run_in_executor(io_pool, sync_io_func)

```

---

### 💡 Final Concept :
Implementing a **Circuit Breaker** (or a **Backpressure** mechanism) is the "safety fuse" of high-performance servers. Without it, if 10,000 requests hit your 2-core LLM pool, the queue will grow indefinitely, RAM will spike, and the server will eventually crash (OOM - Out of Memory).

By adding a **Semaphore**, we can limit exactly how many requests are allowed to even "enter" the queue at once.

### 1. The "Safety Fuse" Code (Semaphore)

We wrap the `run_in_executor` call with an `asyncio.Semaphore`. If the limit is reached, the 1,001st request will wait at the "gate" rather than entering the memory-heavy queue.

```python
import asyncio
from fastapi import FastAPI, HTTPException

app = FastAPI()
# Limit the LLM queue to 10 concurrent requests
# (2 running + 8 waiting in line)
llm_semaphore = asyncio.Semaphore(10)

@app.get("/heavy-compute")
async def heavy_compute():
    # 1. Check if the "Circuit Breaker" is full
    if llm_semaphore.locked():
        # Option A: Wait for a slot
        # Option B: Return a 503 Busy error (Better for UX)
        print("⚠️ Queue Full! Rejecting request to save memory.")
        raise HTTPException(status_code=503, detail="Server Busy - Try again later")

    async with llm_semaphore:
        loop = asyncio.get_running_loop()
        # This only runs if we passed the semaphore gate
        result = await loop.run_in_executor(cpu_pool, heavy_math)
        return {"result": result}

```

---

### 2. Monitoring Memory (The Final Piece)

To understand how 1,000 requests affect your RAM, you should use `psutil`. This allows you to log your RAM usage directly inside your server logs so you can see it while Locust is running.

```python
import psutil
import os

def get_memory_usage():
    process = psutil.Process(os.getpid())
    mem_mb = process.memory_info().rss / 1024 / 1024
    print(f"🧠 RAM Usage: {mem_mb:.2f} MB")

# Add this to your FastAPI routes to watch it in real-time

```

---

## 🏗️ Final Documentation Addition: System Health

| Strategy | Problem it Solves | Impact on Locust Dashboard |
| --- | --- | --- |
| **Semaphore** | Prevents RAM crashes (OOM) by limiting queue size. | You will see **503 Errors** instead of 100s of "Timed Out" requests. |
| **Circuit Breaker** | Stops requests from piling up when the backend is failing. | Prevents the "staircase" response time climb. |
| **Connection Pool** | Prevents SSL/Port exhaustion. | Eliminates the "Max retries exceeded" red errors. |

### How to use this now:

1. **Update your `server.py**` with the `Semaphore`.
2. **Run Locust** with a very high user count (e.g., 500).
3. **Observe the "Failures" tab**: You'll see your server gracefully rejecting work (503) instead of freezing. This is what a "production-ready" system looks like.

---
