"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("lizzy_chat");
    setChat(saved ? JSON.parse(saved) : [{ role: "lizzy", text: "Oii" }]);
  }, []);

  useEffect(() => {
    if (chat.length) localStorage.setItem("lizzy_chat", JSON.stringify(chat));
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chat]);

  function querImagem(text) {
    const t = text.toLowerCase();
    return (
      t.includes("gera imagem") ||
      t.includes("gerar imagem") ||
      t.includes("cria imagem") ||
      t.includes("crie imagem") ||
      t.includes("faz uma imagem") ||
      t.includes("desenha") ||
      t.includes("imagem de")
    );
  }

  async function enviar() {
    if (!msg.trim() || loading) return;

    const text = msg.trim();
    setMsg("");
    setLoading(true);

    const base = [...chat, { role: "user", text }];
    setChat([...base, { role: "lizzy", text: "Pensando..." }]);

    try {
      if (querImagem(text)) {
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

        setChat([...base, { role: "lizzy", text: data.reply }]);
      }
    } catch {
      setChat([...base, { role: "lizzy", text: "Deu erro. Tenta de novo." }]);
    }

    setLoading(false);
  }

  function limpar() {
    localStorage.removeItem("lizzy_chat");
    setChat([{ role: "lizzy", text: "Conversa limpa" }]);
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">L</div>
          <div>
            <h1>LIZZY</h1>
            <p>Hyper AI</p>
          </div>
        </div>

        <div className="panel">
          <p>🟢 Online</p>
          <p>⚡ Resposta rápida</p>
          <p>🎨 Gera imagens</p>
          <p>🧠 Memória local</p>
          <p>🌐 Busca simples</p>
        </div>

        <button className="clear" onClick={limpar}>
          Limpar conversa
        </button>
      </aside>

      <section className="chat">
        <header className="topbar">
          <div className="miniLogo">💜</div>
          <div>
            <h2>Lizzy</h2>
            <p>online • pronta</p>
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
            placeholder="Fale com a Lizzy..."
          />
          <button onClick={enviar}>{loading ? "..." : "➤"}</button>
        </footer>
      </section>
    </main>
  );
}
