import React from "react";
import styles from "../../../../styles/App/MonitoramentoView.module.css";

export default function MetricsPanel({ result }) {
  if (!result) return null;

  const isAligned = result.alignment?.aligned;
  const scoreValue = parseFloat(result.failure_score) || 0;
  const uniformityValue = parseFloat(result.uniformity) || 0;
  const densityFormatted = result.density != null ? parseFloat(result.density).toFixed(2) : '—';

  return (
    <>
      <div className={styles.cardHeader}>
        <span>📊 Análise da Plantação</span>
      </div>

      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>🌱</span> Densidade
          </div>
          <div className={styles.metricValue}>
            {densityFormatted}
            <span className={styles.metricUnit}>plantas/m²</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>⚠️</span> Falhas
          </div>
          <div className={styles.metricValue}>
            {result.failures}
            <span className={styles.metricUnit}>ocorrências</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>📈</span> Score de falha
          </div>
          <div className={styles.metricValue}>
            {scoreValue.toFixed(1)}
            <span className={styles.metricUnit}>/10</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(scoreValue * 10, 100)}%` }}
            />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>🔄</span> Uniformidade
          </div>
          <div className={styles.metricValue}>
            {uniformityValue.toFixed(1)}
            <span className={styles.metricUnit}>%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${uniformityValue}%` }}
            />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>📐</span> Alinhamento
          </div>
          <div className={styles.metricValue} style={{ fontSize: "1.2rem", marginTop: "0.3rem" }}>
            <span className={`${styles.alignmentBadge} ${isAligned ? styles.aligned : styles.notAligned}`}>
              {isAligned ? "✓ Alinhado" : "⚠ Desalinhado"}
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>
            <span>📏</span> Variação
          </div>
          <div className={styles.metricValue}>
            {result.alignment?.variation || "—"}
            <span className={styles.metricUnit}>px</span>
          </div>
        </div>
      </div>
    </>
  );
}