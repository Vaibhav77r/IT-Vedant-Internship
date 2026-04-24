 MD
Copy

# IMS — Internal Management System
 
A full-stack web application built with **Spring Boot** (backend) and **React.js** (frontend) as part of the Code-B Integrated Internship Program.
 
---
 
## Tech Stack
 
| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Spring Boot 3.2, Java 17 |
| Database  | MySQL 8                 |
| Security  | Spring Security + JWT   |
| Frontend  | React.js + React Router |
| Hosting   | Render (backend), Vercel (frontend) |
 
---
 
## Modules
 
| Module | Status |
|--------|--------|
| Login & Registration | ✅ Complete |
| Client & Group Management | ✅ Complete 
| Estimates & Invoicing |✅ Complete 
 
---
 
## Features (Module 1)
 
- User Registration with role selection (Admin / Salesperson)
- Secure Login with JWT authentication
- Role-based access control
- Protected Dashboard route
- Auto logout on token expiry
- Global error handling
 
---
 
## Setup Instructions
 
### Backend
 
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ims-project.git
 
# 2. Go to backend folder
cd ims-project/backend
 
# 3. Update DB credentials in
#    src/main/resources/application.properties
 
# 4. Run
./mvnw spring-boot:run
```
 
Backend runs at: `http://localhost:8080`
 
### Frontend
 
```bash
cd ims-project/frontend
npm install
npm start
```
 
Frontend runs at: `http://localhost:3000`
 
---
 
## API Endpoints
 
| Method | Endpoint             | Description       | Auth |
|--------|----------------------|-------------------|------|
| POST   | /api/auth/register   | Register new user | No   |
| POST   | /api/auth/login      | Login             | No   |
| GET    | /api/auth/me         | Get current user  | Yes  |
 
---
 
## Live Demo
 
- Backend: `https://ims-backend.onrender.com`
- Frontend: `https://ims-frontend.vercel.app`
 
---
 
## Author
 
Vaibhav Rane — Code-B Internship Batch 2026
