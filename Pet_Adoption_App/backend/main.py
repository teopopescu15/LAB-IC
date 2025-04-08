from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup

app = FastAPI(title="API de scraping pentru animale")

@app.get("/scrape")
def scrape_animals():
    results = []
    page_number = 1

    while True:
        url = f'https://www.danyflor.ro/animale-adoptie/page/{page_number}/'
        response = requests.get(url)
        if response.status_code != 200:
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        animal_cards = soup.select('div.ct-div-block[id^="div_block-41-5231"]')

        if not animal_cards:
            break

        for card in animal_cards:
            link_tag = card.select_one('a.ct-link')
            animal_url = link_tag.get('href') if link_tag else None

            title_tag = card.select_one('h1.ct-headline span.ct-span')
            animal_name = title_tag.get_text(strip=True) if title_tag else "Nume necunoscut"

            image_tag = card.select_one('img.ct-image')
            image_url = image_tag.get('src') if image_tag else None

            details_tags = card.select('div.ct-text-block')
            details_str = " | ".join(tag.get_text(strip=True) for tag in details_tags)
            
            parts = [p.strip() for p in details_str.split('|') if p.strip()]
            details_dict = {}
            for part in parts:
                if ':' in part:
                    key, value = part.split(':', 1)
                    details_dict[key.strip()] = value.strip()
            
            record = {
                "page": page_number,
                "name": animal_name,
                "url": animal_url,
                "image": image_url,
            }
            
            record.update(details_dict)

            results.append(record)

        page_number += 1

    if not results:
        raise HTTPException(status_code=404, detail="Nu s-au găsit animale.")
    return results
