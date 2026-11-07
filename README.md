ReachInBox – Full Stack Email Scheduler

1. Project Overview

ReachInBox is a Full Stack Email Scheduler application designed to schedule, manage, and send emails automatically at a specified date and time.

The application allows users to compose emails, schedule them for future delivery, and track their email status through an interactive dashboard.

The backend manages email scheduling, job processing, persistence, rate limiting, and concurrency using Redis and BullMQ.

The frontend provides a user-friendly interface to manage scheduled and sent emails.

2. Technologies Used

Frontend
	•	Next.js
	•	React.js
	•	TypeScript
	•	Tailwind CSS
	•	HTML and CSS

Backend
	•	Node.js
	•	Express.js
	•	Redis
	•	BullMQ
	•	Database: [Mention your database]
	•	Ethereal Email for email testing

Development Tools
	•	Visual Studio Code
	•	Git and GitHub
	•	Postman
	•	Docker (if used)

3. Project Structure
ReachInBox-Scheduler/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── types/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── package.json
└── README.md

4. Features Implemented

Backend Features
	•	Email scheduling using BullMQ.
	•	Background job processing using workers.
	•	Redis-based job queue management.
	•	Persistence of scheduled jobs across server restarts (with Redis persistence configured).
	•	Rate limiting to control email sending frequency.
	•	Concurrency management for processing multiple email jobs.
	•	Email delivery using Ethereal Email.

Frontend Features
	•	User login interface.
	•	Interactive dashboard.
	•	Email composition interface.
	•	Schedule emails for future delivery.
	•	View scheduled emails.
	•	View sent emails.
	•	Email status tracking.
	•	Email management through tables.

5. Installation and Setup

Prerequisites

Make sure the following tools are installed:
	•	Node.js
	•	npm
	•	Redis
	•	Git
	•	Docker (if required by the project)

6. Ethereal Email Configuration

Ethereal Email is used as a testing email service to verify email functionality without sending actual emails to real recipients.

Configuration Steps
	1.	Create an account on Ethereal Email.
	2.	Generate SMTP credentials.
	3.	Copy the username and password.
	4.	Add the credentials to the backend .env file

7. System Architecture

The application follows a frontend-backend architecture.
	•	The frontend allows users to compose and schedule emails.
	•	The backend receives email scheduling requests.
	•	BullMQ manages scheduled email jobs.
	•	Redis stores queue and job information.
	•	Background workers process jobs at the scheduled time.
	•	Ethereal Email handles email testing and delivery.

8. How Email Scheduling Works
	1.	The user logs into the application.
	2.	The user composes an email with recipient, subject, and message.
	3.	The user selects a future date and time.
	4.	The frontend sends the scheduling request to the backend.
	5.	The backend creates a job using BullMQ.
	6.	Redis stores the job information.
	7.	The BullMQ worker processes the job when its scheduled delay expires.
	8.	The email is sent through the configured email service.
	9.	The email status is updated and displayed on the dashboard.

9. Persistence on Server Restart

Redis is used to maintain scheduled job information.

When the backend server restarts, pending jobs can continue to be processed without requiring users to schedule them again.

This depends on Redis persistence configuration and the correct recovery of queued jobs.

10. Rate Limiting

Rate limiting controls the frequency of email sending.

It prevents the application from processing too many email requests within a specified time period.

When the configured limit is reached, additional jobs are delayed or processed according to the implemented queue configuration.

11. Concurrency Management

Concurrency allows multiple email jobs to be processed by background workers.

BullMQ workers process jobs according to the configured concurrency limit.

This improves processing efficiency while maintaining control over the number of simultaneously processed jobs.

12. Assumptions and Trade-offs
	•	Ethereal Email is used for email testing.
	•	Redis is required for queue management.
	•	Background workers must be running to process scheduled emails.
	•	Email delivery depends on the configured SMTP service.
	•	The application uses the configured scheduling timezone.
	•	The implementation uses the selected technologies to balance performance and simplicity.

13. Demo Video

Project demonstration video:

[ADD YOUR GOOGLE DRIVE OR YOUTUBE DEMO VIDEO LINK HERE]

The demonstration includes:
	•	Creating and scheduling emails.
	•	Viewing scheduled and sent emails.
	•	Restarting the server and verifying scheduled jobs.
	•	Demonstrating email processing and rate limiting.

14. Author

Developed as part of a Full Stack Software Development Internship.