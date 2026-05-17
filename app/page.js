"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    const salvo = localStorage.getItem("lizzy_chat");
    setChat(
      salvo
        ? JSON.parse(salvo)
        : [{ role: "lizzy", text: "Oii" }]
    );
  }, []);

  useEffect(() => {
    if (chat.length) {
      localStorage.setItem("lizzy_chat", JSON.stringify(chat));
    }
  }, [chat]);

  async function enviar() {
    if (!msg.trim()) return;

    const texto = msg;
    setMsg("");

    const nova = [...chat, { role: "user", text: texto }];
    setChat(nova);

    const lower = texto.toLowerCase();

    const querImagem =
      lower.includes("gera imagem") ||
      lower.includes("crie imagem") ||
      lower.includes("faz imagem") ||
      lower.includes("desenha") ||
      lower.includes("imagem de");

    if (querImagem) {
      const digitando = [...nova, { role: "lizzy", text: "Gerando imagem..." }];
      setChat(digitando);

      const r = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: texto
        })
      });

      const data = await r.json();

      setChat([
        ...nova,
        {
          role: "lizzy",
          text: "Pronto 😈",
          image: data.imageUrl
        }
      ]);

      return;
    }

    const digitando = [...nova, { role: "lizzy", text: "Digitando..." }];
    setChat(digitando);

    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: texto,
        history: nova.slice(-10)
      })
    });

    const data = await r.json();

    setChat([
      ...nova,
      {
        role: "lizzy",
        text: data.reply
      }
    ]);
  }

  function uploadImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setChat([
      ...chat,
      {
        role: "user",
        text: "Imagem enviada",
        image: url
      }
    ]);
  }

  return (
    <main className="app">
      <section className="profile">
        <div className="avatar">L</div>
        <h1>LIZZY 💜</h1>
        <p>IA rápida • imagens • conversa natural</p>
      </section>

      <section className="chatBox">
        <header>
          <h2>Lizzy</h2>
        </header>

        <div className="messages">
          {chat.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.text}
              {m.image && <img src={m.image} alt="" className="chatImg" />}
            </div>
          ))}
        </div>

        <footer>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Digite..."
          />

          <button onClick={() => fileRef.current.click()}>📎</button>

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={uploadImagem}
          />

          <button onClick={enviar}>➤</button>
        </footer>
      </section>
    </main>
  );
        }
