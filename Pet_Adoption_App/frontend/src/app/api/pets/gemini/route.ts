import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Proxying Gemini request with prompt:', prompt);

    // Call the backend Gemini endpoint
    const backendUrl = `http://localhost:8000/pets/gemini?prompt=${encodeURIComponent(prompt)}`;
    const response = await fetch(backendUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout for AI processing
    });

    if (!response.ok) {
      console.error(`Backend Gemini error: ${response.status}`);
      const errorText = await response.text();
      console.error('Backend error details:', errorText);
      
      // Check if it's an API key configuration issue
      if (response.status === 503) {
        return NextResponse.json(
          { 
            error: 'AI search is not configured yet. Please contact the administrator to set up the Gemini API key.',
            details: 'The Gemini AI service needs to be configured with a valid API key.'
          },
          { status: 503 }
        );
      }
      
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Gemini search returned ${data.length} pets`);

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
    console.error('Error in Gemini proxy:', error);
    return NextResponse.json(
      { error: 'Failed to process AI search' },
      { status: 500 }
    );
  }
} 