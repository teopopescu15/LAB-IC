import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio_file') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Forward to Python backend
    const backendFormData = new FormData();
    backendFormData.append('audio_file', audioFile);

    const response = await fetch('http://localhost:8000/pets/voice-to-text', {
      method: 'POST',
      body: backendFormData,
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend request failed: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Voice-to-text error:', error);
    return NextResponse.json(
      { error: 'Failed to process speech' },
      { status: 500 }
    );
  }
} 