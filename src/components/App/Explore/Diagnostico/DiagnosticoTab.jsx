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

  // Log para debug - mostra o que está recebendo
  useEffect(() => {
    console.log("DiagnosticoTab - Props recebidas:", {
      camera: !!camera,
      cameraHistory: camera?.history,
      diagnostico: !!diagnostico,
      diagnosticoHistory: diagnostico?.history,
      gallery: !!gallery
    });
  }, [camera, diagnostico, gallery]);

  // Se as props não existirem, mostra erro
  if (!camera || !diagnostico || !gallery) {
    return (
      <div className="diagnostic-container">
        <div className="empty-state">
          <span className="material-symbols-outlined">error</span>
          <h3>Erro de configuração</h3>
          <p>Módulos necessários não foram carregados.</p>
          <button onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Efeito para iniciar/parar câmera baseado no step
  useEffect(() => {
    if (step === "camera") {
      camera.startCamera();
    } else {
      camera.stopCamera();
    }
  }, [step]);

  const handleCapture = () => {
    const capturedImage = camera.capturePhoto();
    if (capturedImage) {
      setImage(capturedImage);
      setStep("preview");
    }
  };

  const handleGalleryPick = async () => {
    try {
      const imageData = await gallery.pickFromGallery();
      setImage(imageData);
      setStep("preview");
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    }
  };

  const handleAnalyze = async () => {
    setStep("analysis");
    
    try {
      const blob = await fetch(image).then(res => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");
      
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      await diagnostico.analyzeImage(data);
      setStep("result");
    } catch (err) {
      console.error("Erro na análise:", err);
      setStep("result");
    }
  };

  const handleReset = () => {
    setImage(null);
    camera.resetCapture();
    gallery.resetSelection();
    diagnostico.resetDiagnosis();
    setStep("start");
  };

  // Renderização condicional
  if (step === "camera") {
    return (
      <CameraView
        videoRef={camera.videoRef}
        onCapture={handleCapture}
        onCancel={handleReset}
        onSwitchCamera={camera.switchCamera}
        facingMode={camera.facingMode}
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
        result={diagnostico.diagnosisResult}
        onRestart={handleReset}
        history={diagnostico.history}
      />
    );
  }

  // Step "start"
  return (
    <div className="diagnostic-container">
      <div className="diagnostic-header">
        <h2>Diagnóstico de Doenças</h2>
        <p className="header-subtitle">
          Selecione uma opção para diagnosticar sua plantação
        </p>
      </div>

      <div className="options-grid">
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
      {diagnostico.history && diagnostico.history.length > 0 && (
        <div className="history-section">
          <h4 className="history-title">
            <span className="material-symbols-outlined">history</span>
            Diagnósticos Recentes
          </h4>
          <div className="history-grid">
            {diagnostico.history.slice(0, 4).map((item) => (
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
      )}
    </div>
  );
}