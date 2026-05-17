"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const salvo = localStorage.getItem("lizzy_chat");
    setChat(salvo ? JSON.parse(salvo) : [
      { role: "lizzy", text: "Oii" }
    ]);
  }, []);

  useEffect(() => {
    if (chat.length) localStorage.setItem("lizzy_chat", JSON.stringify(chat));
  }, [chat]);

  async function enviar() {
    if (!msg.trim()) return;

    const nova = [...chat, { role: "user", text: msg }];
    setChat(nova);
    setMsg("");

    setChat([...nova, { role: "lizzy", text: "Digitando..." }]);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: nova.slice(-10) })
      });

      const data = await r.json();

      setChat([...nova, { role: "lizzy", text: data.reply }]);
    } catch {
      setChat([...nova, { role: "lizzy", text: "Deu erro 😭" }]);
    }
  }

  function limpar() {
    localStorage.removeItem("lizzy_chat");
    setChat([{ role: "lizzy", text: "Chat limpo" }]);
  }

  return (
    <main className="app">
      <section className="profile">
        <div className="avatar">L</div>
        <h1>LIZZY 💜</h1>
        <p>Sua IA dark, rápida e inteligente.</p>

        <div className="tags">
          <span>natural</span>
          <span>memória</span>
          <span>criativa</span>
          <span>direta</span>
        </div>

        <button onClick={limpar} className="clear">Limpar conversa</button>
      </section>

      <section className="chatBox">
        <header>
          <div>
            <h2>Lizzy</h2>
            <p>online • pronta pra conversar</p>
          </div>
        </header>

        <div className="messages">
          {chat.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.text}
            </div>
          ))}
        </div>

        <footer>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={enviar}>➤</button>
        </footer>
      </section>
    </main>
  );
                         }
