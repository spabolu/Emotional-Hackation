from flask import Flask, jsonify
from db_connection import DatabaseConnection

app = Flask(__name__)
db_connection = None    # to connect to psql database

@app.route('/')
def home():
    return 'Hello from Flask 3.9!'

@app.route("/users/<int:id>", methods=["GET"])
def movie(id):
    # check database connection 
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    query = f"SELECT * FROM users WHERE user_id = %s;"
    db_connection.execute_query(query, (id,))
    user = db_connection.cursor.fetchone()
    
    if user:
        # Format user data as a dictionary
        user_data = {
            "user_id": user[0],        
            "username": user[1],       
            "first_name": user[2],     
            "last_name": user[3],      
            "about_me": user[4]
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404


# Utility Method to establish DB connection when sever starts
def initialize_db_connection():
    global db_connection
    db_connection = DatabaseConnection(
        dbname="neondb",
        user="neondb_owner",
        password="npg_WuMNtdKJ3v8a",
        host="ep-flat-hill-a50y2o25-pooler.us-east-2.aws.neon.tech",
        port="5432"
    )
    db_connection.connect()

# Utility Method to close DB connection when sever stops
def close_db_connection():
    if db_connection:
        db_connection.close()
    
if __name__ == "__main__":
    initialize_db_connection()
    app.run(debug=False, use_reloader=False)
    close_db_connection()