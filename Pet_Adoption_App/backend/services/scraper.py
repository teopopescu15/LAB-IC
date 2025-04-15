import re
import requests
import time
from bs4 import BeautifulSoup

session = requests.Session()

def parse_price(price_str):
    if not price_str:
        return None
    cleaned = re.sub(r'[^\d\.]', '', price_str)
    try:
        return float(cleaned)
    except ValueError:
        return None

def scrape_pet_cards(base_url: str):
    
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/135.0.0.0 Safari/537.36'
        )
    }
    page_num = 1
    pet_cards_list = []

    while True:
        url = f"{base_url}?pag={page_num}"
        response = session.get(url, headers=headers)
        time.sleep(2)

        delay = 0.5
        count = 0

        if response.status_code == 429:
            print(f"429 received at page {page_num}. Waiting for {delay} seconds before retrying...")
            time.sleep(2)
            response = session.get(url, headers=headers)

        if response.status_code != 200:
            print(f"Failed to retrieve page {page_num}: {response.status_code}")
            break
        if response.url.rstrip('/') == base_url.rstrip('/'):
            print(f"Reached the last page: {url}")
            break
            
        print(f"Scraping page {page_num}: {url}")

        soup = BeautifulSoup(response.text, 'html.parser')
        pet_cards = soup.find_all('div', class_='article-item')
        if not pet_cards:
            break
        


        for card in pet_cards:
            title_element = card.find('h2', class_='article-title')
            title_text = title_element.find('a').get_text(strip=True) if title_element and title_element.find('a') else None

            link = title_element.find('a')['href'] if title_element and title_element.find('a') else None

            promoted_tag = card.find('div', class_='art-promoted')
            is_promoted = promoted_tag is not None

            if is_promoted:
                if any(pet.get("link") == link and pet.get("promoted") for pet in pet_cards_list):
                    continue

            img_element = card.find('img')
            image_url = img_element['src'] if img_element and img_element.has_attr('src') else None

            price_container = card.find('span', class_='article-price')
            new_price_text = None
            old_price_text = None
            price_text = None

            if price_container:
                new_price_elem = price_container.find('span', class_='new-price')
                if new_price_elem:
                    new_price_text = new_price_elem.get_text(strip=True)
                    old_price_elem = price_container.find('span', class_='old-price')
                    if old_price_elem:
                        old_price_text = old_price_elem.get_text(strip=True)
                else:
                    price_text = price_container.get_text(strip=True)

            price_data = {
                "price_after_discount": parse_price(new_price_text),
                "price_before_discount": parse_price(old_price_text),
                "price_without_any_discounts": parse_price(price_text)
            }

            pet_data = {
                "title": title_text,
                "link": link,
                "description": None,
                "county": None,
                "city": None,
                "image_url": image_url,
                "price": price_data,
                "breed": None,
                "service": None,
                "promoted": is_promoted
            }
            
            if link:
                time.sleep(0.5)
                detail_response = session.get(link, headers=headers)
                count = count + 1

                if detail_response.status_code == 429:
                    print('429 error on individual pet page ' + str(count) + ' on page ' + str(page_num))
                    time.sleep(0.5)
                    detail_response = session.get(link, headers=headers)
                
                if detail_response.status_code == 200:
                    print(link)
                    detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
                    print('Scraping individual pet page ' + str(count) + ' on page ' + str(page_num))
                    attribute_items = detail_soup.find_all("div", class_="attribute-item")
                    breed = None
                    service = None
                    for item in attribute_items:
                        label_div = item.find("div", class_="attribute-label")
                        if label_div and "Rase" in label_div.get_text():
                            value_div = item.find("div", class_="attribute-value")
                            if value_div:
                                breed = value_div.get_text(strip=True)
                                break
                        if label_div and "Servicii" in label_div.get_text():
                            value_div = item.find("div", class_="attribute-value")
                            if value_div:
                                service = value_div.get_text(strip=True)
                                break
                    
                    pet_data["breed"] = breed
                    pet_data["service"] = service


            desc_div = detail_soup.find("div", class_="article-description", itemprop="description")
            if desc_div:
                for span in desc_div.find_all("span", style=lambda s: s and "opacity:0" in s):
                    span.decompose()
                full_description = desc_div.get_text(separator="\n", strip=True)
                pet_data["description"] = full_description
            
            location_elem = detail_soup.find("p", itemprop="name")
            county = None
            city = None
            if location_elem:
                links = location_elem.find_all("a", itemprop="url")
                if len(links) >= 2:
                    county = links[0].get_text(strip=True)
                    city = links[1].get_text(strip=True)

            pet_data["county"] = county
            pet_data["city"] = city


            pet_cards_list.append(pet_data)


        page_num += 1

    return pet_cards_list
#scrape_pet_cards('https://www.animalutul.ro/anunturi/animale/caini/timis/timisoara/')