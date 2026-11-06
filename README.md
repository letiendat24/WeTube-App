# 🎬 YouTube Clone Project

A full-stack YouTube clone built with **Java Spring Boot (backend)**, **ReactJS (frontend)**, and **NodeJS (real-time service)**.  
This project simulates the core features of YouTube including **video upload, playing video, authentication, playlists, comments, reaction and subscription function,**.

---

## 🚀 Tech Stack
- **Frontend:** ReactJS
- **Backend:** NodeJS (https://github.com/letiendat24/backend_wetube)
- **Database:** MongoDB
- **Support Service:** NodeJS + WebSocket (chat, notifications)
- **Others:** REST API

---

```bash
## 📂 Project Structure
WeTubeApp/
│
├── backend/ # Java Spring Boot backend
frontend/
│
├── public/                # Các file tĩnh (ảnh favicon, robots.txt, ...)
│   └── favicon.ico
│
├── src/
│   ├── assets/            # Hình ảnh, icon, font, file tĩnh dùng trong code
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/        # Các component nhỏ, dùng lại nhiều lần
│   │
│   ├── layouts/           # Layout tổng quát (MainLayout, AuthLayout, ...)
│   │   └── DefaultLayout.jsx
│   │   └── WatchingLayout.jsx
│   │
│   ├── pages/             # Các trang chính (Home, Login, Profile, ...)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Profile.jsx
│   │
│   ├── hooks/             # Custom hooks (useAuth, useFetch, ...)
│   │
│   ├── context/           # React Context API (AuthContext, ThemeContext, ...)
│   │
│   ├── services/          # Gọi API (axios, fetch)
│   │
│   ├── utils/             # Hàm tiện ích, helper (formatDate, validateEmail, ...)
│   │
│   ├── styles/            # Global styles, SCSS, Tailwind config
│   │   └── main.scss
│   │   └── .scss
│   │
│   ├── App.jsx            # App chính
│   ├── main.jsx           
│   
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

├── node-service/ # NodeJS service (realtime chat, notifications)
└── README.md
```
---

## ⚙️ Installation & Setup

### 🔹 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev 
```
👉 Runs at: http://localhost:5173

### 🔹 Backend (Java Spring Boot)
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
👉 Runs at: http://localhost:8080

### 🔹 Node.js Service
``` bash
cd node-service
npm install
npm start
```
👉 Runs at: http://localhost:3000

## 📌 Requirements

- **Node.js** >= 18.x  
- **npm** >= 9.x  
- **Java JDK** >= 17  
- **Maven** >= 3.9
