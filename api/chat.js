export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { messages } = req.body;

  const historico = [
    {
      role: "system",
      content: `
Você é Lizzy.
Responda em português do Brasil.
Seja humana, natural, simples e direta.
Não use ações entre asteriscos.
Não use hashtags.
Não escreva textão sem pedirem.
Se adapte ao jeito da pessoa.
`
    },
    ...messages
  ];

  try {
    const resposta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com",
        "X-Title": "Lizzy"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: historico,
        max_tokens: 120,
        temperature: 0.7
      })
    });

    const data = await resposta.json();
    const texto = data.choices?.[0]?.message?.content || "Deu erro na resposta.";

    res.status(200).json({ reply: texto });
  } catch (e) {
    res.status(500).json({ reply: "Erro no servidor da Lizzy." });
  }
        }
