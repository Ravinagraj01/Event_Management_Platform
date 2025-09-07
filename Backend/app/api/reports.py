from flask import request, jsonify
from app import db
from app.models import Event, Registration, Attendance, Feedback, Student, College
from app.api import api_bp
from sqlalchemy import func, desc

@api_bp.route('/reports/event_popularity', methods=['GET'])
def event_popularity():
    try:
        college_id = request.args.get('college_id')
        
        query = db.session.query(
            Event.id,
            Event.title,
            Event.event_type,
            Event.capacity,
            func.count(Registration.id).label('registration_count')
        ).join(Registration, Event.id == Registration.event_id)
        
        if college_id:
            query = query.filter(Event.college_id == college_id)
        
        results = query.group_by(Event.id, Event.title, Event.event_type, Event.capacity)\
                      .order_by(desc('registration_count'))\
                      .all()
        
        report_data = []
        for result in results:
            report_data.append({
                'event_id': result.id,
                'title': result.title,
                'event_type': result.event_type,
                'capacity': result.capacity,
                'registration_count': result.registration_count
            })
        
        return jsonify(report_data), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/reports/event/<event_id>/attendance', methods=['GET'])
def event_attendance(event_id):
    try:
        # Get event details
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Get registration count
        registration_count = Registration.query.filter_by(event_id=event_id).count()
        
        # Get attendance count
        attendance_count = Attendance.query.filter_by(event_id=event_id).count()
        
        # Calculate attendance percentage
        attendance_percentage = (attendance_count / registration_count * 100) if registration_count > 0 else 0
        
        # Get average feedback rating
        avg_rating_result = db.session.query(func.avg(Feedback.rating))\
                                     .filter_by(event_id=event_id)\
                                     .scalar()
        avg_rating = round(avg_rating_result, 2) if avg_rating_result else None
        
        # Get feedback count
        feedback_count = Feedback.query.filter_by(event_id=event_id).count()
        
        return jsonify({
            'event': event.to_dict(),
            'registration_count': registration_count,
            'attendance_count': attendance_count,
            'attendance_percentage': round(attendance_percentage, 2),
            'average_rating': avg_rating,
            'feedback_count': feedback_count
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/reports/student/<student_id>', methods=['GET'])
def student_participation(student_id):
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get events registered
        registrations = Registration.query.filter_by(student_id=student_id).all()
        registered_events = [reg.event.to_dict() for reg in registrations]
        
        # Get events attended
        attendances = Attendance.query.filter_by(student_id=student_id).all()
        attended_events = [att.event.to_dict() for att in attendances]
        
        # Get feedbacks given
        feedbacks = Feedback.query.filter_by(student_id=student_id).all()
        feedback_data = []
        for feedback in feedbacks:
            feedback_data.append({
                'event_title': feedback.event.title,
                'rating': feedback.rating,
                'comment': feedback.comment,
                'submitted_at': feedback.submitted_at.isoformat()
            })
        
        return jsonify({
            'student': student.to_dict(),
            'events_registered': len(registered_events),
            'events_attended': len(attended_events),
            'attendance_rate': round(len(attended_events) / len(registered_events) * 100, 2) if registered_events else 0,
            'feedbacks_given': len(feedback_data),
            'registered_events': registered_events,
            'attended_events': attended_events,
            'feedbacks': feedback_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/reports/top_active_students', methods=['GET'])
def top_active_students():
    try:
        college_id = request.args.get('college_id')
        limit = int(request.args.get('limit', 3))
        
        query = db.session.query(
            Student.id,
            Student.name,
            Student.email,
            func.count(Attendance.id).label('attendance_count')
        ).join(Attendance, Student.id == Attendance.student_id)
        
        if college_id:
            query = query.filter(Student.college_id == college_id)
        
        results = query.group_by(Student.id, Student.name, Student.email)\
                      .order_by(desc('attendance_count'))\
                      .limit(limit)\
                      .all()
        
        active_students = []
        for result in results:
            active_students.append({
                'student_id': result.id,
                'name': result.name,
                'email': result.email,
                'attendance_count': result.attendance_count
            })
        
        return jsonify(active_students), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
