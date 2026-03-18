// components/Home/ExploreModules.jsx
const modules = [
  { path: "/explore", icon: "eco", label: "Diagnóstico", sublabel: "Análise de plantas", type: "diagnose" },
  { path: "/explore", icon: "cloud", label: "Clima", sublabel: "Previsão 7 dias", type: "weather" },
  { path: "/explore", icon: "menu_book", label: "Diário", sublabel: "Registros da plantação", type: "diary" },
  { path: "/explore", icon: "map", label: "Mapa", sublabel: "Visualização 3D", type: "map" },
  { path: "/explore", icon: "inventory", label: "Estoque", sublabel: "Insumos e materiais", type: "stock" },
  { path: "/explore", icon: "assessment", label: "Relatórios", sublabel: "Dados e métricas", type: "reports" }
]

export default function ExploreModules({ onNavigate }) {
  return (
    <section className="explore-section">
      <h2 className="section-title">
        <span className="material-symbols-outlined">explore</span>
        Módulos do Sistema
      </h2>

      <div className="explore-grid">
        {modules.map((module) => (
          <button
            key={module.path}
            className="explore-card glass"
            onClick={() => onNavigate(module.path)}
          >
            <div className={`explore-icon ${module.type}`}>
              <span className="material-symbols-outlined">{module.icon}</span>
              <div className="icon-glow"></div>
            </div>
            <span className="explore-label">{module.label}</span>
            <span className="explore-sublabel">{module.sublabel}</span>
          </button>
        ))}
      </div>
    </section>
  )
}