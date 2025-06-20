# Online Learning Platform – Client

This is the **client-side React application** for the Online Learning Platform. It provides a modern, interactive interface for students, lecturers, and admins to access courses, manage profiles, and interact with AI-powered features.

---

## 🚀 Features

- **Course Catalog**: Browse, search, and filter a wide range of courses by category.
- **Course Details**: View detailed information, pricing, and enroll in courses.
- **My Courses**: Track your learning progress, continue courses, and view completion stats.
- **Video Courses**: Watch course videos, navigate chapters/lessons, and track progress.
- **User Profiles**: Manage your profile, update information, and view your learning status.
- **Authentication**: Register and log in as a Student, Lecturer, or Admin.
- **Protected Routes**: Role-based access to different parts of the platform.
- **AI Chatbot**: Get course recommendations, learning advice, and interact with a RAG-powered chatbot.
- **Document Upload**: Upload documents for AI-powered Q&A (RAG integration).
- **Responsive Design**: Fully responsive and modern UI using MUI, Ant Design, and custom CSS.

---

## 🗂️ Project Structure

```
client/
├── public/                # Static assets (index.html, images, etc.)
├── src/
│   ├── assets/            # Images, CSS, and sample data
│   │   ├── course/        # Course cards, details, video player, etc.
│   │   ├── chatbot/       # Chatbot and AI widgets
│   │   ├── login/         # Login form
│   │   ├── profile/       # User profile
│   │   ├── register/      # Registration form
│   │   └── ...
│   ├── pages/             # Main pages/routes (Landing, Courses, Profile, etc.)
│   ├── services/          # API and utility services
│   └── index.js           # App entry point
├── package.json           # Project metadata and dependencies
├── craco.config.js        # Custom Webpack config (path aliases)
├── Dockerfile             # Docker support
└── README.md              # This file
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Online-Learning-Platform/client
   ```

2. **Create a `.env` file**

   > Example:

   ```env
   PORT=3000
   # Optionally set REACT_APP_API_BASE_URL for backend API
   # REACT_APP_API_BASE_URL=http://localhost:8000
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**

   ```bash
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

5. **(Optional) Run with Docker**
   ```bash
   docker build -t online-learning-client .
   docker run -p 3000:3000 online-learning-client
   ```

---

## 🧑‍💻 Test Accounts

Test lecturer account:

```
phong.tran@email.com
phong123
```

---

## 🛠️ Scripts

- `npm start` – Start the development server
- `npm run build` – Build for production
- `npm test` – Run tests

---

## 🔒 Protected Routes

This app uses a custom `ProtectedRoute` component to restrict access based on user roles (Student, Lecturer, Admin). User info is stored in `localStorage` after login.

---

## 🧩 Main Components & Pages

- **LandingPage**: Home page with navigation, banner, reasons, feedback, live events, and AI widget.
- **CoursePage**: Browse all courses, search, and filter by category.
- **CourseDetailPage**: View detailed info and enroll in a course.
- **MyCoursesPage**: Track your enrolled courses and progress.
- **VideoCourse**: Watch course videos and navigate lessons.
- **StudentProfilePage**: View and edit your profile.
- **LoginPage / RegisterPage**: Authentication for all roles.
- **ChatBotPage**: Interact with the AI chatbot for recommendations and Q&A.

---

## 🤖 AI Chatbot & RAG Integration

- **Chatbot**: Ask for course recommendations, learning tips, or upload documents for Q&A.
- **RAG Service**: Connects to a backend for Retrieval-Augmented Generation (document Q&A).
- **EvenLab Widget**: Integrates ElevenLabs conversational AI for voice/chat.

---

## 📦 Dependencies

- React, React Router DOM, MUI, Ant Design, Emotion, KaTeX, React-Markdown, Lucide-React, and more. See `package.json` for the full list.

---

## 📁 Sample Data

- `src/assets/data/` contains mock data for courses, video courses, and inner course structure for demo/testing.

---

## 📝 Customization

- **Path Aliases**: Use `@` as an alias for `src/` (see `craco.config.js`).
- **API URLs**: Change backend API endpoints via `.env` or directly in `src/services/`.
- **Styling**: Customize with MUI, Ant Design, and custom CSS modules.

---

## 🧑‍🏫 Roles & Access

- **Student**: Browse, enroll, and track courses; manage profile.
- **Lecturer**: (Requires approval) Access lecturer dashboard and features.
- **Admin**: (Separate admin app) Manage users, courses, and platform settings.

---

## 📄 License

This project is for educational/demo purposes. See main repository for license details.

---

## 🙏 Credits

- UI libraries: [MUI](https://mui.com/), [Ant Design](https://ant.design/), [Lucide](https://lucide.dev/)
- AI: [ElevenLabs](https://elevenlabs.io/), [OpenAI](https://openai.com/)
- Special thanks to all contributors!
