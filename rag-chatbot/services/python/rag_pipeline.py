"""
rag_pipeline.py
A self-contained RAG pipeline that:
  1. Loads PDF/MD/TXT content from a directory
  2. Cleans and chunks text
  3. Generates embeddings via OpenAI
  4. Indexes vectors in MongoDB Atlas
"""
import os
from dotenv import load_dotenv
from pprint import pprint
from typing import List
from pymongo import MongoClient
from langchain.docstore.document import Document
from langchain_openai import OpenAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from my_helper_function import (
    pdf_text_extract,
    md_text_extract,
    txt_text_extract,
    clean_text_basic,
    llm_clean_data,
    count_tokens_for_openai,
    cluster_chunking,
)
# -----------------------------------------------------------------------------
# Load environment
# -----------------------------------------------------------------------------
load_dotenv(override=True)
MONGODB_URI_CHAT_BOT       = os.getenv("MONGODB_URI_CHAT_BOT")
DB_NAME                    = os.getenv("DB_NAME_CHAT_BOT")
COLLECTION_NAME            = os.getenv("COLLECTION_NAME_CHAT_BOT")
INDEX_NAME                 = os.getenv("MONGODB_INDEX_NAME", "vector_index")
EMBEDDING_MODEL            = os.getenv("EMBEDDING_MODEL", "text3-small")
VECTOR_DIMENSIONS          = int(os.getenv("VECTOR_DIMENSIONS", "1536"))
RAG_DIR_PATH               = os.getenv('RAG_DIR_PATH')
SUPPORTED_EXTENSIONS       = {'.pdf', '.md', '.txt'}
MAX_TOKENS_PER_CHUNK       = 5000
TOKEN_OVERLAP             = 300

if not MONGODB_URI_CHAT_BOT or not DB_NAME or not COLLECTION_NAME or not INDEX_NAME:
    raise ValueError("Environment variable must be set")

# -----------------------------------------------------------------------------
# Format-aware Loader
# -----------------------------------------------------------------------------
def load_text_by_extension(path: str) -> str:
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Document not found: {path}")
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return pdf_text_extract(path)
    elif ext == ".md":
        return md_text_extract(path)
    elif ext == ".txt":
        return txt_text_extract(path)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Supported: .pdf, .md, .txt")

# -----------------------------------------------------------------------------
# Cleaning & Chunking
# -----------------------------------------------------------------------------
def split_large_text(text: str) -> List[str]:
    """
    Splits text into chunks of MAX_TOKENS_PER_CHUNK with TOKEN_OVERLAP overlap
    if the text exceeds MAX_TOKENS_PER_CHUNK tokens.
    
    Args:
        text (str): Input text to split
        
    Returns:
        List[str]: List of text chunks
    """
    token_count = count_tokens_for_openai(text)
    if token_count <= MAX_TOKENS_PER_CHUNK:
        return [text]
        
    chunks = []
    current_pos = 0
    text_length = len(text)
    
    while current_pos < text_length:
        # Find approximate chunk size by binary search
        chunk_size = MAX_TOKENS_PER_CHUNK
        while True:
            chunk_text = text[current_pos:current_pos + chunk_size]
            if count_tokens_for_openai(chunk_text) <= MAX_TOKENS_PER_CHUNK:
                break
            chunk_size = int(chunk_size * 0.9)  # Reduce chunk size by 10%
            
        chunks.append(chunk_text)
        # Move position forward, accounting for overlap
        current_pos += chunk_size - TOKEN_OVERLAP
        
    return chunks

def clean_and_condense(raw: str) -> str:
    basic_cleaned = clean_text_basic(raw)
    condensed = llm_clean_data(basic_cleaned)
    fence = "\n```plaintext\n"
    if condensed.startswith(fence):
        condensed = condensed[len(fence):]
    return condensed

# -----------------------------------------------------------------------------
# Diagnostics
# -----------------------------------------------------------------------------
def report_token_counts(raw: str, cleaned: str, condensed: str) -> None:
    print("Token counts:")
    print(f"  • Raw:       {count_tokens_for_openai(raw)}")
    print(f"  • Cleaned:   {count_tokens_for_openai(cleaned)}")
    print(f"  • Condensed: {count_tokens_for_openai(condensed)}\n")

# -----------------------------------------------------------------------------
# Vector Store Initialization
# -----------------------------------------------------------------------------
def init_vector_store():
    client = MongoClient(MONGODB_URI_CHAT_BOT)
    coll = client[DB_NAME][COLLECTION_NAME]
    # Clear existing data
    coll.delete_many({})

    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vs = MongoDBAtlasVectorSearch(
        collection=coll,
        embedding=embeddings,
        index_name=INDEX_NAME,
        relevance_score_fn="cosine",
    )
    vs.create_vector_search_index(dimensions=VECTOR_DIMENSIONS)
    return vs

# -----------------------------------------------------------------------------
# Directory-based Pipeline
# -----------------------------------------------------------------------------
def process_directory(dir_path: str) -> None:
    if not os.path.isdir(dir_path):
        raise NotADirectoryError(f"Directory not found: {dir_path}")

    vs = init_vector_store()

    for filename in os.listdir(dir_path):
        ext = os.path.splitext(filename)[1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            print(f"Skipping unsupported file: {filename}")
            continue

        file_path = os.path.join(dir_path, filename)
        # 1. Load
        raw = load_text_by_extension(file_path)
        print(f"\n--- Loaded {file_path} ({len(raw)} characters) ---\n")
        pprint(raw[:300])

        # 2. Split large texts if needed before cleaning
        raw_chunks = split_large_text(raw)
        
        # 3. Process each chunk
        all_docs = []
        for chunk in raw_chunks:
            # Clean & condense
            cleaned = clean_text_basic(chunk)
            condensed = clean_and_condense(chunk)
            
            # Diagnostics
            report_token_counts(chunk, cleaned, condensed)
            
            # Further chunking and document creation
            docs = [
                Document(page_content=subchunk, metadata={"source": filename})
                for subchunk in cluster_chunking(condensed)
            ]
            all_docs.extend(docs)
            
        if all_docs:
            vs.add_documents(all_docs)
            print(f"✅ Indexed {filename} ({len(all_docs)} chunks)")
        else:
            print(f"⚠️ No chunks generated for {filename}")

# -----------------------------------------------------------------------------
# Script Entry Point
# -----------------------------------------------------------------------------
if __name__ == "__main__":    
    if not RAG_DIR_PATH:
        raise ValueError("RAG_DIR_PATH environment variable is not set")
    process_directory(RAG_DIR_PATH)
