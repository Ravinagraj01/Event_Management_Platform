from flask import render_template_string
from app.api import api_bp
from app.models import Event, Student, Registration, Attendance, Feedback, College
from app import db
from sqlalchemy import func, desc

@api_bp.route('/reports', methods=['GET'])
def web_reports():
    """Simple web-based view of reports"""
    
    # Get event popularity data
    event_popularity = db.session.query(
        Event.id,
        Event.title,
        Event.event_type,
        College.name.label('college_name'),
        func.count(Registration.id).label('registration_count'),
        Event.capacity,
        (func.count(Registration.id) * 100.0 / Event.capacity).label('popularity_percentage')
    ).outerjoin(Registration, Event.id == Registration.event_id)\
     .join(College, Event.college_id == College.id)\
     .group_by(Event.id, Event.title, Event.event_type, College.name, Event.capacity)\
     .order_by(desc('registration_count'))\
     .limit(10).all()
    
    # Get top active students
    top_students = db.session.query(
        Student.id,
        Student.name,
        Student.email,
        College.name.label('college_name'),
        func.count(func.distinct(Registration.id)).label('total_registrations'),
        func.count(func.distinct(Attendance.id)).label('total_attendances'),
        func.count(func.distinct(Feedback.id)).label('total_feedbacks'),
        func.avg(Feedback.rating).label('average_rating')
    ).outerjoin(Registration, Student.id == Registration.student_id)\
     .outerjoin(Attendance, Student.id == Attendance.student_id)\
     .outerjoin(Feedback, Student.id == Feedback.student_id)\
     .join(College, Student.college_id == College.id)\
     .group_by(Student.id, Student.name, Student.email, College.name)\
     .having(func.count(func.distinct(Registration.id)) > 0)\
     .order_by(desc('total_registrations'))\
     .limit(3).all()
    
    # Get event type statistics
    event_type_stats = db.session.query(
        Event.event_type,
        func.count(func.distinct(Event.id)).label('total_events'),
        func.count(func.distinct(Registration.id)).label('total_registrations'),
        func.count(func.distinct(Attendance.id)).label('total_attendances'),
        func.avg(Feedback.rating).label('average_rating')
    ).outerjoin(Registration, Event.id == Registration.event_id)\
     .outerjoin(Attendance, Event.id == Attendance.event_id)\
     .outerjoin(Feedback, Event.id == Feedback.event_id)\
     .group_by(Event.event_type)\
     .order_by(desc('total_registrations')).all()
    
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Event Management - Reports</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
            .report-section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .report-title { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; font-weight: bold; color: #333; }
            tr:hover { background-color: #f5f5f5; }
            .metric { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; margin: 5px; }
            .popularity-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; }
            .popularity-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; transition: width 0.3s ease; }
            .rating-stars { color: #ffc107; }
            .no-data { text-align: center; color: #666; font-style: italic; padding: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Campus Event Management Reports</h1>
                <p>Real-time analytics and insights for campus events</p>
            </div>
            
            <div class="report-section">
                <h2 class="report-title">🏆 Event Popularity Report</h2>
                {% if event_popularity %}
                <table>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Type</th>
                            <th>College</th>
                            <th>Registrations</th>
                            <th>Capacity</th>
                            <th>Popularity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for event in event_popularity %}
                        <tr>
                            <td><strong>{{ event.title }}</strong></td>
                            <td><span class="metric">{{ event.event_type }}</span></td>
                            <td>{{ event.college_name }}</td>
                            <td>{{ event.registration_count }}</td>
                            <td>{{ event.capacity }}</td>
                            <td>
                                <div class="popularity-bar">
                                    <div class="popularity-fill" style="width: {{ event.popularity_percentage }}%"></div>
                                </div>
                                {{ "%.1f"|format(event.popularity_percentage) }}%
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
                {% else %}
                <div class="no-data">No event data available</div>
                {% endif %}
            </div>
            
            <div class="report-section">
                <h2 class="report-title">⭐ Top 3 Active Students</h2>
                {% if top_students %}
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>College</th>
                            <th>Registrations</th>
                            <th>Attendances</th>
                            <th>Feedbacks</th>
                            <th>Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for student in top_students %}
                        <tr>
                            <td><strong>{{ student.name }}</strong></td>
                            <td>{{ student.email }}</td>
                            <td>{{ student.college_name }}</td>
                            <td><span class="metric">{{ student.total_registrations }}</span></td>
                            <td><span class="metric">{{ student.total_attendances }}</span></td>
                            <td><span class="metric">{{ student.total_feedbacks }}</span></td>
                            <td>
                                {% if student.average_rating %}
                                <span class="rating-stars">
                                    {% for i in range(student.average_rating|round|int) %}★{% endfor %}
                                </span>
                                {{ "%.1f"|format(student.average_rating) }}
                                {% else %}
                                N/A
                                {% endif %}
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
                {% else %}
                <div class="no-data">No student data available</div>
                {% endif %}
            </div>
            
            <div class="report-section">
                <h2 class="report-title">📈 Event Type Statistics</h2>
                {% if event_type_stats %}
                <table>
                    <thead>
                        <tr>
                            <th>Event Type</th>
                            <th>Total Events</th>
                            <th>Total Registrations</th>
                            <th>Total Attendances</th>
                            <th>Average Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for stat in event_type_stats %}
                        <tr>
                            <td><strong>{{ stat.event_type }}</strong></td>
                            <td>{{ stat.total_events }}</td>
                            <td>{{ stat.total_registrations }}</td>
                            <td>{{ stat.total_attendances }}</td>
                            <td>
                                {% if stat.average_rating %}
                                <span class="rating-stars">
                                    {% for i in range(stat.average_rating|round|int) %}★{% endfor %}
                                </span>
                                {{ "%.1f"|format(stat.average_rating) }}
                                {% else %}
                                N/A
                                {% endif %}
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
                {% else %}
                <div class="no-data">No event type data available</div>
                {% endif %}
            </div>
            
            <div class="report-section">
                <h2 class="report-title">🔗 API Endpoints</h2>
                <p>Access these reports programmatically:</p>
                <ul>
                    <li><code>GET /api/reports/event_popularity</code> - Event popularity report</li>
                    <li><code>GET /api/reports/event_popularity?type=Workshop</code> - Filter by event type</li>
                    <li><code>GET /api/reports/top_active_students</code> - Top active students</li>
                    <li><code>GET /api/reports/student/{id}</code> - Individual student report</li>
                    <li><code>GET /api/reports/event/{id}/attendance</code> - Event attendance details</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """
    
    return render_template_string(
        html_template,
        event_popularity=event_popularity,
        top_students=top_students,
        event_type_stats=event_type_stats
    )
