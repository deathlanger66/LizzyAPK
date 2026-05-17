"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    const salvo = localStorage.getItem("lizzy_chat");
    setChat(
      salvo
        ? JSON.parse(salvo)
        : [{ role: "lizzy", text: "Oi 💜 no que posso ajudar?" }]
    );
  }, []);

  useEffect(() => {
    if (chat.length) {
      localStorage.setItem("lizzy_chat", JSON.stringify(chat));
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }
  }, [chat]);

  async function enviar() {
    if (!msg.trim()) return;

    const texto = msg;
    setMsg("");

    const nova = [...chat, { role: "user", text: texto }];
    setChat([...nova, { role: "lizzy", text: "Digitando..." }]);

    const lower = texto.toLowerCase();
    const querImagem =
      lower.includes("gera imagem") ||
      lower.includes("crie imagem") ||
      lower.includes("desenha") ||
      lower.includes("imagem de");

    if (querImagem) {
      const r = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: texto })
      });

      const data = await r.json();

      setChat([
        ...nova,
        {
          role: "lizzy",
          text: "Pronto ✨",
          image: data.imageUrl
        }
      ]);
      return;
    }

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: texto,
          history: nova.slice(-12)
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
    } catch {
      setChat([
        ...nova,
        {
          role: "lizzy",
          text: "Deu erro 😭"
        }
      ]);
    }
  }

  function limpar() {
    localStorage.removeItem("lizzy_chat");
    setChat([{ role: "lizzy", text: "Conversa limpa 💜" }]);
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="logoWrap">
          <div className="logo">L</div>
          <div>
            <h1>LIZZY</h1>
            <p>Advanced AI</p>
          </div>
        </div>

        <div className="card">
          <h3>Status</h3>
          <p>🟢 Online</p>
        </div>

        <div className="card">
          <h3>Skills</h3>
          <div className="tags">
            <span>Chat</span>
            <span>Imagem</span>
            <span>Criativa</span>
            <span>Rápida</span>
          </div>
        </div>

        <button className="clearBtn" onClick={limpar}>
          Limpar conversa
        </button>
      </aside>

      <section className="chatBox">
        <header className="topbar">
          <div>
            <h2>Lizzy</h2>
            <p>Inteligência conversacional</p>
          </div>
        </header>

        <div className="messages" ref={messagesRef}>
          {chat.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              <div>{m.text}</div>
              {m.image && <img src={m.image} alt="" className="chatImg" />}
            </div>
          ))}
        </div>

        <footer className="composer">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Pergunte qualquer coisa..."
          />
          <button onClick={enviar}>➤</button>
        </footer>
      </section>
    </main>
  );
}
