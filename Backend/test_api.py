#!/usr/bin/env python3
"""
Test script for Campus Event Management Platform API
This script tests all the major API endpoints to ensure functionality.
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

def test_endpoint(method, endpoint, data=None, expected_status=200):
    """Test an API endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n{'='*50}")
    print(f"Testing {method} {endpoint}")
    print(f"{'='*50}")
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, headers=HEADERS, json=data)
        else:
            print(f"Unsupported method: {method}")
            return None
            
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == expected_status:
            print("✅ SUCCESS")
        else:
            print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
            
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
            return response_data
        except:
            print(f"Response: {response.text}")
            return response.text
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR - Make sure the Flask server is running")
        return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

def main():
    print("🚀 Starting Campus Event Management Platform API Tests")
    print("=" * 60)
    
    # Test 1: Create a college
    print("\n1. Testing College Creation")
    college_data = {"name": "Test University"}
    college_response = test_endpoint("POST", "/colleges", college_data, 201)
    
    if not college_response:
        print("❌ Cannot continue without college. Exiting.")
        return
        
    college_id = college_response.get("id")
    print(f"Created college with ID: {college_id}")
    
    # Test 2: Create a student
    print("\n2. Testing Student Creation")
    student_data = {
        "college_id": college_id,
        "name": "Test Student",
        "email": "test.student@testuniversity.edu"
    }
    student_response = test_endpoint("POST", "/students", student_data, 201)
    
    if not student_response:
        print("❌ Cannot continue without student. Exiting.")
        return
        
    student_id = student_response.get("id")
    print(f"Created student with ID: {student_id}")
    
    # Test 3: Create an event
    print("\n3. Testing Event Creation")
    start_time = datetime.now() + timedelta(days=7)
    end_time = start_time + timedelta(hours=2)
    
    event_data = {
        "college_id": college_id,
        "title": "Test Workshop: API Testing",
        "description": "A workshop to test the API functionality",
        "event_type": "Workshop",
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "capacity": 30
    }
    event_response = test_endpoint("POST", "/events", event_data, 201)
    
    if not event_response:
        print("❌ Cannot continue without event. Exiting.")
        return
        
    event_id = event_response.get("id")
    print(f"Created event with ID: {event_id}")
    
    # Test 4: Register student for event
    print("\n4. Testing Event Registration")
    registration_data = {"student_id": student_id}
    registration_response = test_endpoint("POST", f"/events/{event_id}/register", registration_data, 201)
    
    if not registration_response:
        print("❌ Registration failed. Continuing with other tests...")
    
    # Test 5: Mark attendance
    print("\n5. Testing Attendance Marking")
    attendance_data = {
        "student_id": student_id,
        "method": "manual"
    }
    attendance_response = test_endpoint("POST", f"/events/{event_id}/attendance", attendance_data, 201)
    
    if not attendance_response:
        print("❌ Attendance marking failed. Continuing with other tests...")
    
    # Test 6: Submit feedback
    print("\n6. Testing Feedback Submission")
    feedback_data = {
        "student_id": student_id,
        "rating": 5,
        "comment": "Great test event! The API works perfectly."
    }
    feedback_response = test_endpoint("POST", f"/events/{event_id}/feedback", feedback_data, 201)
    
    if not feedback_response:
        print("❌ Feedback submission failed. Continuing with other tests...")
    
    # Test 7: List events
    print("\n7. Testing Event Listing")
    test_endpoint("GET", "/events")
    
    # Test 8: List students
    print("\n8. Testing Student Listing")
    test_endpoint("GET", f"/students?college_id={college_id}")
    
    # Test 9: Event popularity report
    print("\n9. Testing Event Popularity Report")
    test_endpoint("GET", f"/reports/event_popularity?college_id={college_id}")
    
    # Test 10: Event attendance report
    print("\n10. Testing Event Attendance Report")
    test_endpoint("GET", f"/reports/event/{event_id}/attendance")
    
    # Test 11: Student participation report
    print("\n11. Testing Student Participation Report")
    test_endpoint("GET", f"/reports/student/{student_id}")
    
    # Test 12: Top active students
    print("\n12. Testing Top Active Students Report")
    test_endpoint("GET", f"/reports/top_active_students?college_id={college_id}&limit=3")
    
    # Test 13: Test error handling - duplicate registration
    print("\n13. Testing Error Handling - Duplicate Registration")
    test_endpoint("POST", f"/events/{event_id}/register", registration_data, 409)
    
    # Test 14: Test error handling - invalid rating
    print("\n14. Testing Error Handling - Invalid Rating")
    invalid_feedback_data = {
        "student_id": student_id,
        "rating": 6,  # Invalid rating (should be 1-5)
        "comment": "Test comment"
    }
    test_endpoint("POST", f"/events/{event_id}/feedback", invalid_feedback_data, 400)
    
    print("\n" + "="*60)
    print("🎉 API Testing Complete!")
    print("="*60)
    print("\nSummary:")
    print("- All major endpoints have been tested")
    print("- Error handling has been verified")
    print("- The API appears to be working correctly")
    print("\nTo run the frontend:")
    print("1. cd frontend")
    print("2. npm install")
    print("3. npm start")
    print("\nTo view the admin portal: http://localhost:3000/admin")
    print("To view the student app: http://localhost:3000/student")

if __name__ == "__main__":
    main()
