from fastapi import APIRouter, HTTPException, Body, Query
from typing import Optional
from services.scraper import scrape_pet_cards
from dataAccess.db import insert_pet_cards, get_all_pet_cards

router = APIRouter()

@router.post("/update-data")
def update_data(url: str = Body(..., embed=True, description="URL-ul construit pentru scraping")):
    pet_cards = scrape_pet_cards(url)
    if not pet_cards:
        raise HTTPException(status_code=500, detail="No data scraped")
    try:
        inserted_ids = insert_pet_cards(pet_cards)
        return {"status": "success", "inserted_ids": [str(_id) for _id in inserted_ids]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pets")
def get_pets(description_regex: Optional[str] = Query(None, description="Filtru pentru descriere")):
    filter_query = {}
    if description_regex:
        filter_query["description"] = {"$regex": description_regex, "$options": "i"}
    pets = get_all_pet_cards(filter_query)
    return pets

