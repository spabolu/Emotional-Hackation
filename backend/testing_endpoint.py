# import requests

# url = "http://127.0.0.1:5000/add_ai_insight/1"
# response = requests.post(url)

# print("Status Code:", response.status_code)
# print("Response:", response.json())

# import requests

# user_id = 2
# content = "This is my journal entry."

# url = f"http://127.0.0.1:5000/add_journal_entry/{user_id}/{content}"
# response = requests.post(url)

# print(response.status_code, response.json())  # Should return 201 if successful

# from text_embedder import TextEmbedder

# embedder = TextEmbedder()
# embedding = embedder.embed("Test text")
# print(len(embedding))  # Prints the dimensionality of the embedding

# import requests

# url = "http://127.0.0.1:5000/add_journal_entry"
# data = {
#     "user_id": 1,
#     "title": "A Reflective Day",
#     "content": "Today I learned a lot about Flask and APIs."
# }

# response = requests.post(url, json=data)

# print("Status Code:", response.status_code)
# print("Response Text:", response.text)  # Print raw response to debug


import requests

# Define user_id to test
user_id = 6  # Replace with an actual user ID from your database

# Define the API endpoint
url = f"http://127.0.0.1:5000/summarize_latest_entry/{user_id}"

# Send a POST request
response = requests.post(url)

# Print the response
print("Status Code:", response.status_code)
print("Response JSON:", response.json())

