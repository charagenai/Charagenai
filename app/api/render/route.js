import { NextRequest, NextResponse } from 'next/server';
import { createAvatarVideo } from '/app/lib/heygen.js';
import { fetchProduct } from '/app/lib/shopify.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    // 1. Shopify data
    const product = await fetchProduct(url);

    // 3. Avatar video
    const videoUrl = await createAvatarVideo(audioUrl, product.image);

    return NextResponse.json({ videoUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

