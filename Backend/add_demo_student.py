from app import create_app, db
from app.models import Student, College

app = create_app()

with app.app_context():
    # Check if demo student already exists
    existing_student = Student.query.filter_by(email='student@campus.edu').first()
    
    if existing_student:
        print(f"Demo student already exists: {existing_student.name} ({existing_student.email})")
    else:
        # Get the first college
        college = College.query.first()
        if college:
            # Create demo student
            demo_student = Student(
                college_id=college.id,
                name="Demo Student",
                email="student@campus.edu"
            )
            db.session.add(demo_student)
            db.session.commit()
            print(f"Created demo student: {demo_student.name} ({demo_student.email}) - ID: {demo_student.id}")
        else:
            print("No colleges found. Please run the seeding script first.")
    
    # List first few students for verification
    students = Student.query.limit(3).all()
    print("\nFirst few students in database:")
    for student in students:
        print(f"- {student.email} ({student.name}) - ID: {student.id}")
