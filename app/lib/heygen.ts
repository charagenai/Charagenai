
// app/lib/heygen.js
const API_KEY = process.env.HEYGEN_API_KEY; // .env.local

export async function createAvatarVideo(audioUrl, imageUrl) {
  const response = await fetch('https://api.heygen.com/v1/video/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      background: '#ffffff',
      ratio: '16:9',
      test: true, // gratis & schnell
      voice: {
        type: 'audio',
        audio_path: audioUrl,
      },
      avatar: {
        type: 'photo',
        image_url: imageUrl,
      },
    }),
  });

  if (!response.ok) throw new Error('HeyGen Error ' + response.status);

  const data = await response.json();
  const videoId = data.video_id;

  // Poll bis fertig
  let status = 'processing';
  while (status === 'processing') {
    await new Promise(r => setTimeout(r, 5000)); // 5 s warten
    const statusRes = await fetch(`https://api.heygen.com/v1/video/status?video_id=${videoId}`, {
      headers: { 'X-Api-Key': API_KEY },
    });
    const statusData = await statusRes.json();
    status = statusData.status;
    if (status === 'completed') return statusData.video_url;
    if (status === 'error') throw new Error('HeyGen rendering failed');
  }
}
