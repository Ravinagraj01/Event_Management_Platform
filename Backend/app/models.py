import uuid
from datetime import datetime
from app import db

class College(db.Model):
    __tablename__ = 'colleges'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    students = db.relationship('Student', backref='college', lazy=True)
    events = db.relationship('Event', backref='college', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    college_id = db.Column(db.String(36), db.ForeignKey('colleges.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='student', lazy=True)
    attendances = db.relationship('Attendance', backref='student', lazy=True)
    feedbacks = db.relationship('Feedback', backref='student', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    college_id = db.Column(db.String(36), db.ForeignKey('colleges.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    event_type = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='event', lazy=True)
    attendances = db.relationship('Attendance', backref='event', lazy=True)
    feedbacks = db.relationship('Feedback', backref='event', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'title': self.title,
            'description': self.description,
            'event_type': self.event_type,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'capacity': self.capacity,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('student_id', 'event_id', name='unique_registration'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'event_id': self.event_id,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendances'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    checked_in_at = db.Column(db.DateTime, default=datetime.utcnow)
    method = db.Column(db.String(50), default='manual')  # manual, qr_code, etc.
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('student_id', 'event_id', name='unique_attendance'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'event_id': self.event_id,
            'checked_in_at': self.checked_in_at.isoformat() if self.checked_in_at else None,
            'method': self.method
        }

class Feedback(db.Model):
    __tablename__ = 'feedbacks'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('student_id', 'event_id', name='unique_feedback'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'event_id': self.event_id,
            'rating': self.rating,
            'comment': self.comment,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        }
