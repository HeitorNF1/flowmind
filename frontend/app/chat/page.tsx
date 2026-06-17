"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

type Message = {
  id: string
  role: "user" | "ai"
  text: string
  ts: Date
}

const suggestions = [
  "Quero automatizar o envio de relatório de vendas semanal",
  "Preciso de alertas quando metas não forem atingidas",
  "Como posso integrar meu ERP com e-mail automático?",
  "Crie um dashboard com métricas de atendimento",
]

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#4F6EFF",
            display: "inline-block",
            animation: `fm-bounce 1.2s ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Avatar({ name, isAI }: { name?: string | null; isAI?: boolean }) {
  const initials = isAI
    ? "FM"
    : name
      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "VC"

  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.02em",
      background: isAI
        ? "linear-gradient(135deg, #4F6EFF 0%, #A78BFF 100%)"
        : "#1A2035",
      color: isAI ? "#fff" : "#6B7A99",
      border: isAI ? "none" : "1px solid rgba(255,255,255,0.08)",
    }}>
      {initials}
    </div>
  )
}

function MessageBubble({ msg, userName }: { msg: Message; userName?: string | null }) {
  const isAI = msg.role === "ai"
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      flexDirection: isAI ? "row" : "row-reverse",
      animation: "fm-fadein 0.25s ease",
    }}>
      <Avatar name={userName} isAI={isAI} />
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 4, alignItems: isAI ? "flex-start" : "flex-end" }}>
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: isAI ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          fontSize: "0.9375rem", lineHeight: 1.65,
          background: isAI ? "#0E1220" : "#4F6EFF",
          color: isAI ? "#C8D0E0" : "#fff",
          border: isAI ? "1px solid rgba(255,255,255,0.07)" : "none",
          whiteSpace: "pre-wrap",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: "0.7rem", color: "#3D4860", padding: "0 4px" }}>
          {msg.ts.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setInput("")

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      ts: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: session?.user?.email ?? "anonymous",
        }),
      })

      const data = await res.json()
      const aiText =
        data?.output ?? data?.message ?? data?.response ?? JSON.stringify(data)

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: aiText,
        ts: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
          ts: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { height: 100%; }
        body { font-family: 'Inter', sans-serif; background: #080B14; color: #E8EAF0; -webkit-font-smoothing: antialiased; overflow: hidden; }

        @keyframes fm-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fm-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes fm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .fm-layout {
          display: flex; height: 100vh; width: 100vw; overflow: hidden;
        }

        /* Sidebar */
        .fm-sidebar {
          width: 260px; flex-shrink: 0;
          background: #060912;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column;
          transition: width 0.2s ease, opacity 0.2s ease;
          overflow: hidden;
        }
        .fm-sidebar.collapsed { width: 0; opacity: 0; }

        .fm-sidebar-header {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .fm-logo {
          font-size: 1.1rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #6C8EFF, #A78BFF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }

        .fm-new-btn {
          width: 100%; margin: 0.75rem 0 0;
          padding: 0.6rem 1rem;
          background: rgba(79,110,255,0.1);
          border: 1px solid rgba(79,110,255,0.25);
          border-radius: 8px;
          color: #8AA4FF; font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: background 0.15s, border-color 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .fm-new-btn:hover { background: rgba(79,110,255,0.18); border-color: rgba(79,110,255,0.4); }

        .fm-sidebar-section {
          padding: 1rem 1rem 0.25rem;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #2E3A55;
          white-space: nowrap;
        }

        .fm-history-item {
          padding: 0.5rem 1rem; margin: 0 0.5rem;
          border-radius: 7px; font-size: 0.8125rem; color: #5A6A8A;
          cursor: pointer; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; transition: background 0.12s, color 0.12s;
        }
        .fm-history-item:hover { background: rgba(255,255,255,0.04); color: #8892AA; }
        .fm-history-item.active { background: rgba(79,110,255,0.1); color: #8AA4FF; }

        .fm-sidebar-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1rem;
        }
        .fm-user-row {
          display: flex; align-items: center; gap: 10px;
          padding: 0.5rem; border-radius: 8px;
          cursor: pointer; transition: background 0.12s;
          white-space: nowrap; overflow: hidden;
        }
        .fm-user-row:hover { background: rgba(255,255,255,0.04); }
        .fm-user-name { font-size: 0.8125rem; font-weight: 500; color: #8892AA; overflow: hidden; text-overflow: ellipsis; }
        .fm-user-email { font-size: 0.7rem; color: #3D4860; overflow: hidden; text-overflow: ellipsis; }
        .fm-signout {
          width: 100%; margin-top: 0.5rem;
          padding: 0.5rem; border-radius: 7px;
          background: transparent; border: none;
          color: #3D4860; font-size: 0.775rem; font-family: inherit;
          cursor: pointer; text-align: left;
          transition: color 0.12s, background 0.12s;
        }
        .fm-signout:hover { color: #E05252; background: rgba(224,82,82,0.06); }

        /* Main */
        .fm-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
          min-width: 0;
        }

        .fm-topbar {
          height: 52px; flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 12px;
          padding: 0 1.25rem;
        }
        .fm-toggle-btn {
          background: none; border: none; cursor: pointer;
          color: #3D4860; padding: 6px; border-radius: 6px;
          display: flex; transition: color 0.12s, background 0.12s;
        }
        .fm-toggle-btn:hover { color: #8892AA; background: rgba(255,255,255,0.04); }
        .fm-topbar-title {
          font-size: 0.875rem; font-weight: 600; color: #5A6A8A;
        }
        .fm-topbar-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4F6EFF;
          animation: fm-pulse 2s infinite;
          margin-left: auto;
        }
        .fm-back-link {
          margin-left: auto; font-size: 0.775rem; color: #3D4860;
          text-decoration: none; transition: color 0.12s;
        }
        .fm-back-link:hover { color: #6B7A99; }

        /* Messages */
        .fm-messages {
          flex: 1; overflow-y: auto; padding: 2rem 1.5rem;
          display: flex; flex-direction: column; gap: 1.5rem;
          scroll-behavior: smooth;
        }
        .fm-messages::-webkit-scrollbar { width: 4px; }
        .fm-messages::-webkit-scrollbar-track { background: transparent; }
        .fm-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

        .fm-messages-inner {
          max-width: 720px; width: 100%; margin: 0 auto;
          display: flex; flex-direction: column; gap: 1.5rem;
        }

        /* Empty state */
        .fm-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; text-align: center;
          animation: fm-fadein 0.4s ease;
        }
        .fm-empty-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, #4F6EFF, #A78BFF);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.375rem; margin-bottom: 1.25rem;
        }
        .fm-empty-title {
          font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em;
          color: #E8EAF0; margin-bottom: 0.5rem;
        }
        .fm-empty-sub { font-size: 0.9375rem; color: #5A6A8A; margin-bottom: 2rem; }
        .fm-suggestions {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.75rem; max-width: 560px; width: 100%;
        }
        @media (max-width: 500px) { .fm-suggestions { grid-template-columns: 1fr; } }
        .fm-suggestion {
          padding: 0.875rem 1rem; border-radius: 10px;
          background: #0E1220; border: 1px solid rgba(255,255,255,0.07);
          color: #6B7A99; font-size: 0.8125rem; line-height: 1.5;
          text-align: left; cursor: pointer; font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .fm-suggestion:hover {
          border-color: rgba(79,110,255,0.35); color: #A8B4CC;
          background: rgba(79,110,255,0.06);
        }

        /* Typing indicator */
        .fm-typing-row {
          display: flex; gap: 12px; align-items: flex-start;
          animation: fm-fadein 0.25s ease;
        }
        .fm-typing-bubble {
          padding: 0.75rem 1rem;
          background: #0E1220; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px 14px 14px 14px;
        }

        /* Input */
        .fm-input-area {
          flex-shrink: 0; padding: 1rem 1.5rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .fm-input-wrap {
          max-width: 720px; margin: 0 auto;
          display: flex; align-items: flex-end; gap: 10px;
          background: #0E1220;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 0.75rem 0.75rem 0.75rem 1.125rem;
          transition: border-color 0.15s;
        }
        .fm-input-wrap:focus-within { border-color: rgba(79,110,255,0.4); }
        .fm-textarea {
          flex: 1; background: none; border: none; outline: none;
          color: #E8EAF0; font-size: 0.9375rem; font-family: inherit;
          line-height: 1.6; resize: none; min-height: 24px; max-height: 180px;
          overflow-y: auto;
        }
        .fm-textarea::placeholder { color: #2E3A55; }
        .fm-send-btn {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: #4F6EFF; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          color: #fff;
        }
        .fm-send-btn:disabled { background: #1A2035; opacity: 0.5; cursor: not-allowed; }
        .fm-send-btn:not(:disabled):hover { background: #3D5CE0; transform: scale(1.05); }
        .fm-input-hint {
          max-width: 720px; margin: 0.5rem auto 0;
          font-size: 0.7rem; color: #2A3450; text-align: center;
        }
      `}</style>

      <div className="fm-layout">
        {/* Sidebar */}
        <aside className={`fm-sidebar${sidebarOpen ? "" : " collapsed"}`}>
          <div className="fm-sidebar-header">
            <span className="fm-logo">FlowMind</span>
          </div>
          <div style={{ padding: "0 0.75rem 0.75rem" }}>
            <button className="fm-new-btn" onClick={() => window.location.reload()}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Nova conversa
            </button>
          </div>

          <div className="fm-sidebar-section">Recentes</div>
          {["Relatório de vendas SAP", "Alerta de metas", "Dashboard de atendimento"].map((h, i) => (
            <div key={i} className={`fm-history-item${i === 0 ? " active" : ""}`}>{h}</div>
          ))}

          <div className="fm-sidebar-footer">
            <div className="fm-user-row">
              <Avatar name={session?.user?.name} />
              <div style={{ minWidth: 0 }}>
                <div className="fm-user-name">{session?.user?.name ?? "Usuário"}</div>
                <div className="fm-user-email">{session?.user?.email ?? ""}</div>
              </div>
            </div>
            <button className="fm-signout" onClick={() => signOut({ callbackUrl: "/login" })}>
              → Sair da conta
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="fm-main">
          {/* Topbar */}
          <div className="fm-topbar">
            <button className="fm-toggle-btn" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="fm-topbar-title">Consultor de automação</span>
            <div className="fm-topbar-dot" title="Conectado ao FlowMind" />
            <Link href="/" className="fm-back-link">← Início</Link>
          </div>

          {/* Messages or Empty */}
          {isEmpty ? (
            <div className="fm-empty">
              <div className="fm-empty-icon">⚡</div>
              <div className="fm-empty-title">
                Olá{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
              </div>
              <div className="fm-empty-sub">
                Descreva o processo que você quer automatizar.
              </div>
              <div className="fm-suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="fm-suggestion" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="fm-messages">
              <div className="fm-messages-inner">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} userName={session?.user?.name} />
                ))}
                {loading && (
                  <div className="fm-typing-row">
                    <Avatar isAI />
                    <div className="fm-typing-bubble">
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="fm-input-area">
            <div className="fm-input-wrap">
              <textarea
                ref={inputRef}
                className="fm-textarea"
                placeholder="Descreva o processo que você quer automatizar..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px"
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
              />
              <button
                className="fm-send-btn"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Enviar"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="fm-input-hint">Enter para enviar · Shift+Enter para nova linha</div>
          </div>
        </main>
      </div>
    </>
  )
}