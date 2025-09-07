from app import create_app, db
from app.models import College, Student, Event
from datetime import datetime, timedelta
import os

app = create_app()

with app.app_context():
    # Remove old database files
    db_files = ['campus_events.db', 'instance/campus_events.db']
    for db_file in db_files:
        if os.path.exists(db_file):
            os.remove(db_file)
            print(f"Removed {db_file}")
    
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()
    print("Database schema recreated")
    
    # Add test data
    college = College(name="Test University")
    db.session.add(college)
    db.session.commit()
    
    student = Student(
        college_id=college.id,
        name="Demo Student",
        email="student@campus.edu"
    )
    db.session.add(student)
    db.session.commit()
    
    # Add a test event
    test_event = Event(
        college_id=college.id,
        title="Test Event",
        description="A test event to verify the schema",
        event_type="Workshop",
        start_time=datetime.now() + timedelta(days=1),
        end_time=datetime.now() + timedelta(days=1, hours=2),
        capacity=50,
        status='active'
    )
    db.session.add(test_event)
    db.session.commit()
    
    print("Database recreated successfully!")
    print(f"College ID: {college.id}")
    print(f"Student ID: {student.id}")
    print(f"Test Event ID: {test_event.id}")
    print("Schema includes 'status' column in events table")
