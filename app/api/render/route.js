import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/elevenlabs';
import { createAvatarVideo } from '@/lib/heygen';
import { fetchProduct } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    const product = await fetchProduct(url);
    const audioUrl = await generateSpeech(product.title);
    const videoUrl = await createAvatarVideo(audioUrl, product.image);

    return NextResponse.json({ videoUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
