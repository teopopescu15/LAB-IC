import { NextResponse } from 'next/server';

// Define types for better code organization
type BackendPet = {
  _id: string;
  title: string;
  image_url: string;
  description: string;
  county: string;
  city: string;
  category: string;
  subcategory: string;
  breed: string;
  price: number;
  link: string;
  species: string | null;
  service: string | null;
  promoted: boolean;
};

type FrontendPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  imageUrl: string;
  description: string;
  source: string;
  originalLink: string;
  location: string;
  gender: string;
  size: string;
  postedDate: string;
  price: number;
  category: string;
  subcategory: string | null;
  promoted: boolean;
  countyRaw: string;
  cityRaw: string;
  serviceType: string | null;
};

// Fallback data when the backend is unavailable
const fallbackPets: FrontendPet[] = [
  {
    id: "1",
    name: "Berbeci și oi cu miei",
    species: "other",
    breed: "Oi",
    age: "Necunoscută",
    imageUrl: "https://s3.publi24.ro/vertical-ro-f646bd5a/top/20250325/1938/de7f79efab33a0d2cb57529a2db199aa.jpg",
    description: "Berbeci și oi cu miei, grase și frumoase pentru pretențioși. Prețul stabilit în funcție de greutate.",
    source: "animalutul.ro",
    originalLink: "https://www.animalutul.ro",
    location: "Maciuca, Valcea",
    gender: "male",
    size: "large",
    postedDate: new Date().toLocaleDateString('ro-RO'),
    price: 1000,
    category: "Animale de ferma",
    subcategory: "Oi",
    promoted: false,
    countyRaw: "Valcea",
    cityRaw: "Maciuca",
    serviceType: null
  },
  {
    id: "2",
    name: "Vand porc pt sacrificare",
    species: "other",
    breed: "Porci",
    age: "Necunoscută",
    imageUrl: "https://s3.publi24.ro/vertical-ro-f646bd5a/top/20250325/1940/3d9d10b6f.jpg",
    description: "Vand porc crescut in batatura de 200 kg pt sacrificare. Pret - 15 ron kg.",
    source: "animalutul.ro",
    originalLink: "https://www.animalutul.ro",
    location: "Pascani, Iasi",
    gender: "male",
    size: "large",
    postedDate: new Date().toLocaleDateString('ro-RO'),
    price: 15,
    category: "Animale de ferma",
    subcategory: "Porci",
    promoted: false,
    countyRaw: "Iasi",
    cityRaw: "Pascani",
    serviceType: null
  },
  {
    id: "3",
    name: "pudel roscat",
    species: "dog",
    breed: "pudel",
    age: "2 luni",
    imageUrl: "https://s3.publi24.ro/vertical-ro-f646bd5a/top/20250412/0848/34b6ce385.jpg",
    description: "catelul pudel mic 2 luni, cu carnet de sănătate, microcip inregistrat la Recom.",
    source: "animalutul.ro",
    originalLink: "https://www.animalutul.ro",
    location: "Cluj-Napoca, Cluj",
    gender: "male",
    size: "small",
    postedDate: new Date().toLocaleDateString('ro-RO'),
    price: 3982,
    category: "Caini",
    subcategory: null,
    promoted: true,
    countyRaw: "Cluj",
    cityRaw: "Cluj-Napoca",
    serviceType: null
  },
  {
    id: "4",
    name: "dresaj de caini",
    species: "dog",
    breed: "serviciu",
    age: "Necunoscută",
    imageUrl: "https://s3.publi24.ro/vertical-ro-f646bd5a/top/20250123/0953/ee70438e1.jpg",
    description: "cu o experiență de peste 40 ani canisa DE RIBA vă oferă dresaj pentru toate rasele.",
    source: "animalutul.ro",
    originalLink: "https://www.animalutul.ro",
    location: "Dragomiresti-Vale, Ilfov",
    gender: "male",
    size: "medium",
    postedDate: new Date().toLocaleDateString('ro-RO'),
    price: 150,
    category: "Servicii",
    subcategory: null,
    promoted: false,
    countyRaw: "Ilfov",
    cityRaw: "Dragomiresti-Vale",
    serviceType: "dresaj si cosmetica"
  },
  {
    id: "5",
    name: "British Longhair",
    species: "cat",
    breed: "british shorthair",
    age: "8 săptămâni", 
    imageUrl: "https://s3.publi24.ro/vertical-ro-f646bd5a/top/20250413/1627/dd0f25ca1.jpg",
    description: "Suntem 2 frățiori (baiețel și fetiță) și căutăm o căsuță nouă. Avem 8 săptămâni.",
    source: "animalutul.ro",
    originalLink: "https://www.animalutul.ro",
    location: "Deva, Hunedoara",
    gender: "female",
    size: "small",
    postedDate: new Date().toLocaleDateString('ro-RO'),
    price: 2500,
    category: "Pisici",
    subcategory: null,
    promoted: true,
    countyRaw: "Hunedoara",
    cityRaw: "Deva",
    serviceType: null
  }
];

