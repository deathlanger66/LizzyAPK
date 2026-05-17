export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const cleanPrompt = `
high quality, detailed, cinematic, neon purple cyberpunk style, ${prompt}
`;

    const imageUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(cleanPrompt) +
      "?width=1024&height=1024&enhance=true&nologo=true&safe=true";

    return Response.json({ imageUrl });
  } catch {
    return Response.json({ error: true });
  }
}
