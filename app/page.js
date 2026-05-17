"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("lizzy_v4_chat");
    setChat(saved ? JSON.parse(saved) : [
      { role: "lizzy", text: "Oii" }
    ]);
  }, []);

  useEffect(() => {
    if (chat.length) localStorage.setItem("lizzy_v4_chat", JSON.stringify(chat));
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat]);

  function isImagePrompt(text) {
    const t = text.toLowerCase();
    return t.includes("gera imagem") || t.includes("cria imagem") || t.includes("faz imagem") || t.includes("desenha") || t.includes("imagem de");
  }

  async function enviar() {
    if (!msg.trim() || loading) return;

    const text = msg.trim();
    setMsg("");
    setLoading(true);

    const base = [...chat, { role: "user", text }];
    setChat([...base, { role: "lizzy", text: "Pensando..." }]);

    try {
      if (isImagePrompt(text)) {
        const r = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text })
        });

        const data = await r.json();

        setChat([
          ...base,
          { role: "lizzy", text: "Pronto ✨", image: data.imageUrl }
        ]);
      } else {
        const r = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: base.slice(-14) })
        });

        const data = await r.json();

        setChat([
          ...base,
          { role: "lizzy", text: data.reply || "Deu erro 😭" }
        ]);
      }
    } catch {
      setChat([...base, { role: "lizzy", text: "Deu erro 😭 tenta de novo." }]);
    }

    setLoading(false);
  }

  function limpar() {
    localStorage.removeItem("lizzy_v4_chat");
    setChat([{ role: "lizzy", text: "Conversa limpa" }]);
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">L</div>
          <div>
            <h1>LIZZY</h1>
            <p>Hyper AI System</p>
          </div>
        </div>

        <div className="panel">
          <h3>Status</h3>
          <p>🟢 Online</p>
          <p>⚡ Modo rápido</p>
          <p>🎨 Imagens ativadas</p>
        </div>

        <div className="panel">
          <h3>Ferramentas</h3>
          <div className="chips">
            <span>Chat</span>
            <span>Imagem</span>
            <span>Código</span>
            <span>Ideias</span>
            <span>Estudo</span>
            <span>Criação</span>
          </div>
        </div>

        <button className="clear" onClick={limpar}>Limpar conversa</button>
      </aside>

      <section className="chat">
        <header className="topbar">
          <div className="miniLogo">💜</div>
          <div>
            <h2>Lizzy</h2>
            <p>online • inteligente • rápida</p>
          </div>
        </header>

        <div className="messages" ref={messagesRef}>
          {chat.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              <p>{m.text}</p>
              {m.image && <img src={m.image} className="chatImg" alt="Imagem gerada" />}
            </div>
          ))}
        </div>

        <footer className="composer">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Peça qualquer coisa..."
          />
          <button onClick={enviar}>{loading ? "..." : "➤"}</button>
        </footer>
      </section>
    </main>
  );
}
