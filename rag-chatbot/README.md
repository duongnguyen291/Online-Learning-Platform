# RAG Chatbot with Google Gemini & OpenAI

This project implements a Retrieval Augmented Generation (RAG) chatbot. It uses Google's Generative AI models (specifically for embeddings and potentially text cleaning) and OpenAI's GPT models (for final answer generation). Data is ingested, processed, and vectorized into a MongoDB Atlas Vector Search collection using a Python pipeline. The chat functionality is exposed via a Node.js/Express API.

## Features

- **Node.js/Express Backend:** Serves the chat API endpoint.
- **Python RAG Pipeline:**
  - Extracts text from PDF, Markdown, and TXT files.
  - Cleans text using basic methods and advanced LLM-based cleaning (Gemini).
  - Chunks text semantically.
  - Generates embeddings using Google's `text-embedding-004` model (configurable).
  - Indexes documents and their embeddings into MongoDB Atlas Vector Search.
- **Dual LLM Usage:**
  - Google AI for embeddings and text processing.
  - OpenAI (GPT-4o) for generating answers based on retrieved context.
- **MongoDB Atlas Integration:** For efficient vector similarity search.

## Project Structure

```
.
|____utils
| |____mongoClient.js         # MongoDB client setup for Node.js
|____package-lock.json
|____package.json
|____routes
| |____chat.js                # Express route for chat functionality
|____app.js                   # Main Express application
|____services
| |____python
| | |____my_helper_function.py # Helper functions for Python RAG pipeline
| | |____rag_pipeline.py       # Main Python script for data ingestion and vectorization
| |____embedding.js           # Node.js service for generating embeddings (Google AI)
| |____vectorSearch.js        # Node.js service for MongoDB vector search
| |____rag.js                 # Node.js RAG core logic (query embedding, search, generation)
```

## Prerequisites

- Node.js (v18+ recommended for Express 5) and npm
- Python (v3.9+ recommended) and pip
- MongoDB Atlas Account:
  - A running cluster.
  - Database and collection created.
  - Vector Search Index configured (see "MongoDB Setup" below).
- API Keys:
  - Google AI API Key
  - OpenAI API Key

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd rag-chatbot
    ```

2.  **Create `.env` file:**
    Create a `.env` file in the root directory and populate it with your credentials and configurations:

    ```env
    # Node.js and Python shared
    MONGODB_URI_CHAT_BOT="mongodb+srv://<user>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"
    DB_NAME_CHAT_BOT="your_chat_db_name"
    COLLECTION_NAME_CHAT_BOT="your_chat_collection_name"
    GOOGLE_API_KEY="your_google_ai_api_key"

    # Node.js specific
    PORT=3000
    OPENAI_API_KEY="your_openai_api_key"
    # Optional: Override Google embedding model for Node.js (default: models/text-embedding-004)
    # GOOGLE_EMBEDDING_MODEL="models/text-embedding-004"

    # Python RAG Pipeline specific
    # Optional: Override embedding model for Python (default: models/text-embedding-004)
    EMBEDDING_MODEL="models/text-embedding-004"
    # Optional: Override MongoDB index name for Python (default: vector_index)
    MONGODB_INDEX_NAME="vector_index"
    # Optional: Override vector dimensions if not using text-embedding-004 (default: 768)
    # VECTOR_DIMENSIONS="768"
    ```

    - Replace placeholders with your actual values.
    - The `EMBEDDING_MODEL` and `VECTOR_DIMENSIONS` should match between the Python pipeline that _writes_ the embeddings and the Node.js service that _reads/creates query embeddings_ if they interact with the same vector store index. The current setup defaults to `models/text-embedding-004` (768 dimensions) for both.

3.  **Install Node.js Dependencies:**

    - **Important:** The `package-lock.json` might be out of sync. To ensure all dependencies from `package.json` are correctly installed and the lockfile is updated:
      ```bash
      npm install @google-ai/generativelanguage
      npm install
      ```
      This first installs the potentially missing package and then ensures all others are consistent.

4.  **Install Python Dependencies:**

    ```bash
    pip install -r services/python/requirements.txt
    # or pip install -r requirements.txt if you placed it in root
    ```

5.  **MongoDB Atlas Setup:**

    - In your MongoDB Atlas cluster, create the database and collection specified in your `.env` file (e.g., `your_chat_db_name`, `your_chat_collection_name`).
    - **Create a Vector Search Index:**
      Go to your collection in Atlas, navigate to the "Search" tab, and create a new Search Index. Choose "Atlas Vector Search" and configure it using the JSON editor.
      The index name must match `MONGODB_INDEX_NAME` from your `.env` (default: `vector_index`).
      The `path` should be `embedding` (as used in `vectorSearch.js` and implied by LangChain's default).
      The `dimensions` must match `VECTOR_DIMENSIONS` (default: 768 for `text-embedding-004`).

      Example JSON configuration for the index:

      ```json
      {
        "fields": [
          {
            "type": "vector",
            "path": "embedding",
            "numDimensions": 768,
            "similarity": "cosine"
          }
        ]
      }
      ```

      _Note: The `rag_pipeline.py` script will attempt to create this index if it doesn't exist, but it's recommended to create it manually first for better control._

## Running the Application

1.  **Build the RAG Knowledge Base (Ingest Documents):**
    Run the Python pipeline to process your documents and populate the MongoDB Atlas collection.

    ```bash
    npm run build-rag -- --base-path path/to/your/document.pdf
    ```

    - Replace `path/to/your/document.pdf` with the actual path to your `.pdf`, `.md`, or `.txt` file.
    - The `npm run build-rag` script executes `python3 services/python/rag_pipeline.py`.
    - The `--` is important to pass arguments (`--base-path ...`) to the Python script.
    - **Warning:** This script will delete all existing documents in the configured MongoDB collection before adding new ones.

2.  **Start the Node.js API Server:**
    ```bash
    npm start
    ```
    The server will start, typically on `http://localhost:3000` (or the `PORT` specified in `.env`).

