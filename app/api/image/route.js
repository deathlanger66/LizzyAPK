export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&enhance=true&nologo=true`;

    return Response.json({
      imageUrl
    });

  } catch {
    return Response.json({
      error: true
    });
  }
}
