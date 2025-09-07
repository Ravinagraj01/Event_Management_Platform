# Campus Event Management Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently using mock authentication. For student endpoints, use:
- Email: `student@campus.edu`
- Password: `student123`

For admin endpoints, use:
- Email: `admin@campus.edu` 
- Password: `admin123`

---

## Core Endpoints

### 1. Create College
**POST** `/colleges`

Creates a new college in the system.

**Request Body:**
```json
{
  "name": "University of Technology"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "University of Technology",
  "created_at": "2025-09-07T08:13:32.606276"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/colleges \
  -H "Content-Type: application/json" \
  -d '{"name": "University of Technology"}'
```

---

### 2. Create Student
**POST** `/students`

Creates a new student account.

**Request Body:**
```json
{
  "college_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@university.edu"
}
```

**Response (201):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "college_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "created_at": "2025-09-07T08:15:22.123456"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "college_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@university.edu"
  }'
```

---

### 3. Create Event
**POST** `/events`

Creates a new event.

**Request Body:**
```json
{
  "college_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Workshop 2025",
  "description": "Learn about the latest AI technologies and applications",
  "event_type": "Workshop",
  "start_time": "2025-09-15T10:00:00",
  "end_time": "2025-09-15T16:00:00",
  "capacity": 50
}
```

**Response (201):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "college_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Workshop 2025",
  "description": "Learn about the latest AI technologies and applications",
  "event_type": "Workshop",
  "start_time": "2025-09-15T10:00:00",
  "end_time": "2025-09-15T16:00:00",
  "capacity": 50,
  "status": "active",
  "created_at": "2025-09-07T08:20:15.789012"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "college_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Workshop 2025",
    "description": "Learn about the latest AI technologies and applications",
    "event_type": "Workshop",
    "start_time": "2025-09-15T10:00:00",
    "end_time": "2025-09-15T16:00:00",
    "capacity": 50
  }'
```

---

### 4. List Events
**GET** `/events`

Retrieves all events with optional filtering.

**Query Parameters:**
- `college_id` (optional): Filter by college
- `event_type` (optional): Filter by event type

**Response (200):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "college_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Workshop 2025",
    "description": "Learn about the latest AI technologies and applications",
    "event_type": "Workshop",
    "start_time": "2025-09-15T10:00:00",
    "end_time": "2025-09-15T16:00:00",
    "capacity": 50,
    "status": "active",
    "created_at": "2025-09-07T08:20:15.789012"
  }
]
```

**cURL Examples:**
```bash
# Get all events
curl http://localhost:5000/api/events

# Filter by college
curl "http://localhost:5000/api/events?college_id=550e8400-e29b-41d4-a716-446655440000"

# Filter by event type
curl "http://localhost:5000/api/events?event_type=Workshop"
```

---

### 5. Student Registration
**POST** `/events/{event_id}/register`

Registers a student for an event.

**Request Body:**
```json
{
  "student_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response (201):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "event_id": "770e8400-e29b-41d4-a716-446655440002",
  "registered_at": "2025-09-07T08:25:30.456789"
}
```

**Error Responses:**
- `404`: Event or student not found
- `409`: Student already registered
- `400`: Event at full capacity

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/events/770e8400-e29b-41d4-a716-446655440002/register \
  -H "Content-Type: application/json" \
  -d '{"student_id": "660e8400-e29b-41d4-a716-446655440001"}'
```

---

### 6. Mark Attendance
**POST** `/events/{event_id}/attendance`

Marks attendance for a registered student.

**Request Body:**
```json
{
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "method": "manual"
}
```

**Response (201):**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "event_id": "770e8400-e29b-41d4-a716-446655440002",
  "checked_in_at": "2025-09-15T10:05:00.123456",
  "method": "manual"
}
```

**Error Responses:**
- `403`: Student must be registered first
- `409`: Attendance already marked

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/events/770e8400-e29b-41d4-a716-446655440002/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "660e8400-e29b-41d4-a716-446655440001",
    "method": "manual"
  }'
```

---

### 7. Submit Feedback
**POST** `/events/{event_id}/feedback`

Submits feedback for an attended event.

**Request Body:**
```json
{
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "rating": 5,
  "comment": "Excellent workshop! Learned a lot about AI applications."
}
```

**Response (201):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "event_id": "770e8400-e29b-41d4-a716-446655440002",
  "rating": 5,
  "comment": "Excellent workshop! Learned a lot about AI applications.",
  "submitted_at": "2025-09-15T16:30:00.789012"
}
```

**Error Responses:**
- `403`: Student must have attended the event
- `409`: Feedback already submitted
- `400`: Rating must be between 1 and 5

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/events/770e8400-e29b-41d4-a716-446655440002/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "660e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Excellent workshop! Learned a lot about AI applications."
  }'
```

---

## Reports Endpoints

### 8. Event Popularity Report
**GET** `/reports/event_popularity`

Returns events ranked by registration count.

**Query Parameters:**
- `type` (optional): Filter by event type (e.g., `Workshop`, `Seminar`)

