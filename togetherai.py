from together import Together

import psycopg2
from datetime import datetime

import os

# Extracted connection details
DB_NAME = "neondb"
DB_USER = "neondb_owner"
DB_PASSWORD = "npg_WuMNtdKJ3v8a"
DB_HOST = "ep-flat-hill-a50y2o25-pooler.us-east-2.aws.neon.tech"
DB_PORT = "5432"  # Default PostgreSQL port
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
    journal_entries = [
    {
        "content": "Today felt like a whirlwind. I spent hours perfecting my project, unsure if it was good enough. But when my professor gave me such positive feedback, I felt this deep sense of relief wash over me. Maybe I’m actually getting better at this. The weight of self-doubt still lingers, but for now, I’ll hold onto this small victory.",
        "content_summary": "I worked hard on my project and was relieved to receive positive feedback. Self-doubt lingers, but I’m holding onto this small win.",
        "ai_summary_consent": True
    },
    {
        "content": "I sat at my desk today, staring at a growing list of assignments, feeling completely overwhelmed. My brain felt like it was running in circles, trying to figure out where to start. But then I forced myself to step away. A short break turned into a quiet evening of deep breaths and small joys. I know the work is still waiting for me, but at least now, I feel a little lighter.",
        "content_summary": "I felt overwhelmed with assignments but took a break to reset. I still have work to do, but I feel a little lighter now.",
        "ai_summary_consent": True
    },
    {
        "content": "This morning, I pushed myself to go for a run even though I wanted to stay curled up in bed. The crisp air, the rhythmic sound of my footsteps—it all felt so refreshing. For a brief moment, everything else faded away, and I just existed in the movement. It’s crazy how something so simple can completely shift my mood. I need to remember this feeling.",
        "content_summary": "I went for a run despite wanting to stay in bed. The fresh air and movement shifted my mood, and I want to hold onto that feeling.",
        "ai_summary_consent": True
    },
    {
        "content": "Dinner with friends tonight was exactly what I needed. The laughter, the unspoken understanding, the warmth of familiar faces—it reminded me that even in the midst of stress, I’m not alone. I didn’t realize how much I had been carrying until I felt it start to lift.",
        "content_summary": "I had dinner with friends, which reminded me I’m not alone. I didn’t realize how much I needed that until I felt the weight lift.",
        "ai_summary_consent": False  # Not used for AI insights
    },
    {
        "content": "My focus kept slipping today. No matter how hard I tried, my mind drifted, jumping from one unfinished thought to another. I finally forced myself to write things down, hoping that seeing my tasks on paper would ground me. It helped—at least a little. I’m still struggling, but now, I have a plan.",
        "content_summary": "I struggled to focus today, but making a to-do list helped me feel a bit more grounded. I still have work to do, but now I have a plan.",
        "ai_summary_consent": True
    }
]
    for entry in journal_entries:
        cursor.execute("""
            INSERT INTO journals (user_id, content, content_summary, entry_date, ai_summary_consent)
            VALUES (%s, %s, %s, %s, %s);
        """, (1, entry["content"], entry["content_summary"], datetime.now(), entry["ai_summary_consent"]))
    
    conn.commit()

    # View all schemas
    cursor.execute("SELECT schema_name FROM information_schema.schemata;")
    schemas = cursor.fetchall()
    print("Schemas:", schemas)
    
   
    print("✅ Tables created successfully (if not already exists).")

    conn.commit()  

    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = cursor.fetchall()
    print("📌 Tables in the database:", tables)




    TABLE_NAME = '"Snowman"'
    # Execute the query to fetch all rows
    query = f"SELECT * FROM {TABLE_NAME};"
    cursor.execute(query)

    # Fetch all results
    rows = cursor.fetchall()

    # Print each row
    print(f"\n📌 Rows from {TABLE_NAME}:")
    for row in rows:
        print(row)
    

    # Close the connection
    cursor.close()
    conn.close()
    print("✅ Connection closed.")

except Exception as e:
    print("❌ Error:", e)

client = Together(api_key="8e60402316e0dd36fb4baf560af2deb6c755b0f415b7311fa726708f78c59687")


response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=[{"role": "user", "content": "Hi"}],
)
print(response.choices[0].message.content)



