# TaskMaster - Task Manager App

## Live Demo

Frontend: [Add Frontend URL Here]

Backend: [Add Backend URL Here]

---

## Overview

TaskMaster is a full-stack task management application that allows users to create, organize, update, and track tasks through three stages:

* Todo
* In Progress
* Done

The application includes user authentication, task management, responsive UI, loading states, and error handling.

---

## Features

### Authentication

* User Registration
* User Login
* Secure JWT Authentication
* Protected Routes

### Task Management

* Create Tasks
* Edit Tasks
* Delete Tasks
* Move Tasks Between Stages
* Track Task Progress

### Dashboard

* Task Statistics
* Completion Progress Bar
* Search Tasks
* Filter by Priority
* Dark / Light Theme

### User Experience

* Responsive Design
* Loading Indicators
* Toast Notifications
* Error Handling

---

## Tech Stack

### Frontend

* EJS
* HTML
* CSS
* Vanilla JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* HTTP Only Cookies

---

## Project Structure

project/

├── models/

│ ├── User.js

│ └── Task.js

├── routes/

│ ├── auth.js

│ └── tasks.js

├── middleware/

│ └── auth.js

├── views/

│ ├── login.ejs

│ ├── register.ejs

│ ├── dashboard.ejs

│ └── partials/

├── public/

│ ├── style.css

│ └── client.js

├── server.js

└── package.json

---

## Installation

1. Clone the repository

git clone <repository-url>

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file

PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

4. Start the application

npm start

5. Open

http://localhost:5000

---

## Assumptions

* Each task belongs to one authenticated user.
* Users can only manage their own tasks.
* MongoDB is available locally or through MongoDB Atlas.

---

## Technical Decisions

### Why JWT Authentication?

JWT provides a simple and scalable authentication mechanism while keeping the backend stateless.

### Why EJS Instead of React?

EJS allows server-side rendering, simpler deployment, and faster development for this assignment.

### Why MongoDB?

MongoDB provides flexible document storage and integrates well with Node.js applications.

---

## Tradeoffs

* EJS was chosen over a modern SPA framework to keep deployment simple.
* Cookie-based JWT authentication was used for improved security.
* Server-side rendering was preferred over client-side rendering to reduce complexity.

---

## Future Improvements

* Drag and Drop Enhancements
* Task Categories
* Email Notifications
* Team Collaboration
* Real-time Updates using WebSockets

---

## Author

Vaibhav Singh
