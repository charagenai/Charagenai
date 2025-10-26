
import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '/app/lib/elevenlabs';
import { createAvatarVideo } from '/app/lib/heygen';
import { fetchProduct } from '/app/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    console.log('Received URL:', url);

    const product = await fetchProduct(url);
    console.log('Fetched Product:', product);

    const audioUrl = await generateSpeech(product.title);
    console.log('Generated Audio URL:', audioUrl);

    const videoUrl = await createAvatarVideo(audioUrl, product.image);
    console.log('Generated Video URL:', videoUrl);

    return NextResponse.json({ videoUrl });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: `API Error: ${err.message}` },
      { status: 500 }
    );
  }
}
