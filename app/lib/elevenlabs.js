// app/lib/elevenlabs.js
const API_KEY = process.env.ELEVEN_LABS_API_KEY; // kommt aus .env.local

export async function generateSpeech(text) {
  const voiceId = 'zlatCM6nK59gyedHFFxn'; // beliebige Stimme
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  });

  if (!response.ok) throw new Error('ElevenLabs Error ' + response.status);

  const audioBuffer = await response.arrayBuffer();
  const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob); // lokal nutzbar; später S3-Upload
}
