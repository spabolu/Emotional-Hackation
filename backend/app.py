import os
import re
import json
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Custom imports: ensure these modules are available in your project
from llm import LLM  # For interacting with the OpenAI API
import llm         # Provides stateful assistant functions
from db_connection import DatabaseConnection  # Manages database connectivity
from text_embedder import TextEmbedder          # Used for generating text embeddings

# -----------------------------------------------------------------------------
# Load Environment Variables
# -----------------------------------------------------------------------------
load_dotenv()  # Load .env file if it exists

# -----------------------------------------------------------------------------
# Flask Application Setup
# -----------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Global variables for the database connection and text embedder
db_connection = None
embedder = None

# Custom header name for passing the thread ID (used by chat endpoints)
THREAD_ID_HEADER = 'X-Thread-ID'

# =============================================================================
# API Endpoints
# =============================================================================

@app.route('/')
def home():
    """
    Home endpoint that returns an HTML page with descriptions of the available API endpoints.
    """
    return """
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Journal Companion API</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 40px; }
            .container { background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee; }
            li:last-child { border-bottom: none; }
            a { color: #007BFF; text-decoration: none; }
            a:hover { text-decoration: underline; }
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

# -----------------------------------------------------------------------------
# Journal Submission / Summarization Endpoints
# -----------------------------------------------------------------------------

@app.route("/add_journal_entry", methods=["POST", "OPTIONS"])
def add_journal_entry():
    """
    Endpoint to add a journal entry to the database.
    Expects a JSON payload with 'user_id', 'title', and 'content'.
    """
    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request

    data = request.get_json()
    user_id = data.get("user_id")
    title = data.get("title")
    content = data.get("content")

    # Validate required fields
    if not user_id or not title or not content:
        return jsonify({"error": "Missing user_id, title, or content"}), 400

    # Insert journal entry into the database
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
    """
    Endpoint to generate a summary for the latest journal entry of a user.
    Uses the LLM to generate a summary and updates the database.
    """
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500

    # Fetch the most recent journal entry for the given user
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

    # Generate summary using the LLM
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

# -----------------------------------------------------------------------------
# Journal Companion / Chat Endpoints
# -----------------------------------------------------------------------------

@app.route('/journal-entry', methods=['POST'])
def handle_journal_entry():
    """
    Endpoint to handle journal entries in a chat-style format.
    Expects a JSON payload with the 'entry' key and an optional X-Thread-ID header.
    """
    data = request.json
    entry_text = data.get('entry')
    thread_id = request.headers.get(THREAD_ID_HEADER)  # May be None for new threads

    if not entry_text:
        return jsonify({"error": "No entry text provided"}), 400

    print(f"Received journal entry request (Header Thread ID: {thread_id or 'None - will create new'})")

    try:
        # Process the journal entry using the assistant (stateful conversation)
        response_text, used_thread_id = llm.get_assistant_response(
            thread_id, entry_text, is_journal_entry=True
        )

        # Return the assistant's response and the thread ID used
        if response_text.startswith("Error:"):
            return jsonify({"error": response_text, "thread_id": used_thread_id}), 500
        else:
            return jsonify({"response": response_text, "thread_id": used_thread_id})
    except Exception as e:
        print(f"Unhandled exception in /journal-entry endpoint: {e}")
        return jsonify({"error": "An unexpected server error occurred."}), 500

@app.route('/chat', methods=['POST'])
def handle_chat():
    """
    Endpoint to handle chat messages.
    Requires a JSON payload with the 'message' key and an existing X-Thread-ID header.
    """
    data = request.json
    message_text = data.get('message')
    thread_id = request.headers.get(THREAD_ID_HEADER)

    if not message_text:
        return jsonify({"error": "No message text provided"}), 400

    if not thread_id:
        return jsonify({
            "error": f"Missing {THREAD_ID_HEADER} header. Chat requires an existing thread ID."
        }), 400

    print(f"Received chat message request (Header Thread ID: {thread_id})")

    try:
        # Process the chat message using the assistant (stateful conversation)
        response_text, used_thread_id = llm.get_assistant_response(
            thread_id, message_text, is_journal_entry=False
        )

        if response_text.startswith("Error:"):
            return jsonify({"error": response_text, "thread_id": used_thread_id}), 500
        else:
            return jsonify({"response": response_text, "thread_id": used_thread_id})
    except Exception as e:
        print(f"Unhandled exception in /chat endpoint: {e}")
        return jsonify({"error": "An unexpected server error occurred."}), 500

@app.route('/fetch_journals/<int:user_id>', methods=["GET", "OPTIONS"])
def fetch_journals(user_id):

    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request

    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    query = """
        SELECT title, entry_date, content, journal_id FROM public.journals
        WHERE user_id = %s
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

