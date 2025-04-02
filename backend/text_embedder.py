from openai import OpenAI
from typing import Optional, List, Union

class TextEmbedder:
    def __init__(self, model: str = "text-embedding-3-small", api_key: Optional[str] = "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"):
        self.client = OpenAI(api_key=api_key)
        self.model = model
    
    def embed(self, text: Union[str, List[str]]) -> Union[List[float], List[List[float]]]:
        """
        Create embeddings for a single text or a list of texts.
        
        Args:
            text: A string or list of strings to embed
            
        Returns:
            If input is a string: A single embedding vector (list of floats)
            If input is a list: A list of embedding vectors
        """
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=text
            )
            
            # Handle single input case
            if isinstance(text, str):
                return response.data[0].embedding
            # Handle list input case
            else:
                return [item.embedding for item in response.data]
                
        except Exception as e:
            raise Exception(f"Embedding error: {e}")
    
    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Cosine similarity score (between -1 and 1)
        """
        if len(embedding1) != len(embedding2):
            raise ValueError("Embeddings must have the same dimensionality")
            
        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))
        magnitude1 = sum(a * a for a in embedding1) ** 0.5
        magnitude2 = sum(b * b for b in embedding2) ** 0.5
        
        if magnitude1 * magnitude2 == 0:
            return 0
            
        return dot_product / (magnitude1 * magnitude2)

# Usage example:
# embedder = TextEmbedder()
# embedding = embedder.embed("Hello world")
# embeddings = embedder.embed(["Hello world", "How are you?"])
# similarity = embedder.similarity(embeddings[0], embeddings[1])