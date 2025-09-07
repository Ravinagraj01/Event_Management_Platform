-- Campus Event Management Platform - SQL Reports
-- These queries can be run directly against the SQLite database

-- 1. Event Popularity Report
-- Shows events ranked by registration count with popularity percentage
SELECT 
    e.id as event_id,
    e.title,
    e.event_type,
    c.name as college_name,
    COUNT(r.id) as registration_count,
    e.capacity,
    ROUND((COUNT(r.id) * 100.0 / e.capacity), 2) as popularity_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN colleges c ON e.college_id = c.id
GROUP BY e.id, e.title, e.event_type, c.name, e.capacity
ORDER BY registration_count DESC, popularity_percentage DESC;

-- 2. Event Popularity Report (Filtered by Workshop type)
-- Example of filtering by event type
SELECT 
    e.id as event_id,
    e.title,
    e.event_type,
    c.name as college_name,
    COUNT(r.id) as registration_count,
    e.capacity,
    ROUND((COUNT(r.id) * 100.0 / e.capacity), 2) as popularity_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN colleges c ON e.college_id = c.id
WHERE e.event_type = 'Workshop'
GROUP BY e.id, e.title, e.event_type, c.name, e.capacity
ORDER BY registration_count DESC, popularity_percentage DESC;

-- 3. Event Attendance Details
-- Shows detailed attendance information for a specific event
-- Replace 'EVENT_ID_HERE' with actual event ID
SELECT 
    e.id as event_id,
    e.title,
    COUNT(DISTINCT r.id) as total_registered,
    COUNT(DISTINCT a.id) as total_attended,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / COUNT(DISTINCT r.id)), 2) as attendance_rate,
    s.id as student_id,
    s.name as student_name,
    s.email as student_email,
    a.checked_in_at,
    a.method
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN attendances a ON e.id = a.event_id AND r.student_id = a.student_id
LEFT JOIN students s ON a.student_id = s.id
WHERE e.id = 'EVENT_ID_HERE'
GROUP BY e.id, e.title, s.id, s.name, s.email, a.checked_in_at, a.method
ORDER BY a.checked_in_at;

-- 4. Student Participation Summary
-- Shows comprehensive participation data for a specific student
-- Replace 'STUDENT_ID_HERE' with actual student ID
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.email as student_email,
    c.name as college_name,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT a.id) as total_attendances,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / COUNT(DISTINCT r.id)), 2) as attendance_rate,
    COUNT(DISTINCT f.id) as total_feedbacks,
    ROUND(AVG(f.rating), 2) as average_rating
FROM students s
LEFT JOIN colleges c ON s.college_id = c.id
LEFT JOIN registrations r ON s.id = r.student_id
LEFT JOIN attendances a ON s.id = a.student_id
LEFT JOIN feedbacks f ON s.id = f.student_id
WHERE s.id = 'STUDENT_ID_HERE'
GROUP BY s.id, s.name, s.email, c.name;

-- 5. Student Events Detail (for specific student)
-- Shows all events a student has interacted with
-- Replace 'STUDENT_ID_HERE' with actual student ID
SELECT 
    e.id as event_id,
    e.title,
    e.event_type,
    CASE WHEN r.id IS NOT NULL THEN 'Yes' ELSE 'No' END as registered,
    CASE WHEN a.id IS NOT NULL THEN 'Yes' ELSE 'No' END as attended,
    f.rating as feedback_rating,
    f.comment as feedback_comment,
    r.registered_at,
    a.checked_in_at
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id AND r.student_id = 'STUDENT_ID_HERE'
LEFT JOIN attendances a ON e.id = a.event_id AND a.student_id = 'STUDENT_ID_HERE'
LEFT JOIN feedbacks f ON e.id = f.event_id AND f.student_id = 'STUDENT_ID_HERE'
WHERE r.id IS NOT NULL OR a.id IS NOT NULL OR f.id IS NOT NULL
ORDER BY r.registered_at DESC, e.start_time DESC;

