export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const finalPrompt = `
Crie exatamente o que o usuário pediu, respeitando o estilo, tema, detalhes, clima e composição solicitados.
Não force estilo cyberpunk, roxo, neon, anime ou realista se o usuário não pediu.
Se o usuário pedir realista, faça realista.
Se pedir anime, faça anime.
Se pedir desenho, faça desenho.
Se pedir logo, faça logo.
Se pedir foto, faça estilo fotografia.
Pedido do usuário: ${prompt}
`;

    const imageUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(finalPrompt) +
      "?width=1024&height=1024&enhance=true&nologo=true&safe=true";

    return Response.json({ imageUrl });
  } catch {
    return Response.json({ error: true });
  }
}
