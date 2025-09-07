from flask import request, jsonify
from app import db
from app.models import College
from app.api import api_bp

@api_bp.route('/colleges', methods=['POST'])
def create_college():
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'College name is required'}), 400
        
        college = College(name=data['name'])
        db.session.add(college)
        db.session.commit()
        
        return jsonify(college.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/colleges', methods=['GET'])
def get_colleges():
    try:
        colleges = College.query.all()
        return jsonify([college.to_dict() for college in colleges]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