## API Endpoint

### `POST /chat`

Send a question to the chatbot.

- **Request Body:**
  ```json
  {
    "question": "Your question here?"
  }
  ```
- **Response Body:**
  ```json
  {
    "answer": "The chatbot's answer based on retrieved documents."
  }
  ```
- **Example using `curl`:**
  ```bash
  curl -X POST http://localhost:3000/chat \
       -H "Content-Type: application/json" \
       -d '{"question":"What is the main topic of the document?"}'
  ```

## Workflow Overview

1.  **Data Ingestion (Python Pipeline - `npm run build-rag`):**

    - A source document (PDF, MD, TXT) is provided.
    - Text is extracted and cleaned (basic and LLM-based).
    - Cleaned text is split into semantic chunks.
    - Each chunk is converted into a vector embedding using Google's embedding model.
    - The chunks (as text) and their corresponding embeddings are stored in MongoDB Atlas.

2.  **Querying (Node.js API - `POST /chat`):**
    - User sends a question to the `/chat` endpoint.
    - The question is converted into a vector embedding using the same Google embedding model (`services/embedding.js`).
    - This query embedding is used to search for the most similar document embeddings in MongoDB Atlas (`services/vectorSearch.js`).
    - The text content of the top N relevant document chunks is retrieved.
    - This retrieved context, along with the original question and a prompt, is sent to OpenAI's GPT-4o model (`services/rag.js`).
    - GPT-4o generates an answer based _only_ on the provided context.
    - The answer is returned to the user.

## Key Technologies Used

- **Backend:** Node.js, Express.js
- **RAG Pipeline:** Python
- **Language Models:**
  - Google Generative AI (for embeddings, text processing via Gemini)
  - OpenAI GPT-4o (for answer generation)
- **Vector Database:** MongoDB Atlas Vector Search
- **Libraries/Frameworks:**
  - `@google-ai/generativelanguage` (Node.js Google AI SDK)
  - `langchain`, `langchain-google-genai`, `langchain-mongodb` (Python RAG components)
  - `pymongo` (Python MongoDB driver)
  - `mongodb` (Node.js MongoDB driver)
  - `axios` (HTTP client for Node.js)
  - `dotenv` (Environment variable management)

## Potential Issues & Considerations

- **`package-lock.json` Synchronization:** Always ensure `package-lock.json` is up-to-date with `package.json` by running `npm install` after modifying dependencies.
- **Python Dependencies:** Manage Python dependencies explicitly using `requirements.txt`.
- **Data Overwriting:** The `npm run build-rag` script clears the target MongoDB collection before each run. Be mindful of this if you have existing data.
- **MongoDB Connection Pooling:** The `vectorSearch.js` service currently connects to MongoDB on each search request. For production, consider establishing a persistent connection when the Node.js application starts.
- **Vector Index Management:** The Python script attempts to create the vector index. It's often more robust to create and manage this index manually in Atlas or via a separate setup script, especially in production environments.
