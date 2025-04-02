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
