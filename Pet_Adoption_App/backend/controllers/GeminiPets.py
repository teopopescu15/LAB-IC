import os
import json
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import tempfile

import google.generativeai as genai

from dataAccess.db import get_all_pet_cards, get_db

load_dotenv()

# Check if API key is configured
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    print("⚠️  WARNING: GEMINI_API_KEY not configured or using placeholder value!")
    print("🔧 Please add your real Gemini API key to backend/.env file")
    print("🌐 Get your API key from: https://makersuite.google.com/app/apikey")
else:
    genai.configure(api_key=api_key)
    print("✅ Gemini API configured successfully")

router = APIRouter()

class PetFilter(BaseModel):
    county: Optional[str]
    city: Optional[str]
    category: Optional[str]
    breed: Optional[str]
    min_price: Optional[float]
    max_price: Optional[float]
    description_regex: Optional[str]

SYSTEM_PROMPT = """
You are an expert at extracting MongoDB filters from natural-language pet-search queries.
Output ONLY a JSON object matching this schema:

fields: county, city, category, breed, min_price, max_price, description_regex.

Mapping rules:
• If the user gives a max price ("under X" or "up to X"), set max_price (integer).
• If the user gives a min price ("over Y" or "more than Y"), set min_price (integer).
• Apply $lte to max_price, $gte to min_price.
• Map location words to county or city (they are case sensitive, so they always start with a capital letter).
• Category must be one of: Caini, Pisici, Adoptii (case-sensitive).
• If user asks for an adoption, set breed to null and look inside description with description_regex on whether it is a cat or a dog ( you can also look for derogatives, like kitten, doggy etc).
* do not use plural for breed
• Use null for any field the user doesn't specify.

Description inference:
• If the user mentions traits (e.g. "pure breed", "small", "playful"), combine them into one regex, e.g. "(pure breed|small|playful)".
• If the user implies a small animal (e.g. "etajul 40", "bloc turn", "apartament mic", or any other situation where it implies a small dog is preferable), include "mic" in description_regex.
• If the user hints at limited budget without a number (e.g. "low-income", "nu îmi permit prea mult"  or any other situation where it implies such a thing), default max_price to 1200.

Return exactly one valid JSON object—no extra text or formatting.
"""


@router.get("/pets/gemini")
def get_pets_gemini(
    prompt: str = Query(..., description="Natural-language description of the filters")
):
    # Check if API key is configured
    if not api_key or api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=503, 
            detail="Gemini API not configured. Please add GEMINI_API_KEY to .env file. Get your key from: https://makersuite.google.com/app/apikey"
        )

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": PetFilter
            },
            system_instruction=SYSTEM_PROMPT
        )
        resp = model.generate_content(prompt)
        filters = json.loads(resp.text)
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error parsing filters from Gemini: {e}")


    mongo_filter: dict = {}

    for field in ("county", "city", "category"):
        val = filters.get(field)
        if val:
            mongo_filter[field] = val


    breed = filters.get("breed")
    if breed:
        if "|" in breed:
            mongo_filter["breed"] = {
                "$regex": breed,
                "$options": "i"
            }
        else:
            mongo_filter["breed"] = breed

    if filters.get("description_regex"):
        mongo_filter["description"] = {
            "$regex": filters["description_regex"],
            "$options": "i"
        }

    min_p = filters.get("min_price")
    max_p = filters.get("max_price")
    if min_p is not None or max_p is not None:
        price_q = {}
        if min_p is not None:
            price_q["$gte"] = min_p
        if max_p is not None:
            price_q["$lte"] = max_p
        mongo_filter["price"] = price_q

    try:
        pets = get_all_pet_cards(mongo_filter)
        print(f"✅ Found {len(pets)} pets matching criteria: {mongo_filter}")
        return pets
    except Exception as e:
        print(f"❌ Database Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")

@router.post("/pets/voice-to-text")
async def voice_to_text(audio_file: UploadFile = File(...)):
    """Convert voice audio to text using Gemini API - Direct approach"""
    
    # Check if API key is configured
    if not api_key or api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=503, 
            detail="Gemini API not configured. Please add GEMINI_API_KEY to .env file."
        )
    
    try:
        # Read audio content as bytes
        audio_bytes = await audio_file.read()
        
        # Create model for audio transcription
        model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp")
        
        # Create audio part directly from bytes
        audio_part = {
            "mime_type": "audio/webm",
            "data": audio_bytes
        }
        
        # Generate transcription
        response = model.generate_content([
            "Please transcribe this audio to text in Romanian. Return only the transcription, no additional text or formatting.",
            audio_part
        ])
        
        return {
            "transcript": response.text.strip(),
            "success": True
        }
            
    except Exception as e:
        print(f"❌ Gemini Voice-to-Text Error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Voice transcription failed: {str(e)}"
        )