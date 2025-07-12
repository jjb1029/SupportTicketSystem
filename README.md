# Support Ticket System

A full-stack support ticket management system that allows users to create and track tickets, while tech staff can assign, manage, and resolve them. Built to simulate a real-world helpdesk workflow.

---

## Features

### Users
- Sign up and log in securely
- Create new support tickets
- Edit tickets
- Leave comments on tickets
- View ticket status in a clean dashboard
- Dark mode support

### 🛠️ Techs
- View all tickets in the system
- Accept unassigned tickets
- Leave comments on tickets
- Update ticket status to "Closed" when resolved
- Sort and edit tickets
- Dark mode support

---

## Tech Stack

### Frontend
- React (Hooks and Functional Components)
- CSS Modules for styling
- Framer Motion for animations (cards, modals, transitions)
- Toast notifications (react-toastify)
- Skeleton loading cards
- Responsive, accessible design

### Backend
- Spring Boot (Java)
- RESTful API design
- Role-based access control with JWT
- MySQL for database
- Secure password hashing with BCrypt

---

## Getting Started

### Prerequisites
- Node.js & npm
- Java 17+ and Maven
- MySQL running locally

### Backend Setup
```bash
cd support-ticket-backend
# Add your database credentials in application.properties
mvn spring-boot:run

*### Frontend Setup*
cd support-ticket-frontend
npm install
npm start
