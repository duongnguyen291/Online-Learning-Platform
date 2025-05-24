const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class RAGService {
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/rag/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async query(question, context = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      return await response.json();
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw error;
    }
  }

  async getDocumentContext(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get context');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const ragService = new RAGService();
export default ragService; 