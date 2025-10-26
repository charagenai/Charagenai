import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '/app/lib/elevenlabs';
import { createAvatarVideo } from '/app/lib/heygen';
import { fetchProduct } from '/app/lib/shopify';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    // 1. Shopify data
    const product = await fetchProduct(url);

    // 2. MP3 speech
    const audioUrl = await generateSpeech(product.title);

    // 3. Avatar video
    const videoUrl = await createAvatarVideo(audioUrl, product.image);

    return NextResponse.json({ videoUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
