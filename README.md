# 🏫 Smart Campus Operations Hub

A full-stack web application developed for the **IT3030 – Programming Applications and Frameworks (PAF)** module at SLIIT.

---

## 📌 Project Overview

The **Smart Campus Operations Hub** is designed to manage:

* 📅 Facility & asset bookings (rooms, labs, equipment)
* 🛠 Maintenance & incident reporting system
* 🔔 Notifications and workflow tracking
* 🔐 Role-based authentication and authorization

---

## 🚀 Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Data MongoDB
* Maven

### Database

* MongoDB Atlas (Cloud)

### Frontend *(Planned)*

* React.js

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smartcampus.git
cd smartcampus
```

---

### 2️⃣ Configure Environment

Edit the file:

```
src/main/resources/application.properties
```

Add your MongoDB connection:

```properties
spring.mongodb.uri=YOUR_MONGODB_ATLAS_URI
```

---

### 3️⃣ Run Backend

```bash
mvn spring-boot:run
```

Server will start at:

```
http://localhost:8080
```

---

## 📡 API Endpoints (Current)

### Resource Management

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/resources` | Get all resources |
| POST   | `/api/resources` | Create a resource |

---

## 🧪 Example Request

### POST `/api/resources`

```json
{
  "name": "Lab A",
  "type": "Lab",
  "capacity": 30,
  "location": "Building 1",
  "status": "ACTIVE"
}
```

---

## 📂 Project Structure

```
src/main/java/com/paf/smartcampus
│
├── controller     # REST Controllers
├── model          # MongoDB Models
├── repository     # Database Access
└── SmartcampusApplication.java
```

---

## 📌 Features (Planned)

* ✅ Resource Management
* 🔄 Booking System (Pending → Approved → Cancelled)
* 🛠 Incident Ticketing System
* 🔔 Notifications
* 🔐 Authentication & Authorization (OAuth 2.0)

---

## 👥 Team Contribution

| Member   | Module               |
| -------- | -------------------- |
| Member 1 | Resource Management  |
| Member 2 | Booking System       |
| Member 3 | Ticket System        |
| Member 4 | Auth & Notifications |

---

## 📜 License

This project is developed for academic purposes only.

---

## 💡 Notes

* Ensure MongoDB Atlas network access is enabled (0.0.0.0/0)
* Do not commit sensitive credentials

---

## 🔗 GitHub Repository

Add your repository link here.

---

🔥 Developed as part of IT3030 PAF Assignment 2026
