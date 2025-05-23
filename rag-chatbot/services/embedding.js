const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function getEmbedding(text) {
  const res = await axios.post('https://api.openai.com/v1/embeddings', {
    input: text,
    model: 'text-embedding-3-small'
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return res.data.data[0].embedding;
}

module.exports = { getEmbedding };
