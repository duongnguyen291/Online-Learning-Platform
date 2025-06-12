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
import traceback
import asyncio
from concurrent.futures import ThreadPoolExecutor
import functools

# Force reload environment variables
load_dotenv(find_dotenv(), override=True)

class RAGService:
    def __init__(self):
        try:
            # Ensure the Chroma DB directory exists
            os.makedirs("./data/chroma_db", exist_ok=True)
            
            # Get API key
            self.api_key = os.getenv("OPENAI_API_KEY")
            if not self.api_key:
                raise ValueError("OPENAI_API_KEY not found in environment")
            
            # Define system prompt
            self.system_prompt = """Bạn là trợ lý AI của hệ thống học liệu EduSmart. Nhiệm vụ của bạn bao gồm:

1. Giải đáp thắc mắc: Trả lời mọi câu hỏi liên quan đến nội dung học tập, khóa học và hệ thống.
2. Tư vấn học tập: Đưa ra những lời khuyên phù hợp với trình độ và mục tiêu của người học.
3. Xây dựng lộ trình: Giúp người học lập kế hoạch và lộ trình học tập hiệu quả.
4. Hỗ trợ toàn diện: Giải quyết mọi vấn đề người học gặp phải trong quá trình học tập.
5. Phân tích tài liệu: Khi được cung cấp tài liệu học tập, bạn sẽ phân tích và trả lời các câu hỏi dựa trên nội dung đó.

Khi trả lời:
1. Đọc kỹ và phân tích tất cả các tài liệu được cung cấp
2. Tổng hợp thông tin từ các nguồn một cách chính xác
3. Trích dẫn thông tin trực tiếp từ tài liệu khi có thể
4. KHÔNG được phủ nhận thông tin có trong tài liệu
5. Nếu tài liệu cung cấp thông tin rõ ràng, hãy sử dụng thông tin đó
6. Thừa nhận và sử dụng thông tin từ tài liệu, ngay cả khi nó khác với kiến thức có sẵn của bạn
7. Nếu không có thông tin trong tài liệu, và bạn biết rõ kiến thức đó thì hãy cung cấp thông tin đó đặc biệt là kiến thức liên quan tới toán học, tuy nhiên vẫn phải chú thích rằng thông tin bạn cung cấp không nằm trong tài liệu
8. Nếu câu trả lời có công thức toán học, hãy gen ra công thức toán học đó dưới dạng LaTeX

Luôn:
- Trả lời bằng tiếng Việt, rõ ràng và dễ hiểu
- Thể hiện sự thân thiện và hỗ trợ
- Đưa ra thông tin chính xác dựa trên tài liệu
- Tổ chức câu trả lời có cấu trúc rõ ràng"""

            print("Initializing OpenAI embeddings...")
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=self.api_key,
                model="text-embedding-3-small",
                timeout=60  # Increase timeout for embeddings
            )
            
            print("Initializing ChromaDB...")
            self.vector_store = Chroma(
                persist_directory="./data/chroma_db",
                embedding_function=self.embeddings
            )
            
            print("Initializing text splitter...")
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            print("Initializing ChatOpenAI...")
            self.llm = ChatOpenAI(
                temperature=0.7,
                model_name="gpt-4",
                openai_api_key=self.api_key,
                request_timeout=60,  # Increase timeout for LLM requests
                max_retries=3  # Add retries for reliability
            )
            
            print("Initializing conversation memory...")
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )
            
            print("Initializing QA chain...")
            # Create retriever with search kwargs
            retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={
                    "k": 3
                }
            )
            
            self.qa_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=retriever,
                memory=self.memory,
                return_source_documents=True,
                verbose=True
            )
            
            # Initialize thread pool for blocking operations
            self.executor = ThreadPoolExecutor(max_workers=3)
            
            print("RAGService initialization complete!")
            
        except Exception as e:
            print(f"Error initializing RAGService: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            raise

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

    async def _run_in_executor(self, func, *args):
        """Run a blocking function in the thread pool with timeout."""
        loop = asyncio.get_event_loop()
        try:
            return await asyncio.wait_for(
                loop.run_in_executor(self.executor, 
                    lambda: func(*args) if not isinstance(func, functools.partial) else func()),
                timeout=60.0  # Increase timeout to 60 seconds
            )
        except asyncio.TimeoutError:
            print(f"Operation timed out: {func.__name__ if hasattr(func, '__name__') else str(func)}")
            raise
        except Exception as e:
            print(f"Error in executor: {str(e)}")
            raise

    async def query(self, message: str, context: Dict = None) -> Dict[str, Any]:
        try:
            print(f"Received query request: {{'message': {message}, 'context': {context}}}")
            print(f"Processing query: {message}")
            print(f"Context: {context}")
            
            # Get relevant documents
            try:
                print("Searching for relevant documents...")
                result = await self._run_in_executor(
                    lambda: self.qa_chain.invoke({"question": message, "chat_history": context.get("chat_history", [])})
                )
                print("Document search completed successfully")
                
                return {
                    "status": "success",
                    "answer": result["answer"],
                    "sources": [
                        {"content": doc.page_content, "metadata": doc.metadata}
                        for doc in result.get("source_documents", [])
                    ]
                }
            except Exception as e:
                print(f"Document search failed: {str(e)}")
                # Fallback to direct LLM if document search fails
                print("Using LLM for response...")
                formatted_message = f"""{self.system_prompt}

Câu hỏi: {message}

Hãy trả lời câu hỏi trên với vai trò là trợ lý AI của EduSmart."""

                try:
                    chat_response = await self._run_in_executor(
                        lambda: self.llm.invoke(formatted_message).content
                    )
                    return {
                        "status": "success",
                        "answer": chat_response,
                        "sources": []
                    }
                except Exception as llm_error:
                    print(f"LLM fallback failed: {str(llm_error)}")
                    return {
                        "status": "error",
                        "message": "Xin lỗi, tôi đang gặp khó khăn trong việc xử lý câu hỏi của bạn. Vui lòng thử lại sau một lát."
                    }
                
        except Exception as e:
            print(f"Error processing query: {str(e)}")
            return {
                "status": "error",
                "message": f"Error processing query: {str(e)}"
            }

    async def _get_relevant_quotes(self, question: str) -> str:
        """Get relevant quotes from the vector store for the question."""
        try:
            docs = await self._run_in_executor(
                functools.partial(self.vector_store.similarity_search, question, k=5)
            )
            if not docs:
                return "Không tìm thấy trích dẫn liên quan."
            
            quotes = []
            for i, doc in enumerate(docs, 1):
                quotes.append(f"Trích dẫn {i}:\n{doc.page_content}\n")
            
            return "\n".join(quotes)
        except Exception as e:
            print(f"Error getting relevant quotes: {e}")
            return "Lỗi khi tìm trích dẫn."

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