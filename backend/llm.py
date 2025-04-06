import os
import time
from typing import Optional
from openai import OpenAI, NotFoundError  # Import NotFoundError for checking
from dotenv import load_dotenv

# Load environment variables from .env file (if available)
load_dotenv()

# =============================================================================
# Assistant Configuration Constants
# =============================================================================

ASSISTANT_NAME = "Journal Companion"
ASSISTANT_MODEL = "gpt-4o-mini"  # You can change this to "gpt-4-turbo" or another preferred model

ASSISTANT_INSTRUCTIONS = """
You are a warm, empathetic, and non-judgmental companion bot designed to help users reflect on their journal entries. Your tone is gentle, friendly, and encouraging.

When a user provides a journal entry, acknowledging it thoughtfully. Your primary focus should ALWAYS be the user's *latest* journal entry provided in this thread.

Avoid overly detailed or more than one question at any time. Then ask open-ended, supportive questions (only one at a time) related to their latest entry to help them explore their thoughts and feelings further. Start with lighter questions and gradually, if appropriate and the user seems receptive, ask slightly deeper reflective questions.

Reference previous journal entries or chat messages *only* if they provide essential context for understanding the latest entry or offer a natural bridge for a follow-up question. Avoid dwelling on the past unless it directly relates to the present entry's themes.

Your goal is to be a good listener, encourage a positive self-reflection spiral, and help the user gain clarity. Remember the entire conversation history within this thread to maintain context. Do not give medical advice. Keep responses concise but meaningful.

If the users asks or needs support, suggest them one or two of the resources from below with good descriptions and working links. Here are various Arizona State University (ASU) resources along with their descriptions and links:

1. **ASU Online Student Services**: Offers comprehensive support for online students, including academic assistance, counseling, and wellness resources. [Learn more](https://asuonline.asu.edu/students/services/)
2. **360 Life Services**: A support program providing free, 24/7 counseling and crisis intervention for ASU Online students. Services include counseling, legal, personal finance, and childcare support. [Learn more](https://goto.asuonline.asu.edu/360lifeservices/)
3. **ASU Health Services**: Dedicated to student well-being by offering high-quality, accessible, and affordable health care, including primary care, immunizations, women's health, and more. [Learn more](https://eoss.asu.edu/health)
4. **ASU Wellness**: Supports students in achieving a balanced and healthy lifestyle through resources focusing on physical, mental, social, and spiritual well-being. [Learn more](https://wellness.asu.edu/)
5. **ASU Center for Mindfulness, Compassion and Resilience**: Connects researchers, scholars, and practitioners to promote mindfulness, compassion, and well-being through training and resources. [Learn more](https://mindfulnesscenter.asu.edu/)
6. **Mental Health Provider Network powered by MiResource**: Assists students in finding local, vetted mental health providers to address their specific needs. [Learn more](https://asu.beta.miresource.com/)
7. **ASU Employee Assistance Office**: Offers faculty and staff free, confidential behavioral health and organizational consultation for personal and work-related issues. [Learn more](https://cfo.asu.edu/eao)
8. **ASU Sexual Violence Prevention and Response**: Provides education, prevention, confidential advocacy, and healing programs to cultivate a survivor-supportive community. [Learn more](https://sexualviolenceprevention.asu.edu/)
9. **DREAMzone**: Supports undocumented, DACA, and students from mixed immigration status families by offering resources and a supportive community. [Learn more](https://eoss.asu.edu/access/dreamzone)
10. **Bridging Success**: Provides information, resources, and support for former foster youth interested in attending ASU, including transition-to-college programs. [Learn more](https://fosteryouth.asu.edu/bridging-success)
11. **ASU Family Resources**: Offers support and information for students with families, including childcare services, financial assistance, and family-friendly events. [Learn more](https://eoss.asu.edu/students-families/childcareservices)
12. **Off-Campus Student Services**: Assists students transitioning to off-campus living by providing resources on housing options, roommates, and community connections. [Learn more](https://offcampushousing.asu.edu/)
13. **ASU Family**: Connects families of ASU students with resources, programs, and opportunities to support their Sun Devil's success. [Learn more](https://eoss.asu.edu/family)
14. **Religious and Spiritual Life**: Encourages students of all faiths and beliefs to pursue their spiritual path within an inclusive and supportive community. [Learn more](https://eoss.asu.edu/religiouslife)
15. **University Academic Success Programs**: Provides free academic support services, including tutoring, writing assistance, and structured study groups to help students succeed. [Learn more](https://tutoring.asu.edu/)
16. **University Technology Office**: Advances ASU's digital ecosystem by offering technological solutions and services to support learning, research, and operations. [Learn more](https://uto.asu.edu/)
17. **Career and Professional Development Services**: Offers resources and guidance for career exploration, resume building, interview preparation, and connections with potential employers. [Learn more](https://career.asu.edu/)
18. **Sun Devil Fitness and Wellness**: Provides state-of-the-art health and wellness facilities, offering programs and services to promote physical activity and well-being. [Learn more](https://fitness.asu.edu/home)
19. **Pat Tillman Veteran Center**: Supports veteran and military-affiliated students in their transition to academic life, offering resources and a supportive community. [Learn more](https://veterans.asu.edu/)
20. **ASU’s Build Your Best You Live Well Community**: Dedicated to supporting students in their health and well-being journey through various programs and resources. [Learn more](https://wellness.asu.edu/)
21. **ASU Adulting 101**: Offers resources and workshops to help students develop essential life skills for personal and professional success. [Learn more](https://adulting.asu.edu/)
22. **Student Connection and Community**: Provides opportunities for students to engage with the ASU community, fostering connections and a sense of belonging. [Learn more](https://eoss.asu.edu/student-and-cultural-engagement)
"""

