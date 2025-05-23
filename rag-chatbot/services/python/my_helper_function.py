"""
This module provides utility functions for text extraction, cleaning, and processing for a RAG (Retrieval-Augmented Generation) system.
It includes functions for handling various file formats, text cleaning, and AI-driven text processing.
"""

import re
import markdown
from bs4 import BeautifulSoup
import os
import PyPDF2
import tiktoken
from langchain.docstore.document import Document
import pylcs
import pandas as pd
import textwrap
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from chunking_evaluation.chunking import ClusterSemanticChunker
from chromadb.utils import embedding_functions

### EXTRACT RAW TEXT FROM VARIOUS FILES
def pdf_text_extract(file_path):
    """
    Extracts text content from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text content or error message if extraction fails
    """
    try:
        with open(file_path, "rb") as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            documents = pdf_reader.pages
            text = " ".join([doc.extract_text() for doc in documents])
        return text
    except FileNotFoundError:
        return f"Error: File not found at {file_path}"
    except Exception as e:
        return f"An error occur: {e}"

def md_text_extract(file_path):
    """
    Extracts text content from a Markdown file by converting it to HTML and then extracting plain text.
    
    Args:
        file_path (str): Path to the Markdown file
        
    Returns:
        str: Extracted text content or error message if extraction fails
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        html_content = markdown.markdown(markdown_content)
        soup = BeautifulSoup(html_content, 'html.parser')
        text = soup.get_text()
        return text.strip()
    except FileNotFoundError:
        return f"Error: File not found at '{file_path}'"
    except Exception as e:
        return f"An error occurred: {e}"

def txt_text_extract(file_path):
    """
    Extracts text content from a plain text file.
    
    Args:
        file_path (str): Path to the text file
        
    Returns:
        str: Extracted text content or None if extraction fails
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return None
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
            return text
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return None

### BASIC DATA CLEANING
def clean_text_basic(text: str) -> str:
    """
    Performs basic text cleaning operations including:
    - ASCII encoding/decoding
    - Removal of special characters
    - Fixing hyphenation
    - Standardizing spacing
    - Handling ligatures
    
    Args:
        text (str): Input text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = text.replace('\t', ' ')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    text = re.sub(r'(\w)-(\w)', r'\1\2', text)
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    text = re.sub(r'(\d)([a-zA-Z])', r'\1 \2', text)
    text = re.sub(r'([a-zA-Z])(\d)', r'\1 \2', text)
    text = re.sub(r' +', ' ', text)
    text = text.strip()
    text = re.sub(r'fi', 'fi', text)
    text = re.sub(r'ff', 'ff', text)
    text = re.sub(r'fl', 'fl', text)
    text = re.sub(r'ffi', 'ffi', text)
    text = re.sub(r'ffl', 'ffl', text)
    text = re.sub(r'\u00b0', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r' +', ' ', text)
    return text.strip()

### AI-DRIVEN DATA EXTRACTOR
def llm_clean_data(text: str) -> str:
    """
    Uses GPT-4 to clean and structure text for RAG systems.
    Performs advanced cleaning including:
    - Removing headers/footers
    - Fixing line breaks and hyphenation
    - Standardizing formatting
    - Preserving document structure
    - Handling special elements (tables, code blocks, equations)
    
    Args:
        text (str): Raw text to clean
        
    Returns:
        str: Cleaned and structured text optimized for RAG systems
    """
    information_condenser_model = ChatOpenAI(
        model="gpt-4",
        temperature=0
    )

    # [Previous prompt template remains unchanged]
    condense_information_prompt_template = """
You are an expert AI agent specializing in cleaning text extracted from PDF files to optimize its quality for use in a Retrieval-Augmented Generation (RAG) system. Your primary objective is to transform raw, often noisy text inside backticks into a clean, coherent, and highly informative format while meticulously preserving every piece of original information and its context.

Your responsibilities include:

