from fastapi import APIRouter, HTTPException, Body, Query
from typing import Optional, List
from services.scraper import scrape_pet_cards
from dataAccess.db import insert_pet_cards, get_all_pet_cards
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/update-data")
def update_data(
    url: str = Body(..., embed=True, description="The URL used in scraper"),
    overwrite: bool = Body(False, embed=True, description="Clear database(true) or not(false) before inserting"),
):
    pet_cards = scrape_pet_cards(url)
    if not pet_cards:
        raise HTTPException(status_code=500, detail="No data scraped")
    try:
        inserted_ids = insert_pet_cards(pet_cards, overwrite=overwrite)
        return {"status": "success", "inserted_ids": [str(_id) for _id in inserted_ids]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/filters")
def get_filters():
    try:
        pets = get_all_pet_cards({})
        
        if not pets:
            logger.warning("No pets found in database for filters")
            return {
                "counties": [],
                "categories": [],
                "breeds": [],
            }
            
        logger.info(f"Fetched {len(pets)} pets for filters")
        
        counties = list(set(p.get("county", "") for p in pets if p.get("county")))
        categories = list(set(p.get("category", "") for p in pets if p.get("category")))
        breeds = list(set(p.get("breed", "") for p in pets if p.get("breed")))
        
        logger.info(f"Filter counts: counties={len(counties)}, categories={len(categories)}")
        
        return {
            "counties": counties,
            "categories": categories,
            "breeds": breeds,
        }
    except Exception as e:
        logger.error(f"Error fetching filters: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching filters: {str(e)}")



@router.get("/pets")
def get_pets(
    description_regex: Optional[str] = Query(None, description="Filtru pentru descriere"),
    county: Optional[str] = Query(None, description="Filtru pentru judet"),
    city: Optional[str] = Query(None, description="Filtru pentru oras"),
    category: Optional[str] = Query(None, description="Filtru pentru categoria principala (caini, pisici, adoptii)"),
    breed: Optional[str] = Query(None, description="Filtru pentru rasa"),
    min_price: Optional[float] = Query(None, description="Pret minim"),
    max_price: Optional[float] = Query(None, description="Pret maxim")
):
    try:
        filter_query = {}
        
        logger.info(f"Filter params: county={county}, category={category}, breed={breed}")

        if description_regex:
            filter_query["description"] = {"$regex": description_regex, "$options": "i"}
        if county:
            filter_query["county"] = county
        if city:
            filter_query["city"] = city
        if category:
            filter_query["category"] = category
        if breed:
            filter_query["breed"] = breed
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = min_price
            if max_price is not None:
                price_filter["$lte"] = max_price
            filter_query["price"] = price_filter
        
        logger.info(f"MongoDB query: {filter_query}")
        
        try:
            pets = get_all_pet_cards(filter_query)
            
            if pets is None:
                logger.warning("get_all_pet_cards returned None, using empty list instead")
                pets = []
                
            logger.info(f"Found {len(pets)} pets matching criteria")
            
            for pet in pets:
                if "_id" not in pet:
                    pet["_id"] = str(hash(pet.get("link", "") or ""))
            
            return pets
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            return []
            
    except Exception as e:
        logger.error(f"Error fetching pets: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching pets: {str(e)}")