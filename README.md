Backend Setup
===================
cd backend
npm install

npm run seed (for database update and admin credential)
==========================
Email: admin@newsbite.com
Password: admin123
==========================

Create .env file:
================================
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsbite
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:3000
NODE_ENV=development


Start backend:
===============================
npm run dev

Frontend Setup
===============================
cd frontend
npm install

Create `.env` file:
REACT_APP_API_URL=http://localhost:5000/api


Start frontend:
npm start
======================================
Run the App

* Frontend: http://localhost:3000
* Backend: http://localhost:5000
---

## 👨‍💻 Author

Built as part of a MERN stack technical assignment.

