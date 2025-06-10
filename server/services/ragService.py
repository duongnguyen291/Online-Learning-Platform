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
import json
from datetime import datetime
import hashlib

# Force reload environment variables
os.environ.pop('OPENAI_API_KEY', None)
load_dotenv(find_dotenv(), override=True)

# Check OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

class RAGService:
    def __init__(self):
        # Ensure directories exist
        os.makedirs("./data/chroma_db", exist_ok=True)
        os.makedirs("./data/documents", exist_ok=True)
        os.makedirs("./data/user_knowledge", exist_ok=True)
        
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=self.api_key,
            model="text-embedding-3-small"
        )
        
        # Initialize global knowledge base
        self.global_vector_store = Chroma(
            persist_directory="./data/chroma_db",
            embedding_function=self.embeddings,
            collection_name="global_knowledge",
            collection_metadata={"hnsw:space": "cosine"}
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-4",
            openai_api_key=self.api_key,
            verbose=True
        )

    def get_user_vector_store(self, user_id: str) -> Chroma:
        """Get or create a vector store for a specific user."""
        return Chroma(
            persist_directory=f"./data/user_knowledge/{user_id}",
            embedding_function=self.embeddings,
            collection_name=f"user_{user_id}_knowledge",
            collection_metadata={"hnsw:space": "cosine"}
        )

    async def add_document(self, file_path: str, user_id: str = None) -> Dict[str, Any]:
        try:
            if not os.path.exists(file_path):
                return {
                    "status": "error",
                    "message": f"File not found: {file_path}"
                }
            
            # Calculate file hash
            file_hash = self._calculate_file_hash(file_path)
            
            # Load and process document
            documents = self._load_document(file_path, doc_id=file_hash)
            if not documents:
                return {
                    "status": "error",
                    "message": "No content could be extracted from the document"
                }
            
            # Add to appropriate vector store
            if user_id:
                vector_store = self.get_user_vector_store(user_id)
                # Add user metadata to documents
                for doc in documents:
                    doc.metadata["user_id"] = user_id
            else:
                vector_store = self.global_vector_store
            
            vector_store.add_documents(documents)
            
            return {
                "status": "success",
                "message": f"Successfully added document to {'user' if user_id else 'global'} knowledge base",
                "doc_id": file_hash,
                "num_chunks": len(documents)
            }
        except Exception as e:
            print(f"Error processing document: {str(e)}")
            return {
                "status": "error",
                "message": f"Error processing document: {str(e)}"
            }

    async def suggest_learning_path(self, user_id: str, user_knowledge: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Get user's personal vector store
            user_store = self.get_user_vector_store(user_id)
            
            # Combine user preferences and history into a prompt
            preferences = user_knowledge.get("learningPreferences", {})
            history = user_knowledge.get("learningHistory", [])
            
            prompt = f"""Based on the user's profile and learning history, suggest a personalized learning path. Consider:

1. Current level: {preferences.get('difficulty', 'beginner')}
2. Learning style: {preferences.get('preferredLearningStyle', 'visual')}
3. Available time: {preferences.get('availableTimePerWeek', 10)} hours per week
4. Interests: {', '.join(preferences.get('interests', []))}
5. Goals: {', '.join(preferences.get('goals', []))}

Previous courses completed: {len([h for h in history if h.get('completionDate')])}
Average performance: {sum(h.get('performance', 0) for h in history) / len(history) if history else 0}%

Please suggest:
1. Next recommended courses
2. Estimated completion time
3. Prerequisites if any
4. Learning milestones
5. Supplementary materials from their knowledge base"""

            # Create a temporary chain for recommendation
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )
            
            # Combine global and user knowledge for recommendations
            combined_retriever = {
                "global": self.global_vector_store.as_retriever(search_kwargs={"k": 3}),
                "personal": user_store.as_retriever(search_kwargs={"k": 2})
            }
            
            # Custom retriever that combines results
            def combined_search(query):
                global_docs = combined_retriever["global"].get_relevant_documents(query)
                personal_docs = combined_retriever["personal"].get_relevant_documents(query)
                return global_docs + personal_docs
            
            chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=combined_search,
                memory=memory,
                return_source_documents=True,
                verbose=True
            )

            result = await chain.ainvoke({
                "question": prompt,
                "chat_history": []
            })

            return {
                "status": "success",
                "recommendation": result["answer"],
                "sources": [
                    {
                        "content": doc.page_content,
                        "metadata": doc.metadata
                    }
                    for doc in result.get("source_documents", [])
                ]
            }
        except Exception as e:
            print(f"Error generating learning path: {str(e)}")
            return {
                "status": "error",
                "message": f"Error generating learning path: {str(e)}"
            }

    async def query(self, question: str, user_id: str = None, context: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            # Format the question to get better responses
            formatted_question = f"""Based on the provided documents, please answer the following question. Follow these guidelines:

1. Give a clear, direct answer to the question
2. If the documents don't contain enough information to answer the question fully, clearly state what information is missing
3. DO NOT quote or repeat the source text directly
4. DO NOT say phrases like "According to the documents" or "The text states"
5. Write in a natural, conversational tone
6. If you need to cite specific facts or figures, you can do so naturally within your answer

Question: {question}"""

            # If user_id is provided, use both personal and global knowledge
            if user_id:
                user_store = self.get_user_vector_store(user_id)
                
                # Custom retriever that combines results
                def combined_search(query):
                    global_docs = self.global_vector_store.similarity_search(query, k=3)
                    personal_docs = user_store.similarity_search(query, k=2)
                    return global_docs + personal_docs
                
                retriever = combined_search
            else:
                retriever = self.global_vector_store.as_retriever(
                    search_kwargs={"k": 5}
                )

            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )

            chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=retriever,
                memory=memory,
                return_source_documents=True,
                verbose=True
            )

            result = await chain.ainvoke({
                "question": formatted_question,
                "chat_history": context.get("chat_history", []) if context else []
            })
            
            # Extract source documents with enhanced metadata
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

# Create a singleton instance
rag_service = RAGService() 