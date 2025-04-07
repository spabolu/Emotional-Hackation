import requests

def test_add_ai_insight(user_id):
    url = f"http://127.0.0.1:5000/add_ai_insight/{user_id}"
    
    try:
        # Send a POST request to the endpoint
        response = requests.post(url)
        
        # Print the status code and response
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

def test_find_friend(user_id):
    url = f"http://127.0.0.1:5000/find_friend/{user_id}"
    
    try:
        # Send a POST request to the endpoint
        response = requests.post(url)
        
        # Print the status code and response
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        
def test_find_groups(user_id):
    url = f"http://127.0.0.1:5000/find_groups/{user_id}"
    
    try:
        # Send a POST request to the endpoint
        response = requests.post(url)
        
        # Print the status code and response
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":

    test_user_id = 69
    
    test_find_friend(test_user_id)
    test_find_groups(test_user_id)
    # test_add_ai_insight(test_user_id)
    
