import os
import pymongo
from dotenv import load_dotenv


def get_db():
    load_dotenv()
    connection_string = os.getenv("MONGODB_CONNECTION_STRING")
    client = pymongo.MongoClient(connection_string)
    db = client["pets"]
    return db

def insert_pet_cards(pet_cards_list):
    db = get_db()
    collection = db["animalutul"]
    collection.delete_many({})
    result = collection.insert_many(pet_cards_list)
    return result.inserted_ids

def get_all_pet_cards():
    db = get_db()
    collection = db["animalutul"]
    pet_cards = list(collection.find({}, {"_id": 0}))
    return pet_cards

