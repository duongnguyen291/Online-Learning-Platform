const { getEmbedding } = require('./embedding');
const { searchSimilarDocuments } = require('./vectorSearch');
const axios = require('axios');
require('dotenv').config();

async function answerQuestion(question) {
  const queryEmbedding = await getEmbedding(question);
  const relevantDocs = await searchSimilarDocuments(queryEmbedding);

  const context = relevantDocs.map(doc => doc.text).join('\n');

  const prompt = `
Bạn là một trợ lý AI phân tích. Hãy trả lời câu hỏi của người dùng một cách chính xác, hoàn toàn dựa vào "THÔNG TIN THAM KHẢO" được cung cấp.
Đối với mỗi phần quan trọng trong câu trả lời của bạn, hãy tham chiếu đến phần cụ thể trong "THÔNG TIN THAM KHẢO" đã cung cấp thông tin đó. Ví dụ: "(theo đoạn X)" hoặc "Như đã nêu trong phần Y...".
Không sử dụng kiến thức bên ngoài. Nếu không tìm thấy thông tin, hãy nêu rõ. Trả lời bằng tiếng Việt.

THÔNG TIN THAM KHẢO:
---
${context}
---

Câu hỏi của người dùng: ${question}

Câu trả lời của bạn (tham chiếu đến nguồn trong tài liệu):
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
