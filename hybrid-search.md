# Hybrid Search Architecture: A Technical Deep Dive

## 1. The Core Concept
**Hybrid Search** is the fusion of two distinct retrieval methods to improve search accuracy:
1.  **Keyword Search (Lexical):** Matches exact words using **BM25**. Good for specific terms (e.g., product IDs, acronyms).
2.  **Semantic Search (Vector):** Matches meaning using **Dense Embeddings**. Good for concepts and context.

---

## 2. Why Specialized "Hybrid DBs"? (The Two-Index Problem)
While you *can* store vectors and text separately, specialized databases solve two complex architectural hurdles:

### A. The "Two Index" Challenge
Standard databases cannot efficiently store both types of data in the same structure.
* **Vector Search** needs a **Vector Index** (e.g., HNSW) to navigate high-dimensional space.
* **BM25 Search** needs an **Inverted Index** (a map of Words → Document IDs).
* **Hybrid DBs** manage both indexes simultaneously, ensuring that a single "Write" operation updates both the semantic and keyword representations without desynchronization.

### B. The "Apples vs. Oranges" Scoring Problem
* **BM25 Scores:** Unbounded (e.g., 0 to 50+). Based on term frequency.
* **Vector Scores:** Bounded (e.g., 0.0 to 1.0). Based on Cosine Similarity.
* **Hybrid DBs** provide native algorithms (like RRF) to normalize and merge these incompatible scores into a single result list.

---

## 3. Storage Internals: How Data is Actually Stored

In a hybrid-compatible database, a single document is stored as a composite object containing two distinct types of vectors.

### A. Dense Vectors (for Semantic Search)
* **Representation:** A fixed-length array of floats.
* **Dimensions:** Typically 384, 768, or 1536.
* **Example:** `[0.12, -0.98, 0.05, ...]`
* **Storage:** Graph-based index (HNSW).

### B. Sparse Vectors (for BM25/Keyword Search)
* **Representation:** A map of indices (vocabulary IDs) to values (weights).
* **Dimensions:** Size of the entire vocabulary (can be millions).
* **Example:**
    ```json
    "sparse_values": {
      "indices": [405, 991, 102],  // The words "cat", "sat", "mat"
      "values": [1.2, 0.5, 0.8]    // The pre-calculated weights
    }
    ```
* **Storage:** Inverted Index.

---

## 4. The Math of BM25 Storage (The "Pre-calculation" Logic)
Why does the DB store "values" like `1.2` inside the sparse vector? 

The BM25 formula is split into two parts to optimize speed:

$$Score = \text{Global Importance (IDF)} \times \text{Local Importance (TF + Norm)}$$

### What is Stored (Static)
The DB pre-calculates the **Local Importance** when the document is indexed. This includes:
1.  **Term Frequency (TF):** How often the word appears in the doc.
2.  **Field Length Norm:** Normalizing based on the document's length relative to the average.

By storing this pre-baked value, the database turns a complex BM25 formula into a simple **Dot Product** at query time.

### What is Calculated at Query Time (Dynamic)
**IDF (Inverse Document Frequency):** The "rarity" of the search term across the whole database.
* *Note on Updates:* DBs rarely update IDF in real-time. They use **Sharding** or **Background Merging** to update statistics periodically, preventing performance hits during data ingestion.

---

## 5. Fusion Strategies (Solving Doubt #1)
How do we combine the `0.85` Vector score with the `12.5` BM25 score?

### Strategy A: Reciprocal Rank Fusion (RRF)
* **Logic:** Ignores the raw scores completely. It only cares about the **position** (rank) of the document in the two lists.
* **Formula:** $\sum \frac{1}{k + rank}$
* **Pros:** No tuning required.
* **Cons:** Ignores the magnitude of the match (a "perfect" match is treated the same as a "barely made it" match).

### Strategy B: Linear Combination (Convex Score)
* **Logic:** Normalizes BM25 scores to a 0–1 range and adds them using a weight ($\alpha$).
* **Formula:** $Score = \alpha \cdot Vector + (1-\alpha) \cdot NormalizedBM25$
* **Pros:** Preserves the nuance of "how good" a match was.
* **Cons:** Requires tuning the $\alpha$ parameter.

---

## 6. Performance & Latency (Solving Doubt #2)
Does running two searches double the latency? **Generally, No.**

1.  **Parallel Execution:** Modern DBs run the Vector search (GPU/SIMD heavy) and the BM25 search (Memory heavy) on separate threads simultaneously. The total time is `Max(Vector, BM25) + Merge`.
2.  **Resource Cost:** While fast, Hybrid Search is **memory expensive**. You are essentially maintaining two full indexes, doubling the storage/RAM requirements compared to a single-method system.
