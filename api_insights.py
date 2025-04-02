from together import Together

import psycopg2
from datetime import datetime

import os

# Extracted connection details
DB_NAME = "neondb"
DB_USER = "neondb_owner"
DB_PASSWORD = "npg_WuMNtdKJ3v8a"
DB_HOST = "ep-flat-hill-a50y2o25-pooler.us-east-2.aws.neon.tech"
DB_PORT = "5432" 
SSL_MODE = "require"

# Connect to Neon PostgreSQL
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        sslmode=SSL_MODE
    )
    print("✅ Connected to Neon PostgreSQL!")

    # Create a cursor object
    cursor = conn.cursor()

    # togetherai api
    client = Together(api_key="8e60402316e0dd36fb4baf560af2deb6c755b0f415b7311fa726708f78c59687")

    # SCRIPT TO GENERATE JOURNAL SUMMARY
    journal_content = """Today was a really good day overall! I woke up feeling refreshed, grabbed my favorite coffee, 
    and even managed to squeeze in a quick workout before class. It set a great tone for the morning. But wow, my classes 
    were stressful. There was so much material to cover, and I felt like I was barely keeping up. The professor went through 
    the lecture at lightning speed, and I already feel behind on assignments.

    Still, I tried to stay positive. After classes, I met up with some friends for dinner, and it was exactly what I needed. 
    We laughed, shared stories, and for a moment, I forgot about the overwhelming workload. Now, I’m back home, trying to stay 
    organized and remind myself that I’ll get through this. Just taking it one step at a time!
    """

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": f"Summarize this journal entry into a couple sentences while retaining its main themes but keeping it first person and ensuring privacy. Remove personal details and specifics: {journal_content}"}],
        )
        content_summary = response.choices[0].message.content.strip()
        # print(response.choices[0].message.content.strip())
    except Exception as e:
        print("❌ Error generating summary:", e)

    # ai  -> content summary
    
    # FUNCTION THAT TAKES USER_ID AS A PARAMETER TO GENERATE INSIGHTS FOR LAST 5 JOURNAL ENTRIES
    def generate_ai_insight(user_id):
        cursor.execute("""
            SELECT content_summary FROM journals 
            WHERE user_id = %s AND ai_summary_consent = TRUE 
            ORDER BY entry_date DESC 
            LIMIT 5;
        """, (user_id,))
        summaries = [row[0] for row in cursor.fetchall()]

        if not summaries:
            print(f"⚠️ No valid journal entries found for user {user_id}")
            return

        # Combine summaries into a single string
        combined_summaries = " ".join(summaries)
        print(combined_summaries)

        # use api to create ai_insight
        try:
            response = client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages=[{
                    "role": "user",
                    "content": f"Analyze these journal entries and generate insights about the user's thoughts, emotions, and behavioral patterns over time. Focus on recurring themes, emotional trends, and personal growth while maintaining user privacy. Make it one paragraph: {combined_summaries}"
                }],
            )
            insight_text = response.choices[0].message.content.strip()
            print(insight_text)
        except Exception as e:
            print(f"❌ Error generating AI insight: {e}")
            return

        #Insert the AI-generated insight into the ai_insights table
        try:
            cursor.execute("""
                INSERT INTO ai_insight (user_id, insights, insight_date)
                VALUES (%s, %s, %s);
            """, (user_id, insight_text, datetime.now()))
            conn.commit()
            print(f"✅ Insight successfully added for user {user_id}")

        except Exception as e:
            print(f"❌ Error inserting AI insight into database: {e}")

    generate_ai_insight(1)



    cursor.close()
    conn.close()
    print("✅ Connection closed.")
except Exception as e:
    print("❌ Error:", e)