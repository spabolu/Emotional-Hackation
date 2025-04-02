from flask import Flask, jsonify
from db_connection import DatabaseConnection
from llm import LLM
from datetime import datetime

app = Flask(__name__)
db_connection = None    # to connect to psql database

@app.route('/')
def home():
    return 'Hello from Flask 3.9!'

# retrieves a user with userid
@app.route("/users/<int:id>", methods=["GET"])
def users(id):
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

# adds an insight for a given userid using the last 5 journal entries
@app.route("/add_ai_insight/<int:id>", methods=["POST"])
def ai_insights(id):
    # check database connection 
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Fetch journal summaries
    query = """
        SELECT content_summary FROM journals 
        WHERE user_id = %s AND ai_summary_consent = TRUE 
        ORDER BY entry_date DESC 
        LIMIT 5;
    """
    db_connection.execute_query(query, (id,))
    summaries = [row[0] for row in db_connection.cursor.fetchall()]

    if not summaries:
        return jsonify({"error": f"No journal entries available for user {id}"}), 404

    # Combine summaries into one string
    combined_summaries = " ".join(summaries)
    print(combined_summaries)

    # Use OpenAI API to create insights
    try:
        gpt = LLM()
        insight_text = gpt.ask( f"Analyze these journal entries and generate insights about the user's thoughts, emotions, and behavioral patterns over time. Focus on recurring themes, emotional trends, and personal growth while maintaining user privacy. Make it one paragraph: {combined_summaries}")
    except Exception as e:
        return jsonify({"error": f"Error generating AI insight: {e}"}), 500

    # Insert the AI-generated insight into the database
    try:
        insert_query = """
            INSERT INTO ai_insight (user_id, insights, insight_date)
            VALUES (%s, %s, %s);
        """
        db_connection.execute_query(insert_query, (id, insight_text, datetime.now()))

        return jsonify({"message": "AI insight added successfully", "insight": insight_text}), 200
    except Exception as e:
        return jsonify({"error": f"Error inserting AI insight into database: {e}"}), 500


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