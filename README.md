# 📰 NewsBite

A personalized news aggregator with an ad campaign platform built using the MERN stack.

---

## 🚀 Features

* User authentication (JWT based)
* Personalized news feed (category-based)
* Save / bookmark articles
* Infinite scrolling feed
* RSS-based automatic news fetching
* Ad injection inside feed
* Ad view & click tracking
* Admin panel for managing feeds & ads
* Campaign analytics (views, clicks, CTR)

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router, Axios
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Cache:** Redis
* **Authentication:** JWT
* **Background Jobs:** node-cron
* **RSS Parsing:** rss-parser

---

## 📁 Project Structure

```
newsbite/
├── backend/     # Express API server
└── frontend/    # React application
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsbite
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

---

## 🌐 Run the App

* Frontend: http://localhost:3000
* Backend: http://localhost:5000

---

## 🔍 API Health Check

```
GET /health
```

---

## 📊 Key Functionalities

### 👤 User

* Register / Login
* Select categories
* View personalized feed
* Save / unsave articles

### 📢 Ads

* Ads shown after every N articles
* Track ad impressions (views)
* Track ad clicks

### 🛠️ Admin

* Manage RSS feeds
* Manage ad campaigns
* View analytics (views, clicks, CTR)

---

## ⚡ Optional

Seed sample data:

```bash
npm run seed
```

---

## 🧠 Notes

* Redis is optional (app works without it)
* MongoDB indexing is used for performance
* Ad tracking ensures **unique views per user**

---

## 📌 Future Improvements

* Real-time notifications
* Advanced analytics dashboard
* AI-based news recommendations
* Deployment (AWS / Vercel / Render)

---

## 👨‍💻 Author

Built as part of a MERN stack technical assignment.

