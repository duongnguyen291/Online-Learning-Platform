import os
import sys
import uvicorn

# Add the server directory to Python path
server_dir = os.path.dirname(os.path.abspath(__file__))
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug",
        workers=1
    ) 