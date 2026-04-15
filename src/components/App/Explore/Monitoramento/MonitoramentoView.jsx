import React, { useState } from "react";
import { useMonitoramento } from "../hooks/useMonitoramento";
import UploadImage from "./UploadImage";
import MetricsPanel from "./MetricsPanel";
import OverlayResult from "./OverlayResult";
import styles from "../../../../styles/App/MonitoramentoView.module.css";

export default function MonitoramentoView() {
  const { analisar, result, loading, error } = useMonitoramento(); // assumindo que o hook pode retornar 'error'
  const [image, setImage] = useState(null);

  const handleSelect = (file) => {
    setImage(URL.createObjectURL(file));
    analisar(file);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Monitoramento de Plantação</h2>

      <UploadImage onSelect={handleSelect} />

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span>Analisando imagem...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <span>⚠️</span>
          <span className={styles.errorMessage}>{error}</span>
        </div>
      )}

      {image && !loading && !error && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>Imagem Original</div>
          <div className={styles.imageWrapper}>
            <img
              src={image}
              alt="original"
              className={styles.image}
            />
          </div>
        </div>
      )}

      {result && !loading && !error && (
        <div className={styles.resultGrid}>
          <div className={styles.card}>
            <OverlayResult result={result} />
          </div>
          <div className={styles.card}>
            <MetricsPanel result={result} />
          </div>
        </div>
      )}
    </div>
  );
}