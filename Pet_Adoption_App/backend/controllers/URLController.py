from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from urllib.parse import quote

router = APIRouter()

@router.get("/build-url")
def build_url(
    category: str = Query(..., description="Ex: caini, pisici, pasari, accesorii"),
    subcategory: Optional[str] = Query(None, description="Ex: rasa sau servicii"),
    county: Optional[str] = Query(None, description="Ex: timis, constanta, bucuresti"),
    city: Optional[str] = Query(None, description="Ex: timisoara, lugoj, sector-6")
):
    base_url = "https://www.animalutul.ro/anunturi/animale"
    subcategory_encoded = quote(subcategory) if subcategory else ""

    if city and not county:
        raise HTTPException(status_code=400, detail="Trebuie sa specifici obligatoriu un judet cand cauti intr-un oras specific.")
    
    final_url = f"{base_url}/{category}"
    if subcategory_encoded:
        final_url += f"/{subcategory_encoded}"
    if county:
        final_url += f"/{county}"
    if city:
        final_url += f"/{city}"
    final_url += "/"
    
    return {"url": final_url}
