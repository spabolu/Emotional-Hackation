# from text_embedder import TextEmbedder

# embedder = TextEmbedder()
# embedding = embedder.embed("Test text")
# print(len(embedding))  # Prints the dimensionality of the embedding

import requests

url = "http://127.0.0.1:5000/add_ai_insight/1"
response = requests.post(url)

print("Status Code:", response.status_code)
print("Response:", response.json())