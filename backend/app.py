import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import llm
from llm import LLM
from db_connection import DatabaseConnection
from datetime import datetime

# Load environment variables from .env file if it exists
load_dotenv()

app = Flask(__name__)

# Global DB connection (for endpoints using the database)
db_connection = None

# Custom header name for passing the thread ID (used by chat endpoints)
THREAD_ID_HEADER = 'X-Thread-ID'

@app.route('/')
def home():
    return (
        "Journal Companion API is running.\n"
        "Available endpoints:\n"
        " - /journal-entry [POST] (for chat-style journal entries using header thread IDs)\n"
        " - /chat [POST] (for chat messages, requires thread ID header)\n"
        " - /users/<id> [GET] (retrieve user by ID)\n"
        " - /add_ai_insight/<id> [POST] (generate AI insight using recent journal entries)\n"
        " - /add_journal_entry [POST] (add a journal entry to the database)"
    )

# ----------------------------
# Journal Companion / Chat Endpoints
# ----------------------------

@app.route('/journal-entry', methods=['POST'])
def handle_journal_entry():
    """Endpoint to receive journal entries. Expects X-Thread-ID header for existing convos."""
    data = request.json
    entry_text = data.get('entry')
    # Get thread_id from header if present
    thread_id = request.headers.get(THREAD_ID_HEADER)

    if not entry_text:
        return jsonify({"error": "No entry text provided"}), 400

    print(f"Received journal entry request (Header Thread ID: {thread_id or 'None - will create new'})")

    try:
        # Pass thread_id (which might be None) to the llm function
        response_text, used_thread_id = llm.get_assistant_response(thread_id, entry_text, is_journal_entry=True)

        # Always return the thread_id used so the client can keep track
        if response_text.startswith("Error:"):
            return jsonify({"error": response_text, "thread_id": used_thread_id}), 500
        else:
            # Success: return response and the thread_id for the next request
            return jsonify({"response": response_text, "thread_id": used_thread_id})
    except Exception as e:
        print(f"Unhandled exception in /journal-entry endpoint: {e}")
        return jsonify({"error": "An unexpected server error occurred."}), 500

@app.route('/chat', methods=['POST'])
def handle_chat():
    """Endpoint to receive chat messages. Requires X-Thread-ID header."""
    data = request.json
    message_text = data.get('message')
    # Get thread_id from header - *required* for chat context
    thread_id = request.headers.get(THREAD_ID_HEADER)

    if not message_text:
        return jsonify({"error": "No message text provided"}), 400

    if not thread_id:
        # Enforce that chat requires an existing conversation thread
        return jsonify({"error": f"Missing {THREAD_ID_HEADER} header. Chat requires an existing thread ID."}), 400

    print(f"Received chat message request (Header Thread ID: {thread_id})")

    try:
        # Pass the required thread_id to the llm function
        response_text, used_thread_id = llm.get_assistant_response(thread_id, message_text, is_journal_entry=False)

        # Always return the thread_id used
        if response_text.startswith("Error:"):
            return jsonify({"error": response_text, "thread_id": used_thread_id}), 500
        else:
            # Success: return response and the thread_id
            return jsonify({"response": response_text, "thread_id": used_thread_id})
    except Exception as e:
        print(f"Unhandled exception in /chat endpoint: {e}")
        return jsonify({"error": "An unexpected server error occurred."}), 500

# ----------------------------
# Database-Backed Endpoints
# ----------------------------

@app.route("/users/<int:id>", methods=["GET"])
def users(id):
    # Check database connection 
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    query = "SELECT * FROM users WHERE user_id = %s;"
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

@app.route("/add_ai_insight/<int:id>", methods=["POST"])
def ai_insights(id):
    # Check database connection 
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
        insight_text = gpt.ask(
            f"Analyze these journal entries and generate insights about the user's thoughts, emotions, and behavioral patterns over time. "
            f"Focus on recurring themes, emotional trends, and personal growth while maintaining user privacy. Make it one paragraph: {combined_summaries}"
        )
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

@app.route("/add_journal_entry", methods=["POST"])
def add_journal_entry():
    data = request.get_json()

    # Extract user_id, title, and content from request data
    user_id = data.get("user_id")
    title = data.get("title")
    content = data.get("content")

    if not user_id or not title or not content:
        return jsonify({"error": "Missing user_id, title, or content"}), 400

    # Insert journal entry into database
    try:
        insert_query = """
            INSERT INTO journals (user_id, title, content, entry_date, ai_summary_consent, content_summary)
            VALUES (%s, %s, %s, %s, FALSE, NULL);
        """
        db_connection.execute_query(insert_query, (user_id, title, content, datetime.now()))
        return jsonify({"message": "Journal entry added successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Error inserting journal entry: {e}"}), 500

# ----------------------------
# Utility Functions for Database Connection
# ----------------------------

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

def close_db_connection():
    if db_connection:
        db_connection.close()

# ----------------------------
# Run the Flask Application
# ----------------------------

if __name__ == '__main__':
    initialize_db_connection()
    try:
        # Running with debug mode enabled; set use_reloader=False to prevent duplicate DB connections.
        app.run(debug=True, use_reloader=False)
    finally:
        close_db_connection()
