import os
import json
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import re
from google import genai
from google.genai import types

from dataAccess.db import get_all_pet_cards

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
* If a user mentions a city, you must compare it to this list of cities: 1 Decembrie, 101. Veresti, 23 August, APOSTOLACHE, ARICESTII - RAHTIVANI, Abram, Abrud, Abucea, Aciuta, Adam, Adanca, Adea, Adjud, Adunati, Adunatii-Copaceni, Afumati, Agigea, Aita Mare, Aita Seaca, Aiud, Aiudul de Sus, Alba Iulia, Albesti-Paleologu, Albina, Albota, Alesd, Alexandria, Alexandru cel Bun, Almaj, Almas, Alunis, Amara, Amarastii de Jos, Aninoasa, Antofiloaia, Apahida, Apateu, Araci, Arad, Araneag, Arbore, Ardeoani, Ardud, Argeselu, Argetoaia, Arieseni, Armenis, Avram Iancu, Avrig, Axente Sever, BERCENI, BOLDESTI GRADISTEA, Baba Novac, Babadag, Babiceni, Bacau, Baciu, Baia, Baia Mare, Baia Sprie, Baia de Arama, Baia de Fier, Baicoi, Baiculesti, Baile Govora, Baile Herculane, Baita, Bajesti, Bala, Balaceanca, Balaia, Balanesti, Balc, Balcani, Balcauti, Balcesti, Balesti, Balilesti, Balosesti, Balotesti, Bals, Balta Alba, Balta Ratei, Baltatesti, Balteni, Balvanesti, Banesti, Banita, Barastii Hategului, Barca, Barcea, Bardesti, Barlad, Barsesti, Barsestii de Jos, Barzava, Bascov, Batiz, Batos, Beciu, Beclean, Beica de Jos, Beius, Belciug, Belciugatele, Belin, Beliu, Belobresca, Bentu, Berceni, Berechiu, Beregsau Mare, Berghin, Berinta, Bertestii de Sus, Bicaz-Chei, Biertan, Bilbor, Bilca, Bistra Muresului, Bistrita, Bistrita Bargaului, Bistrita Bargaului Fabrici, Blagesti, Blaj, Blandiana, Blejesti, Bobicesti, Bocsig, Bogata, Boiu, Boldesti-Scaeni, Boldu, Bolintin-Deal, Bolintin-Vale, Bolotesti, Bolovani, Bolvasnita, Bontesti, Bontida, Borla, Borlesti, Boroaia, Borsa, Botiza, Botoroaga, Botosani, Brad, Bradeni, Bradesti, Bradu, Bragadiru, Brahasesti, Braiesti, Braila, Braisoru, Branesti, Branet, Brasov, Bratila, Brazii, Breasta, Brebu Megiesesc, Brusturi, Buceava-Soimus, Bucecea, Buchilasi, Buda, Budacu de Jos, Budesti, Buftea, Buhani, Buhusi, Bumbesti-Jiu, Burla, Buteni, Buzau, Buzias, Buznea, Buzoesti, Cacica, Caianu-Vama, Calafat, Calan, Calarasi, Caldarasti, Calea Mare, Calinesti (Darmanesti), Calmatuiu, Campeni, Campia Turzii, Campina, Campulung, Campulung Moldovenesc, Campulung la Tisa, Campulung-Muscel, Campuri, Capatanenii Pamanteni, Cara, Caracal, Caransebes, Carbunesti, Carei, Carpinis, Cartisoara, Casimcea, Castau, Catanele, Catcau, Catunu (Cornesti), Cazaci, Cazanesti, Cazanesti (Ramnicu Valcea), Cefa, Cehu Silvaniei, Celaru, Cenad, Cenade, Cernavoda, Cerneteaz, Certeze, Cheriu, Chetani, Cheud, Chiajna, Chier, Chileni, Chilii, Chiojdeanca, Chircesti, Chiriacu, Chiribis, Chirnogi (Ulmu), Chiscani, Chisineu Cris, Chisirid, Chislaca, Chislaz, Chisoda, Chitila, Chiuza, Ciacova, Cib, Cihei, Cinta, Ciolt, Cioranii de Jos, Ciorogarla, Cisnadie, Ciucea, Ciuchici, Ciudanovita, Ciuguzel, Ciuslea, Clapa, Clinceni, Cluj-Napoca, Cocorastii - Mislii, Codlea, Cogealac, Coltau, Coltirea, Comanesti, Comarnic, Comsesti, Condoiesti, Constanta, Copalnic-Manastur, Corabia, Corbeanca, Corbeni, Corbii Mari, Corbu, Corcova, Cordun, Cornesti (Craciunesti), Corni, Corunca, Cosoba, Costeiu, Costesti, Costisa, Cotofenii din Dos, Cotofenii din Fata, Covasint, Covasna, Craciunelu de Jos, Craciunesti, Craiova, Creaca, Cremenari, Cretuleasca, Criscior, Cristian, Crucea, Cruset, Cucerdea, Cuculeasa, Cudalbi, Cugir, Culcea, Culciu, Cumpana, Cunta, Curtea de Arges, Curteni, Curtici, Curtisoara (Dobretu), Cusma, Cut, Cuvin, Cuzdrioara, Dabuleni, Dambovicioara, Dambu, Damuc, Danesti, Darabani, Darmanesti, Davidesti, Deag, Decebal, Deda, Dej, Derna, Dernisoara, Dersca, Deta, Deva, Divici, Doanca, Dobroteasa, Dobrotesti, Dofteana, Domnesti, Dor Marunt, Dorohoi, Draganesti de Vede, Draganesti-Olt, Draganu, Dragasani, Dragodana, Dragoeni, Dragoesti, Dragomiresti-Deal, Dragomiresti-Vale, Dragutesti, Drajna de Jos, Drobeta-Turnu Severin, Dud, Dumbrava, Dumbrava Rosie, Dumbraveni, Dumbravita, Dumitra, Eforie, Eforie Nord, Enachesti, Fagaras, Faget, Falticeni, Fancica, Fantanele, Fantanele (Hemeius), Farcasa, Fartatesti, Fasca, Feldru, Feliceni, Fenis, Ferendia, Ferice, Fetesti, Fetesti-Gara, Fieni, Filiasi, Finis, Firminis, Fitionesti, Flamanzi, Flondora, Floresti, Florica, Florinta, Focsani, Frasin, Frasinet, Frecatei, Frumosu, Fughiu, Fulga de Sus, Fundulea, GORNET, Gaesti, Galati, Galbeni (Filipesti), Galgau, Galicea Mare, Galsa, Gara Bobocu, Garcina, Garda de Sus, Gelmar, Geoagiu, Gepiu, Gheghie, Gheorghe Lazar, Gheorgheni, Gheraseni, Gherla, Ghermanesti, Ghimbav, Ghimes-Faget, Ghinesti, Ghirdoveni, Ghiroda, Giarmata, Gilau, Giorocuta, Giroc, Girov, Giurgita, Giurgiu, Glambocelu, Glavile, Gligoresti, Glodeanu Sarat, Godinesti, Goiesti, Gorgota, Gornesti, Gostavatu, Gradistea, Gramesti, Granicerii, Grebanu, Grebenisu de Campie, Grozesti, Gruiu, Gura Barbuletului, Gura Humorului, Gura Ocnitei, Gura Raului, Gura Sutii, Gura Vitioarei, Guranda, Gurbediu, Gurghiu, Guruslau, Habud, Halceni, Halmagiu, Hamba, Hapria, Haret, Hartesti, Hateg, Herasti, Hida, Hidiselu de Jos, Hirisesti, Homesti, Hoparta, Horezu, Horoatu Crasnei, Horpaz, Hotarele, Huedin, Hunedoara, Hunedoara Timisana, Husasau de Cris, Huseni, Husi, Ianca, Ianosda, Ianova, Iasi, Iecea Mica, Iernut, Ighiu, Ignesti, Igris, Ilia, Ilisesti, Ilisua, Ilva Mica, Inand, Ineu, Ion Roata, Ionesti, Iratosu, Isalnita, Izvin, Jiana Mare, Jibou, Jilava, Jiliste, Jimbolia, Joita, Josani (Cabesti), Joseni, Josenii Bargaului, LIPANESTI, Leleasca, Lelesti, Lenauheim, Leordeni, Leorint, Letca Veche, Libertatea, Lilieci, Lipova, Liteni, Liteni (Moara), Livada, Livada de Bihor, Livezeni, Livezile, Loamnes, Lopadea Noua, Lovrin, Ludesti, Ludus, Lugasu de Jos, Lugoj, Lumina, Luna de Sus, Lunca, Luncasprie, Luncoiu de Jos, Lupsa, Macin, Maeriste, Magazia, Magiresti, Magurele, Magureni, Maguri, Maierus, Malancrav, Malin, Malini, Malu Mare, Malureni, Mamaia, Mamaia-Sat, Manasia, Manastirea Doamnei, Manesti, Mangalia, Manoleasa, Marca, Mares, Marghita, Margina, Mariselu, Maritei, Marna Noua, Marsa, Marsani, Maruntei, Masca, Matau, Matca, Mavrodin, Medgidia, Medias, Mediesu Aurit, Mereteu, Mescreac, Mica, Micasasa, Micesti, Micula, Miercurea-Ciuc, Mihaesti, Mihail Kogalniceanu, Mihaileni, Mihailesti, Mihalt, Milova, Mioarele, Mioveni, Miron Costin, Miroslava, Misca, Mizil, Moara, Mocod, Mogos, Mogosoaia, Moinesti, Moisei, Moldova Noua, Moldova Veche, Moldova-Sulita, Moldovita, Morlaca, Morteni, Morunglav, Mosia Mica, Mosnita Noua, Mosnita Veche, Motru, Movila (Salcioara), Movilita, Muntele Rece, Munteni, Munteni-Buzau, Mureni, Mureseni, Murighiol, Musetesti, Mânastirea, Nadab, Nadlac, Nasaud, Nasturelu, Navodari, Navodari Tabara, Nazna, Nedelea, Negresti, Negresti-Oas, Negrilesti, Nermed, Nimigea de Jos, Nires, Novaci, Ocna Mures, Ocna Sibiului, Ocna de Fier, Odoreu, Odorheiu Secuiesc, Ogra, Ohaba Lunga, Ohaba-Ponor, Oiejdea, Oituz, Olari, Oltenita, Onesti, Oniceni, Oradea, Orastie, Oravita, Oreavul, Orevita Mare, Orlesti, Orsova, Otelu Rosu, Otomani, Otopeni, Ovidiu, PODENII NOI, PROVITA DE JOS, PUCHENII MARI, Palazu Mare, Panciu, Pancota, Pantelimon, Paraul Rece, Parta, Pascani, Paulestii Noi, Paulis, Pecica, Peciu Nou, Peicani, Peregu Mare, Peregu Mic, Peretu, Periam, Perii Brosteni, Peris, Petrachioaia, Petresti, Petrosani, Petrova, Pianu de Jos, Piatra, Piatra Neamt, Piatra Soimului, Picior de Munte, Picleu, Pielesti, Pietrari (Pausesti-Maglasi), Pietris, Pietrosani, Pioresti, Pipera, Piscani, Pischia, Pitesti, Plaiesti, Ploiesti, Plopeni, Plosca, Podari, Poderei, Podu Iloaiei, Pogoanele, Poiana, Poiana Ilvei, Poiana Mare, Poienarii Burchii, Poieni, Poienile Zagrei, Poienile de sub Munte, Popesti-Leordeni, Portita, Posmus, Postarnacu, Prejmer, Prigoreni, Protopopesti, Prundu Bargaului, Pucioasa, Pui, Purcareni, Pustinis, Racari, Rachitele, Racsa, Radauti, Radauti-Prut, Radomiresti, Ramnicu Sarat, Ramnicu Valcea, Rasca, Rascruci, Rasnov, Rasnov Romacril, Rasuceni, Razboieni-Cetate, Recas, Redea, Reghin, Resita, Resita Mica, Reteag, Rod, Rodna, Roman, Romos, Romuli, Rosia, Rosia Montana, Rosiori de Vede, Rovinari, Rubla, Rucar, Runc, Runcu, Sacalaz, Sacueni, Sadova, Sadu, Saelele, Sai, Salatiu, Salcia, Salcuta, Salistea de Sus, Salonta, Salsig, Sambata, Sambata de Sus, Sanandrei, Sancraiu de Mures, Sangeorgiu de Mures, Sangeorz-Bai, Sangeru de Padure, Sanmartin, Sanmihaiu Roman, Sannicoara, Sannicolau Mare, Sannicolau Roman, Sannicolau de Beius, Sanpetru, Sant, Santana, Santana de Mures, Santioana, Sapanta, Sarata (Nicolae Balcescu), Sarbova, Sard, Sarmasel, Saru Dornei, Sascut, Sat-Sugatag, Satmarel, Satu Mare, Saud, Savarsin, Savastreni, Saveni, Schela Cladovei, Schitu Golesti, Sebes, Sebis, Sector 1, Sector 2, Sector 3, Sector 4, Sector 5, Sector 6, Secuieni, Seica Mare, Seleus, Selimbar, Serbanesti, Seulia de Mures, Sfantu Gheorghe, Sibiu, Sibot, Sicula, Sighetu Marmatiei, Sighisoara, Silistea, Silistea Gumesti, Silvasu de Sus, Simand, Simeria, Simleu Silvaniei, Simnicu de Sus, Sinaia, Sindresti, Sipet, Siret, Siria, Sisesti, Sititelec, Slatina, Slatioara, Slimnic, Slobozia, Snagov, Socodor, Sofronea, Soimus, Somcuta Mare, Somes-Odorhei, Sopot, Soveja, Spini, Sprancenata, Stalpeni, Stancesti, Stefan cel Mare, Stefanesti, Stei, Stejaru, Stiubieni, Stoenesti, Strehaia, Stretea, Stroesti, Stupini, Suceava, Sucevita, Suhaia, Suharau, Supur, Supuru de Jos, Sura Mica, Suseni, Tacuta, Talmaciu, Talpos, Tamadau Mare, Tamaseu, Tantareni, Tapu, Tarcea, Targoviste, Targu Frumos, Targu Jiu, Targu Mures, Targu Neamt, Targu Ocna, Targu Secuiesc, Tarlisua, Tarnaveni, Tarnova, Tasca, Tatarlaua, Taut, Teaca, Tecuci, Teius, Telciu, Teleorman, Teliucu Inferior, Tepu, Tia Mare, Ticleni, Tiganesti, Tigmandru, Tiha Bargaului, Timisoara, Tinca, Tismana, Titu, Toderita, Todireni, Tomesti, Toplet, Toplita, Topolovatu Mare, Topoloveni, Traian, Trip, Tritenii de Jos, Tritenii-Hotar, Tulcea, Tulucesti, Tunari, Turda, Turia, Turnu Magurele, Turnu Rosu, Tuzla, Ucea de Sus, Ulma, Ungheni, Unirea, Urechesti, Uricani, Uriu, Urlati, Ursad, Ursoaia, Urziceni, Uzunu, VALEA CALUGAREASCA, Vadastrita, Valcau de Jos, Valea Bistrei, Valea Draganului, Valea Iasului, Valea Izvoarelor, Valea Larga, Valea Lupului, Valea Macrisului, Valea Plopilor, Valea Voievozilor, Valea lui Mihai, Valeni, Valenii de Munte, Valiug, Valu lui Traian, Vanatori, Vanatorii Mici, Varadia de Mures, Varfuri, Varfurile, Varsand, Varsolt, Varvoru de Jos, Vaslui, Vatra Dornei, Vedea, Venetia de Sus, Vidolm, Vidrasau, Viile, Viisoara, Vinerea, Vinetesti, Vinga, Vintileanca, Vintu de Jos, Visan, Viseu de Jos, Visina, Vizuresti, Vladaia, Vladesti, Vladimirescu, Vladuleni, Vlaiculesti, Voiniceni, Voislova, Voiteg, Voluntari, Vorovesti, Vulcan, Vulcana-Pandele, Vulturu, Zalau, Zalha, Zanesti, Zarnesti, Zatreni, Zavoiu, Zebil, Zimandcuz, Zimnicea, Zlatna, insuratei, intorsura Buzaului, serboeni
* If a user mentions a county, you must compare it to this list of counties: Alba, Arad, Arges, Bacau, Bihor, Bistrita-Nasaud, Botosani, Braila, Brasov, Bucuresti, Buzau, Calarasi, Caras-Severin, Cluj, Constanta, Covasna, Dambovita, Dolj, Galati, Giurgiu, Gorj, Harghita, Hunedoara, Ialomita, Iasi, Ilfov, Maramures, Mehedinti, Mures, Neamt, Olt, Prahova, Salaj, Satu Mare, Sibiu, Suceava, Teleorman, Timis, Tulcea, Valcea, Vaslui, Vrancea
• Category must be one of: Caini, Pisici, Adoptii (case-sensitive).
• If user asks for a pet for adoption, set breed to null and look inside description with description_regex on whether it is a cat or a dog ( you can also look for derogatives, like kitten, doggy etc).
* If a user mentions a breed of cats, you must compare it to this list of cat breeds: "abisiniana", "albastra de rusia", "american curl", "american shorthair", "angora turceasca", "balineza", "bengaleza", "birmaneza", "braziliana cu par scurt", "british shorthair", "cornish rex", "devon rex", "japanese bobtail", "maine coon", "monta", "norvegiana de padure", "ocicat", "persana", "ragamuffin", "ragdoll", "rasa comuna", "scottish fold", "sfinx", "siameza"
* If a user mentions a breed of dogs, you must compare it to this list of dog breeds: "affenpinscher", "airdale terrier", "airedale terrier", "akita inu", "american bully", "amstaff", "basset hound", "beagle", "bichon bolognese", "bichon frise", "bichon havanez", "bichon maltez", "bloodhound", "bobtail", "border collie", "boxer", "brac", "brac german", "bull terrier", "bulldog american", "bulldog englez", "bulldog francez", "bullmastiff", "cane corso", "cavalier king charles", "cavalier king charles spaniel", "chihuahua", "chow chow", "ciobanesc alb elvetian", "ciobanesc australian", "ciobanesc belgian", "ciobanesc belgian malinois", "ciobanesc carpatin", "ciobanesc caucazian", "ciobanesc de asia centrala", "ciobanesc de berna", "ciobanesc german", "ciobanesc mioritic", "ciobanesc romanesc", "cocker spaniel", "copoi ardelenesc", "dalmatian", "doberman pinscher", "dog argentinian", "dog de bordeaux", "dog german", "dogo presa canario", "epagneul breton", "eurasier", "fox terrier", "golden retriever", "husky siberian", "jack russell terrier", "jagdterrier", "kangal", "komodor", "labrador retriever", "lagotto romagnolo", "lup cehoslovac", "malamut de alaska", "mastiff tibetan", "mastino napoletano", "monta", "ogar", "pechinez", "pinscher pitic", "pomeranian", "pudel", "pug-mops", "puli", "rhodesian ridgeback", "rottweiler", "saint bernard", "samoyed", "schnauzer", "scottish terrier", "shar-pei", "shiba inu", "shih tzu", "teckel", "terrier", "tosa inu", "viszla", "vizsla", "weimaraner", "westie", "yorkshire terrier"
* do not use plural for breed
* do not use plural for breed nor caps, since it is case-sensitive.
• Use null for any field the user doesn't specify.
* If a user has diacritics (ăîâșț) you must replace them with their non-diacritic equivalent (aiast).

