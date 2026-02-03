I am exlporing the problem statement :
- Using knowledge nodes that has node-desription to answer user queries. 
- Setting up a threshold to (some kind of) similarity match between user query and descrption

Standard Way : Create embeddings | Similarity score. 

Dimentions/Parameters to play with :

1. Embdedding Model Performance:
	a) Use different multilingual models. 
	b) Find balance between response time and performance

2. Similarity Score : Embedding Cosine the most common. 

	a) Embeddings capture sematics of docs, which causes to squeeze the information in a vector of say 1024. This information squeeze causes information loss. Hence, just embeddings might not be enough. 
	b) Hybrid search : combines vector-based techniques with traditional keyword-based methods, allowing it to leverage both semantic understanding and exact keyword matching. This uses embedding search and keyword search -- dense and sparse method of searching. 
	For embeddings, we can use cosine similarity and for keyword match, BM25 algorithm is used. 
	Hybrid search is better suited for applications where users might combine vague intent. 

	c) The issue with setting threshold on hybrid score : 
	BM25 and Vector Search produce scores that look nothing alike. 
	- BM25 scores are unbounded (they can be 1.5, 10.2, or 100) based on term frequency.
	- Vector scores are usually distances or similarities [0,1]. DB merges these using Reciprocal Rank Fusion (RRF). So essentially the score we get is just good enough for ranking, but not for threshold!

	d) How do we solve for this? 
	Milvus : 

    # 1. Get Dense Results
    dense_results = self._search_dense(query, top_k, filter_expr)
    
    # 2. Get Sparse Results
    sparse_results = self._search_sparse(query, top_k, filter_expr)
            
    # 3. Manually calculate hybrid score (Weighted Sum)
    for res in combined_data.values():
        res["hybrid_score"] = (alpha * res["dense_score"]) + ((1 - alpha) * res["sparse_score"])
        
    #4. Sort by the new hybrid score
    return sorted(combined_data.values(), key=lambda x: x["hybrid_score"], reverse=True)[:top_k]

    But in OpenSearch, we doesnt have this issue. 

    e) Mostly important hack : 
    We will extract score for both, but for thresholding we will use only the embedding match --> this beautifully combines the embedding-matches + re-ranker filter into just one step of hybrid search. 


     

