const client = require('../utils/mongoClient');
require('dotenv').config();

async function searchSimilarDocuments(queryEmbedding) {
  await client.connect();
  const db = client.db(process.env.DB_NAME_CHAT_BOT);
  const collection = db.collection(process.env.COLLECTION_NAME_CHAT_BOT);

  const results = await collection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        queryVector: queryEmbedding,
        path: 'embedding',
        numCandidates: 100,
        limit: 5
      }
    }
  ]).toArray();

  return results;
}

module.exports = { searchSimilarDocuments };
