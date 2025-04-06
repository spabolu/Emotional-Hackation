import psycopg2
from psycopg2.extras import execute_values

class DatabaseConnection:
    """
    A class to handle PostgreSQL database connections and query executions.
    """

    def __init__(self, dbname, user, password, host="localhost", port="5432"):
        """
        Initialize the database connection parameters.

        Args:
            dbname (str): Name of the database.
            user (str): Database user name.
            password (str): Password for the database user.
            host (str, optional): Database host address. Defaults to "localhost".
            port (str, optional): Database port number. Defaults to "5432".
        """
        self.dbname = dbname
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.connection = None
        self.cursor = None

    def connect(self):
        """
        Establish a connection to the PostgreSQL database and create a cursor.
        """
        try:
            self.connection = psycopg2.connect(
                dbname=self.dbname,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            )
            self.cursor = self.connection.cursor()
            print("Database connected successfully.")
        except Exception as e:
            print(f"Error connecting to the database: {e}")

    def close(self):
        """
        Close the cursor and database connection.
        """
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("Database connection closed.")

    def execute_query(self, query, params=None):
        """
        Execute a SQL query with optional parameters and commit the changes.

        Args:
            query (str): The SQL query to execute.
            params (tuple or list, optional): Parameters to pass with the query.

        Note:
            If an error occurs, the transaction is rolled back.
        """
        try:
            self.cursor.execute(query, params)
            self.connection.commit()
            print("Query executed successfully.")
        except Exception as e:
            print(f"Error executing query: {e}")
            self.connection.rollback()
