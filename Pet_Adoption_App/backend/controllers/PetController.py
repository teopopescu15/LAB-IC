from fastapi import APIRouter, HTTPException, Body, Query
from typing import Optional
from services.scraper import scrape_pet_cards
from dataAccess.db import insert_pet_cards, get_all_pet_cards

router = APIRouter()

@router.post("/update-data")
def update_data():
    pet_cards = scrape_pet_cards('https://www.animalutul.ro/anunturi/')
    if not pet_cards:
        raise HTTPException(status_code=500, detail="No data scraped")
    try:
        inserted_ids = insert_pet_cards(pet_cards)
        return {"status": "success", "inserted_ids": [str(_id) for _id in inserted_ids]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pets")
def get_pets(
    description_regex: Optional[str] = Query(None, description="Filtru pentru descriere"),
    county: Optional[str] = Query(None, description="Filtru pentru judet"),
    city: Optional[str] = Query(None, description="Filtru pentru oras"),
    category: Optional[str] = Query(None, description="Filtru pentru categoria principala (caini, pisici, animale de ferma, adoptii ...)"),
    subcategory: Optional[str] = Query(None, description="Filtru pentru categoria secundara (oi, porci, vaci ...)"),
    species: Optional[str] = Query(None, description="Filtru pentru specii (porumbei, fazani, canar, perusi ...)"),
    breed: Optional[str] = Query(None, description="Filtru pentru rasa"),
    service: Optional[str] = Query(None, description="Filtru pentru servicii (dresaj si cosmetica)"),
    min_price: Optional[float] = Query(None, description="Pret minim"),
    max_price: Optional[float] = Query(None, description="Pret maxim")
):
    filter_query = {}
    if description_regex:
        filter_query["description"] = {"$regex": description_regex, "$options": "i"}
    if county:
        filter_query["county"] = county
    if city:
        filter_query["city"] = city
    if category:
        filter_query["category"] = category
    if subcategory:
        filter_query["subcategory"] = subcategory
    if species:
        filter_query["species"] = species
    if breed:
        filter_query["breed"] = breed
    if service:
        filter_query["service"] = service
    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = min_price
        if max_price is not None:
            price_filter["$lte"] = max_price
        filter_query["price"] = price_filter

    pets = get_all_pet_cards(filter_query)
    return pets
