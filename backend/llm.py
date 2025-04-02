import os
import time
from openai import OpenAI, NotFoundError # Import NotFoundError for checking
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# --- Assistant Definition ---
ASSISTANT_NAME = "Journal Companion"
ASSISTANT_MODEL = "gpt-4o-mini" # Or "gpt-4-turbo" or another preferred model
ASSISTANT_INSTRUCTIONS = """
You are a warm, empathetic, and non-judgmental companion bot designed to help users reflect on their journal entries. Your tone is gentle, friendly, and encouraging.

When a user provides a journal entry (often submitted first in the conversation or explicitly marked like 'Here is my latest journal entry:...'), acknowledge it thoughtfully. Your primary focus should ALWAYS be the user's *latest* journal entry provided in this thread.

Ask open-ended, supportive questions related to their latest entry to help them explore their thoughts and feelings further. Start with lighter questions and gradually, if appropriate and the user seems receptive, ask slightly deeper reflective questions.

Reference previous journal entries or chat messages *only* if they provide essential context for understanding the latest entry or offer a natural bridge for a follow-up question. Avoid dwelling on the past unless it directly relates to the present entry's themes.

Your goal is to be a good listener, encourage a positive self-reflection spiral, and help the user gain clarity. Remember the entire conversation history within this thread to maintain context. Do not give medical advice. Keep responses concise but meaningful.
"""
# --- -------------------- ---

# Ensure API key is set
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Missing environment variable: OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# --- Get or Create Assistant ID ---
assistant_id = os.getenv("OPENAI_ASSISTANT_ID")

if not assistant_id:
    print("Environment variable OPENAI_ASSISTANT_ID not set. Creating a new assistant...")
    try:
        assistant = client.beta.assistants.create(
            name=ASSISTANT_NAME,
            instructions=ASSISTANT_INSTRUCTIONS,
            model=ASSISTANT_MODEL,
            tools=[] # No tools needed for this setup (like Retrieval or Code Interpreter)
        )
        assistant_id = assistant.id
        print(f"Assistant created successfully!")
        print(f"Assistant Name: {ASSISTANT_NAME}")
        print(f"Assistant ID:   {assistant_id}")
        print("\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        print("IMPORTANT: Set the OPENAI_ASSISTANT_ID environment variable to this ID")
        print("           for future runs to reuse the same assistant.")
        print("e.g., export OPENAI_ASSISTANT_ID=" + assistant_id)
        print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
    except Exception as e:
        print(f"Error creating assistant: {e}")
        raise # Stop execution if creation fails
else:
    print(f"Using existing Assistant ID from environment variable: {assistant_id}")
    # Optional: Verify the assistant ID is valid
    try:
        retrieved_assistant = client.beta.assistants.retrieve(assistant_id)
        print(f"Successfully verified Assistant: {retrieved_assistant.name} (ID: {retrieved_assistant.id})")
    except NotFoundError:
        print(f"ERROR: Assistant with ID '{assistant_id}' not found. Check the ID or unset the environment variable to create a new one.")
        raise # Stop execution if ID is invalid
    except Exception as e:
        print(f"Warning: Could not retrieve assistant with ID {assistant_id}. Error: {e}")
        # Decide if you want to proceed cautiously or raise an error

# Ensure we have a valid assistant_id to proceed
if not assistant_id:
     raise ValueError("Failed to get or create an Assistant ID.")

# --- Rest of the functions (Unchanged from previous version using Headers) ---

def create_new_thread():
    """Creates a new OpenAI thread."""
    try:
        thread = client.beta.threads.create()
        print(f"Created new thread: {thread.id}")
        return thread.id
    except Exception as e:
        print(f"Error creating thread: {e}")
        raise

def add_message_to_thread(thread_id, content, role="user"):
    """Adds a message to the specified thread."""
    try:
        message = client.beta.threads.messages.create(
            thread_id=thread_id,
            role=role,
            content=content
        )
        print(f"Added message to thread {thread_id}: '{content[:50]}...'")
        return message
    except Exception as e:
        print(f"Error adding message to thread {thread_id}: {e}")
        raise

def run_assistant_and_wait(thread_id):
    """Runs the assistant on the thread and waits for completion."""
    global assistant_id # Make sure we use the globally determined assistant_id
    try:
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id, # Use the validated/created ID
        )
        print(f"Created run {run.id} for thread {thread_id} using Assistant {assistant_id}")

        # Poll for completion
        while run.status in ['queued', 'in_progress', 'cancelling']:
            time.sleep(1) # Wait 1 second before checking again
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
            print(f"Run {run.id} status: {run.status}")

        return run # Return the completed (or failed) run object

    except Exception as e:
        print(f"Error creating or monitoring run for thread {thread_id}: {e}")
        raise

def get_latest_assistant_message(thread_id):
    """Retrieves the text of the latest assistant message from the thread."""
    try:
        messages = client.beta.threads.messages.list(
            thread_id=thread_id,
            order="desc", # Newest first
            limit=1       # We only need the most recent one
        )

        if messages.data and messages.data[0].role == "assistant":
            assistant_response = ""
            for content_block in messages.data[0].content:
                if content_block.type == 'text':
                    assistant_response += content_block.text.value + "\n"
            print(f"Retrieved assistant response for thread {thread_id}: '{assistant_response[:50]}...'")
            return assistant_response.strip()
        else:
            print(f"No recent assistant message found for thread {thread_id}")
            return None

    except Exception as e:
        print(f"Error retrieving messages for thread {thread_id}: {e}")
        raise

def get_assistant_response(thread_id_from_header, user_input, is_journal_entry=False):
    """
    Main function to handle user input, interact with the assistant, and get a response.
    Accepts thread_id directly. Creates a new thread if thread_id_from_header is None.

    Args:
        thread_id_from_header (str | None): The thread ID passed from the client, or None.
        user_input (str): The text input from the user.
        is_journal_entry (bool): Flag to indicate if the input is a journal entry.

    Returns:
        tuple[str, str]: A tuple containing (assistant's response or error message, thread_id used).
    """
    current_thread_id = thread_id_from_header

    try:
        # Create a new thread if one wasn't provided (likely the first request)
        if current_thread_id is None:
            current_thread_id = create_new_thread()
            if not current_thread_id: # Check if thread creation failed
                return ("Error: Failed to create a new conversation thread.", None)

        # Format input if it's a journal entry
        message_content = user_input
        if is_journal_entry:
            message_content = f"Here is my latest journal entry:\n\n{user_input}"

        # Add user message to the thread
        add_message_to_thread(current_thread_id, message_content)

        # Run the assistant and wait
        run = run_assistant_and_wait(current_thread_id)

        # Check run status
        if run.status == 'completed':
            response = get_latest_assistant_message(current_thread_id)
            if response:
                return response, current_thread_id
            else:
                return "Error: Assistant finished but no response message found.", current_thread_id
        elif run.status in ['failed', 'cancelled', 'expired']:
            error_details = run.last_error.message if run.last_error else 'No details provided.'
            print(f"Run failed/cancelled/expired. Status: {run.status}. Details: {error_details}")
            return f"Error: Assistant run did not complete successfully ({run.status}).", current_thread_id
        else:
            print(f"Run ended with unexpected status: {run.status}")
            return f"Error: Assistant run ended with status: {run.status}", current_thread_id

    except Exception as e:
        print(f"An error occurred in get_assistant_response: {e}")
        return f"Error: An internal error occurred.", current_thread_id