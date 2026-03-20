import { useEffect, useState } from "react"

export default function CameraView({
  videoRef,
  onCapture,
  onCancel,
  startCamera,
  stopCamera
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let interval

    const init = async () => {
      try {
        await startCamera?.()

        interval = setInterval(() => {
          if (
            videoRef.current &&
            videoRef.current.readyState >= 2
          ) {
            setIsLoading(false)
            clearInterval(interval)
          }
        }, 100)

      } catch (err) {
        console.error("Erro ao iniciar câmera:", err)
      }
    }

    init()

    return () => {
      stopCamera?.()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="camera-view-container">

      <div className="camera-header">
        <span>Tirar Foto</span>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-video"
      />

      {isLoading && (
        <div className="camera-loading">
          <p>Iniciando câmera...</p>
        </div>
      )}

      {!isLoading && (
        <button
          className="camera-capture-btn"
          onClick={onCapture}
        >
          <span className="material-symbols-outlined">photo_camera</span>
        </button>
      )}

      <button
        className="camera-back-btn"
        onClick={onCancel}
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
    </div>
  )
}