import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from llm import LLM
import llm
from db_connection import DatabaseConnection
from text_embedder import TextEmbedder
from llm import LLM
from datetime import datetime
import json
from flask_cors import CORS
import re


# Load environment variables from .env file if it exists
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Global DB connection (for endpoints using the database)
db_connection = None

# Custom header name for passing the thread ID (used by chat endpoints)
THREAD_ID_HEADER = 'X-Thread-ID'
embedder = None

# ----------------------------
# ENDPOINT DESCRIPTIONS
# ----------------------------
@app.route('/')
def home():
    return """
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Journal Companion API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 40px;
            }
            .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
            li {
                margin: 5px 0;
                padding: 5px;
                border-bottom: 1px solid #eee;
            }
            li:last-child {
                border-bottom: none;
            }
            a {
                color: #007BFF;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Journal Companion API is running.</h1>
            <p>Available endpoints:</p>
            <ul>
                <li><strong>POST</strong> <a href="/journal-entry">/journal-entry</a> (for chat-style journal entries using header thread IDs)</li>
                <li><strong>POST</strong> <a href="/chat">/chat</a> (for chat messages, requires thread ID header)</li>
                <li><strong>GET</strong> <a href="/users/&lt;id&gt;">/users/&lt;id&gt;</a> (retrieve user by ID)</li>
                <li><strong>POST</strong> <a href="/add_ai_insight/&lt;id&gt;">/add_ai_insight/&lt;id&gt;</a> (generate AI insight using recent journal entries)</li>
                <li><strong>POST</strong> <a href="/add_journal_entry">/add_journal_entry</a> (add a journal entry to the database)</li>
            </ul>
        </div>
    </body>
    </html>
    """

# ----------------------------
# Journal Sumbission / Summarization
# ----------------------------
@app.route("/add_journal_entry", methods=["POST", "OPTIONS"])
def add_journal_entry():
    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request
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

@app.route("/summarize_latest_entry/<int:user_id>", methods=["POST"])
def summarize_latest_entry(user_id):
    # Check database connection
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500

    # Fetch the most recent journal entry for the user
    query = """
        SELECT journal_id, content FROM journals
        WHERE user_id = %s
        ORDER BY entry_date DESC
        LIMIT 1;
    """
    db_connection.execute_query(query, (user_id,))
    result = db_connection.cursor.fetchone()

    if not result:
        return jsonify({"error": f"No journal entry found for user {user_id}"}), 404

    journal_id, content = result

    # Generate summary using OpenAI API
    try:
        gpt = LLM()
        summary = gpt.ask(
            f"Summarize this journal entry into a couple sentences while retaining its main themes but keeping it first person and ensuring privacy. Remove personal details and specifics: {content}"
        )
    except Exception as e:
        return jsonify({"error": f"Error generating summary: {e}"}), 500

    # Update the journal entry with the generated summary
    try:
        update_query = """
            UPDATE journals
            SET content_summary = %s
            WHERE journal_id = %s;
        """
        db_connection.execute_query(update_query, (summary, journal_id))
        return jsonify({"message": "Summary added successfully", "summary": summary}), 200
    except Exception as e:
        return jsonify({"error": f"Error updating journal entry: {e}"}), 500


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

@app.route('/fetch_journals/<int:user_id>', methods=["GET", "OPTIONS"])
def fetch_journals(user_id):
    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request
    # Check database connection 
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    query = """
        SELECT title, entry_date, content, journal_id FROM public.journals
        WHERE user_id = 1
        ORDER BY entry_date DESC
    """
    db_connection.execute_query(query, (user_id,))
    journals = db_connection.cursor.fetchall()
    
    if journals:
        journal_entries = [
            {
                "id": journal[3],
                "title": journal[0], 
                "entry_date": journal[1].strftime("%Y-%m-%d"),
                "content": journal[2] 
            } 
            for journal in journals
        ]
        return jsonify({"journals": journal_entries}), 200
    else:
        return jsonify({"journals": []}), 200  


# ----------------------------
# ASYNCRONOUS Vector AI to Find Friends
# ----------------------------
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
            f"Analyze the following journal entries and produce a concise, one-paragraph summary that captures the user's emotional state, recurring themes, cognitive patterns, coping mechanisms, and personal growth over time. "
            f"Focus on identifying consistent emotional trends and behavioral patterns, and ensure that no personally identifying information is included. "
            f"At the end of the paragraph, list 3-5 key descriptive keywords (separated by commas) that best capture the core themes. "
            f"Journal entries: {combined_summaries}"
        )
    except Exception as e:
        return jsonify({"error": f"Error generating AI insight: {e}"}), 500

    # Generate embedding for the insight
    try:
        embedding = embedder.embed(insight_text)
    except Exception as e:
        return jsonify({"error": f"Error generating embedding: {e}"}), 500

    # Insert the AI-generated insight and serialized embedding into the database
    try:
        insert_query = """
            INSERT INTO ai_insight (user_id, insights, insight_date, embedding)
            VALUES (%s, %s, %s, %s);
        """
        db_connection.execute_query(insert_query, (id, insight_text, datetime.now(), embedding))

        return jsonify({"message": "AI insight added successfully", "insight": insight_text, "embedding": embedding}), 200
    except Exception as e:
        return jsonify({"error": f"Error inserting AI insight into database: {e}"}), 500

