# SafeSubmit.in

**SafeSubmit.in** is a secure and scalable submission management system designed for handling digital submissions in educational or organizational settings. Built with a modern tech stack including **Next.js**, **Node.js**, **MySQL**, **Redis**, **Docker**, and **React.js**, this application ensures fast performance, reliable data handling, and a seamless user experience.

## 🌐 Live Demo

🔗 [safesubmitin.vercel.app](https://safesubmitin.vercel.app/)

---

## 🚀 Tech Stack

- **Frontend:** React.js, Next.js (App Router)
- **Backend:** Node.js (Express.js)
- **Database:** MySQL
- **Caching & Sessions:** Redis, JWT (JSON Web Tokens)
- **File Uploads:** Multer (for handling multipart/form-data)
- **Containerization:** Docker
- **Deployment:** Vercel (Frontend), Railway / Dockerized Backend (assumed)

---

## ✨ Features

- 🔐 **Secure Authentication**  
  Role-based authentication system with session management powered by Redis.

- 📤 **Submission Uploads**  
  Users can securely upload documents/files (e.g., assignments, reports, etc.) with size and type validations.

- 📁 **Organized Submissions**  
  Submissions are stored and categorized based on user, subject, or department for easy retrieval.

- 🔍 **Search & Filter**  
  Faculty and admin users can easily search and filter submissions by various criteria.

- 🐳 **Dockerized Setup**  
  Fully containerized using Docker for smooth development and deployment.

- ⚡ **Optimized Performance**  
  Redis caching for faster data access and reduced DB load.

---

## 📷 Screenshots

![Screenshot 1](https://res.cloudinary.com/do1xweis7/image/upload/v1747217392/Screenshot_2025-05-14_153858_uxgz87.png)
![Screenshot 1](https://res.cloudinary.com/do1xweis7/image/upload/v1747217392/Screenshot_2025-05-14_153842_hm4ctm.png)

---

## 🛠️ Installation & Development

### Prerequisites

- Node.js
- Docker
- MySQL Server (if not using Docker)
- Redis Server (or Dockerized)

### Clone the Repository

```bash
git clone https://github.com/neerajsde/safesubmitin.git
cd safesubmit.in
```