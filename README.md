# 🏫 Smart Campus Operations Hub

A full-stack web application developed for the **IT3030 – Programming Applications and Frameworks (PAF)** module at SLIIT.

---

## 📌 Project Overview

The **Smart Campus Operations Hub** is an integrated platform designed to streamline administrative and operational tasks within a university environment. The system focuses on automation, efficiency, and real-time tracking of campus resources.

### Key Modules:
* 📅 **Facility & Asset Bookings**: Efficient management of rooms, labs, and specialized equipment.
* 🛠 **Maintenance & Incident Reporting**: A centralized system for reporting and tracking infrastructure issues.
* 🔔 **Notifications & Workflows**: Automated alerts and approval processes for various requests.
* 🔐 **Role-Based Access Control**: Secure authentication for students, faculty, and administrative staff.

---

## 🚀 Tech Stack

### Backend
* **Language**: Java 21
* **Framework**: Spring Boot 3.x
* **Data Access**: Spring Data MongoDB
* **Build Tool**: Maven

### Database
* **Type**: NoSQL
* **Platform**: MongoDB Atlas (Cloud Instance)

### Frontend
* **Library**: React.js
* **State Management**: Context API / Redux (Planned)
* **Styling**: CSS / Bootstrap

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [JDK 21](https://www.oracle.com/java/technologies/downloads/) or higher
* [Maven 3.9+](https://maven.apache.org/download.cgi)
* [Node.js](https://nodejs.org/) (for frontend development)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/UsharaChamudithaKumara/SmartCampus.git
cd SmartCampus
```

### 2️⃣ Configure Environment Properties
Navigate to `src/main/resources/application.properties` and configure your MongoDB connection string:
```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/SmartCampus
spring.data.mongodb.database=smartcampus_db
```

### 3️⃣ Run the Backend Application
```bash
./mvnw spring-boot:run
```
The server will be available at `http://localhost:8080`.

---

## 📡 API Endpoints (Current)

### Resource Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/resources` | Fetch all available resources |
| `POST` | `/api/resources` | Create a new campus resource |
| `GET` | `/api/resources/{id}` | Get specific resource details |

---

## 🧪 Example Request

### POST `/api/resources`
```json
{
  "name": "Advanced Computing Lab",
  "type": "Lab",
  "capacity": 50,
  "location": "Faculty of Computing, Level 3",
  "status": "ACTIVE"
}
```

---

## 📂 Project Structure

```text
SmartCampus/
├── src/main/java/com/paf/smartcampus/
│   ├── controller/      # REST API Endpoints
│   ├── model/           # Data Models (POJOs)
│   ├── repository/      # MongoDB Data Access Objects
│   ├── service/         # Business Logic Layer
│   └── SmartcampusApplication.java
├── src/main/resources/
│   └── application.properties
├── frontend/            # React Application
└── pom.xml              # Maven Dependencies
```

---

## 📌 Development Roadmap

- [x] Initial Project Setup
- [x] MongoDB Integration
- [/] Resource Management Module
- [ ] Booking System Implementation
- [ ] Notification Service
- [ ] User Authentication (JWT)

---

## 👥 Team Contribution

| Name | Role | Contribution Area |
| :--- | :--- | :--- |
| Januda | Developer | Backend Architecture & Notifications |
| Ushara | Developer | Frontend & Resource Management |
| Member 3 | Developer | Booking System |
| Member 4 | Developer | Incident Management |

---

## 📜 License
This project is for academic use as part of the PAF module.

---

🔥 **Developed with ❤️ for IT3030 PAF Assignment 2026**
