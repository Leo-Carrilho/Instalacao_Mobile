import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AppHeader from "../../components/App/Global/AppHeader"
import MenuBar from "../../components/App/Global/MenuBar"
import DiagnosticoTab from "../../components/App/Explore/Diagnostico/DiagnosticoTab"
import ClimaTab from "../../components/App/Explore/ClimaTab"
import DiarioTab from "../../components/App/Explore/DiarioTab"
import MapaTab from "../../components/App/Explore/MapaTab"
import EstoqueTab from "../../components/App/Explore/EstoqueTab"
import AtividadesTab from "../../components/App/Explore/AtividadesTab"
import ParticleBackground from "../../components/App/Home/ParticleBackground"
import "../../styles/App/Explore.css"

const tabs = [
  { id: "diagnostico", label: "Diagnóstico", icon: "🌱" },
  { id: "clima", label: "Clima", icon: "🌦️" },
  { id: "diario", label: "Diário", icon: "📒" },
  { id: "mapa", label: "Mapa", icon: "🗺️" },
  { id: "estoque", label: "Estoque", icon: "📦" },
  { id: "atividades", label: "Atividades", icon: "✅" }
]


export default function Explore() {
  const [activeTab, setActiveTab] = useState("diagnostico")

  const renderTab = () => {
    switch(activeTab) {
      case "diagnostico": 
         return <DiagnosticoTab active={activeTab === "diagnostico"} />
      case "clima": return <ClimaTab />
      case "diario": return <DiarioTab />
      case "mapa": return <MapaTab />
      case "estoque": return <EstoqueTab />
      case "atividades": return <AtividadesTab />
      default: return <DiagnosticoTab />
    }
  }

  return (
    <div className="explore-container">
       <ParticleBackground />
      <AppHeader title="Explorar" showNotification={true} />

      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      <MenuBar />
    </div>
  )
}