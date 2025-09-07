from flask import request, jsonify
from app import db
from app.models import Event, Registration, Attendance, Feedback, Student
from app.api import api_bp
from datetime import datetime

@api_bp.route('/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        
        required_fields = ['college_id', 'title', 'event_type', 'start_time', 'end_time', 'capacity']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': 'All required fields must be provided'}), 400
        
        # Parse datetime strings
        try:
            start_time = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
            end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid datetime format'}), 400
        
        event = Event(
            college_id=data['college_id'],
            title=data['title'],
            description=data.get('description', ''),
            event_type=data['event_type'],
            start_time=start_time,
            end_time=end_time,
            capacity=data['capacity']
        )
        db.session.add(event)
        db.session.commit()
        
        return jsonify(event.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events', methods=['GET'])
def get_events():
    try:
        college_id = request.args.get('college_id')
        event_type = request.args.get('event_type')
        
        query = Event.query
        
        if college_id:
            query = query.filter_by(college_id=college_id)
        if event_type:
            query = query.filter_by(event_type=event_type)
        
        events = query.all()
        return jsonify([event.to_dict() for event in events]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/<event_id>/register', methods=['POST'])
def register_for_event(event_id):
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'student_id is required'}), 400
        
        # Check if event exists
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if already registered
        existing_registration = Registration.query.filter_by(
            student_id=student_id, 
            event_id=event_id
        ).first()
        if existing_registration:
            return jsonify({'error': 'Student already registered for this event'}), 409
        
        # Check capacity
        current_registrations = Registration.query.filter_by(event_id=event_id).count()
        if current_registrations >= event.capacity:
            return jsonify({'error': 'Event is at full capacity'}), 400
        
        registration = Registration(student_id=student_id, event_id=event_id)
        db.session.add(registration)
        db.session.commit()
        
        return jsonify(registration.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/<event_id>/attendance', methods=['POST'])
def mark_attendance(event_id):
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        method = data.get('method', 'manual')
        
        if not student_id:
            return jsonify({'error': 'student_id is required'}), 400
        
        # Check if student is registered
        registration = Registration.query.filter_by(
            student_id=student_id, 
            event_id=event_id
        ).first()
        if not registration:
            return jsonify({'error': 'Student must be registered to mark attendance'}), 403
        
        # Check if already marked attendance
        existing_attendance = Attendance.query.filter_by(
            student_id=student_id, 
            event_id=event_id
        ).first()
        if existing_attendance:
            return jsonify({'error': 'Attendance already marked for this event'}), 409
        
        attendance = Attendance(
            student_id=student_id, 
            event_id=event_id, 
            method=method
        )
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify(attendance.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/<event_id>/feedback', methods=['POST'])
def submit_feedback(event_id):
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        rating = data.get('rating')
        comment = data.get('comment', '')
        
        if not student_id or not rating:
            return jsonify({'error': 'student_id and rating are required'}), 400
        
        if not (1 <= rating <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if student attended the event
        attendance = Attendance.query.filter_by(
            student_id=student_id, 
            event_id=event_id
        ).first()
        if not attendance:
            return jsonify({'error': 'Student must have attended to submit feedback'}), 403
        
        # Check if already submitted feedback
        existing_feedback = Feedback.query.filter_by(
            student_id=student_id, 
            event_id=event_id
        ).first()
        if existing_feedback:
            return jsonify({'error': 'Feedback already submitted for this event'}), 409
        
        feedback = Feedback(
            student_id=student_id, 
            event_id=event_id, 
            rating=rating, 
            comment=comment
        )
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify(feedback.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
