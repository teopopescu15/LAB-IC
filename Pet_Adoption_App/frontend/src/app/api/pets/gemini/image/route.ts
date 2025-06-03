import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Forward the file to the backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch('http://localhost:8000/pets/gemini/image', {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error details:', errorText);
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the backend data to match the frontend expected structure
    const transformedData = data.map((pet: any) => {
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
    console.error('Error in image search:', error);
    return NextResponse.json(
      { error: 'Failed to process image search' },
      { status: 500 }
    );
  }
} 