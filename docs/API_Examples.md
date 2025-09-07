# API Usage Examples

This document provides comprehensive examples of how to use the Campus Event Management Platform API.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API doesn't require authentication for demo purposes. In production, implement JWT or session-based authentication.

## API Endpoints

### 1. Colleges Management

#### Create a College
```bash
curl -X POST http://localhost:5000/api/colleges \
  -H "Content-Type: application/json" \
  -d '{
    "name": "University of Technology"
  }'
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "University of Technology",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### List All Colleges
```bash
curl -X GET http://localhost:5000/api/colleges
```

### 2. Students Management

#### Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "college_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@university.edu"
  }'
```

#### List Students by College
```bash
curl -X GET "http://localhost:5000/api/students?college_id=123e4567-e89b-12d3-a456-426614174000"
```

### 3. Events Management

#### Create an Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "college_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Tech Workshop: React Fundamentals",
    "description": "Learn the basics of React development with hands-on exercises",
    "event_type": "Workshop",
    "start_time": "2024-02-15T10:00:00Z",
    "end_time": "2024-02-15T12:00:00Z",
    "capacity": 50
  }'
```

#### List Events
```bash
# All events
curl -X GET http://localhost:5000/api/events

# Events by college
curl -X GET "http://localhost:5000/api/events?college_id=123e4567-e89b-12d3-a456-426614174000"

# Events by type
curl -X GET "http://localhost:5000/api/events?event_type=Workshop"

# Combined filters
curl -X GET "http://localhost:5000/api/events?college_id=123e4567-e89b-12d3-a456-426614174000&event_type=Workshop"
```

### 4. Event Actions

#### Register for an Event
```bash
curl -X POST http://localhost:5000/api/events/event-id/register \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "456e7890-e89b-12d3-a456-426614174001"
  }'
```

**Success Response (201):**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "student_id": "456e7890-e89b-12d3-a456-426614174001",
  "event_id": "event-id",
  "registered_at": "2024-01-15T14:30:00Z"
}
```

**Error Response (409) - Already Registered:**
```json
{
  "error": "Student already registered for this event"
}
```

**Error Response (400) - Capacity Full:**
```json
{
  "error": "Event is at full capacity"
}
```

#### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/events/event-id/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "456e7890-e89b-12d3-a456-426614174001",
    "method": "manual"
  }'
```

**Error Response (403) - Not Registered:**
```json
{
  "error": "Student must be registered to mark attendance"
}
```

#### Submit Feedback
```bash
curl -X POST http://localhost:5000/api/events/event-id/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "456e7890-e89b-12d3-a456-426614174001",
    "rating": 5,
    "comment": "Great event! Learned a lot about React."
  }'
```

**Error Response (403) - Not Attended:**
```json
{
  "error": "Student must have attended to submit feedback"
}
```

**Error Response (400) - Invalid Rating:**
```json
{
  "error": "Rating must be between 1 and 5"
}
```

### 5. Reports & Analytics

#### Event Popularity Report
```bash
# All colleges
curl -X GET http://localhost:5000/api/reports/event_popularity

# Specific college
curl -X GET "http://localhost:5000/api/reports/event_popularity?college_id=123e4567-e89b-12d3-a456-426614174000"
```

**Response:**
```json
[
  {
    "event_id": "event-1",
    "title": "Tech Workshop: React Fundamentals",
    "event_type": "Workshop",
    "capacity": 50,
    "registration_count": 45
  },
  {
    "event_id": "event-2",
    "title": "Career Fair 2024",
    "event_type": "Career Fair",
    "capacity": 200,
    "registration_count": 180
  }
]
```

#### Event Attendance Details
```bash
curl -X GET http://localhost:5000/api/reports/event/event-id/attendance
```

**Response:**
```json
{
  "event": {
    "id": "event-id",
    "title": "Tech Workshop: React Fundamentals",
    "description": "Learn React basics",
    "event_type": "Workshop",
    "start_time": "2024-02-15T10:00:00Z",
    "end_time": "2024-02-15T12:00:00Z",
    "capacity": 50,
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "registration_count": 45,
  "attendance_count": 38,
  "attendance_percentage": 84.44,
  "average_rating": 4.2,
  "feedback_count": 35
}
```

#### Student Participation Summary
```bash
curl -X GET http://localhost:5000/api/reports/student/student-id
```

**Response:**
```json
{
  "student": {
    "id": "student-id",
    "college_id": "college-id",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "events_registered": 8,
  "events_attended": 6,
  "attendance_rate": 75.0,
  "feedbacks_given": 5,
  "registered_events": [...],
  "attended_events": [...],
  "feedbacks": [...]
}
```

#### Top Active Students
```bash
# Top 3 students from all colleges
curl -X GET http://localhost:5000/api/reports/top_active_students?limit=3

# Top 5 students from specific college
curl -X GET "http://localhost:5000/api/reports/top_active_students?college_id=college-id&limit=5"
```

**Response:**
```json
[
  {
    "student_id": "student-1",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "attendance_count": 15
  },
  {
    "student_id": "student-2",
    "name": "Jane Smith",
    "email": "jane.smith@university.edu",
    "attendance_count": 12
  }
]
```

## 🔧 Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `403` - Forbidden (business rule violations)
- `404` - Not Found
- `409` - Conflict (duplicate registrations, etc.)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## 📝 Business Rules

### Registration Rules
1. Students can only register for events at their college
2. Students cannot register for the same event twice
3. Registration is limited by event capacity
4. Students must be registered to mark attendance

### Attendance Rules
1. Students must be registered to mark attendance
2. Students cannot mark attendance twice for the same event
3. Attendance can be marked using different methods (manual, QR code, mobile app)

### Feedback Rules
1. Students must have attended an event to submit feedback
2. Students can only submit one feedback per event
3. Rating must be between 1 and 5
4. Comments are optional

## 🧪 Testing with Postman

### Import Collection
1. Create a new Postman collection
2. Add the base URL: `http://localhost:5000/api`
3. Create requests for each endpoint
4. Use the examples above as request bodies

### Environment Variables
Set up environment variables in Postman:
- `base_url`: `http://localhost:5000/api`
- `college_id`: `123e4567-e89b-12d3-a456-426614174000`
- `student_id`: `456e7890-e89b-12d3-a456-426614174001`
- `event_id`: `789e0123-e89b-12d3-a456-426614174002`

## 🚀 Production Considerations

### Rate Limiting
Implement rate limiting to prevent abuse:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

### Input Validation
Add comprehensive input validation:
```python
from marshmallow import Schema, fields, validate

class EventSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    capacity = fields.Int(required=True, validate=validate.Range(min=1, max=1000))
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
```

### Logging
Implement proper logging for monitoring:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/events', methods=['POST'])
def create_event():
    logger.info(f"Creating event: {request.json.get('title')}")
    # ... rest of the function
```