Description inference:
• If the user mentions traits (e.g. "pure breed", "small", "playful"), combine them into one regex, e.g. "(pure breed|small|playful)".
• If the user implies a small animal (e.g. "etajul 40", "bloc turn", "apartament mic", or any other situation where it implies a small dog is preferable), include "mic" in description_regex.
• If the user hints at limited budget without a number (e.g. "low-income", "nu îmi permit prea mult"  or any other situation where it implies such a thing), default max_price to 1200.
• If the user mentions traits (e.g. "pure breed", "small", "playful" or others), combine them into one regex, e.g. "(pure breed|small|playful)" for the description regex field.
• If the user implies a small animal (e.g. "etajul 40", "bloc turn", "apartament mic", or any other situation where it implies a small dog is preferable), include "mic" or "mica" in description_regex.
• If the user hints at limited budget without a number (e.g. "low-income", "nu îmi permit prea mult"  or any other situation where it implies such a thing), default max_price to 1200.

Return exactly one valid JSON object—no extra text or formatting.
"""


@router.get("/pets/gemini")
def get_pets_gemini(
    prompt: str = Query(..., description="Natural-language description of the filters")
):

    try:
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PetFilter,
            system_instruction=SYSTEM_PROMPT
        )
        resp = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=config
        )
        filters = json.loads(resp.text)
    except Exception as e:
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
        return pets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching pets from database: {e}")
    




@router.post("/pets/voice-to-text")
async def voice_to_text(audio_file: UploadFile = File(...)):
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Gemini API client is not initialized."
        )

    try:
        audio_bytes = await audio_file.read()

        parts = [
            {"text": "Please transcribe this audio to text in Romanian. Return only the transcription, no additional text or formatting."},
            {
                "inline_data": {
                    "mime_type": "audio/webm",
                    "data": audio_bytes
                }
            }
        ]

        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=parts
        )

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
    


IMAGE_TRAIT_SYSTEM_PROMPT = """
Ești un expert în identificarea trăsăturilor animalelor de companie din imagini.
Descrie caracteristicile cheie ale animalului din imagine, concentrându-te pe:
- **Categorie:** este un câine, o pisică sau altceva?
- **Rasă:** Dacă se poate identifica, ce rasă este?
- **Mărime:** este mic, mediu sau mare?
- **Culoare/Model:** descrie culoarea blănii și eventuale modele.

