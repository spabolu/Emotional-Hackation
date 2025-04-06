from openai import OpenAI
from typing import Optional, List, Union

class TextEmbedder:
    """
    A class for generating text embeddings using OpenAI's embedding API.

    Attributes:
        client (OpenAI): The OpenAI client instance used for API requests.
        model (str): The model identifier for generating embeddings.
    """

    def __init__(
        self, 
        model: str = "text-embedding-3-small", 
        api_key: Optional[str] = "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"
    ):
        """
        Initialize the TextEmbedder with a specific model and API key.

        Args:
            model (str, optional): The embedding model to use. Defaults to "text-embedding-3-small".
            api_key (Optional[str], optional): The API key for OpenAI. Defaults to a placeholder key.
        """
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def embed(self, text: Union[str, List[str]]) -> Union[List[float], List[List[float]]]:
        """
        Generate embeddings for a single text string or a list of text strings.

        Args:
            text (Union[str, List[str]]): The text or list of texts to embed.

        Returns:
            Union[List[float], List[List[float]]]:
                - If a string is provided, returns a list of floats representing the embedding vector.
                - If a list is provided, returns a list of embedding vectors.

        Raises:
            Exception: If there is an error during the embedding generation.
        """
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=text
            )
            # If the input is a single string, return the first embedding vector.
            if isinstance(text, str):
                return response.data[0].embedding
            # Otherwise, return a list of embedding vectors.
            else:
                return [item.embedding for item in response.data]
        except Exception as e:
            raise Exception(f"Embedding error: {e}")

    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate the cosine similarity between two embedding vectors.

        Args:
            embedding1 (List[float]): The first embedding vector.
            embedding2 (List[float]): The second embedding vector.

        Returns:
            float: The cosine similarity score between the two vectors (range -1 to 1).

        Raises:
            ValueError: If the embeddings do not have the same dimensionality.
        """
        if len(embedding1) != len(embedding2):
            raise ValueError("Embeddings must have the same dimensionality")

        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))
        magnitude1 = sum(a * a for a in embedding1) ** 0.5
        magnitude2 = sum(b * b for b in embedding2) ** 0.5

        if magnitude1 * magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

# -----------------------------------------------------------------------------
# Usage Examples (Commented Out)
# -----------------------------------------------------------------------------
# Example for a single text string:
# embedder = TextEmbedder()
# embedding = embedder.embed("Hello world")
#
# Example for a list of texts:
# embeddings = embedder.embed(["Hello world", "How are you?"])
#
# Calculate similarity between two embeddings:
# similarity_score = embedder.similarity(embeddings[0], embeddings[1])
