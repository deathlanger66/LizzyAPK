"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const salvo = localStorage.getItem("lizzy_chat");
    if (salvo) {
      setChat(JSON.parse(salvo));
    } else {
      setChat([{ role: "lizzy", text: "Oiii 💜" }]);
    }
  }, []);

  useEffect(() => {
    if (chat.length > 0) {
      localStorage.setItem("lizzy_chat", JSON.stringify(chat));
    }
  }, [chat]);

  async function enviar() {
    if (!msg.trim()) return;

    const nova = [...chat, { role: "user", text: msg }];
    setChat(nova);

    const userMsg = msg;
    setMsg("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMsg
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

  function limparChat() {
    localStorage.removeItem("lizzy_chat");
    setChat([{ role: "lizzy", text: "Chat limpo 💜" }]);
  }

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#090914",
        color: "white"
      }}
    >
      <header
        style={{
          padding: "20px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#c46cff",
          borderBottom: "1px solid #2d1d40",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Lizzy 💜

        <button
          onClick={limparChat}
          style={{
            background: "#7b2dff",
            border: "none",
            padding: "10px 14px",
            borderRadius: "12px",
            color: "white"
          }}
        >
          Limpar
        </button>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px"
        }}
      >
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#7b2dff" : "#1c1c2b",
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "18px",
              maxWidth: "80%",
              marginLeft: m.role === "user" ? "auto" : "0"
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "15px",
          display: "flex",
          gap: "10px",
          borderTop: "1px solid #2d1d40"
        }}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Digite..."
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "#1c1c2b",
            color: "white"
          }}
        />

        <button
          onClick={enviar}
          style={{
            background: "#7b2dff",
            border: "none",
            padding: "14px 18px",
            borderRadius: "14px",
            color: "white"
          }}
        >
          Enviar
        </button>
      </div>
    </main>
  );
                           }
