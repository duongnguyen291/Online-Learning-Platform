const { getEmbedding } = require('./embedding');
const { searchSimilarDocuments } = require('./vectorSearch');
const axios = require('axios');
require('dotenv').config();

async function answerQuestion(question) {
  const queryEmbedding = await getEmbedding(question);
  const relevantDocs = await searchSimilarDocuments(queryEmbedding);

  const context = relevantDocs.map(doc => doc.text).join('\n');

  const prompt = `
    Trả lời câu hỏi dựa trên thông tin sau:
    ${context}

    Câu hỏi: ${question}
  `;

  const res = await axios.post('https://api.openai.com/v1/completions', {
    model: 'gpt-4o',
    prompt,
    max_tokens: 200
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return res.data.choices[0].text.trim();
}

module.exports = { answerQuestion };
