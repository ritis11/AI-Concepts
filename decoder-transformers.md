This guide synthesizes the architecture of **Decoder-Only Transformers** (like Llama and GPT) based on your specific questions about attention, parallelization, and data dimensions.

---

# The Deep-Dive Guide to Decoder-Only Transformers

## 1. The Architecture Shift: Why "Decoder-Only"?

While the original Transformer used an Encoder to process input and a Decoder to generate output, modern LLMs (Llama, GPT) use only the **Decoder** block.

* **Logic:** A Decoder-only model treats the "prompt" and the "response" as one continuous sequence.
* **The Difference:** It removes the **Cross-Attention** layer (where the decoder looks at the encoder) and keeps **Masked Self-Attention**.
* **Purpose:** This architecture is optimized for **Auto-regressive generation**—predicting the next token based on all previous tokens.

---

## 2. Multi-Head Attention (The "Subspace" Logic)

A common doubt is whether the "whole embedding" is used or if it is "sliced." Mathematically, it is a **projection**.

* **The Input:** Each word starts as a vector (e.g., 512 dimensions).
* **The Projection:** We multiply this 512-dim vector by smaller weight matrices () for each head.
* **The Result:** If there are 8 heads, each head receives a **64-dimension** version of that word.
* **The Benefit:** Each head focuses on different relationships. For example, one head might track grammatical structure while another tracks pronoun references (like "it" referring to "animal").

---

## 3. The "Causal Mask" (How the Decoder Learns)

In the Decoder, we must prevent the model from "seeing the future" during training.

* **The Mechanism:** We apply a **Mask** to the attention scores.
* **The Math:** Values for "future" tokens are set to  before the Softmax step.
* **The Result:** When the model calculates attention for the 3rd word, the 4th, 5th, and 6th words are invisible. This forces the model to learn how to predict based strictly on the past.

---

## 4. Parallel vs. Sequential Processing

You asked how Transformers can be parallel if they are auto-regressive. It depends on the **phase**:

### Phase 1: The Prefill (Parallel)

When you provide a prompt, the model knows all the words already.

* The GPU calculates the attention for **all tokens in your prompt simultaneously**.
* Even though the mask is active, the matrix multiplication for every word in the prompt happens at the same time.

### Phase 2: The Decoding (Sequential)

Once the model starts generating the answer:

* It must produce Token A to calculate Token B.
* This part is **sequential** and cannot be parallelized, which is why text "streams" in one word at a time.

---

## 5. Understanding the 3D Data Dimensions

When looking at normalization or tensor flow diagrams, the 3D cube represents the **Batch** of data:

| Axis | Name | Description |
| --- | --- | --- |
| **N** | **Batch Size** | Multiple independent sequences (e.g., different users) processed at once. |
| **H, W** | **Sequence Length** | The number of tokens (words) in your current prompt. |
| **C** | **Embedding (d_model)** | The "width" of the hidden state (e.g., 512 or 4096 dimensions). |

**Note:** Layer Normalization (common in Transformers) normalizes across the **C** and **H/W** axes for each individual sequence in the batch.

---

## 6. From Vector to Word (The Final Step)

After passing through  layers of decoder blocks, the model produces a final vector.

1. **Linear Layer:** Projects the vector into a massive "Logits" vector (the size of the entire vocabulary, e.g., 50,000 words).
2. **Softmax:** Converts those scores into probabilities.
3. **Selection:** The word with the highest probability is chosen as the next token.

---
