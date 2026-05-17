"use client";

import { useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { role: "lizzy", text: "Oii 😈" }
  ]);

  async function enviar() {
    if (!msg.trim()) return;

    const nova = [...chat, { role: "user", text: msg }];
    setChat(nova);

    const userMsg = msg;
    setMsg("");

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
  }

  return (
    <main style={{
      height:"100vh",
      display:"flex",
      flexDirection:"column"
    }}>
      <header style={{
        padding:"20px",
        fontSize:"28px",
        fontWeight:"bold",
        color:"#c46cff",
        borderBottom:"1px solid #2d1d40"
      }}>
        Lizzy 💜
      </header>

      <div style={{
        flex:1,
        overflowY:"auto",
        padding:"20px"
      }}>
        {chat.map((m,i)=>(
          <div
            key={i}
            style={{
              background:m.role==="user"?"#7b2dff":"#1c1c2b",
              padding:"14px",
              marginBottom:"12px",
              borderRadius:"18px",
              maxWidth:"80%",
              marginLeft:m.role==="user"?"auto":"0"
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={{
        display:"flex",
        padding:"16px",
        gap:"10px",
        borderTop:"1px solid #2d1d40"
      }}>
        <input
          value={msg}
          onChange={(e)=>setMsg(e.target.value)}
          placeholder="Fale com Lizzy..."
          style={{
            flex:1,
            padding:"14px",
            borderRadius:"16px",
            border:"none",
            background:"#151522",
            color:"white"
          }}
        />
        <button
          onClick={enviar}
          style={{
            padding:"14px 20px",
            borderRadius:"16px",
            border:"none",
            background:"#a145ff",
            color:"white"
          }}
        >
          Enviar
        </button>
      </div>
    </main>
  );
                            }
