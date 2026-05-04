import { useEffect, useState, useRef, memo, useCallback } from "react"
import "../../../styles/Global/SplashScreen.css"

// ─── Utilitários ───────────────────────────────────────────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp   = (a, b, t) => a + (b - a) * clamp(t, 0, 1)
const easeOutCubic  = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)
const easeOutQuart  = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 4)
const easeInOutQuad = (t) => {
  t = clamp(t, 0, 1)
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

// ─── Mensagens do scan ─────────────────────────────────────────────────────────
const SCAN_MESSAGES = [
  "INICIANDO SISTEMA...",
  "MAPEANDO TERRENO...",
  "DETECTANDO CULTIVOS...",
  "ANALISANDO DADOS...",
  "GERANDO RELATÓRIO...",
  "SCAN COMPLETO ✓",
]

function getScanMessage(progress) {
  const idx = Math.min(
    Math.floor((progress / 100) * (SCAN_MESSAGES.length - 1)),
    SCAN_MESSAGES.length - 1
  )
  return SCAN_MESSAGES[idx]
}

// ─── Geração de dados das plantas ─────────────────────────────────────────────
function generatePlants(isMobile) {
  const rows = isMobile ? 3 : 4
  const plants = []

  for (let row = 0; row < rows; row++) {
    const rowDepth = (row + 1) / rows
    const perRow   = isMobile ? 5 : 8
    const baseH    = lerp(isMobile ? 18 : 38, isMobile ? 52 : 105, rowDepth)

    for (let col = 0; col < perRow; col++) {
      const spacing = 100 / perRow
      plants.push({
        id:     row * perRow + col,
        row,
        depth:  rowDepth,
        left:   col * spacing + spacing * 0.08 + Math.random() * spacing * 0.55,
        height: baseH + Math.random() * baseH * 0.35,
        delay:  row * 0.1 + col * 0.05 + Math.random() * 0.12,
        type:   Math.floor(Math.random() * 3),
        lean:   (Math.random() - 0.5) * 7,
      })
    }
  }
  return plants
}

// ─── Componente de Planta ──────────────────────────────────────────────────────
const Plant = memo(({ plant, grow, scanning }) => {
  const { left, height, delay, type, depth, lean } = plant

  return (
    <div
      className={`plant type-${type} ${grow ? "grow" : ""} ${scanning ? "scanning" : ""}`}
      style={{
        left:              `${left}%`,
        "--plant-height":  `${height}px`,
        "--plant-delay":   `${delay}s`,
        "--plant-scale":   lerp(0.42, 1, depth),
        "--plant-opacity": lerp(0.48, 1, depth),
        "--plant-lean":    `${lean}deg`,
      }}
    >
      <div className="plant-root" />

      <div className="stem">
        <div className="stem-inner" />
        <div className="stem-glow" />
      </div>

      <div className="leaves">
        <div className="leaf-pair pair-1">
          <div className="leaf left"  />
          <div className="leaf right" />
        </div>
        <div className="leaf-pair pair-2">
          <div className="leaf left"  />
          <div className="leaf right" />
        </div>
        <div className="leaf-pair pair-3">
          <div className="leaf left"  />
          <div className="leaf right" />
        </div>
      </div>

      <div className="fruit">
        <div className="fruit-body" />
      </div>

      {scanning && <div className="scan-particle" />}
    </div>
  )
})

// ─── Drone ─────────────────────────────────────────────────────────────────────
function Drone({ hovering }) {
  return (
    <div className={`drone-premium ${hovering ? "hovering" : ""}`}>
      <div className="drone-halo" />

      {["-45deg", "45deg", "-135deg", "135deg"].map((angle, i) => (
        <div key={i} className="drone-arm" style={{ "--arm-angle": angle }}>
          <div className="arm-bar" />
          <div className="motor">
            <div className="propeller-blur" />
            <div className="propeller">
              <span className="blade b1" />
              <span className="blade b2" />
            </div>
            <div className="motor-hub" />
          </div>
        </div>
      ))}

      <div className="drone-body">
        <div className="body-top" />
        <div className="body-bottom">
          <div className="camera">
            <div className="lens" />
            <div className="lens-glow" />
          </div>
        </div>
        <div className="led led-front" />
        <div className="led led-back"  />
        <div className="drone-logo">
          <span>AGRO</span>
          <span>TECH</span>
        </div>
      </div>

      <div className="drone-antenna" />
    </div>
  )
}

// ─── HUD de Scan ───────────────────────────────────────────────────────────────
function ScanHUD({ progress, message, visible }) {
  return (
    <div className={`scan-hud ${visible ? "hud-visible" : ""}`}>
      <div className="hud-frame">
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />
      </div>

      <div className="scan-sweep" />

      <div className="scan-card">
        <div className="scan-header">
          <div className="scan-icon">⬡</div>
          <div className="scan-titles">
            <div className="scan-title">SCAN AGRÍCOLA</div>
            <div className="scan-subtitle">SISTEMA ATIVO</div>
          </div>
          <div className="scan-blink" />
        </div>

        <div className="scan-bar-wrap">
          <div className="scan-bar-track">
            <div className="scan-bar-fill" style={{ width: `${progress}%` }}>
              <div className="scan-bar-shine" />
            </div>
          </div>
          <div className="scan-pct">{Math.floor(progress)}%</div>
        </div>

        <div className="scan-message">{message}</div>

        <div className="scan-metrics">
          <div className="metric">
            <span className="metric-lbl">ÁREA</span>
            <span className="metric-val">{(progress * 0.24).toFixed(1)} ha</span>
          </div>
          <div className="metric">
            <span className="metric-lbl">PLANTAS</span>
            <span className="metric-val">{Math.floor(progress * 0.87)}</span>
          </div>
          <div className="metric">
            <span className="metric-lbl">SAÚDE</span>
            <span className="metric-val">98%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente Principal ──────────────────────────────────────────────────────
export default function SplashScreen({ onComplete }) {
  const [stage,      setStage]      = useState(0)
  const [progress,   setProgress]   = useState(0)
  const [dronePos,   setDronePos]   = useState(0)
  const [isMobile,   setIsMobile]   = useState(false)
  const [plantData,  setPlantData]  = useState([])
  const [hudVisible, setHudVisible] = useState(false)
  const [scanMsg,    setScanMsg]    = useState(SCAN_MESSAGES[0])
  const rafRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setPlantData(generatePlants(isMobile))
  }, [isMobile])

  // ─── Timeline ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!plantData.length) return

    const timers = []
    const add = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id) }

    add(() => setStage(1), 80)
    add(() => setStage(2), 340)

    // Entrada do drone com rAF (suave, 60fps real)
    add(() => {
      setStage(3)
      let pos = 0
      let last = null
      const speed = isMobile ? 1.05 : 1.7

      function tick(ts) {
        if (!last) last = ts
        const dt = Math.min(ts - last, 32)
        last = ts
        pos += speed * (dt / 16.67)
        pos  = Math.min(pos, 100)
        setDronePos(pos)
        if (pos < 100) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          add(() => { setStage(4); setHudVisible(true) }, 300)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, isMobile ? 1700 : 1500)

    // Progresso do scan
    add(() => {
      let p = 0
      const tickSpeed = isMobile ? 1.5 : 2.2
      const iv = setInterval(() => {
        p = Math.min(p + tickSpeed, 100)
        setProgress(p)
        setScanMsg(getScanMessage(p))
        if (p >= 100) {
          clearInterval(iv)
          add(() => setStage(5), 800)
          add(() => onComplete?.(), 1800)
        }
      }, 40)
      timers.push({ _iv: iv })
    }, isMobile ? 2500 : 2300)

    return () => {
      timers.forEach(t => t._iv ? clearInterval(t._iv) : clearTimeout(t))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [plantData, isMobile, onComplete])

  // ─── Posição do drone ─────────────────────────────────────────────────────────
  const getDrone = useCallback(() => {
    if (stage < 3) return { x: -58, y: 32, scale: 0.12, opacity: 0, tilt: -10 }

    if (stage === 3) {
      const t = dronePos / 100
      return {
        x:       lerp(-58, 0, easeOutQuart(t)),
        y:       lerp(32, -5, easeInOutQuad(t)),
        scale:   lerp(0.12, 1, easeOutCubic(t)),
        opacity: Math.min(t * 4, 1),
        tilt:    lerp(-14, 0, easeOutCubic(t)),
      }
    }

    if (stage === 4) {
      const now = Date.now()
      return {
        x:       Math.sin(now * 0.0006) * 2,
        y:       -5 + Math.sin(now * 0.0018) * 2.2,
        scale:   1,
        opacity: 1,
        tilt:    Math.sin(now * 0.001) * 1.8,
      }
    }

    return { x: 0, y: -45, scale: 0.5, opacity: 0, tilt: 0 }
  }, [stage, dronePos])

  const drone = getDrone()
  const rows  = isMobile ? 3 : 4

  if (!plantData.length) return <div className="splash splash-loading" />

  return (
    <div
      className={`splash stage-${stage}`}
      style={{
        transform: stage >= 4
          ? `scale(${1 + progress * 0.0012}) translateY(${progress * -0.03}px)`
          : "scale(1)",
      }}
    >
      {/* ── Céu ── */}
      <div className="bg-sky">
        <div className="sky-gradient" />
        <div className="sky-glow"     />
        <div className="sun"          />
        <div className="sun-rays"     />
        <div className="sun-halo"     />
      </div>

      {/* ── Chão em camadas ── */}
      <div className="ground-layers">
        <div className="ground-far"   />
        <div className="ground-mid"   />
        <div className="ground-near"  />
        <div className="ground-front" />
      </div>

      {/* ── Sulcos (perspectiva) ── */}
      <div className="furrows">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="furrow" style={{ "--fi": i }} />
        ))}
      </div>

      {/* ── Plantação ── */}
      <div className="plantation">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="plant-row"
            style={{ "--row-depth": (row + 1) / rows }}
          >
            {plantData
              .filter(p => p.row === row)
              .map(p => (
                <Plant
                  key={p.id}
                  plant={p}
                  grow={stage >= 2}
                  scanning={stage >= 4 && progress > p.depth * 55}
                />
              ))}
          </div>
        ))}
      </div>

      {/* ── Névoa de chão ── */}
      <div className="ground-mist" />

      {/* ── Drone ── */}
      {stage >= 3 && (
        <>
          <div
            className="drone-shadow"
            style={{
              transform: `translateX(calc(-50% + ${drone.x}vw)) scale(${drone.scale}, ${drone.scale * 0.3})`,
              opacity:   drone.opacity * 0.4,
            }}
          />
          <div
            className="drone-wrapper"
            style={{
              transform: `translate(calc(-50% + ${drone.x}vw), calc(-50% + ${drone.y}vh)) scale(${drone.scale}) rotate(${drone.tilt}deg)`,
              opacity:   drone.opacity,
            }}
          >
            <Drone hovering={stage === 4} />
          </div>
        </>
      )}

      {/* ── HUD ── */}
      <ScanHUD progress={progress} message={scanMsg} visible={hudVisible && stage === 4} />

      {/* ── Conclusão ── */}
      {progress >= 100 && stage >= 4 && (
        <div className="completion">
          <div className="completion-ring" />
          <div className="completion-check">✓</div>
          <div className="completion-text">ANÁLISE CONCLUÍDA</div>
        </div>
      )}

      {/* ── Fade out ── */}
      <div className={`fade-out ${stage === 5 ? "active" : ""}`} />
    </div>
  )
}