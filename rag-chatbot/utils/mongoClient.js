const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const client = new MongoClient(process.env.MONGODB_URI_CHAT_BOT);
console.log('Connecting to MongoDB at:', process.env.MONGODB_URI_CHAT_BOT);
client.connect();
module.exports = client;
