/*

Copyright 2024 Himanshu Dinkar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const express = require('express');
const connectDb = require('./db/db');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser');
const socketService = require('./middlewares/socketService');
// Initialize Express app and setup middlewares
const app = express();
connectDb(); // Connect database

// Configure CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.IO setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5174","https://virtual-classroom-admin.vercel.app","https://virtual-classroom-application.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

socketService(io);

// API routes

app.use('/api/v1', userRoutes);
app.use('/api/v2', adminRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('Welcome to my Server');
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