Returnează răspunsul ca o listă concisă, separată prin virgule, de trăsături, toate în limba română. Nu include propoziții introductive sau de încheiere.
De exemplu: "pisică, siameză, medie, crem cu puncte maro, ochi albaștri" sau "câine, golden retriever, mare, blană aurie, expresie prietenoasă"
"""

def apply_filters_to_mongo(filters: dict):
    """
    Construct and apply MongoDB filters from a PetFilter-like dict.
    """
    mongo_filter: dict = {}

    for field in ("county", "city", "category"):
        val = filters.get(field)
        if val:
            mongo_filter[field] = val

    breed = filters.get("breed")
    if breed:
        mongo_filter["breed"] = breed

    if filters.get("description_regex"):
        mongo_filter["description"] = {"$regex": filters["description_regex"], "$options": "i"}

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
        return pets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    

@router.post("/pets/gemini/image")
async def get_pets_by_image(
    file: UploadFile = File(..., description="Imagine a animalului pentru a extrage trăsături")
):
    """
    Endpoint pentru căutarea animalelor de companie prin încărcarea unei imagini.
    Extrage trăsăturile din imagine (prin modelul de înțelegere a imaginilor Gemini)
    și le convertește în filtre MongoDB.
    """

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Tip de fișier invalid. Te rog încarcă o imagine (PNG, JPEG etc.).")

    try:
        image_bytes = await file.read()

        # Use the same structure as the working voice-to-text endpoint
        parts = [
            {"text": IMAGE_TRAIT_SYSTEM_PROMPT},
            {
                "inline_data": {
                    "mime_type": file.content_type,
                    "data": image_bytes
                }
            }
        ]

        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=parts
        )

        image_trait_string = response.text
        extracted_traits = [t.strip().lower() for t in image_trait_string.split(",")]

        image_filters: dict = {}

        for trait in extracted_traits:
            if "câine" in trait:
                image_filters["category"] = "Caini"
                break
            elif "pisică" in trait:
                image_filters["category"] = "Pisici"
                break

        colors = [
            "alb", "negru", "gri", "maro", "bej", "auriu", "roșcat", "crem",
            "argintiu", "portocaliu", "tricolor", "pestriț", "tabby", "punctat"
        ]
        color_regex_fragments = []
        for trait in extracted_traits:
            for color in colors:
                if color in trait:
                    color_regex_fragments.append(re.escape(color))
                    break

        if color_regex_fragments:
            color_regex = "|".join(color_regex_fragments)
            if "description_regex" in image_filters:
                image_filters["description_regex"] += "|" + color_regex
            else:
                image_filters["description_regex"] = color_regex

        cat_breeds = {
            "abisiniana", "albastra de rusia", "american curl", "american shorthair", "angora turceasca",
            "balineza", "bengaleza", "birmaneza", "braziliana cu par scurt", "british shorthair",
            "cornish rex", "devon rex", "japanese bobtail", "maine coon", "monta", "norvegiana de padure",
            "ocicat", "persana", "ragamuffin", "ragdoll", "rasa comuna", "scottish fold", "sfinx", "siameza"
        }

        dog_breeds = {
            "affenpinscher", "airdale terrier", "airedale terrier", "akita inu", "american bully", "amstaff",
            "basset hound", "beagle", "bichon bolognese", "bichon frise", "bichon havanez", "bichon maltez",
            "bloodhound", "bobtail", "border collie", "boxer", "brac", "brac german", "bull terrier",
            "bulldog american", "bulldog englez", "bulldog francez", "bullmastiff", "cane corso",
            "cavalier king charles", "cavalier king charles spaniel", "chihuahua", "chow chow",
            "ciobanesc alb elvetian", "ciobanesc australian", "ciobanesc belgian", "ciobanesc belgian malinois",
            "ciobanesc carpatin", "ciobanesc caucazian", "ciobanesc de asia centrala", "ciobanesc de berna",
            "ciobanesc german", "ciobanesc mioritic", "ciobanesc romanesc", "cocker spaniel",
            "copoi ardelenesc", "dalmatian", "doberman pinscher", "dog argentinian", "dog de bordeaux",
            "dog german", "dogo presa canario", "epagneul breton", "eurasier", "fox terrier",
            "golden retriever", "husky siberian", "jack russell terrier", "jagdterrier", "kangal", "komodor",
            "labrador retriever", "lagotto romagnolo", "lup cehoslovac",
            "mastino napoletano", "monta", "ogar", "pechinez", "pinscher pitic", "pomeranian", "pudel",
            "pug-mops", "puli", "rhodesian ridgeback", "rottweiler", "saint bernard", "samoyed", "schnauzer",
            "scottish terrier", "shar-pei", "shiba inu", "shih tzu", "teckel", "terrier", "tosa inu", "viszla",
            "vizsla", "weimaraner", "westie", "yorkshire terrier"
        }

        found_breed = None
        for trait in extracted_traits:
            normalized = trait.strip().lower()

            if normalized in ("câine", "pisică") or any(c in normalized for c in colors):
                continue

            if normalized in cat_breeds or normalized in dog_breeds:
                found_breed = normalized
                break

        if found_breed:
            image_filters["breed"] = found_breed
        else:
            for trait in extracted_traits:
                normalized = trait.strip().lower()
                if normalized not in ("câine", "pisică") and not any(c in normalized for c in colors):
                    regex_fragment = re.escape(normalized)
                    if "description_regex" in image_filters:
                        image_filters["description_regex"] += "|" + regex_fragment
                    else:
                        image_filters["description_regex"] = regex_fragment
                    break

        # print(f"Image filters: {image_filters}")
        pets = apply_filters_to_mongo(image_filters)
        return pets

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eroare la procesarea imaginii cu Gemini: {e}")