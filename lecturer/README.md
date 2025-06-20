# Online Learning Platform – Lecturer

This is the **Lecturer Dashboard** for the Online Learning Platform. It empowers lecturers to create and manage courses, track student progress, and interact with a modern, responsive UI.

---

## 🚀 Features

- **Course Management**: Create, edit, and delete courses, chapters, and lessons
- **Student Management**: View enrolled students, track progress, and export student lists
- **Profile Management**: View and update lecturer profile and credentials
- **Notifications**: Receive real-time updates on course and student activity
- **Authentication**: Secure login for lecturer users with protected routes
- **Responsive UI**: Built with modern React, Lucide icons, and custom CSS

---

## 🗂️ Project Structure

```
lecturer/
├── public/                # Static assets (index.html, icons, etc.)
├── src/
│   ├── assets/            # Images and static files
│   │   ├── sidebar/       # Navigation sidebar
│   │   ├── menu/          # Dashboard, notifications
│   │   ├── courses/       # Course management (create, edit, list, enrolled students)
│   │   ├── students/      # Student management
│   │   ├── profile/       # Lecturer profile
│   │   ├── auth/          # ProtectedRoute
│   │   └── App.js[x]      # App entry point
│   ├── pages/             # Main pages (Auth, MainMenu, CourseEditor, etc.)
│   ├── services/          # API service calls
│   ├── styles/            # Custom CSS
│   └── index.js           # React entry point
├── package.json           # Project metadata and dependencies
└── README.md              # This file
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Online-Learning-Platform/lecturer
   ```

2. **Create a `.env` file**

   > Example:

   ```env
   PORT=3002
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm start
   ```
   The lecturer dashboard will be available at [http://localhost:3002](http://localhost:3002)

---

## 🧑‍💻 Test Lecturer Account

```
alice.smith@email.com
alice123
```

---

## 🛠️ Scripts

- `npm start` – Start the development server
- `npm run build` – Build for production
- `npm test` – Run tests

---

## 🧩 Main Components & Pages

- **Sidebar**: Navigation for courses, profile, and logout
- **LecturerPanel**: Main dashboard with notifications and search
- **Course Management**: Create, edit, and delete courses, manage chapters and lessons
- **Student Management**: View and manage enrolled students
- **Profile**: View and update lecturer profile
- **AuthPage / ProtectedRoute**: Handles authentication and route protection

---

## 📦 Dependencies

- React, React Router DOM, Lucide-React, and more. See `package.json` for the full list.

---

## 📝 Customization

- **Styling**: Customize with CSS modules in `src/styles/` and component folders
- **API URLs**: Change backend API endpoints via `.env` or directly in service calls

---

## 🔗 Related

- For backend, client, and admin setup, see the main [project README](../README.md)
- For architecture and API details, see the main project documentation

---

## 📄 License

This project is for educational/demo purposes. See main repository for license details.
