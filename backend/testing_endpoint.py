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

import requests

url = "http://127.0.0.1:5000/add_journal_entry"
data = {
    "user_id": 1,
    "title": "A Reflective Day",
    "content": "Today I learned a lot about Flask and APIs."
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response Text:", response.text)  # Print raw response to debug
