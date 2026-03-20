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
  const [loadingAction, setLoadingAction] = useState(false);

  // ✅ SAFE FALLBACKS (EVITA QUEBRAR TUDO)
  const safeCamera = camera || {
    videoRef: { current: null },
    startCamera: async () => {},
    stopCamera: () => {},
    switchCamera: () => {},
    capturePhoto: () => null,
    resetCapture: () => {},
    facingMode: "environment"
  };

  const safeDiagnostico = diagnostico || {
    diagnosisResult: null,
    history: [],
    analyzeImage: async () => {},
    resetDiagnosis: () => {}
  };

  const safeGallery = gallery || {
    pickFromGallery: async () => null,
    resetSelection: () => {}
  };

  // ==============================
  // CONTROLE DA CÂMERA
  // ==============================
  

  // ==============================
  // CAPTURAR FOTO
  // ==============================
  const handleCapture = () => {
    try {
      // Verifica se a câmera está ativa
      if (!safeCamera.isCameraActive) {
        setLocalError("Câmera não está ativa. Tente novamente.")
        return
      }

      const captured = safeCamera.capturePhoto?.()

      if (!captured) {
        throw new Error("Imagem não capturada")
      }

      setImage(captured)
      setStep("preview")
    } catch (err) {
      console.error(err)
      setLocalError("Erro ao capturar imagem: " + err.message)
    }
  }

  // ==============================
  // GALERIA
  // ==============================
  const handleGalleryPick = async () => {
    try {
      setLoadingAction(true);

      const imageData = await safeGallery.pickFromGallery();

      if (!imageData) {
        setLoadingAction(false);
        return;
      }

      setImage(imageData);
      setStep("preview");
    } catch (error) {
      console.error(error);
      setLocalError("Erro ao selecionar imagem da galeria");
    } finally {
      setLoadingAction(false);
    }
  };

  // ==============================
  // COMPRESSÃO DE IMAGEM
  // ==============================
  const compressImage = async (base64) => {
    const img = new Image();
    img.src = base64;

    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const MAX_WIDTH = 800;
    const scale = MAX_WIDTH / img.width;

    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.7);
  };

  // ==============================
  // ANALISAR IMAGEM
  // ==============================
  const handleAnalyze = async () => {
    setStep("analysis");

    try {
      const compressed = await compressImage(image);

      const response = await fetch(compressed);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const apiResponse = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error("Erro na API");
      }

      const data = await apiResponse.json();

      await safeDiagnostico.analyzeImage?.(data);

      setStep("result");
    } catch (err) {
      console.error(err);
      setLocalError("Erro ao analisar imagem");
      setStep("start");
    }
  };

  // ==============================
  // RESET
  // ==============================
  const handleReset = () => {
    setImage(null);
    setLocalError(null);
    setStep("start");

    safeCamera.stopCamera?.();
    safeCamera.resetCapture?.();
    safeGallery.resetSelection?.();
    safeDiagnostico.resetDiagnosis?.();
  };

  // ==============================
  // ERRO UI
  // ==============================
  if (localError) {
    return (
      <div className="diagnostic-container">
        <div className="empty-state">
          <span className="material-symbols-outlined error-icon">error</span>
          <h3>Erro</h3>
          <p>{localError}</p>

          <button className="empty-action-btn" onClick={handleReset}>
            <span>Tentar novamente</span>
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // CAMERA
  // ==============================
  if (step === "camera") {
    if (!safeCamera.videoRef) {
      return <p>Erro ao inicializar câmera</p>;
    }

    return (
      <CameraView
        videoRef={safeCamera.videoRef}
        onCapture={handleCapture}
        onCancel={handleReset}
        startCamera={safeCamera.startCamera}   // 🔥 ADD
        stopCamera={safeCamera.stopCamera}     // 🔥 ADD
      />
    );
  }

  // ==============================
  // PREVIEW
  // ==============================
  if (step === "preview") {
    return (
      <ImagePreview
        image={image}
        onBack={handleReset}
        onAnalyze={handleAnalyze}
      />
    );
  }

  // ==============================
  // ANALISANDO
  // ==============================
  if (step === "analysis") {
    return <AnalysisLoader />;
  }

  // ==============================
  // RESULTADO
  // ==============================
  if (step === "result") {
    return (
      <DiagnosisResult
        result={safeDiagnostico.diagnosisResult}
        onRestart={handleReset}
        history={safeDiagnostico.history || []}
      />
    );
  }

  // ==============================
  // TELA INICIAL
  // ==============================
  return (
    <div className="diagnostic-container">
      <div className="diagnostic-header">
        <h2>Diagnóstico de Doenças</h2>
        <p className="header-subtitle">
          Tire uma foto ou envie uma imagem da sua plantação
        </p>
      </div>

      <div className="options-grid">
        {/* CAMERA */}
        <div
          className="option-card camera"
          onClick={() => setStep("camera")}
        >
          <span className="material-symbols-outlined">photo_camera</span>
          <h3>Tirar Foto</h3>
          <p>Usar câmera do dispositivo</p>
        </div>

        {/* GALERIA */}
        <div
          className="option-card gallery"
          onClick={handleGalleryPick}
        >
          <span className="material-symbols-outlined">photo_library</span>
          <h3>Galeria</h3>
          <p>Selecionar imagem existente</p>
        </div>
      </div>

      {loadingAction && (
        <p className="text-secondary">Abrindo galeria...</p>
      )}

      {/* HISTÓRICO */}
      {safeDiagnostico.history?.length > 0 && (
        <div className="history-section">
          <h4>
            <span className="material-symbols-outlined">history</span>
            Recentes
          </h4>

          <div className="history-grid">
            {safeDiagnostico.history.slice(0, 4).map((item) => (
              <div key={item.id} className="history-item">
                <h5>{item.disease}</h5>
                <p>{item.date}</p>
                <span>{item.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}