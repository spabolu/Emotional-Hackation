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
    
    create_table_query = '''
    CREATE TABLE IF NOT EXISTS ai_insight (
        ai_insight_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        insights TEXT,
        insight_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    '''
    
    # Execute the table creation query
    cursor.execute(create_table_query)
    print("✅ Tables created successfully (if not already exists).")
    conn.commit()  
    
    # Close the connection
    cursor.close()
    conn.close()
    print("✅ Connection closed.")

except Exception as e:
    print("❌ Error:", e)
