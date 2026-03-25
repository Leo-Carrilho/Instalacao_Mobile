// Intro.jsx - VERSÃO MODERNIZADA
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import "../../styles/App/Intro.css"

import Logo from "/public/assets/image/Logo.png" 

export default function Intro() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) {
        const x = (e.clientX / window.innerWidth - 0.5) * 30
        const y = (e.clientY / window.innerHeight - 0.5) * 30
        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // PARTÍCULAS MODERNAS
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const existingParticles = container.querySelectorAll('.particle')
    existingParticles.forEach(p => p.remove())

    const particles = []
    const particleCount = window.innerWidth < 768 ? 30 : 80

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      const size = Math.random() * 6 + 1
      const duration = Math.random() * 15 + 10
      const delay = Math.random() * 8
      const left = Math.random() * 100
      const top = Math.random() * 100
      
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${left}%`
      particle.style.top = `${top}%`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`
      
      // Cores gradientes modernas
      const colors = [
        'linear-gradient(135deg, rgba(19, 236, 128, 0.8), rgba(15, 184, 107, 0.4))',
        'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.2))',
        'linear-gradient(135deg, rgba(74, 139, 74, 0.6), rgba(50, 100, 50, 0.3))',
        'linear-gradient(135deg, rgba(196, 154, 108, 0.6), rgba(150, 100, 50, 0.3))'
      ]
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(particle => {
        if (particle && particle.parentNode) {
          particle.remove()
        }
      })
    }
  }, [])

  return (
    <div 
      className={`intro-container ${isLoaded ? 'loaded' : ''}`}
      ref={containerRef}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      }}
    >
      {/* BACKGROUND ANIMADO */}
      <div className="background-gradient"></div>
      <div className="background-noise"></div>
      
      {/* SPHERES 3D */}
      <div className="sphere-container">
        <div className="sphere sphere-1"></div>
        <div className="sphere sphere-2"></div>
        <div className="sphere sphere-3"></div>
        <div className="sphere sphere-4"></div>
      </div>

      {/* WAVES SVG */}
      <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="rgba(19, 236, 128, 0.05)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <div className="intro-card">
        <div className="card-glow-effect"></div>
        
        {/* LOGO SECTION */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-container">
              <div className="logo-pulse"></div>
              <img 
                src={Logo} 
                alt="AgroVoo" 
                className="logo-image"
              />
              <div className="logo-ring"></div>
            </div>
            
            <div className="logo-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">AGRO 4.0 • NEXT GEN</span>
              <span className="badge-dot"></span>
            </div>
            
            <h1 className="logo-title">
              <span className="title-line">Monitoramento</span>
              <span className="title-line title-line-highlight">
                Inteligente
                <span className="title-cursor">_</span>
              </span>
            </h1>
            
            <p className="logo-description">
              Drones autônomos com IA avançada para detecção precoce de pragas e doenças
            </p>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <span className="stat-number">98%</span>
            <span className="stat-label">Precisão na detecção</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">🕒</div>
            <span className="stat-number">24/7</span>
            <span className="stat-label">Monitoramento contínuo</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">📉</div>
            <span className="stat-number">-40%</span>
            <span className="stat-label">Perdas evitadas</span>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Análise do Solo</h3>
            <p className="feature-description">Umidade, nutrientes e saúde em tempo real</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M19.4 15C18.7 16.2 17.6 17.2 16.3 17.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.6 15C5.3 16.2 6.4 17.2 7.7 17.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Detecção de Pragas</h3>
            <p className="feature-description">IA identifica 50+ tipos de pragas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M2 12L5 9M22 12L19 9M12 2L9 5M12 22L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="feature-title">Voo Autônomo</h3>
            <p className="feature-description">Rotas inteligentes e mapeamento 3D</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V20H3V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 12V4M12 12L9 9M12 12L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="4" y="12" width="16" height="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="feature-title">Relatórios IA</h3>
            <p className="feature-description">Dashboards com insights acionáveis</p>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="actions-section">
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            <span className="btn-text">Acessar Plataforma</span>
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            <span className="btn-text">Começar Agora</span>
            <span className="btn-icon">✨</span>
          </button>
        </div>

        {/* TRUST BADGES */}
        <div className="trust-section">
          <div className="trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#13ec80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Garantia de resultados</span>
          </div>
          <div className="trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v1M12 20v1M3 12h1M20 12h1" stroke="#13ec80" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="4" stroke="#13ec80" strokeWidth="2"/>
            </svg>
            <span>Dados seguros</span>
          </div>
          <div className="trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="#13ec80" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="#13ec80" strokeWidth="2"/>
            </svg>
            <span>Suporte 24/7</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <p className="footer-text">
            Já é produtor rural? 
            <a href="/login" className="footer-link">
              Entrar na plataforma
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}