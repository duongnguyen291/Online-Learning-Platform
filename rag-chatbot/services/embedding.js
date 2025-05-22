const { GoogleGenerativeAI } = require("@google-ai/generativelanguage");
require('dotenv').config();

// Ensure GOOGLE_API_KEY is loaded from .env
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Use the model name from .env, defaulting to text-embedding-004
const EMBEDDING_MODEL_NAME = process.env.GOOGLE_EMBEDDING_MODEL || "models/text-embedding-004";

async function getEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    if (!embedding || !embedding.values) {
        throw new Error('Failed to get embedding values from Google AI');
    }
    return embedding.values; // This is the actual embedding vector (array of numbers)
  } catch (error) {
    console.error("Error getting embedding from Google AI:", error.message);
    // Potentially log more details from error if available, e.g., error.response.data
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

module.exports = { getEmbedding };


// const axios = require('axios');
// require('dotenv').config();

// async function getEmbedding(text) {
//   const res = await axios.post('https://api.openai.com/v1/embeddings', {
//     input: text,
//     model: 'text-embedding-ada-002'
//   }, {
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
//     }
//   });

//   return res.data.data[0].embedding;
// }

// module.exports = { getEmbedding };
