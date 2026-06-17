"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const chatMessages = [
  { role: "user", text: "Preciso automatizar o envio de relatório de vendas toda semana para os gestores." },
  { role: "ai", text: "Entendido. De onde vêm os dados de vendas? ERP, planilha ou CRM?" },
  { role: "user", text: "Vêm do nosso ERP, sistema SAP." },
  { role: "ai", text: "Perfeito. Criando o fluxo agora: SAP → consolidação de dados → relatório PDF → envio automático às segundas, 8h. Posso adicionar alertas se a meta não for atingida?" },
  { role: "user", text: "Sim! Isso seria ótimo." },
  { role: "ai", text: "Pronto. Fluxo criado e ativo. Seu time recebe o relatório toda segunda e um alerta caso as vendas estejam abaixo da meta." },
]

const stats = [
  { value: "73%", label: "dos processos empresariais ainda são manuais" },
  { value: "6x", label: "mais rápido que uma consultoria tradicional" },
  { value: "Zero", label: "linhas de código necessárias" },
]

const steps = [
  {
    n: "01",
    title: "Você descreve o processo",
    desc: "Fale com o FlowMind como falaria com um consultor. Sem formulários, sem diagramas.",
  },
  {
    n: "02",
    title: "A IA entende e mapeia",
    desc: "O agente faz as perguntas certas para entender fontes de dados, regras e resultados esperados.",
  },
  {
    n: "03",
    title: "Automação criada automaticamente",
    desc: "O fluxo é montado e ativado. Relatórios, alertas, e-mails — tudo funcionando.",
  },
  {
    n: "04",
    title: "Dashboards em linguagem natural",
    desc: "Peça 'quero ver vendas por região' e o painel aparece. Sem Power BI, sem Excel.",
  },
]

