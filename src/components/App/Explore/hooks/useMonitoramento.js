import { useState } from "react";

const API_MONITORAMENTO = "https://tccamsamericana-monitoramento-plantacao.hf.space/analyze";

export function useMonitoramento() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analisar = async (file) => {
    if (!file) {
      setError("Nenhum arquivo enviado");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_MONITORAMENTO, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      const data = await response.json();

      // melhora pro front
      const imageSrc = `data:image/jpeg;base64,${data.overlay_image}`;

      setResult({
        ...data,
        imageSrc,
      });

    } catch (err) {
      console.error("Erro:", err);
      setError("Erro ao analisar imagem");
    } finally {
      setLoading(false);
    }
  };

  return { analisar, result, loading, error };
}