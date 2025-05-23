const express = require('express');
const app = express();
const chatRoute = require('./routes/chat');
require('dotenv').config();

app.use(express.json());
app.use('/chat', chatRoute);

const PORT_RAG_CHAT_BOT = process.env.PORT_RAG_CHAT_BOT || 3000;
app.listen(PORT_RAG_CHAT_BOT, () => {
  console.log(`Server running on port localhost:${PORT_RAG_CHAT_BOT}`);
});
