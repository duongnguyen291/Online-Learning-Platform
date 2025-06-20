# Online Learning Platform – Admin

This is the **Admin Dashboard** for the Online Learning Platform. It provides administrators with tools to manage users, courses, and platform settings, featuring a modern UI and real-time features.

---

## 🚀 Features

- **User Management**: Approve/reject lecturer registrations, manage students and lecturers
- **Course Management**: Create, edit, and delete courses; assign lecturers and set requirements
- **Profile Management**: View and update admin profile and credentials
- **Authentication**: Secure login for admin users
- **Real-Time Updates**: See changes reflected instantly across the platform
- **Responsive UI**: Built with Ant Design and custom CSS for a modern experience

---

## 🗂️ Project Structure

```
admin/
├── public/                # Static assets (index.html, icons, etc.)
├── src/
│   ├── assets/            # Images and static files
│   │   ├── sidebar/       # Navigation sidebar
│   │   ├── users/         # Student and lecturer management
│   │   ├── courses/       # Course management
│   │   ├── profile/       # Admin profile
│   ├── pages/             # Main pages (Auth, MainMenu)
│   ├── styles/            # Custom CSS
│   ├── App.js[x]          # App entry point
│   └── index.js           # React entry point
├── package.json           # Project metadata and dependencies
└── README.md              # This file
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Online-Learning-Platform/admin
   ```

2. **Create a `.env` file**

   > Example:

   ```env
   PORT=3001
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm start
   ```
   The admin dashboard will be available at [http://localhost:3001](http://localhost:3001)

---

## 🧑‍💻 Test Admin Account

```
phong.cao@email.com
phong1234
```

---

## 🛠️ Scripts

- `npm start` – Start the development server
- `npm run build` – Build for production
- `npm test` – Run tests

---

## 🧩 Main Components & Pages

- **Sidebar**: Navigation for user, course, and profile management
- **User Management**: Approve/reject lecturers, manage students
- **Course Management**: Add, edit, and delete courses
- **Profile**: View and update admin profile and password
- **AuthPage**: Handles authentication and login
- **MainMenuPage**: Main dashboard for admin actions

---

## 📦 Dependencies

- React, React Router DOM, Ant Design, Lucide-React, Moment.js, and more. See `package.json` for the full list.

---

## 📝 Customization

- **Styling**: Customize with Ant Design and CSS modules in `src/styles/` and component folders
- **API URLs**: Change backend API endpoints via `.env` or directly in service calls

---

## 🔗 Related

- For backend, client, and lecturer setup, see the main [project README](../README.md)
- For architecture and API details, see the main project documentation

---

## 📄 License

This project is for educational/demo purposes. See main repository for license details.