@app.route("/find_friend/<int:id>", methods=["POST"])
def find_friend(id):
    # Check database connection 
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Fetch the VECTOR representation of smost recent AI insight for the user
    query = """
        SELECT embedding, insights
        FROM ai_insight 
        WHERE user_id = %s 
        ORDER BY insight_date DESC 
        LIMIT 1;
    """
    db_connection.execute_query(query, (id,))
    embedding, user_A_insight = db_connection.cursor.fetchone()

    if not embedding:
        return jsonify({"error": f"No AI insights available for user {id}"}), 404
    
    # Find the most similar insight using pgvector similarity search
    similarity_query = """
        SELECT ai_insight.user_id, username, insights, embedding <-> %s AS distance
        FROM ai_insight JOIN users ON ai_insight.user_id = users.user_id
        WHERE ai_insight.user_id != %s
        ORDER BY distance ASC
        LIMIT 1;
    """
    
    db_connection.execute_query(similarity_query, (embedding, id))
    similar_insight = db_connection.cursor.fetchone()

    if not similar_insight:
        return jsonify({"error": "No similar insights found"}), 404
            
    similar_user_id, similar_username, user_B_insights, _ = similar_insight
    
    # Insert connection entry into database
    try:
        insert_query = """
            INSERT INTO connections (user_id, matched_id, state, display_name, is_group, user_insight, matched_insight)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        db_connection.execute_query(insert_query, (id, [similar_user_id], 'suggested', similar_username, False, user_A_insight, user_B_insights))
        return jsonify({"message": f"Connection added successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Error inserting connections: {e}"}), 500
    
@app.route("/find_groups/<int:user_id>", methods=["POST"])
def find_groups(user_id):
    # Check database connection
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Step 1: Find the latest AI insight for the user
    query = """
        SELECT user_id, insights, embedding
        FROM ai_insight
        WHERE user_id = %s
        ORDER BY insight_date DESC
        LIMIT 1;
    """
   
    db_connection.execute_query(query, (user_id,))
    latest_insight = db_connection.cursor.fetchone()

    latest_id, latest_text, latest_embedding = latest_insight # assign the values 

    if not latest_insight:
        return jsonify({"error": f"No AI insights found for user {user_id}"}), 404
      
    
    # Step 2: Find similar insights using vector similarity (L2 distance)
    similarity_threshold = 0.7  # Adjust based on your needs
    query = """
        SELECT user_id, insights, embedding <-> %s AS distance
        FROM ai_insight
        WHERE user_id != %s
        ORDER BY distance ASC
        LIMIT 5;
    """
    db_connection.execute_query(query, (latest_embedding, user_id,))
    similar_insights = db_connection.cursor.fetchall()

    matched_ids = [row[0] for row in similar_insights if row[2] < similarity_threshold]
    matched_insights = [{"user_id": row[0], "insight": row[1], "distance": row[2]} for row in similar_insights if row[2] < similarity_threshold]

    if len(matched_ids) <= 1:
        return jsonify({"message": "Not enough matches to form a group"}), 200

    insights_text = f"Original Insight: {latest_text}\n"
    insights_text += "Matched Insights:\n"
    for insight in matched_insights:
        insights_text += f"- {insight['insight']}\n"

    try:
        gpt = LLM()
        group_chat_name = gpt.ask(
           f"Given the following insights, generate a short, catchy, and natural-sounding group chat name "
            f"that would resonate with a Gen-Z audience. The name should feel effortless, modern, and relevant—"
            f"something people would actually want to use. Avoid clichés, overused internet slang, or anything overly dramatic. "
            f"Keep it fun yet authentic. Format your response as:\n\n"
            f'NAME: "Your group chat name here"\n\n'
            f"{insights_text}"
        )
        print(jsonify({"original_user_id": user_id, "matched_user_ids": matched_ids, "matched_insights": matched_insights, "group_chat_name": group_chat_name }))
        match = re.search(r'NAME:\s*"([^"]+)"', group_chat_name)
        group_chat_name = match.group(1) if match else "Unnamed Group"

    except Exception as e:
        return jsonify({"error": f"Error generating group name: {e}"}), 500
    
    try:
        insert_query = """
            INSERT INTO connections (user_id, matched_id, state, display_name, is_group)
            VALUES (%s, %s, %s, %s, %s)
            """
        db_connection.execute_query(insert_query, (user_id, matched_ids, "suggested", group_chat_name, True))
        return jsonify({"message": "Connection entry added successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Error inserting connection entry: {e}"}), 500


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
    embedder = TextEmbedder()
    initialize_db_connection()
    try:
        # Running with debug mode enabled; set use_reloader=False to prevent duplicate DB connections.
        app.run(debug=True, use_reloader=False)
    finally:
        close_db_connection()
