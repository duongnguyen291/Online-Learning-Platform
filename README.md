# Online Learning Platform

A full-stack, AI-powered web application for modern online education. This platform supports students, lecturers, and administrators with tailored dashboards, real-time features, and an integrated AI assistant for learning support and recommendations.

---

## 🚀 Key Features

- **Role-Based Access**: Distinct interfaces and permissions for Students, Lecturers, and Admins
- **Comprehensive Course Management**: Create, update, and manage courses, chapters, lessons, and quizzes
- **Student Progress Tracking**: Personalized dashboards, enrollment, and progress analytics
- **AI Chatbot (RAG)**: Retrieval-Augmented Generation chatbot for Q&A and learning path advice, powered by OpenAI and ChromaDB
- **Learning Path Recommendations**: AI-driven, personalized course and skill suggestions
- **Secure Authentication**: JWT-based login and registration for all roles
- **Real-Time Notifications**: Socket.IO and WebSocket-based updates for enrollments, course changes, and more
- **Microservices Architecture**: Modular, scalable, and cloud-ready

---

## 🏗️ Architecture Overview

- **Frontend**: Three React SPAs
  - **Admin** (`/admin`): User/course management, system settings
  - **Client** (`/client`): Student dashboard, course browsing, AI chatbot
  - **Lecturer** (`/lecturer`): Course creation, student management, analytics
- **Backend**: Node.js (Express)
  - REST API for business logic, authentication, and data
  - Real-time notifications via Socket.IO and WebSocket
- **AI/ML Server**: Python (FastAPI)
  - RAG chatbot, learning path, and course recommendations
  - Integrates with OpenAI, ChromaDB, and MongoDB
- **Database**: MongoDB (Mongoose ODM)
- **Vector DB**: ChromaDB for document embeddings
- **Planning & Docs**: `/plan&Dia` for diagrams and project docs

---

## 🗂️ Project Structure

```
/
├── admin/        # Admin React app (see admin/README.md)
├── client/       # Student React app (see client/README.md)
├── lecturer/     # Lecturer React app (see lecturer/README.md)
├── server/       # Python FastAPI AI/ML server
├── controllers/  # Node.js API controllers
├── db/           # MongoDB connection setup
├── middlewares/  # Express middlewares (auth, socket, etc.)
├── models/       # Mongoose schemas
├── routes/       # Express API routes
├── config/       # Config files (Cloudinary, New Relic)
├── notifyClients.js # WebSocket notification service
├── server.js     # Node.js backend entry point
├── docker-compose.yml # Multi-service orchestration
├── Dockerfile    # Node.js backend Dockerfile
├── plan&Dia/     # Project planning docs and diagrams
└── ...
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Docker & Docker Compose (recommended)
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (if not using Docker)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Online-Learning-Platform
```

### 2. Environment Variables

- **Root `.env`** (Node.js backend):
  ```env
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/online_learning
  JWT_SECRET=your_jwt_secret_key
  CLOUDINARY_CLOUD_NAME=your_cloudinary_name
  CLOUDINARY_API_KEY=your_cloudinary_key
  CLOUDINARY_API_SECRET=your_cloudinary_secret
  OPENAI_API_KEY=your_open_ai_api_key
  ```
- **AI Server `.env`** (`server/`):
  ```env
  OPENAI_API_KEY=your_openai_api_key
  CHROMA_DB_PATH=./data/chroma_db
  ```
- **Frontend `.env`** (see each subdirectory for port and API URL)

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

- **Student App**: http://localhost:3000
- **Lecturer App**: http://localhost:3001
- **Admin App**: http://localhost:3002
- **Node.js API**: http://localhost:5000
- **AI Server**: http://localhost:8000

### 4. Development (without Docker)

- Install Node.js dependencies:
  ```bash
  npm install
  cd admin && npm install
  cd ../client && npm install
  cd ../lecturer && npm install
  ```
- Install Python dependencies:
  ```bash
  cd server
  pip install -r requirements.txt
  ```
- Start services in separate terminals:
  ```bash
  npm start                # Node.js backend
  cd server && uvicorn main:app --reload   # Python AI server
  cd admin && npm start   # Admin frontend
  cd client && npm start  # Client frontend
  cd lecturer && npm start # Lecturer frontend
  ```

---

## 🧑‍💻 Test Accounts

- **Admin**:  
  Email: `phong.cao@email.com`  
  Password: `phong1234`
- **Lecturer**:  
  Email: `alice.smith@email.com`  
  Password: `alice123`
- **Student**:  
  Email: `phong.tran@email.com`  
  Password: `phong123`

---

## 📦 Main Components

### Admin App (`/admin`)

- User and course management, registration approvals, analytics
- See [admin/README.md](./admin/README.md) for setup and usage

### Client App (`/client`)

- Student dashboard, course catalog, AI chatbot, progress tracking
- See [client/README.md](./client/README.md) for setup and usage

### Lecturer App (`/lecturer`)

- Course creation, student management, progress analytics
- See [lecturer/README.md](./lecturer/README.md) for setup and usage

### Node.js Backend

- REST API for authentication, courses, users, and real-time events
- Socket.IO and WebSocket for notifications
- See `server.js`, `routes/`, and `controllers/`

### Python AI/ML Server (`/server`)

- FastAPI app for RAG chatbot and learning path
- Integrates with OpenAI, ChromaDB, and MongoDB
- Endpoints:
  - `/rag/upload` – Upload course documents for Q&A
  - `/rag/query` – Ask questions about uploaded documents
  - `/learning-path/advice/{user_code}` – Get personalized learning path advice
  - `/learning-path/recommendations/{user_code}` – Get course recommendations
- See `server/requirements.txt` for dependencies

---

## 🛠️ Technologies Used

- **Frontend**: React, MUI, Ant Design, Emotion, React Router, KaTeX, Lucide, etc.
- **Backend**: Node.js, Express, Mongoose, Socket.IO, WebSocket
- **AI/ML**: FastAPI, LangChain, OpenAI, ChromaDB, MongoDB, Uvicorn
- **DevOps**: Docker, Docker Compose

---

## 📄 License & Credits

- Licensed under the Apache License 2.0 (see source files)
- UI libraries: [MUI](https://mui.com/), [Ant Design](https://ant.design/), [Lucide](https://lucide.dev/)
- AI: [OpenAI](https://openai.com/), [ChromaDB](https://www.trychroma.com/)
- Special thanks to all contributors!

---

## 📚 More Information

- See subdirectory READMEs for detailed setup, features, and usage:
  - [admin/README.md](./admin/README.md)
  - [client/README.md](./client/README.md)
  - [lecturer/README.md](./lecturer/README.md)
- For architecture, planning, and diagrams, see `/plan&Dia`

---

## 👥 Group Members

- Nguyễn Đình Dương &nbsp; `20225966`
- Nguyễn Lan Nhi &nbsp; `20225991`
- Trần Cao Phong &nbsp; `20226061`
- Nguyễn Trọng Minh Phương &nbsp; `20225992`
- Hà Việt Khánh &nbsp; `20225979`
- Trịnh Hồng Anh &nbsp; `20235906`
