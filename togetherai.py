from together import Together

import psycopg2
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

    # View all schemas
    cursor.execute("SELECT schema_name FROM information_schema.schemata;")
    schemas = cursor.fetchall()
    print("Schemas:", schemas)
    
    create_table_query = '''
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        about_me TEXT,
        ai_insights TEXT
    );
    '''

    create_journals = '''
    CREATE TABLE IF NOT EXISTS journals (
        journal_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE, 
        content TEXT NOT NULL,
        content_summary TEXT,
        entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    );
    '''
    # Execute the table creation query
    cursor.execute(create_table_query)
    cursor.execute(create_journals)
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