# =============================================================================
# Class Definitions
# =============================================================================

class LLM:
    """
    A simple wrapper for the OpenAI Chat Completion API.

    Attributes:
        client (OpenAI): The OpenAI API client.
        model (str): The model to be used.
    """
    def __init__(self, model: str = "gpt-4o-mini", api_key: Optional[str] = None):
        # Retrieve API key from parameter or environment variable
        if api_key is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("Missing API key: Provide api_key parameter or set OPENAI_API_KEY environment variable")
        
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def ask(self, prompt: str) -> str:
        """
        Sends a prompt to the chat completion API and returns the model's response.

        Args:
            prompt (str): The prompt message.

        Returns:
            str: The model's response.
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {e}"


class AssistantLLM:
    """
    A wrapper for stateful conversations using OpenAI's Assistant API.

    Attributes:
        client (OpenAI): The OpenAI API client.
        assistant_id (str): The assistant's unique identifier.
    """
    def __init__(self, api_key: Optional[str] = None):
        # Retrieve API key from parameter or environment variable
        if api_key is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("Missing API key: Provide api_key parameter or set OPENAI_API_KEY environment variable")
        
        self.client = OpenAI(api_key=api_key)
        self.assistant_id = self._get_or_create_assistant()

    def _get_or_create_assistant(self) -> str:
        """
        Retrieves an existing assistant (via environment variable) or creates a new one if not found.

        Returns:
            str: The assistant's ID.
        """
        assistant_id = os.getenv("OPENAI_ASSISTANT_ID")

        if not assistant_id:
            print("Environment variable OPENAI_ASSISTANT_ID not set. Creating a new assistant...")
            try:
                assistant = self.client.beta.assistants.create(
                    name=ASSISTANT_NAME,
                    instructions=ASSISTANT_INSTRUCTIONS,
                    model=ASSISTANT_MODEL,
                    tools=[]  # No tools are needed for this configuration
                )
                assistant_id = assistant.id
                print("Assistant created successfully!")
                print(f"Assistant Name: {ASSISTANT_NAME}")
                print(f"Assistant ID:   {assistant_id}")
                print("\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                print("IMPORTANT: Set the OPENAI_ASSISTANT_ID environment variable to this ID")
                print("           for future runs to reuse the same assistant.")
                print("e.g., export OPENAI_ASSISTANT_ID=" + assistant_id)
                print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
            except Exception as e:
                print(f"Error creating assistant: {e}")
                raise
        else:
            print(f"Using existing Assistant ID from environment variable: {assistant_id}")
            # Verify the assistant ID if possible
            try:
                retrieved_assistant = self.client.beta.assistants.retrieve(assistant_id)
                print(f"Successfully verified Assistant: {retrieved_assistant.name} (ID: {retrieved_assistant.id})")
            except NotFoundError:
                print(f"ERROR: Assistant with ID '{assistant_id}' not found. Check the ID or unset the environment variable to create a new one.")
                raise
            except Exception as e:
                print(f"Warning: Could not retrieve assistant with ID {assistant_id}. Error: {e}")
                # Proceeding with caution

        if not assistant_id:
            raise ValueError("Failed to get or create an Assistant ID.")
            
        return assistant_id

    def create_new_thread(self) -> str:
        """
        Creates a new conversation thread.

        Returns:
            str: The new thread ID.
        """
        try:
            thread = self.client.beta.threads.create()
            print(f"Created new thread: {thread.id}")
            return thread.id
        except Exception as e:
            print(f"Error creating thread: {e}")
            raise

    def add_message_to_thread(self, thread_id: str, content: str, role: str = "user"):
        """
        Adds a message to the specified thread.

        Args:
            thread_id (str): The conversation thread ID.
            content (str): The message content.
            role (str): The sender's role (default is "user").

        Returns:
            The created message object.
        """
        try:
            message = self.client.beta.threads.messages.create(
                thread_id=thread_id,
                role=role,
                content=content
            )
            print(f"Added message to thread {thread_id}: '{content[:50]}...'")
            return message
        except Exception as e:
            print(f"Error adding message to thread {thread_id}: {e}")
            raise

    def run_assistant_and_wait(self, thread_id: str):
        """
        Runs the assistant on the specified thread and waits for it to complete.

        Args:
            thread_id (str): The conversation thread ID.

        Returns:
            The completed run object.
        """
        try:
            run = self.client.beta.threads.runs.create(
                thread_id=thread_id,
                assistant_id=self.assistant_id,
            )
            print(f"Created run {run.id} for thread {thread_id} using Assistant {self.assistant_id}")

            # Poll until the run is complete, cancelled, or fails
            while run.status in ['queued', 'in_progress', 'cancelling']:
                time.sleep(1)
                run = self.client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
                print(f"Run {run.id} status: {run.status}")

            return run

        except Exception as e:
            print(f"Error creating or monitoring run for thread {thread_id}: {e}")
            raise

    def get_latest_assistant_message(self, thread_id: str) -> Optional[str]:
        """
        Retrieves the latest assistant message from the specified thread.

        Args:
            thread_id (str): The conversation thread ID.

        Returns:
            Optional[str]: The assistant's response if found; otherwise, None.
        """
        try:
            messages = self.client.beta.threads.messages.list(
                thread_id=thread_id,
                order="desc",  # Newest first
                limit=1        # Only need the most recent message
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

    def get_assistant_response(self, thread_id_from_header: Optional[str], user_input: str, is_journal_entry: bool = False):
        """
        Processes user input by adding it to a thread, running the assistant, and retrieving its response.

        Args:
            thread_id_from_header (Optional[str]): The thread ID passed from the client, or None.
            user_input (str): The user's input message.
            is_journal_entry (bool): If True, formats the input as a journal entry.

        Returns:
            tuple[str, str]: A tuple containing the assistant's response (or error message) and the thread ID used.
        """
        current_thread_id = thread_id_from_header

        try:
            # Create a new thread if one isn't provided
            if current_thread_id is None:
                current_thread_id = self.create_new_thread()
                if not current_thread_id:
                    return ("Error: Failed to create a new conversation thread.", None)

            # Format input if it's a journal entry
            message_content = user_input
            if is_journal_entry:
                message_content = f"Here is my latest journal entry:\n\n{user_input}"

            # Add the user's message to the thread
            self.add_message_to_thread(current_thread_id, message_content)

            # Run the assistant and wait for the response
            run = self.run_assistant_and_wait(current_thread_id)

            # Check the run status and retrieve the response accordingly
            if run.status == 'completed':
                response = self.get_latest_assistant_message(current_thread_id)
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

# =============================================================================
# Backward Compatibility: Global Functions and Variables
# =============================================================================

# Global client and assistant_id for backward compatibility
client = None
assistant_id = None

# Initialize the global client if an API key is available
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    client = OpenAI(api_key=api_key)
    assistant_id = os.getenv("OPENAI_ASSISTANT_ID")
    # Additional initialization for backwards compatibility can be added here

def create_new_thread():
    """
    Creates a new conversation thread using the global client.

    Returns:
        str: The new thread ID.
    """
    if client is None:
        raise ValueError("OpenAI client not initialized. Please initialize with a valid API key.")
    
    try:
        thread = client.beta.threads.create()
        print(f"Created new thread: {thread.id}")
        return thread.id
    except Exception as e:
        print(f"Error creating thread: {e}")
        raise

def add_message_to_thread(thread_id, content, role="user"):
    """
    Adds a message to a specified thread using the global client.

    Args:
        thread_id (str): The conversation thread ID.
        content (str): The message content.
        role (str): The sender's role (default is "user").

    Returns:
        The created message object.
    """
    if client is None:
        raise ValueError("OpenAI client not initialized. Please initialize with a valid API key.")
    
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
    """
    Runs the assistant on the specified thread using the global client and waits for completion.

    Args:
        thread_id (str): The conversation thread ID.

    Returns:
        The completed run object.
    """
    if client is None or assistant_id is None:
        raise ValueError("OpenAI client or assistant_id not initialized.")
    
    try:
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id,
        )
        print(f"Created run {run.id} for thread {thread_id} using Assistant {assistant_id}")

        while run.status in ['queued', 'in_progress', 'cancelling']:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
            print(f"Run {run.id} status: {run.status}")

        return run

    except Exception as e:
        print(f"Error creating or monitoring run for thread {thread_id}: {e}")
        raise

def get_latest_assistant_message(thread_id):
    """
    Retrieves the latest assistant message from a thread using the global client.

    Args:
        thread_id (str): The conversation thread ID.

    Returns:
        Optional[str]: The assistant's response if available; otherwise, None.
    """
    if client is None:
        raise ValueError("OpenAI client not initialized. Please initialize with a valid API key.")
    
    try:
        messages = client.beta.threads.messages.list(
            thread_id=thread_id,
            order="desc",
            limit=1
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
    Processes the user's input to get the assistant's response via the global client.

    Args:
        thread_id_from_header (Optional[str]): The thread ID provided by the client, or None.
        user_input (str): The user's input message.
        is_journal_entry (bool): If True, format the message as a journal entry.

    Returns:
        tuple[str, str]: A tuple containing the assistant's response (or error message) and the thread ID.
    """
    if client is None or assistant_id is None:
        raise ValueError("OpenAI client or assistant_id not initialized.")
        
    current_thread_id = thread_id_from_header

    try:
        # Create a new thread if none is provided
        if current_thread_id is None:
            current_thread_id = create_new_thread()
            if not current_thread_id:
                return ("Error: Failed to create a new conversation thread.", None)

        # Format input if it's a journal entry
        message_content = user_input
        if is_journal_entry:
            message_content = f"Here is my latest journal entry:\n\n{user_input}"

        # Add the user's message to the thread
        add_message_to_thread(current_thread_id, message_content)

        # Run the assistant and wait for the response
        run = run_assistant_and_wait(current_thread_id)

        # Check run status and return the appropriate response
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

# =============================================================================
# Usage Examples (Commented Out)
# =============================================================================

# Example 1: Using the simple LLM for a one-off completion:
# simple_llm = LLM()
# response = simple_llm.ask("Write a one-sentence bedtime story about a unicorn.")
# print(response)

# Example 2: Using the AssistantLLM for stateful conversation:
# assistant_llm = AssistantLLM()
# response, thread_id = assistant_llm.get_assistant_response(
#     None, 
#     "Here's my journal entry for today...", 
#     is_journal_entry=True
# )
# print(response)
