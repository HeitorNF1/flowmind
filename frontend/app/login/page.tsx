import { signIn } from "@/auth"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="login-page">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-page {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(79, 110, 255, 0.18),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(167, 139, 255, 0.14),
              transparent 35%
            ),
            #080b14;
          color: #e8eaf0;
        }

        .background-grid {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8),
            transparent
          );
        }

        .glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(79, 110, 255, 0.12);
          filter: blur(100px);
          pointer-events: none;
        }

        .glow-one {
          top: -180px;
          left: -120px;
        }

        .glow-two {
          right: -160px;
          bottom: -180px;
          background: rgba(167, 139, 255, 0.1);
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #7f8ba8;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition:
            color 0.15s ease,
            transform 0.15s ease;
        }

        .back-link:hover {
          color: #c9d0df;
          transform: translateX(-3px);
        }

        .login-card {
          position: relative;
          overflow: hidden;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          background: rgba(14, 18, 32, 0.84);
          backdrop-filter: blur(20px);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(79, 110, 255, 0.04);
        }

        .login-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 15%;
          width: 70%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(108, 142, 255, 0.8),
            transparent
          );
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f6eff, #a78bff);
          color: #ffffff;
          font-size: 1.2rem;
          box-shadow: 0 10px 30px rgba(79, 110, 255, 0.3);
        }

        .brand-name {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #8aa4ff, #b69cff);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .login-title {
          margin-bottom: 0.75rem;
          color: #f2f4ff;
          font-size: clamp(1.8rem, 5vw, 2.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.04em;
        }

        .login-description {
          margin-bottom: 2rem;
          color: #7f8ba8;
          font-size: 0.975rem;
          line-height: 1.7;
        }

        .google-button {
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 0.875rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: #ffffff;
          color: #1f2430;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .google-button:hover {
          transform: translateY(-2px);
          background: #f6f7fb;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
        }

        .google-button:active {
          transform: translateY(0);
        }

        .google-icon {
          width: 21px;
          height: 21px;
          flex-shrink: 0;
        }

        .security-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          color: #4d5b78;
          font-size: 0.75rem;
          text-align: center;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
          color: #35415c;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          color: #6f7d99;
          font-size: 0.825rem;
          line-height: 1.5;
        }

        .benefit-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          border-radius: 6px;
          background: rgba(79, 110, 255, 0.1);
          color: #7895ff;
          font-size: 0.7rem;
        }

        .footer-text {
          margin-top: 1.5rem;
          color: #34405a;
          font-size: 0.72rem;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 520px) {
          .login-page {
            padding: 1.25rem;
          }

          .login-card {
            padding: 2rem 1.5rem;
          }

          .brand {
            margin-bottom: 2rem;
          }
        }
      `}</style>

      <div className="background-grid" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="login-container">
        <Link href="/" className="back-link">
          <span aria-hidden="true">←</span>
          Voltar para a página inicial
        </Link>

        <section className="login-card">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              ⚡
            </div>

            <span className="brand-name">FlowMind</span>
          </div>

          <h1 className="login-title">
            Bem-vindo ao FlowMind
          </h1>

          <p className="login-description">
            Entre com sua conta Google para conversar com o FlowMind e
            transformar seus processos em automações.
          </p>

          <form
            action={async () => {
              "use server"

              await signIn("google", {
                redirectTo: "/chat",
              })
            }}
          >
            <button type="submit" className="google-button">
              <svg
                className="google-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
                />

                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.98-.9 6.64-2.4l-3.24-2.51c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.49H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.51l3.34-2.59Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.88-2.88C16.97 2.95 14.7 2 12 2a10 10 0 0 0-8.95 5.49l3.34 2.59C7.18 7.71 9.39 5.95 12 5.95Z"
                />
              </svg>

              Continuar com o Google
            </button>
          </form>

          <div className="security-message">
            <span aria-hidden="true">🔒</span>
            Autenticação segura utilizando o Google
          </div>

          <div className="divider">
            Acesse sua área
          </div>

          <div className="benefits">
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>
                Crie automações descrevendo seu processo em linguagem natural.
              </span>
            </div>

            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>
                Continue suas conversas e acompanhe os fluxos criados.
              </span>
            </div>

            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span>
                Seus dados de acesso não são compartilhados com o FlowMind.
              </span>
            </div>
          </div>

          <p className="footer-text">
            Ao continuar, você concorda com os termos de uso e com a política
            de privacidade do FlowMind.
          </p>
        </section>
      </div>
    </main>
  )
}