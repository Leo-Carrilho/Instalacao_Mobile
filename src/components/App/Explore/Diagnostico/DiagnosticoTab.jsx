import { useState, useEffect } from "react";
import CameraView from "./CameraView";
import ImagePreview from "./ImagePreview";
import AnalysisLoader from "./AnalysisLoader";
import DiagnosisResult from "./DiagnosisResult";
import "../../../../styles/App/Diagnostico.css";

const API_URL = "https://octaviorezendesilva-api-doencas-soja.hf.space/predict";

export default function DiagnosticoTab({ camera, diagnostico, gallery }) {
  const [step, setStep] = useState("start");
  const [image, setImage] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Log para debug
  useEffect(() => {
    console.log("📥 DiagnosticoTab - Props recebidas:", {
      camera: !!camera,
      diagnostico: !!diagnostico,
      diagnosticoHistory: diagnostico?.history?.length || 0,
      gallery: !!gallery
    });

    // Verifica se as props são válidas
    if (!camera || !diagnostico || !gallery) {
      console.error("❌ Props inválidas, usando valores padrão");
      // Não setamos erro, apenas mostramos o componente com valores padrão
    }
  }, [camera, diagnostico, gallery]);

  // Se as props não existirem, usa valores padrão
  const safeCamera = camera || {
    videoRef: { current: null },
    startCamera: () => {},
    stopCamera: () => {},
    capturePhoto: () => null,
    resetCapture: () => {},
    switchCamera: () => {},
    facingMode: "environment"
  };

  const safeDiagnostico = diagnostico || {
    diagnosisResult: null,
    isAnalyzing: false,
    history: [],
    analyzeImage: async () => {},
    resetDiagnosis: () => {}
  };

  const safeGallery = gallery || {
    pickFromGallery: async () => { throw new Error("Gallery não disponível"); },
    resetSelection: () => {}
  };

  // Efeito para iniciar/parar câmera baseado no step
  useEffect(() => {
    if (step === "camera") {
      try {
        safeCamera.startCamera();
      } catch (err) {
        console.error("Erro ao iniciar câmera:", err);
      }
    } else {
      try {
        safeCamera.stopCamera();
      } catch (err) {
        console.error("Erro ao parar câmera:", err);
      }
    }
  }, [step, safeCamera]);

  const handleCapture = () => {
    try {
      const capturedImage = safeCamera.capturePhoto();
      if (capturedImage) {
        setImage(capturedImage);
        setStep("preview");
      }
    } catch (err) {
      console.error("Erro ao capturar foto:", err);
      setLocalError("Erro ao capturar imagem");
    }
  };

  const handleGalleryPick = async () => {
    try {
      const imageData = await safeGallery.pickFromGallery();
      if (imageData) {
        setImage(imageData);
        setStep("preview");
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      setLocalError("Erro ao selecionar imagem da galeria");
    }
  };

  const handleAnalyze = async () => {
    setStep("analysis");
    
    try {
      // Converter base64 para blob
      const response = await fetch(image);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");
      
      const apiResponse = await fetch(API_URL, {
        method: "POST",
        body: formData
      });
      
      const data = await apiResponse.json();
      
      // Usar o hook de diagnóstico para processar o resultado
      await safeDiagnostico.analyzeImage(data);
      setStep("result");
    } catch (err) {
      console.error("Erro na análise:", err);
      setStep("result");
    }
  };

  const handleReset = () => {
    try {
      setImage(null);
      safeCamera.resetCapture();
      safeGallery.resetSelection();
      safeDiagnostico.resetDiagnosis();
      setStep("start");
      setLocalError(null);
    } catch (err) {
      console.error("Erro ao resetar:", err);
    }
  };

  // Se houver erro local, mostra mensagem
  if (localError) {
    return (
      <div className="diagnostic-container">
        <div className="empty-state">
          <img 
            src="/assets/icons/icon-droneP.png" 
            alt="Erro"
            style={{ width: '80px', height: '80px', marginBottom: '20px', opacity: 0.5 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
          <h3>Erro</h3>
          <p>{localError}</p>
          <button 
            className="empty-action-btn"
            onClick={handleReset}
          >
            <span>Tentar novamente</span>
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
    );
  }

  // Renderização condicional baseada no step
  if (step === "camera") {
    return (
      <CameraView
        videoRef={safeCamera.videoRef}
        onCapture={handleCapture}
        onCancel={handleReset}
        onSwitchCamera={safeCamera.switchCamera}
        facingMode={safeCamera.facingMode}
      />
    );
  }

  if (step === "preview") {
    return (
      <ImagePreview
        image={image}
        onBack={handleReset}
        onAnalyze={handleAnalyze}
      />
    );
  }

  if (step === "analysis") {
    return <AnalysisLoader />;
  }

  if (step === "result") {
    return (
      <DiagnosisResult
        result={safeDiagnostico.diagnosisResult || null}
        onRestart={handleReset}
        history={safeDiagnostico.history || []}
      />
    );
  }

  // Step "start" - Tela inicial
  return (
    <div className="diagnostic-container">
      <div className="diagnostic-header">
        <h2>Diagnóstico de Doenças</h2>
        <p className="header-subtitle">
          Selecione uma opção para diagnosticar sua plantação
        </p>
      </div>

      <div className="options-grid">
        {/* Card Tirar Foto */}
        <div className="option-card camera" onClick={() => setStep("camera")}>
          <div className="card-glow"></div>
          <div className="option-icon">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
          <h3 className="option-title">Tirar Foto</h3>
          <p className="option-description">
            Use a câmera para fotografar sua plantação
          </p>
        </div>

        {/* Card Galeria */}
        <div className="option-card gallery" onClick={handleGalleryPick}>
          <div className="card-glow"></div>
          <div className="option-icon">
            <span className="material-symbols-outlined">photo_library</span>
          </div>
          <h3 className="option-title">Galeria</h3>
          <p className="option-description">
            Escolha uma foto do seu dispositivo
          </p>
        </div>
      </div>

      {/* Histórico recente */}
      {safeDiagnostico.history && safeDiagnostico.history.length > 0 ? (
        <div className="history-section">
          <h4 className="history-title">
            <span className="material-symbols-outlined">history</span>
            Diagnósticos Recentes
          </h4>
          <div className="history-grid">
            {safeDiagnostico.history.slice(0, 4).map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-info">
                  <h5>{item.disease}</h5>
                  <p>{item.date}</p>
                  <span className="history-confidence">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="history-section empty">
          <p className="text-secondary">Nenhum diagnóstico recente</p>
        </div>
      )}
    </div>
  );
}