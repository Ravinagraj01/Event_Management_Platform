from app import create_app, db
from app.models import Event
import sqlite3
import os

app = create_app()

def fix_database_schema():
    """Add missing columns to the events table"""
    with app.app_context():
        # Get the database file path
        db_path = app.config.get('SQLALCHEMY_DATABASE_URI', '').replace('sqlite:///', '')
        
        if not os.path.exists(db_path):
            print(f"Database file not found at: {db_path}")
            print("Creating new database with correct schema...")
            db.create_all()
            return
        
        # Connect directly to SQLite to check and modify schema
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        try:
            # Check if status column exists
            cursor.execute("PRAGMA table_info(events)")
            columns = [column[1] for column in cursor.fetchall()]
            
            print(f"Current columns in events table: {columns}")
            
            if 'status' not in columns:
                print("Adding 'status' column to events table...")
                cursor.execute("ALTER TABLE events ADD COLUMN status VARCHAR(20) DEFAULT 'active'")
                conn.commit()
                print("✓ Added 'status' column")
            else:
                print("✓ 'status' column already exists")
            
            # Verify the schema is correct
            cursor.execute("PRAGMA table_info(events)")
            updated_columns = [column[1] for column in cursor.fetchall()]
            print(f"Updated columns in events table: {updated_columns}")
            
        except Exception as e:
            print(f"Error updating schema: {e}")
            conn.rollback()
        finally:
            conn.close()
        
        print("Database schema update completed!")

if __name__ == '__main__':
    fix_database_schema()
