import { useState } from "react";
import ExploreTabs from "./ExploreTabs";
import DiagnosticoTab from "./DiagnosticoTab";
import ClimaTab from "./ClimaTab";
import DiarioTab from "./DiarioTab";
import MapaTab from "./MapaTab";
import EstoqueTab from "./EstoqueTab";
import { useFarmData } from "../../hooks/useFarmData";
import { useCamera } from "../../hooks/useCamera";
import { useDiagnostico } from "../../hooks/useDiagnostico";
import { useGallery } from "../../hooks/useGallery";
import "../../../styles/App/Explore.css";

export default function ExploreView() {
  const [activeTab, setActiveTab] = useState("clima");
  
  // Inicializa todos os hooks diretamente
  const farmData = useFarmData();
  const camera = useCamera();
  const diagnostico = useDiagnostico();
  const gallery = useGallery();

  // Log para debug
  console.log("ExploreView - Hooks:", {
    farmData: !!farmData,
    camera: !!camera,
    diagnostico: !!diagnostico,
    gallery: !!gallery,
    diagnosticoHistory: diagnostico?.history
  });

  return (
    <div className="explore-container">
      <ExploreTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="tab-content">
        {activeTab === "clima" && (
          <ClimaTab farmData={farmData?.farmData || null} />
        )}
        
        {activeTab === "diagnostico" && (
          <DiagnosticoTab 
            camera={camera}
            diagnostico={diagnostico}
            gallery={gallery}
          />
        )}
        
        {activeTab === "diario" && (
          <DiarioTab />
        )}
        
        {activeTab === "mapa" && (
          <MapaTab />
        )}
        
        {activeTab === "estoque" && (
          <EstoqueTab />
        )}
      </div>
    </div>
  );
}