"""
rag_pipeline.py

A self-contained RAG pipeline that:

  1. Loads PDF/MD/TXT content
  2. Cleans and chunks text
  3. Generates embeddings via Google Generative AI
  4. Indexes vectors in MongoDB Atlas

"""

import os
import argparse
from dotenv import load_dotenv
from pprint import pprint
from typing import List

from pymongo import MongoClient
from langchain.docstore.document import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch

from my_helper_function import (
    pdf_text_extract,
    md_text_extract,
    txt_text_extract,
    clean_text_basic,
    llm_clean_data,
    count_tokens_for_gemini,
    cluster_chunking,
)

# -----------------------------------------------------------------------------
# Load environment
# -----------------------------------------------------------------------------
load_dotenv(override=True)

MONGODB_URI_CHAT_BOT          = os.getenv("MONGODB_URI_CHAT_BOT")
DB_NAME              = os.getenv("DB_NAME_CHAT_BOT")
COLLECTION_NAME      = os.getenv("COLLECTION_NAME_CHAT_BOT")
INDEX_NAME           = os.getenv("MONGODB_INDEX_NAME", "vector_index")
EMBEDDING_MODEL      = os.getenv("EMBEDDING_MODEL", "models/text-embedding-004")
VECTOR_DIMENSIONS    = int(os.getenv("VECTOR_DIMENSIONS", "768"))

if not MONGODB_URI_CHAT_BOT or not DB_NAME or not COLLECTION_NAME or not INDEX_NAME:
    raise ValueError("Environment variable must be set")

# -----------------------------------------------------------------------------
# Format-aware Loader
# -----------------------------------------------------------------------------
def load_text_by_extension(path: str) -> str:
    """
    Load the contents of a file based on its extension.

    Supported formats:
      - .pdf → pdf_text_extract
      - .md  → md_text_extract
      - .txt → txt_text_extract

    Args:
        path: Path to the document including extension.

    Returns:
        Raw text extracted from the document.

    Raises:
        ValueError: If the extension is not among supported formats.
        FileNotFoundError: If the file does not exist.
    """
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

def clean_and_condense(raw: str) -> str:
    """
    Clean text and remove PDF code-fence noise.

    Steps:
      1. Normalize whitespace, remove artifacts via clean_text
      2. Further strip PDF-specific formatting via clean_pdf_data
      3. Trim leading ```plaintext fence if present

    Args:
        raw: Raw text extracted from the source.

    Returns:
        A cleaned, condensed string ready for chunking.
    """
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
    """
    Prints token counts for monitoring compression efficiency.

    Args:
        raw: Original raw text.
        cleaned: After general cleaning.
        condensed: After PDF-specific condensation.
    """
    print("Token counts:")
    print(f"  • Raw:       {count_tokens_for_gemini(raw)}")
    print(f"  • Cleaned:   {count_tokens_for_gemini(cleaned)}")
    print(f"  • Condensed: {count_tokens_for_gemini(condensed)}\n")


# -----------------------------------------------------------------------------
# Vector Store Encoding
# -----------------------------------------------------------------------------

def encode_cleaned_text(text: str, source_file_path: str) -> MongoDBAtlasVectorSearch:
    """
    Chunks, embeds, and indexes `text` into MongoDB Atlas Vector Search.

    Args:
        text: Full cleaned text to index.

    Returns:
        Populated MongoDBAtlasVectorSearch instance.
    """
    # Connect & clear old data
    client = MongoClient(MONGODB_URI_CHAT_BOT)
    coll   = client[DB_NAME][COLLECTION_NAME]
    coll.delete_many({})

    # Prepare embedding + vector store
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    vs = MongoDBAtlasVectorSearch(
        collection=coll,
        embedding=embeddings,
        index_name=INDEX_NAME,
        relevance_score_fn="cosine",
    )
    vs.create_vector_search_index(dimensions=VECTOR_DIMENSIONS)

    # Chunk & document wrap
    docs = [
        Document(page_content=chunk, metadata={"source": os.path.basename(source_file_path)}) # Use source_file_path
        for chunk in cluster_chunking(text) # Remove the "for path in []"
    ]

    # Bulk add
    if docs: # Only add if there are documents
        vs.add_documents(docs)
    else:
        print(f"⚠️ No chunks generated for {source_file_path}, nothing to index.")
    return vs

# -----------------------------------------------------------------------------
# Main Pipeline
# -----------------------------------------------------------------------------
def main(file_path: str) -> None:
    """
    Orchestrates:
      1. Format-aware loading
      2. Cleaning & condensation
      3. Token count reporting
      4. Vector encoding

    Args:
        file_path: Path to .pdf, .md, or .txt file.
    """
    # 1) Load
    raw = load_text_by_extension(file_path)
    print(f"\n--- Loaded {file_path} ({len(raw)} characters) ---\n")
    pprint(raw[:300])

    # 2) Clean & condense
    cleaned   = clean_text_basic(raw)
    condensed = clean_and_condense(raw)

    # 3) Diagnostics
    report_token_counts(raw, cleaned, condensed)

    # 4) Encode to vector store
    vs = encode_cleaned_text(condensed, file_path) # Pass file_path
    print(f"✅ Indexed {file_path} into vector store: {vs}")

# -----------------------------------------------------------------------------
# Script Entry Point
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Load & index a document via RAG pipeline"
    )
    parser.add_argument(
        "--base-path",
        required=True,
        help="Path (with extension) to your document, e.g. ./docs/Chapter3.pdf",
    )
    args = parser.parse_args()
    main(args.base_path)


