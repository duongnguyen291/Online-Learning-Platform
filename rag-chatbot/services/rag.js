const { getEmbedding } = require('./embedding');
const { searchSimilarDocuments } = require('./vectorSearch');
const axios = require('axios');
require('dotenv').config();

async function answerQuestion(question) {
  const queryEmbedding = await getEmbedding(question);
  const relevantDocs = await searchSimilarDocuments(queryEmbedding);

  const context = relevantDocs.map(doc => doc.text).join('\n');

  const prompt = `
Bạn là một trợ lý AI hữu ích. Nhiệm vụ của bạn là trả lời câu hỏi của người dùng một cách chính xác và chỉ dựa vào nội dung được cung cấp trong phần "THÔNG TIN THAM KHẢO" dưới đây. Không sử dụng bất kỳ kiến thức bên ngoài nào. Nếu thông tin không có trong tài liệu tham khảo, hãy cho biết bạn không tìm thấy câu trả lời trong tài liệu. Trả lời bằng tiếng Việt.

THÔNG TIN THAM KHẢO:
---
${context}
---

Câu hỏi của người dùng: ${question}

Câu trả lời của bạn:
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
