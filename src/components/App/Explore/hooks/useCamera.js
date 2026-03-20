import { useState, useRef, useEffect } from "react"

export function useCamera() {
  const [stream, setStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [facingMode, setFacingMode] = useState("environment")
  const [error, setError] = useState(null)
  const videoRef = useRef(null)

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      setStream(mediaStream)
      setIsCameraActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        // Garante que o vídeo comece a tocar
        await videoRef.current.play()
      }
    } catch (err) {
      console.error("Erro na câmera:", err)
      setError("Não foi possível acessar a câmera")
      throw err
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
      setStream(null)
      setIsCameraActive(false)
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const switchCamera = async () => {
    stopCamera()
    setFacingMode(prev => prev === "environment" ? "user" : "environment")
    // Pequeno delay para garantir que a câmera anterior foi liberada
    setTimeout(() => {
      startCamera()
    }, 300)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraActive) {
      console.error("Câmera não está ativa")
      return null
    }

    const video = videoRef.current
    const canvas = document.createElement("canvas")
    
    // Usa as dimensões reais do vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext("2d")
    
    // Se for câmera frontal, espelha a imagem
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Volta ao normal se tiver espelhado
    if (facingMode === "user") {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    
    const imageData = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageData)
    
    return imageData
  }

  const resetCapture = () => {
    setCapturedImage(null)
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Efeito para reiniciar câmera quando facingMode mudar
  useEffect(() => {
    if (isCameraActive) {
      stopCamera()
      startCamera()
    }
  }, [facingMode])

  return {
    videoRef,
    isCameraActive,
    capturedImage,
    facingMode,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    resetCapture
  }
}