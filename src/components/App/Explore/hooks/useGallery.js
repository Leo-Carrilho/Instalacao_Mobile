import { useState } from "react"

export function useGallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState(null)

  const pickFromGallery = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.style.display = "none" // Esconde o input

      input.onchange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
          // Usuário cancelou
          resolve(null)
          return
        }

        // Limite de tamanho (10MB)
        if (file.size > 10 * 1024 * 1024) {
          const msg = "Imagem muito grande (máx 10MB)"
          setError(msg)
          reject(new Error(msg))
          return
        }

        const reader = new FileReader()

        reader.onload = () => {
          setSelectedImage(reader.result)
          resolve(reader.result)
        }

        reader.onerror = () => {
          reject(new Error("Erro ao ler imagem"))
        }

        reader.readAsDataURL(file)
      }

      input.oncancel = () => {
        // Usuário cancelou pelo botão "Cancelar" do sistema
        resolve(null)
      }

      // Adiciona o input ao DOM e dispara o clique
      document.body.appendChild(input)
      input.click()
      
      // Remove o input após o clique (opcional, mas bom para limpeza)
      setTimeout(() => {
        document.body.removeChild(input)
      }, 1000)
    })
  }

  const resetSelection = () => {
    setSelectedImage(null)
    setError(null)
  }

  return {
    selectedImage,
    error,
    pickFromGallery,
    resetSelection
  }
}