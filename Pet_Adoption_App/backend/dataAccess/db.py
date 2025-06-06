import os
import pymongo
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_db():
    load_dotenv()
    connection_string = os.getenv("MONGODB_CONNECTION_STRING")
    
    if not connection_string:
        logger.error("MongoDB connection string is missing! Check your .env file.")
        try:
            client = pymongo.MongoClient(connection_string)
            db = client["pets"]
            return db
        except Exception as e:
            logger.error(f"Cannot connect to local MongoDB either: {str(e)}")
            return None
    
    logger.info(f"Connecting to MongoDB with connection string: {connection_string[:10]}...")
    try:
        client = pymongo.MongoClient(connection_string)
        db = client["pets"]
        return db
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        return None



def insert_pet_cards(pet_cards_list, overwrite):
    db = get_db()
        
    collection = db["animalutul"]
    logger.info(f"Clearing existing pet cards and inserting {len(pet_cards_list)} new cards")
    if overwrite:
        collection.delete_many({})
    result = collection.insert_many(pet_cards_list)
    return result.inserted_ids


def get_all_pet_cards(filter_query={}):
    db = get_db()
        
    collection = db["animalutul"]
    logger.info(f"Querying pets with filter: {filter_query}")
    
    try:
        if '_id' in filter_query and isinstance(filter_query['_id'], str):
            from bson.objectid import ObjectId
            filter_query['_id'] = ObjectId(filter_query['_id'])
        
        pet_cards = list(collection.find(filter_query))

        for pet in pet_cards:
            if '_id' in pet:
                pet['_id'] = str(pet['_id'])
                
        logger.info(f"Found {len(pet_cards)} pets matching the filter")
        return pet_cards
    except Exception as e:
        logger.error(f"Error querying database: {str(e)}")
        return []