from typing import List, Dict, Any
import os
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores.chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    TextLoader,
    PDFMinerLoader as PDFLoader,
    Docx2txtLoader as DocxLoader,
    UnstructuredFileLoader,
)
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import chardet
from dotenv import load_dotenv, find_dotenv

# Force reload environment variables
os.environ.pop('OPENAI_API_KEY', None)  # Remove any existing API key from environment
load_dotenv(find_dotenv(), override=True)  # Reload .env file and override existing variables

# Check OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")
print(f"Using OpenAI API key: {OPENAI_API_KEY[:10]}...")  # Print first 10 chars for verification

class RAGService:
    def __init__(self):
        # Ensure the Chroma DB directory exists
        os.makedirs("./data/chroma_db", exist_ok=True)
        
        # Get fresh copy of API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=api_key,
            model="text-embedding-3-small"  # Specify the embedding model
        )
        
        # Initialize ChromaDB with OpenAI embeddings
        self.vector_store = Chroma(
            persist_directory="./data/chroma_db",
            embedding_function=self.embeddings,
            collection_metadata={"hnsw:space": "cosine"}  # Use cosine similarity for text-embedding-3-small
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-4",
            openai_api_key=api_key,
            verbose=True
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        self.qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vector_store.as_retriever(
                search_kwargs={"k": 3}
            ),
            memory=self.memory,
            return_source_documents=True,
            verbose=True
        )

    def _detect_encoding(self, file_path: str) -> str:
        """Detect the encoding of a file."""
        with open(file_path, 'rb') as file:
            raw_data = file.read()
            result = chardet.detect(raw_data)
            return result['encoding'] or 'utf-8'

    def _load_text_file(self, file_path: str) -> List[Any]:
        """Load a text file with proper encoding detection."""
        try:
            encoding = self._detect_encoding(file_path)
            loader = TextLoader(file_path, encoding=encoding)
            return loader.load()
        except Exception as e:
            print(f"Error loading text file: {str(e)}")
            raise

    def _load_document(self, file_path: str) -> List[Any]:
        try:
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension == '.txt':
                documents = self._load_text_file(file_path)
            else:
                loaders = {
                    '.pdf': PDFLoader,
                    '.docx': DocxLoader,
                }
                
                loader_class = loaders.get(file_extension, UnstructuredFileLoader)
                loader = loader_class(file_path)
                documents = loader.load()
            
            # Split documents into chunks
            chunks = self.text_splitter.split_documents(documents)
            
            print(f"Loaded {len(documents)} documents, split into {len(chunks)} chunks")
            return chunks
        except Exception as e:
            print(f"Error loading document: {str(e)}")
            raise

    async def add_document(self, file_path: str) -> Dict[str, Any]:
        try:
            if not os.path.exists(file_path):
                return {
                    "status": "error",
                    "message": f"File not found: {file_path}"
                }
                
            documents = self._load_document(file_path)
            if not documents:
                return {
                    "status": "error",
                    "message": "No content could be extracted from the document"
                }
                
            self.vector_store.add_documents(documents)
            
            return {
                "status": "success",
                "message": f"Successfully added document: {os.path.basename(file_path)}",
                "num_chunks": len(documents)
            }
        except Exception as e:
            print(f"Error processing document: {str(e)}")
            return {
                "status": "error",
                "message": f"Error processing document: {str(e)}"
            }

    async def query(self, question: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            # Format the question to get better responses
            formatted_question = f"""Please answer the following question based on the provided context. 
            If you don't find relevant information in the context, say so.
            
            Question: {question}
            
            Please provide a detailed and well-structured answer."""

            result = await self.qa_chain.ainvoke({
                "question": formatted_question,
                "chat_history": context.get("chat_history", []) if context else []
            })
            
            # Extract source documents
            sources = []
            if result.get("source_documents"):
                for doc in result["source_documents"]:
                    sources.append({
                        "content": doc.page_content,
                        "metadata": doc.metadata
                    })

            return {
                "status": "success",
                "answer": result["answer"],
                "sources": sources
            }
        except Exception as e:
            print(f"Error processing query: {str(e)}")
            return {
                "status": "error",
                "message": f"Error processing query: {str(e)}"
            }

    async def get_relevant_context(self, query: str) -> Dict[str, Any]:
        try:
            documents = self.vector_store.similarity_search(query, k=3)
            contexts = []
            
            for doc in documents:
                contexts.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata
                })

            return {
                "status": "success",
                "contexts": contexts
            }
        except Exception as e:
            print(f"Error retrieving context: {str(e)}")
            return {
                "status": "error",
                "message": f"Error retrieving context: {str(e)}"
            }

# Create a singleton instance
rag_service = RAGService() 