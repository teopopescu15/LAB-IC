import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.PetController import router as data_router
from dataAccess.db import get_db
import logging
import os

app = FastAPI(title="Pet Scraper API")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router)

@app.get("/test-db")
async def test_db_connection():
    """
    Test the MongoDB connection and return diagnostic information.
    """
    try:
        # Test database connection
        db = get_db()
        
        if not db:
            return {
                "status": "error",
                "message": "Database connection failed: db object is None",
                "environment": {
                    "has_connection_string": os.getenv("MONGODB_CONNECTION_STRING") is not None,
                    "env_vars": list(os.environ.keys())
                }
            }
        
        # Get collection stats
        collection = db["animalutul"]
        count = collection.count_documents({})
        
        # Get a sample document
        sample = None
        if count > 0:
            sample = collection.find_one({})
            if sample and "_id" in sample:
                sample["_id"] = str(sample["_id"])
        
        return {
            "status": "success",
            "message": "Database connection successful",
            "database_info": {
                "document_count": count,
                "sample_document": sample,
                "collection_exists": collection is not None
            }
        }
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}",
            "error_details": str(e),
            "environment": {
                "has_connection_string": os.getenv("MONGODB_CONNECTION_STRING") is not None,
                "env_vars": list(os.environ.keys())
            }
        }

@app.get("/test")
async def test_api():
    """
    A simple test endpoint that doesn't require database access.
    """
    return {
        "status": "success",
        "message": "API is working correctly!",
        "sample_data": [
            {
                "_id": "sample1",
                "title": "Test Dog",
                "category": "Caini",
                "breed": "Labrador",
                "price": 1000
            },
            {
                "_id": "sample2",
                "title": "Test Cat",
                "category": "Pisici",
                "breed": "Persian",
                "price": 1500
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
