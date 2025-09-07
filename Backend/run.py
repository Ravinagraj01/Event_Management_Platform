from app import create_app, db
from app.models import College, Student, Event, Registration, Attendance, Feedback
from datetime import datetime, timedelta
import random

app = create_app()

def seed_database():
    """Seed the database with demo data"""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Clear existing data
        db.session.query(Feedback).delete()
        db.session.query(Attendance).delete()
        db.session.query(Registration).delete()
        db.session.query(Event).delete()
        db.session.query(Student).delete()
        db.session.query(College).delete()
        db.session.commit()
        
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
        
        # Create students (50 per college)
        students = []
        for college in colleges:
            for i in range(50):
                student = Student(
                    college_id=college.id,
                    name=f"Student {i+1} {college.name.split()[0]}",
                    email=f"student{i+1}@{college.name.lower().replace(' ', '')}.edu"
                )
                students.append(student)
                db.session.add(student)
        
        # Add a demo student account for easy login
        demo_student = Student(
            college_id=colleges[0].id,  # First college
            name="Demo Student",
            email="student@campus.edu"
        )
        students.append(demo_student)
        db.session.add(demo_student)
        
        db.session.commit()
        
        # Create events (20 per college)
        event_types = ["Workshop", "Seminar", "Conference", "Cultural Event", "Sports Event", "Tech Talk", "Career Fair", "Hackathon"]
        
        events = []
        for college in colleges:
            for i in range(20):
                start_time = datetime.now() + timedelta(days=random.randint(1, 90))
                end_time = start_time + timedelta(hours=random.randint(1, 4))
                
                event = Event(
                    college_id=college.id,
                    title=f"{random.choice(event_types)} {i+1} - {college.name}",
                    description=f"Join us for an exciting {random.choice(event_types).lower()} featuring industry experts and hands-on activities.",
                    event_type=random.choice(event_types),
                    start_time=start_time,
                    end_time=end_time,
                    capacity=random.randint(20, 200)
                )
                events.append(event)
                db.session.add(event)
        
        db.session.commit()
        
        # Create registrations (random for each event)
        for event in events:
            college_students = [s for s in students if s.college_id == event.college_id]
            num_registrations = random.randint(5, min(event.capacity, len(college_students)))
            selected_students = random.sample(college_students, num_registrations)
            
            for student in selected_students:
                registration = Registration(
                    student_id=student.id,
                    event_id=event.id
                )
                db.session.add(registration)
        
        db.session.commit()
        
        # Create attendances (80% of registrations)
        registrations = Registration.query.all()
        for registration in registrations:
            if random.random() < 0.8:  # 80% attendance rate
                attendance = Attendance(
                    student_id=registration.student_id,
                    event_id=registration.event_id,
                    method=random.choice(['manual', 'qr_code', 'mobile_app'])
                )
                db.session.add(attendance)
        
        db.session.commit()
        
        # Create feedbacks (70% of attendances)
        attendances = Attendance.query.all()
        for attendance in attendances:
            if random.random() < 0.7:  # 70% feedback rate
                feedback = Feedback(
                    student_id=attendance.student_id,
                    event_id=attendance.event_id,
                    rating=random.randint(1, 5),
                    comment=random.choice([
                        "Great event! Learned a lot.",
                        "Very informative session.",
                        "Could be better organized.",
                        "Excellent speakers!",
                        "Good content but too long.",
                        "Amazing experience!",
                        "Needs more interactive activities.",
                        "Perfect timing and venue."
                    ])
                )
                db.session.add(feedback)
        
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created {len(colleges)} colleges")
        print(f"Created {len(students)} students")
        print(f"Created {len(events)} events")
        print(f"Created {len(registrations)} registrations")
        print(f"Created {len(attendances)} attendances")
        print(f"Created {len(Feedback.query.all())} feedbacks")

if __name__ == '__main__':
    seed_database()
