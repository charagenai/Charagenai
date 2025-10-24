import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from 'app/api/render/lib/elevenlabs.js';
import { createAvatarVideo } from 'app/api/render/lib/heygen.js';
import { fetchProduct } from 'app/api/render/lib/shopify.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // 1. Shopify-Daten holen
    const product = await fetchProduct(url);

    // 2. MP3-Sprache erzeugen
    const audioUrl = await generateSpeech(product.title);

    // 3. Avatar-Video erzeugen
    const videoUrl = await createAvatarVideo(audioUrl, product.image);

    return NextResponse.json({ videoUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