export default function LandingPage() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [typing, setTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleMessages >= chatMessages.length) return
    const msg = chatMessages[visibleMessages]
    const delay = visibleMessages === 0 ? 800 : msg.role === "ai" ? 1200 : 800
    const typingDelay = msg.role === "ai" ? 900 : 0

    const t1 = setTimeout(() => {
      if (msg.role === "ai") setTyping(true)
      const t2 = setTimeout(() => {
        setTyping(false)
        setVisibleMessages((v) => v + 1)
      }, typingDelay)
      return () => clearTimeout(t2)
    }, delay)

    return () => clearTimeout(t1)
  }, [visibleMessages])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleMessages, typing])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #080B14;
          color: #E8EAF0;
          -webkit-font-smoothing: antialiased;
        }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 2.5rem;
          background: rgba(8, 11, 20, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-size: 1.25rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #6C8EFF, #A78BFF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #4F6EFF; color: #fff;
          padding: 0.6rem 1.25rem; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
        }
        .nav-cta:hover { background: #3D5CE0; transform: translateY(-1px); }

        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 3rem;
          padding: 7rem 2.5rem 5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; padding: 6rem 1.25rem 3rem; }
          .nav { padding: 1rem 1.25rem; }
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(79, 110, 255, 0.12);
          border: 1px solid rgba(79, 110, 255, 0.3);
          color: #8AA4FF;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.35rem 0.875rem; border-radius: 99px;
          margin-bottom: 1.5rem;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4F6EFF;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #F0F2FF;
          margin-bottom: 1.5rem;
        }
        .hero-title-accent {
          background: linear-gradient(135deg, #6C8EFF 0%, #A78BFF 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 1.125rem; line-height: 1.7; color: #8892AA;
          margin-bottom: 2.5rem; max-width: 480px;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #4F6EFF; color: #fff;
          padding: 0.875rem 1.75rem; border-radius: 10px;
          font-size: 1rem; font-weight: 700;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 0 0 0 rgba(79,110,255,0.4);
        }
        .btn-primary:hover {
          background: #3D5CE0; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(79,110,255,0.35);
        }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: #8892AA;
          padding: 0.875rem 1.75rem; border-radius: 10px;
          font-size: 1rem; font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.25); color: #E8EAF0; }

        .chat-window {
          background: #0E1220;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,110,255,0.1);
        }
        .chat-header {
          background: #131726;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0.875rem 1.25rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .chat-header-dot { width: 10px; height: 10px; border-radius: 50%; }
        .chat-header-title { font-size: 0.8rem; font-weight: 600; color: #6B7A99; margin-left: 0.25rem; }
        .chat-body {
          padding: 1.25rem; display: flex; flex-direction: column;
          gap: 0.875rem; min-height: 320px; max-height: 380px;
          overflow-y: auto; scroll-behavior: smooth;
        }
        .chat-body::-webkit-scrollbar { width: 0; }

        .msg { display: flex; gap: 0.625rem; align-items: flex-end; animation: fadeUp 0.3s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .msg-user { flex-direction: row-reverse; }
        .msg-bubble {
          max-width: 78%; padding: 0.75rem 1rem;
          border-radius: 14px; font-size: 0.875rem; line-height: 1.55;
        }
        .msg-bubble-user {
          background: #4F6EFF; color: #fff;
          border-bottom-right-radius: 4px;
        }
        .msg-bubble-ai {
          background: #1A2035; color: #C8CEDD;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .msg-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 700;
        }
        .msg-avatar-ai { background: linear-gradient(135deg, #4F6EFF, #A78BFF); color: #fff; }
        .msg-avatar-user { background: #1E2840; color: #6B7A99; }

        .typing { display: flex; align-items: center; gap: 4px; padding: 0.875rem 1rem; }
        .typing span {
          width: 7px; height: 7px; border-radius: 50%; background: #4F6EFF;
          animation: bounce 1.2s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

        .section { max-width: 1200px; margin: 0 auto; padding: 5rem 2.5rem; }
        @media (max-width: 768px) { .section { padding: 3rem 1.25rem; } }

        .section-label {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #4F6EFF; margin-bottom: 1rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 800; letter-spacing: -0.03em; color: #F0F2FF;
          margin-bottom: 1rem;
        }
        .section-desc { font-size: 1.0625rem; color: #8892AA; line-height: 1.7; max-width: 560px; }

        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); }

        .stats-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05); border-radius: 16px;
          overflow: hidden; margin-top: 4rem;
        }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } }

        .stat-card {
          background: #0E1220; padding: 2.5rem 2rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .stat-value {
          font-size: 3rem; font-weight: 900; letter-spacing: -0.04em;
          background: linear-gradient(135deg, #6C8EFF, #A78BFF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .stat-label { font-size: 0.9375rem; color: #6B7A99; line-height: 1.5; }

        .steps-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem; margin-top: 3rem;
        }
        @media (max-width: 640px) { .steps-grid { grid-template-columns: 1fr; } }

        .step-card {
          background: #0E1220;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 1.75rem;
          transition: border-color 0.2s;
        }
        .step-card:hover { border-color: rgba(79,110,255,0.3); }
        .step-n {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          color: #4F6EFF; margin-bottom: 1rem;
        }
        .step-title { font-size: 1.0625rem; font-weight: 700; color: #E8EAF0; margin-bottom: 0.5rem; }
        .step-desc { font-size: 0.9rem; color: #6B7A99; line-height: 1.65; }

        .cta-section {
          max-width: 1200px; margin: 0 auto; padding: 3rem 2.5rem 6rem;
        }
        .cta-box {
          background: linear-gradient(135deg, #0E1533 0%, #121028 100%);
          border: 1px solid rgba(79,110,255,0.2);
          border-radius: 20px; padding: 4rem 3rem;
          text-align: center;
          box-shadow: 0 0 80px rgba(79,110,255,0.08);
        }
        .cta-title {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 900; letter-spacing: -0.03em; color: #F0F2FF;
          margin-bottom: 1rem;
        }
        .cta-desc { font-size: 1.0625rem; color: #8892AA; margin-bottom: 2.5rem; }

        footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 2rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1200px; margin: 0 auto;
        }
        .footer-logo {
          font-size: 1rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #6C8EFF, #A78BFF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .footer-copy { font-size: 0.8125rem; color: #3D4860; }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">FlowMind</span>
        <Link href="/chat" className="nav-cta">
          Começar agora →
        </Link>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Consultor de automação por IA
          </div>
          <h1 className="hero-title">
            Automatize processos{" "}
            <span className="hero-title-accent">conversando.</span>
          </h1>
          <p className="hero-desc">
            Descreva o que você precisa. O FlowMind entende, cria o fluxo e ativa a automação — sem código, sem consultoria, sem espera.
          </p>
          <div className="hero-actions">
            <Link href="/chat" className="btn-primary">
              Falar com o FlowMind →
            </Link>
            <a href="#como-funciona" className="btn-secondary">
              Ver como funciona
            </a>
          </div>
        </div>

        {/* Chat animado */}
        <div className="chat-window">
          <div className="chat-header">
            <span className="chat-header-dot" style={{ background: "#FF5F57" }} />
            <span className="chat-header-dot" style={{ background: "#FFBD2E" }} />
            <span className="chat-header-dot" style={{ background: "#28C840" }} />
            <span className="chat-header-title">FlowMind — Consultor IA</span>
          </div>
          <div className="chat-body" ref={chatRef}>
            {chatMessages.slice(0, visibleMessages).map((msg, i) => (
              <div key={i} className={`msg ${msg.role === "user" ? "msg-user" : ""}`}>
                <div className={`msg-avatar ${msg.role === "ai" ? "msg-avatar-ai" : "msg-avatar-user"}`}>
                  {msg.role === "ai" ? "FM" : "VC"}
                </div>
                <div className={`msg-bubble ${msg.role === "ai" ? "msg-bubble-ai" : "msg-bubble-user"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg">
                <div className="msg-avatar msg-avatar-ai">FM</div>
                <div className="msg-bubble msg-bubble-ai">
                  <div className="typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Stats */}
      <div className="section" style={{ paddingBottom: "2rem" }}>
        <p className="section-label">O problema que resolvemos</p>
        <h2 className="section-title">Automação ainda é cara e lenta demais.</h2>
        <p className="section-desc">
          Empresas perdem semanas com consultorias, reuniões e planilhas antes de ver qualquer processo rodando.
        </p>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Como funciona */}
      <div className="section" id="como-funciona">
        <p className="section-label">Como funciona</p>
        <h2 className="section-title">De conversa para automação em minutos.</h2>
        <p className="section-desc">
          Sem formulários, sem diagramas, sem dependência de TI. Só você e o FlowMind.
        </p>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-n">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Pronto para automatizar seu primeiro processo?</h2>
          <p className="cta-desc">
            Comece uma conversa com o FlowMind agora. Em minutos você terá uma automação rodando.
          </p>
          <Link href="/chat" className="btn-primary" style={{ display: "inline-flex", fontSize: "1.0625rem" }}>
            Começar gratuitamente →
          </Link>
        </div>
      </div>

      <footer>
        <span className="footer-logo">FlowMind</span>
        <span className="footer-copy">© 2026 FlowMind. Todos os direitos reservados.</span>
      </footer>
    </>
  )
}