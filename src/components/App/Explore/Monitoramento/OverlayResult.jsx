import React from "react";
import styles from "../../../../styles/App/MonitoramentoView.module.css";

export default function OverlayResult({ result }) {
  if (!result) return null;

  return (
    <>
      <div className={styles.cardHeader}>
        <span>🖼️ Resultado Processado</span>
      </div>
      <div className={styles.imageWrapper}>
        <img
          src={`data:image/jpeg;base64,${result.overlay_image}`}
          alt="Análise da plantação"
          className={styles.image}
        />
      </div>
    </>
  );
}