1.  **Eliminate Extraneous Content:** Identify and remove headers, footers, page numbers, watermarks, and any other repetitive or non-content-bearing elements introduced during PDF extraction. Be careful not to remove content that might appear similar but is actually part of the main text.

2.  **Correct Line Breaks and Hyphenation:** Accurately join words split across lines due to hyphenation or formatting. Ensure natural and grammatically correct sentence flow. Pay close attention to the context of the surrounding words to avoid incorrectly merging words that happen to be at the end and beginning of lines.

3.  **Standardize Spacing and Formatting:** Ensure consistent and appropriate spacing between words, sentences, and paragraphs. Remove any redundant spaces, tabs, or unnecessary line breaks that might hinder readability or the RAG system's performance. Aim for a clean and well-structured flow of text.

4.  **Maintain Structural Integrity:** Preserve the logical structure of the original document, including paragraph breaks, bullet points, numbered lists, and section headings (if discernible). This helps maintain context and readability. Recognize different formatting cues that indicate structural elements.

5.  **Handle Special Elements with Care:**
    * **Tables:** If the text contains tables, attempt to retain their structure using appropriate formatting (e.g., Markdown tables if feasible, or clear delimiters like tabs or consistent spacing). If structural preservation is challenging, prioritize retaining all the data within the table in a readable format.
    * **Code Blocks:** If the text includes code blocks, ensure they are clearly demarcated using common code block indicators (e.g., triple backticks in Markdown) and that the code content remains intact and formatted as consistently as possible.
    * **Equations and Formulas:** If present, try to preserve them in a readable format. If the original formatting is lost, consider using common representations like LaTeX-style syntax if appropriate and if it enhances readability without altering the meaning.

6.  **Absolute Information Preservation is Paramount:** Your paramount concern is to ensure that no factual information, data, figures, specific terminology, or context is lost during the cleaning process. If you encounter any ambiguity or uncertainty about whether to remove or modify a piece of text, prioritize preserving it exactly as it appears in the original extracted text. Do not make assumptions or inferences that could lead to information loss.

7.  **Output Format:** The final output must be a single, continuous string of clean text, with logical paragraph breaks maintained (e.g., using double line breaks). Avoid introducing any new information, rephrasing content, or altering the meaning of the original text in any way. Your sole purpose is to clean the formatting for better readability and RAG system performance.

Think step by step and justify your cleaning decisions based on the principles of information preservation and improved readability for a RAG system. If you are ever unsure, lean towards preserving the original text.

```
{text}
```
"""

    condense_information_prompt = PromptTemplate(template=condense_information_prompt_template, input_variables=["text"])
    string_output_parser = StrOutputParser()

    condense_chain = (
        {"text": lambda x: x}
        | condense_information_prompt
        | information_condenser_model
        | string_output_parser
    )

    return condense_chain.invoke(text)

### TOKEN COUNTER FOR OPENAI
def count_tokens_for_openai(text: str, model_name: str = "gpt-4") -> int:
    """
    Counts the number of tokens in a text string for a specific OpenAI model.
    
    Args:
        text (str): Input text to count tokens for
        model_name (str): OpenAI model name (default: "gpt-4")
        
    Returns:
        int: Number of tokens in the text
    """
    enc = tiktoken.encoding_for_model(model_name)
    return len(enc.encode(text))

# Initialize environment variables and embedding function
load_dotenv(override=True)
openai_api_key = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = openai_api_key
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.environ["OPENAI_API_KEY"],
    model_name=EMBEDDING_MODEL_NAME
)

def cluster_chunking(str_text):
    """
    Splits text into semantic chunks using clustering.
    
    Args:
        str_text (str): Input text to chunk
        
    Returns:
        list: List of text chunks
    """
    cluster_chunker = ClusterSemanticChunker(
        embedding_function=embedding_function,
        max_chunk_size = 400
    )
    cluster_chunker_chunks = cluster_chunker.split_text(str_text)
    return cluster_chunker_chunks

