import { useEffect } from "react"

export default function CameraView({ videoRef, onCapture, onCancel }) {
  
  useEffect(() => {
    // Esconder o menu bar
    const menuBar = document.querySelector('.menu-bar')
    if (menuBar) {
      menuBar.style.display = 'none'
    }
    
    // Prevenir scroll
    document.body.style.overflow = 'hidden'
    
    // Iniciar a câmera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Erro ao acessar câmera:", err)
      }
    }
    
    startCamera()
    
    return () => {
      // Restaurar menu bar
      const menuBar = document.querySelector('.menu-bar')
      if (menuBar) {
        menuBar.style.display = 'flex'
      }
      
      // Restaurar scroll
      document.body.style.overflow = 'auto'
      
      // Parar a câmera
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [videoRef])

  return (
    <div className="camera-view-container">
      {/* Header com apenas o título */}
      <div className="camera-header">
        <span>Tirar Foto</span>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
      />

      {/* Botão de capturar - GRANDE no centro */}
      <button className="camera-capture-btn" onClick={onCapture}>
        <span className="material-symbols-outlined">photo_camera</span>
      </button>
      
      {/* Botão de voltar - pequeno no canto */}
      <button className="camera-back-btn" onClick={onCancel}>
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
    </div>
  )
}