export async function GET() {
  try {
    // Use a mock data approach if the backend is failing
    let data: BackendPet[];
    
    try {
      console.log("Attempting to connect to backend at http://localhost:8000/pets");
      const response = await fetch('http://localhost:8000/pets', {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Accept': 'application/json'
        },
        // Add a reasonable timeout
        signal: AbortSignal.timeout(20000)
      });
      
      if (!response.ok) {
        console.error(`Backend error: ${response.status}`);
        throw new Error('Backend connection failed');
      }
      
      data = await response.json();
      console.log(`Successfully fetched ${data.length} pets from backend`);
      
      // Transform the backend data to match the frontend expected structure
      const transformedData: FrontendPet[] = data.map(pet => {
        // Map category to frontend species
        let species = 'other';
        
        if (pet.category === 'Caini' || 
            pet.category?.toLowerCase()?.includes('câini') || 
            pet.category?.toLowerCase()?.includes('caini')) {
          species = 'dog';
        } else if (pet.category === 'Pisici' || 
                  pet.category?.toLowerCase()?.includes('pisici')) {
          species = 'cat';
        }
        
        // Generate gender and size if not available
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        // Ensure we have valid data
        const title = pet.title || 'Animal fără nume';
        const description = pet.description || 'Fără descriere';
        const imageUrl = pet.image_url || '/images/pet-placeholder.jpg';
        const link = pet.link || 'https://www.animalutul.ro';
        const county = pet.county || 'Necunoscut';
        const city = pet.city || 'Necunoscut';
        const location = city && county ? `${city}, ${county}` : (county || city || 'Necunoscut');
        const breed = pet.breed || pet.subcategory || 'Necunoscut';
        
        // Create transformed pet object with all relevant fields
        return {
          id: pet._id,
          name: title,
          species,
          breed,
          age: 'Necunoscută',
          imageUrl,
          description,
          source: 'animalutul.ro',
          originalLink: link,
          location,
          gender,
          size,
          postedDate: new Date().toLocaleDateString('ro-RO'),
          price: pet.price || 0,
          category: pet.category || 'Altele',
          subcategory: pet.subcategory,
          promoted: pet.promoted || false,
          countyRaw: county,
          cityRaw: city,
          serviceType: pet.service
        };
      });
      
      return NextResponse.json(transformedData);
      
    } catch (error) {
      console.error('Using fallback data due to backend error:', error);
      // If we can't reach the backend, use fallback data
      console.log("Returning fallback data instead");
      return NextResponse.json(fallbackPets);
    }
  } catch (error) {
    console.error('Error processing pet data:', error);
    return NextResponse.json(
      { error: 'Failed to process pet data' },
      { status: 500 }
    );
  }
} 