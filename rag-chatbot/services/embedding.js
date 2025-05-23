const axios = require('axios');
require('dotenv').config();

async function getEmbedding(text) {
  const res = await axios.post('https://api.openai.com/v1/embeddings', {
    input: text,
    model: 'text-embedding-ada-002'
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return res.data.data[0].embedding;
}

module.exports = { getEmbedding };
