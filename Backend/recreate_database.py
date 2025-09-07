from app import create_app, db
from app.models import College, Student, Event, Registration, Attendance, Feedback
from datetime import datetime, timedelta
import random
import os

app = create_app()

def recreate_database():
    """Recreate the database with correct schema and seed data"""
    with app.app_context():
        # Remove existing database files
        db_files = ['campus_events.db', 'instance/campus_events.db']
        for db_file in db_files:
            if os.path.exists(db_file):
                os.remove(db_file)
                print(f"Removed existing database: {db_file}")
        
        # Create all tables with correct schema
        db.create_all()
        print("Created new database with correct schema")
        
        # Seed with demo data
        seed_database()

def seed_database():
    """Seed the database with demo data"""
    # Create colleges
    colleges_data = [
        "University of Technology",
        "State College of Engineering", 
        "Metropolitan University",
        "Institute of Science and Technology",
        "Central University"
    ]
    
    colleges = []
    for name in colleges_data:
        college = College(name=name)
        colleges.append(college)
        db.session.add(college)
    
    db.session.commit()
    print(f"Created {len(colleges)} colleges")
    
    # Create students (10 per college + demo student)
    students = []
    for college in colleges:
        for i in range(10):
            student = Student(
                college_id=college.id,
                name=f"Student {i+1} {college.name.split()[0]}",
                email=f"student{i+1}@{college.name.lower().replace(' ', '')}.edu"
            )
            students.append(student)
            db.session.add(student)
    
    # Add demo student account
    demo_student = Student(
        college_id=colleges[0].id,
        name="Demo Student", 
        email="student@campus.edu"
    )
    students.append(demo_student)
    db.session.add(demo_student)
    
    db.session.commit()
    print(f"Created {len(students)} students (including demo student)")
    
    # Create events (5 per college)
    event_types = ["Workshop", "Seminar", "Conference", "Cultural Event", "Sports Event", "Tech Talk", "Career Fair", "Hackathon"]
    
    events = []
    for college in colleges:
        for i in range(5):
            start_time = datetime.now() + timedelta(days=random.randint(1, 30))
            end_time = start_time + timedelta(hours=random.randint(1, 4))
            
            event = Event(
                college_id=college.id,
                title=f"{random.choice(event_types)} {i+1} - {college.name}",
                description=f"Join us for an exciting {random.choice(event_types).lower()} featuring industry experts.",
                event_type=random.choice(event_types),
                start_time=start_time,
                end_time=end_time,
                capacity=random.randint(20, 100),
                status='active'
            )
            events.append(event)
            db.session.add(event)
    
    db.session.commit()
    print(f"Created {len(events)} events")
    
    # Create some registrations
    for event in events[:10]:  # Only for first 10 events
        college_students = [s for s in students if s.college_id == event.college_id]
        num_registrations = min(3, len(college_students))
        selected_students = random.sample(college_students, num_registrations)
        
        for student in selected_students:
            registration = Registration(
                student_id=student.id,
                event_id=event.id
            )
            db.session.add(registration)
    
    db.session.commit()
    print("Created sample registrations")
    
    print("\nDatabase recreated successfully!")
    print("Demo login credentials:")
    print("Student: student@campus.edu / student123")
    print("Admin: admin@campus.edu / admin123")

if __name__ == '__main__':
    recreate_database()