**Response (200):**
```json
[
  {
    "event_id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "AI Workshop 2025",
    "event_type": "Workshop",
    "college_name": "University of Technology",
    "registration_count": 45,
    "capacity": 50,
    "popularity_percentage": 90.0
  },
  {
    "event_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "title": "Data Science Seminar",
    "event_type": "Seminar",
    "college_name": "University of Technology",
    "registration_count": 30,
    "capacity": 40,
    "popularity_percentage": 75.0
  }
]
```

**cURL Examples:**
```bash
# All events
curl http://localhost:5000/api/reports/event_popularity

# Filter by type
curl "http://localhost:5000/api/reports/event_popularity?type=Workshop"
```

---

### 9. Event Attendance Details
**GET** `/reports/event/{event_id}/attendance`

Returns detailed attendance information for a specific event.

**Response (200):**
```json
{
  "event_id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "AI Workshop 2025",
  "total_registered": 45,
  "total_attended": 38,
  "attendance_rate": 84.4,
  "attendees": [
    {
      "student_id": "660e8400-e29b-41d4-a716-446655440001",
      "student_name": "John Doe",
      "student_email": "john.doe@university.edu",
      "checked_in_at": "2025-09-15T10:05:00.123456",
      "method": "manual"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/reports/event/770e8400-e29b-41d4-a716-446655440002/attendance
```

---

### 10. Student Participation Summary
**GET** `/reports/student/{student_id}`

Returns participation summary for a specific student.

**Response (200):**
```json
{
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "student_name": "John Doe",
  "student_email": "john.doe@university.edu",
  "college_name": "University of Technology",
  "total_registrations": 12,
  "total_attendances": 10,
  "attendance_rate": 83.3,
  "total_feedbacks": 8,
  "average_rating": 4.2,
  "events": [
    {
      "event_id": "770e8400-e29b-41d4-a716-446655440002",
      "title": "AI Workshop 2025",
      "event_type": "Workshop",
      "registered": true,
      "attended": true,
      "feedback_rating": 5,
      "feedback_comment": "Excellent workshop!"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/reports/student/660e8400-e29b-41d4-a716-446655440001
```

---

### 11. Top Active Students
**GET** `/reports/top_active_students`

Returns the top 3 most active students based on event participation.

**Query Parameters:**
- `limit` (optional): Number of students to return (default: 3)

**Response (200):**
```json
[
  {
    "student_id": "660e8400-e29b-41d4-a716-446655440001",
    "student_name": "John Doe",
    "student_email": "john.doe@university.edu",
    "college_name": "University of Technology",
    "total_registrations": 12,
    "total_attendances": 10,
    "attendance_rate": 83.3,
    "total_feedbacks": 8,
    "average_rating": 4.2
  },
  {
    "student_id": "cc0e8400-e29b-41d4-a716-446655440007",
    "student_name": "Jane Smith",
    "student_email": "jane.smith@university.edu",
    "college_name": "University of Technology",
    "total_registrations": 10,
    "total_attendances": 9,
    "attendance_rate": 90.0,
    "total_feedbacks": 7,
    "average_rating": 4.5
  },
  {
    "student_id": "dd0e8400-e29b-41d4-a716-446655440008",
    "student_name": "Mike Johnson",
    "student_email": "mike.johnson@university.edu",
    "college_name": "University of Technology",
    "total_registrations": 8,
    "total_attendances": 8,
    "attendance_rate": 100.0,
    "total_feedbacks": 6,
    "average_rating": 4.0
  }
]
```

**cURL Examples:**
```bash
# Top 3 students (default)
curl http://localhost:5000/api/reports/top_active_students

# Top 5 students
curl "http://localhost:5000/api/reports/top_active_students?limit=5"
```

---

## Additional Endpoints

### Get Students
**GET** `/students`

Retrieves students with optional filtering.

**Query Parameters:**
- `college_id` (optional): Filter by college
- `email` (optional): Get specific student by email

**Response (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "college_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "created_at": "2025-09-07T08:15:22.123456"
  }
]
```

**cURL Examples:**
```bash
# All students
curl http://localhost:5000/api/students

# Students by college
curl "http://localhost:5000/api/students?college_id=550e8400-e29b-41d4-a716-446655440000"

# Student by email
curl "http://localhost:5000/api/students?email=john.doe@university.edu"
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `403`: Forbidden (business rule violations)
- `404`: Not Found
- `409`: Conflict (duplicate entries)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Detailed error message"
}
```

---

## Event Types

Supported event types:
- `Workshop`
- `Seminar`
- `Conference`
- `Cultural Event`
- `Sports Event`
- `Tech Talk`
- `Career Fair`
- `Hackathon`

---

## Testing the API

1. **Start the backend server:**
   ```bash
   cd Backend
   python app.py
   ```

2. **Initialize the database:**
   ```bash
   python init_db.py
   ```

3. **Test endpoints using the provided cURL examples or tools like Postman**

4. **For frontend integration, the React app is available at:**
   ```
   http://localhost:3000
   ```

---

## Notes

- All IDs are UUIDs for better scalability
- Timestamps are in ISO format
- The system prevents duplicate registrations and ensures business rule compliance
- Ratings must be between 1-5
- Students must be registered before marking attendance
- Students must have attended before submitting feedback