@app.route('/journal_consent_true/<int:user_id>', methods=["POST", "OPTIONS"])
def journal_consent_true(user_id):
    """
    Endpoint to update the latest journal entry's consent flag to allow AI summaries.
    """
    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request

    try:
        # Fetch the latest journal entry for the user
        query = """
            SELECT journal_id FROM journals
            WHERE user_id = %s
            ORDER BY entry_date DESC
            LIMIT 1;
        """
        db_connection.execute_query(query, (user_id,))
        latest_entry = db_connection.cursor.fetchone()

        if not latest_entry:
            return jsonify({"error": "No journal entries found for this user"}), 404

        latest_entry_id = latest_entry[0]
        print(latest_entry_id)

        # Update the consent flag to TRUE
        update_query = """
            UPDATE journals
            SET ai_summary_consent = TRUE
            WHERE journal_id = %s;
        """
        db_connection.execute_query(update_query, (latest_entry_id,))
        return jsonify({"message": "AI summary consent updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error updating AI summary consent: {e}"}), 500

# -----------------------------------------------------------------------------
# Discover Section Endpoints
# -----------------------------------------------------------------------------

@app.route('/fetch_connections/<int:user_id>', methods=["GET", "OPTIONS"])
def fetch_connections(user_id):
    """
    Endpoint to fetch all connections for a user.
    """
    if request.method == "OPTIONS":
        return "", 200  # Handle preflight request

    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500

    query = """
        SELECT id, matched_id, display_name, state, is_group, user_insight, matched_insight
        FROM public.connections
        WHERE user_id = %s
    """
    db_connection.execute_query(query, (user_id,))
    connections = db_connection.cursor.fetchall()

    # Debug: print the fetched connections
    print(f"Fetched connections for user {user_id}: {connections}")

    connection_list = [
        {
            "id": connection[0],
            "matched_id": connection[1],
            "display_name": connection[2],
            "state": connection[3],
            "is_group": connection[4],
            "user_insight": connection[5],
            "matched_insight": connection[6],
        }
        for connection in connections
    ]

    return jsonify({"connections": connection_list}), 200

