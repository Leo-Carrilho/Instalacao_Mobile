import React from "react";
import styles from "../../../../styles/App/MonitoramentoView.module.css";

export default function UploadImage({ onSelect }) {
  return (
    <div className={styles.uploadArea}>
      <label className={styles.uploadLabel}>
        <span className={styles.uploadIcon}>📤</span>
        <span className={styles.uploadText}>Selecionar imagem da plantação</span>
        <span className={styles.uploadHint}>PNG, JPG • Até 10MB</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onSelect(e.target.files[0])}
          className={styles.uploadInput}
        />
      </label>
    </div>
  );
}