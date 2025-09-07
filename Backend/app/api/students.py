from flask import request, jsonify
from app import db
from app.models import Student, College
from app.api import api_bp

@api_bp.route('/students', methods=['POST'])
def create_student():
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['college_id', 'name', 'email']):
            return jsonify({'error': 'college_id, name, and email are required'}), 400
        
        # Check if college exists
        college = College.query.get(data['college_id'])
        if not college:
            return jsonify({'error': 'College not found'}), 404
        
        # Check if email already exists
        existing_student = Student.query.filter_by(email=data['email']).first()
        if existing_student:
            return jsonify({'error': 'Student with this email already exists'}), 409
        
        student = Student(
            college_id=data['college_id'],
            name=data['name'],
            email=data['email']
        )
        db.session.add(student)
        db.session.commit()
        
        return jsonify(student.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/students', methods=['GET'])
def get_students():
    try:
        college_id = request.args.get('college_id')
        email = request.args.get('email')
        query = Student.query
        
        if email:
            # Get student by email for authentication
            student = query.filter_by(email=email).first()
            if student:
                return jsonify(student.to_dict()), 200
            else:
                return jsonify({'error': 'Student not found'}), 404
        
        if college_id:
            query = query.filter_by(college_id=college_id)
        
        students = query.all()
        return jsonify([student.to_dict() for student in students]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