# RUNS ASYNC 
@app.route("/add_ai_insight/<int:id>", methods=["POST"])
def ai_insights(id):
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Fetch the latest 5 journal summaries with AI consent
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

    # Combine the summaries into one text string
    combined_summaries = " ".join(summaries)
    print(combined_summaries)

    # Generate AI insight using the LLM
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

    # Generate an embedding for the insight text
    try:
        embedding = embedder.embed(insight_text)
    except Exception as e:
        return jsonify({"error": f"Error generating embedding: {e}"}), 500

    # Insert the AI-generated insight into the database
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
    """
    Endpoint to find a friend by matching AI insights.
    Finds the most similar AI insight from another user and creates a connection entry.
    """
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Fetch the most recent AI insight for the user
    query = """
        SELECT embedding, insights
        FROM ai_insight 
        WHERE user_id = %s 
        ORDER BY insight_date DESC 
        LIMIT 1;
    """
    db_connection.execute_query(query, (id,))
    result = db_connection.cursor.fetchone()
    if not result:
        return jsonify({"error": f"No AI insights available for user {id}"}), 404
    embedding, user_A_insight = result

    # Find the most similar insight from another user using vector similarity search
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
    
    # Insert the connection entry into the database
    try:
        insert_query = """
            INSERT INTO connections (user_id, matched_id, state, display_name, is_group, user_insight, matched_insight)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        db_connection.execute_query(insert_query, (id, [similar_user_id], 'suggested', similar_username, False, user_A_insight, user_B_insights))
        return jsonify({"message": "Connection added successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Error inserting connections: {e}"}), 500

@app.route("/find_groups/<int:user_id>", methods=["POST"])
def find_groups(user_id):
    """
    Endpoint to find groups based on AI insights.
    Finds similar insights, generates a group chat name using the LLM, and inserts a group connection.
    """
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    # Fetch the latest AI insight for the user
    query = """
        SELECT user_id, insights, embedding
        FROM ai_insight
        WHERE user_id = %s
        ORDER BY insight_date DESC
        LIMIT 1;
    """
    db_connection.execute_query(query, (user_id,))
    latest_insight = db_connection.cursor.fetchone()

    if not latest_insight:
        return jsonify({"error": f"No AI insights found for user {user_id}"}), 404

    latest_id, latest_text, latest_embedding = latest_insight

    # Find similar insights using vector similarity (L2 distance)
    similarity_threshold = 0.7  # Adjust based on your requirements
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

    # Generate a group chat name using the LLM
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
        print(jsonify({
            "original_user_id": user_id,
            "matched_user_ids": matched_ids,
            "matched_insights": matched_insights,
            "group_chat_name": group_chat_name
        }))
        match = re.search(r'NAME:\s*"([^"]+)"', group_chat_name)
        group_chat_name = match.group(1) if match else "Unnamed Group"
    except Exception as e:
        return jsonify({"error": f"Error generating group name: {e}"}), 500
    
    # Insert the group connection entry into the database
    try:
        insert_query = """
            INSERT INTO connections (user_id, matched_id, state, display_name, is_group)
            VALUES (%s, %s, %s, %s, %s)
            """
        db_connection.execute_query(insert_query, (user_id, matched_ids, "suggested", group_chat_name, True))
        return jsonify({"message": "Connection entry added successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Error inserting connection entry: {e}"}), 500

@app.route("/ice_breaker/<int:id>", methods=["GET"])
def ice_breaker(id):
    """
    Endpoint to generate a creative icebreaker statement for a connection.
    Uses insights from the connection to prompt the LLM for a conversation starter.
    """
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500
    
    try:
        query = """
            SELECT user_insight, matched_insight FROM public.connections
            WHERE id = %s
        """
        db_connection.execute_query(query, (id,))
        insights = db_connection.cursor.fetchone()

        if not insights:
            return jsonify({"error": "No insights found for the given ID"}), 404

        insight1, insight2 = insights

        gpt = LLM()
        prompt = (
            "You are an assistant that helps spark conversations between users based on personal insights.\n"
            "Say something like you guys should talk to one another.\n"
            "Given the two insights below, write one concise, friendly, and creative icebreaker statement to help the users begin chatting. "
            "The tone should be light, engaging, and respectful. Avoid using emojis or overly casual language.\n\n"
            f"User 1 Insight: {insight1}\n"
            f"User 2 Insight: {insight2}\n\n"
        )
        icebreaker = gpt.ask(prompt)
        print(icebreaker)
        return jsonify({"ice_breaker": icebreaker}), 200
    except Exception as e:
        return jsonify({"error": f"Error generating ice breaker: {str(e)}"}), 500

@app.route("/accept_connection", methods=["POST"])
def accept_connection():
    if db_connection is None:
        return jsonify({"error": "Database connection not established"}), 500

    data = request.get_json()
    connection_id = data.get("connection_id")

    if not connection_id:
        return jsonify({"error": "Missing connection_id"}), 400

    try:
        # Update the status to 'accepted'
        update_query = """
            UPDATE public.connections
            SET state = 'accepted'
            WHERE id = %s;
        """
        db_connection.execute_query(update_query, (connection_id,))
        return jsonify({"message": "Connection accepted successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Database error: {e}"}), 500


# -----------------------------------------------------------------------------
# Utility Functions for Database Connection
# -----------------------------------------------------------------------------

def initialize_db_connection():
    """
    Initializes the global database connection using the provided credentials.
    """
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
    """
    Closes the global database connection if it exists.
    """
    if db_connection:
        db_connection.close()

# -----------------------------------------------------------------------------
# Run the Flask Application
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    # Initialize the text embedder and database connection before starting the server
    embedder = TextEmbedder()
    initialize_db_connection()
    try:
        # Run Flask app with debug mode enabled and disable reloader to avoid duplicate DB connections
        app.run(debug=True, use_reloader=False)
    finally:
        close_db_connection()
