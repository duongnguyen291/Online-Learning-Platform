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

Hãy luôn:
- Trả lời bằng tiếng Việt, rõ ràng và dễ hiểu
- Thể hiện sự thân thiện và hỗ trợ
- Đưa ra những gợi ý và lời khuyên mang tính xây dựng
- Khuyến khích người học phát triển
- Sử dụng kiến thức từ tài liệu đã được tải lên khi có thể
- Thừa nhận khi không chắc chắn về một thông tin

Khi trả lời, hãy:
1. Phân tích câu hỏi/yêu cầu của người học
2. Đưa ra câu trả lời có cấu trúc rõ ràng
3. Cung cấp ví dụ hoặc giải thích cụ thể nếu cần
4. Gợi ý các bước tiếp theo hoặc tài nguyên bổ sung nếu phù hợp"""

            print("Initializing OpenAI embeddings...")
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=self.api_key,
                model="text-embedding-3-small"
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
                timeout=30  # 30 seconds timeout
            )
            
            print("Initializing conversation memory...")
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )
            
            print("Initializing QA chain...")
            self.qa_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vector_store.as_retriever(
                    search_kwargs={"k": 3}
                ),
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
                loop.run_in_executor(self.executor, func, *args),
                timeout=10.0  # 10 seconds timeout
            )
        except asyncio.TimeoutError:
            print(f"Operation timed out: {func.__name__}")
            raise

    async def query(self, question: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            print(f"Processing query: {question}")
            print(f"Context: {context}")

            # Format the question with system prompt
            formatted_question = f"""{self.system_prompt}

Câu hỏi: {question}

Yêu cầu:
1. Trả lời dựa trên vai trò của bạn như đã định nghĩa ở trên
2. Sử dụng thông tin từ tài liệu đã tải lên nếu có
3. Nếu không có thông tin liên quan, hãy trả lời dựa trên kiến thức của bạn
4. Trình bày câu trả lời có cấu trúc, dễ đọc
5. Nếu cần thiết, đưa ra ví dụ minh họa"""

            # Process chat history
            chat_history = []
            if context and "chat_history" in context:
                chat_history = [
                    {"role": msg["role"], "content": msg["content"]}
                    for msg in context["chat_history"]
                    if msg.get("content")  # Only include messages with content
                ]

            # Try direct LLM first for quick response
            print("Using direct LLM for response...")
            try:
                response = await self.llm.ainvoke(formatted_question)
                answer = response.content
                print(f"Generated answer: {answer[:100]}...")
                
                # Try to get relevant documents in background for future reference
                try:
                    print("Searching for relevant documents in background...")
                    relevant_docs = await self._run_in_executor(
                        functools.partial(self.vector_store.similarity_search, question, k=3)
                    )
                    has_relevant_docs = len(relevant_docs) > 0
                    if has_relevant_docs:
                        print(f"Found {len(relevant_docs)} relevant documents")
                        sources = [
                            {
                                "content": doc.page_content,
                                "metadata": doc.metadata
                            }
                            for doc in relevant_docs
                        ]
                    else:
                        sources = []
                except Exception as e:
                    print(f"Background document search failed: {e}")
                    sources = []
                    has_relevant_docs = False

                return {
                    "status": "success",
                    "answer": answer,
                    "sources": sources,
                    "has_context": has_relevant_docs
                }

            except Exception as e:
                print(f"Error during LLM processing: {e}")
                return {
                    "status": "error",
                    "message": "Xin lỗi, tôi đang gặp vấn đề khi xử lý câu hỏi của bạn. Vui lòng thử lại sau."
                }

        except Exception as e:
            print(f"Error in query method: {e}")
            print(f"Traceback: {traceback.format_exc()}")
            return {
                "status": "error",
                "message": "Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau."
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