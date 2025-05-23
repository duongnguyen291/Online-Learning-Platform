const express = require('express');
const router = express.Router();
const { answerQuestion } = require('../services/rag');

router.post('/', async (req, res) => {
  const { question } = req.body;
  const answer = await answerQuestion(question);
  res.json({ answer });
});

module.exports = router;
