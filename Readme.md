# Campus Event Management Platform - Webknot Technologies Assignment

Hello and Welcome to my submission for the Webknot Technologies Campus Drive Assignment! I had an amazing time building this project, and Iam excited to share my approach to building a basic **Campus Event Management Platform**. This README reflects my understanding of the problem, the design, and the prototype I’ve built.

## What’s This All About?

The goal was to create an event management platform for the campus which helps colleges manage events such as hackathons , workshops, fests and so on. The system has two main sections: an **Admin Portal** for the college staff to create and manage the events and then **Student App*8 for students for exploring, browsing and registering for the events and later on checking in and giving the feedback after the events. 
My task was to design a prototype of the system that handles event creation , student registration, attendance tracking and feedback collection and many more things while keeping things practicle and scalable for more than 50 colleges and about 500 students who have about 20 events per semester.

## My Approach

I wanted to keep the functionalities simple, functional and scalable. Here's a quick overview of what I've built:
- **Tech Stack**: 
    - Backend : Flask
    - Database : SQLite (lightweight and perfect for a prototype)
    - Frontend : React.js

- **Features**:
    - As there are many colleges which will be conducting their events, one account or one user is permitted from each college to create events and even modify the events only related to their college.
    - APIs to generate events, enroll students, record attendance, and gather feedback (1–5 rating).
    - Event popularity reports (ranked by registrations), student activity, and an extra report for the top 3 most active students.
    - A basic database schema to record events, students, registrations, attendance, and feedback.
    - **Design**: I produced a design document with an ER diagram, API endpoints, sequence diagrams for workflows, and assumptions/edge cases (e.g., processing duplicate registrations or cancelled events).
    - **Scalability**: I structured the system with separate event IDs per college (with a composite key of college ID and event ID) and one database for ease of use, with the ability to later partition data if required.

You’ll find all the details in the `design_document.md` file, including my assumptions, database schema, and API design.

## How to Set Up and Run the Prototype

### Prerequisites
- **Python 3.8+**: Ensure you've installed Python on your laptop.
- **pip**: For installing dependencies.
- **Git**: if you're cloning the repo.
- **SQLite**: Included by default when you install Python, SQLite doesn't

### Setup Instructions
1. **Clone the Repository** (if using GitHub):
```bash
git clone <repository-url>
cd <repository-directory
```
Or unpack the uploaded `.zip` file to the desired directory.

2. **Install Dependencies**:
I've employed a small palette of Python packages. You can install them using:
Bert
pip install -r requirements.txt
```python
This sets up Flask and other packages needed.

3. **Set Up the Database**:
We're using SQLite and the database will automatically be initialized when you run the application for the first time. The schema can be found in the file `database.py` and the project root will hold the database file (`events.db`) created by the ORM.

4. **Running the Application**:
Begin the Flask server running: %dw python app.py  Server will begin at `http://localhost:5000`. You may test the basic UI or work directly using the APIs (e.g., Postman or curl).

### Prerequisites
- **Python 3.8+**: Make sure Python is installed on your system.
- **pip**: For installing dependencies.
- **Git**: If you’re cloning the repo.
- **SQLite**: Comes built-in with Python, so no extra setup is needed!

### Setup Instructions
1. **Clone the Repository** (if using GitHub):
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
   Alternatively, unzip the submitted `.zip` file to your desired directory.

2. **Install Dependencies**:
   I’ve used a minimal set of Python libraries. Install them using:
   ```bash
   pip install -r requirements.txt
   ```
   This installs Flask and other necessary packages.

3. **Set Up the Database**:
   The prototype uses SQLite, and the database is initialized automatically when you run the application for the first time. The schema is defined in `database.py`, and the database file (`events.db`) will be created in the project root.

4. **Run the Application**:
   Start the Flask server by running:
   ```bash
   python app.py
   ```
   The server will start at `http://localhost:5000`. You can access the basic UI for testing or interact with the APIs directly (e.g., via Postman or curl).

### Flow of the project

1. **Admin Portal**
    - Create college
    - Create event
    - List events
    - Register student
    - Mark attendance
    - Submit feedback
    - List reports

2. **Student App**
    - List events
    - Register for event
    - Mark attendance
    - Submit feedback
    - List reports

3. **Reports**
    - Event popularity report
    - Student activity report
    - Top active students report

4. **Frontend**
    - Basic UI for testing
    - Student app for student registration and attendance
    - Admin portal for college staff to create events and manage students

5. **Backend**
    - Flask server
    - SQLite database
    - API endpoints for college staff to create events and manage students

6. **Database**
    - SQLite database
    - API endpoints for college staff to create events and manage students

7. **APIs**
    - API endpoints for college staff to create events and manage students

8. **Design Document**
    - ER diagram
    - API design
    - Workflow diagrams
    - Assumptions and edge cases

9. **Conversation Log for LLM**
    - Screenshots when I brainstormed with an LLM (saved as `ai_log` folder).

### Testing the APIs
I’ve included a few key API endpoints for you to try:
    - POST /colleges - Create college
    - POST /students - Create student
    - POST /events - Create event
    - GET /events - List events with filters
    - POST /events/{id}/register - Student registration
    - POST /events/{id}/attendance - Mark attendance
    - POST /events/{id}/feedback - Submit feedback
    - GET /reports/event_popularity - Event popularity report
    - GET /reports/event/{id}/attendance - Event attendance details
    - GET /reports/student/{id} - Student participation summary
    - GET /reports/top_active_students - Top active students

### Running Reports

The reports can be had through API endpoints or by executing the available SQL queries in the file `reports.sql`. The reports can also be seen at the `/reports` endpoint to get a plain web view of the reports (screenshots are included in the submission).

## What’s Included in the Submission

- **Conversation Log for LLM**: Screenshots when I brainstormed with an LLM (saved as `ai_log`). 
- **Design Document**: Detailed write-up including ER diagram, API design, workflows, and assumptions (`design_document.md`).
- **Prototype Code**: The code for the Flask application, database scripts, and UI mockups in the project directory.
- **Reports**: SQL queries and API responses for event popularity, student activity, and top 3 active students.
- **Bonus**: A simplified UI mockup (a file named `ui_mockup.html`) for event registration/event exploration and a dynamic report end-point filtering by event type (e.g., `GET /api/reports).

## Decision and Assumptions

- I assumed that there will be a separate `college_id` for each college and event ids are unique for each college (e.g., a composite key using `college_id` + `event_id`).
- I stored all data in one SQLite database for simplicity but described in the design doc how to scale to multiple schemas or sharding for bigger sets.
- I used Flask due to how lightweight and good for a prototype it is but outlined in the design document how to scale to Django or FastAPI for production. - For edge cases, I dealt with duplicate registration (checking already registered records) and lack of feedback (defaulting to null ratings).

## Challenges and Learnings

This project was really a perfect blend of coding and design! Decomposing the problem into tractable chunks (schema, APIs, reports) made it very manageable. It was very useful to brainstorm using an LLM to get opening ideas, but I did ensure that I tweaked and perfected them through my understanding of the spec. It was a challenge to balance scalability and simplicity and I picked up a lot about how to design clean APIs and edge cases.

## Final Thoughts

I tried my best to include all the required functionalities like practical, easy to understand and scalable approach. The prototype is minimal but functional. I had faced some problems while building it but enjoyed it from the start to the end and also learnt some new things and i hope it showcases my ability to think through the problems , design thoughtfully and deliver clean code.

Thanks for the opportunity, Let me know if you have any questions or need clarification.

Ravi N