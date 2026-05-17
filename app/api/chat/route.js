import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: `
Você é Lizzy.

Regras:
- fale SEMPRE em português brasileiro
- seja extremamente inteligente
- natural
- humana
- rápida
- não se apresente toda hora
- nunca diga "sou Lizzy" em toda resposta
- converse normalmente
- seja amigável
- seja boa explicando
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return Response.json({
      reply: response.choices[0].message.content
    });

  } catch (e) {
    return Response.json({
      reply: "Deu erro 😭"
    });
  }
      }
