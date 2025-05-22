This service provides a Retrieval Augmented Generation (RAG) powered chatbot. It ingests documents, stores their embeddings in MongoDB Atlas, and uses this knowledge base along with a Large Language Model (LLM) to answer user questions.

## Features

- **Document Ingestion:** Processes PDF, Markdown, and TXT files.
- **Embedding Generation:** Uses Google Generative AI models (e.g., `text-embedding-004`) for creating text embeddings.
- **Vector Storage:** Leverages MongoDB Atlas Vector Search for efficient similarity search.
- **Answer Generation:** Utilizes OpenAI's GPT models (e.g., `gpt-4o`) for generating contextual answers.
- **API:** Exposes an Express.js endpoint (`/chat`) for interaction.

## Directory Structure (Key Components)

```
rag-chatbot/
|____app.js                    # Express.js application entry point
|____package.json              # Node.js dependencies and scripts
|____routes/
| |____chat.js                # API route for chat
|____services/
| |____python/                 # Python scripts for RAG pipeline
| | |____rag_pipeline.py       # Main data ingestion and embedding script
| | |____my_helper_function.py # Helper functions for Python script
| | |____requirements.txt      # Python dependencies
| |____embedding.js            # Generates query embeddings (Google AI)
| |____vectorSearch.js         # Performs vector search in MongoDB
| |____rag.js                  # Orchestrates the RAG process and LLM call
|____utils/
| |____mongoClient.js          # MongoDB client setup
|____.env                      # Environment variables (create this file)
|____Computer_Network_Chapter_3.pdf # Example document for RAG
```

## Prerequisites

- Node.js (v18.x or later recommended) and npm
- Python (v3.9 or later recommended) and pip
- Access to a MongoDB Atlas cluster with Vector Search enabled.
- Google AI API Key
- OpenAI API Key

## Setup

1.  **Clone the Repository (if applicable)**

    ```bash
    # If this is part of a larger project, you might already have it.
    # git clone <repository-url>
    # cd <path-to-project>/rag-chatbot
    ```

2.  **Create Environment File:**
    Navigate to the `rag-chatbot` directory and create a `.env` file with the following content. Replace placeholder values with your actual credentials and configurations:

    ```env
    # Server Configuration
    PORT=3000

    # Google AI Configuration
    GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"
    GOOGLE_EMBEDDING_MODEL="models/text-embedding-004" # Optional, defaults to this

    # OpenAI Configuration
    OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

    # MongoDB Atlas Configuration
    MONGODB_URI_CHAT_BOT="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
    DB_NAME_CHAT_BOT="your_chat_db_name"
    COLLECTION_NAME_CHAT_BOT="your_chat_collection_name"
    MONGODB_INDEX_NAME="vector_index" # Optional, defaults to this for the Python script
    VECTOR_DIMENSIONS=768 # Optional, defaults to this (matches text-embedding-004)


    # RAG Pipeline Configuration (for Python script)
    RAG_FILE_PATH="./Computer_Network_Chapter_3.pdf" # Path to the document to process
    ```

3.  **Install Node.js Dependencies:**
    In the `rag-chatbot` directory:

    ```bash
    npm install
    ```

4.  **Setup Python Environment & Dependencies:**
    Navigate to the Python services directory:
    ```bash
    cd services/python
    ```
    Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    # .\venv\Scripts\activate
    ```
    Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    Return to the `rag-chatbot` root directory:
    ```bash
    cd ../..
    ```