-- 6. Top 3 Active Students
-- Shows the most active students based on participation
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.email as student_email,
    c.name as college_name,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT a.id) as total_attendances,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / NULLIF(COUNT(DISTINCT r.id), 0)), 2) as attendance_rate,
    COUNT(DISTINCT f.id) as total_feedbacks,
    ROUND(AVG(f.rating), 2) as average_rating,
    -- Activity score: weighted combination of registrations, attendances, and feedbacks
    (COUNT(DISTINCT r.id) * 1 + COUNT(DISTINCT a.id) * 2 + COUNT(DISTINCT f.id) * 1) as activity_score
FROM students s
LEFT JOIN colleges c ON s.college_id = c.id
LEFT JOIN registrations r ON s.id = r.student_id
LEFT JOIN attendances a ON s.id = a.student_id
LEFT JOIN feedbacks f ON s.id = f.student_id
GROUP BY s.id, s.name, s.email, c.name
HAVING COUNT(DISTINCT r.id) > 0  -- Only students with at least one registration
ORDER BY activity_score DESC, total_attendances DESC, total_registrations DESC
LIMIT 3;

-- 7. Top 5 Active Students (Extended version)
-- Same as above but shows top 5
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.email as student_email,
    c.name as college_name,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT a.id) as total_attendances,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / NULLIF(COUNT(DISTINCT r.id), 0)), 2) as attendance_rate,
    COUNT(DISTINCT f.id) as total_feedbacks,
    ROUND(AVG(f.rating), 2) as average_rating,
    (COUNT(DISTINCT r.id) * 1 + COUNT(DISTINCT a.id) * 2 + COUNT(DISTINCT f.id) * 1) as activity_score
FROM students s
LEFT JOIN colleges c ON s.college_id = c.id
LEFT JOIN registrations r ON s.id = r.student_id
LEFT JOIN attendances a ON s.id = a.student_id
LEFT JOIN feedbacks f ON s.id = f.student_id
GROUP BY s.id, s.name, s.email, c.name
HAVING COUNT(DISTINCT r.id) > 0
ORDER BY activity_score DESC, total_attendances DESC, total_registrations DESC
LIMIT 5;

-- 8. College-wise Event Statistics
-- Shows event statistics grouped by college
SELECT 
    c.id as college_id,
    c.name as college_name,
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT a.id) as total_attendances,
    ROUND(AVG(e.capacity), 2) as avg_event_capacity,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / NULLIF(COUNT(DISTINCT r.id), 0)), 2) as overall_attendance_rate
FROM colleges c
LEFT JOIN events e ON c.id = e.college_id
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN attendances a ON e.id = a.event_id
GROUP BY c.id, c.name
ORDER BY total_events DESC, total_registrations DESC;

-- 9. Event Type Popularity Analysis
-- Shows which event types are most popular
SELECT 
    e.event_type,
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT a.id) as total_attendances,
    ROUND(AVG(f.rating), 2) as average_rating,
    ROUND((COUNT(DISTINCT r.id) * 1.0 / COUNT(DISTINCT e.id)), 2) as avg_registrations_per_event,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / NULLIF(COUNT(DISTINCT r.id), 0)), 2) as attendance_rate
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN attendances a ON e.id = a.event_id
LEFT JOIN feedbacks f ON e.id = f.event_id
GROUP BY e.event_type
ORDER BY total_registrations DESC, average_rating DESC;

-- 10. Monthly Event Trends
-- Shows event activity by month
SELECT 
    strftime('%Y-%m', e.start_time) as event_month,
    COUNT(DISTINCT e.id) as events_count,
    COUNT(DISTINCT r.id) as registrations_count,
    COUNT(DISTINCT a.id) as attendances_count,
    ROUND((COUNT(DISTINCT a.id) * 100.0 / NULLIF(COUNT(DISTINCT r.id), 0)), 2) as attendance_rate
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN attendances a ON e.id = a.event_id
WHERE e.start_time IS NOT NULL
GROUP BY strftime('%Y-%m', e.start_time)
ORDER BY event_month DESC;

-- Usage Instructions:
-- 1. Connect to your SQLite database: sqlite3 campus_events.db
-- 2. Copy and paste any of the above queries
-- 3. For queries with placeholders (EVENT_ID_HERE, STUDENT_ID_HERE), replace with actual IDs
-- 4. Results can be exported to CSV using: .mode csv and .output filename.csv
