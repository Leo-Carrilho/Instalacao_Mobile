export default function ImagePreview({ image, onBack, onAnalyze }) {
  return (
    <div className="preview-container">
      <div className="preview-content">
        <h2>Pré-visualização</h2>
        
        <div className="preview-image-wrapper">
          <img
            src={image}
            alt="Imagem selecionada"
            className="preview-image"
          />
        </div>

        <div className="preview-actions">
          <button className="btn back" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            Nova Imagem
          </button>
          
          <button className="btn analyze" onClick={onAnalyze}>
            <span className="material-symbols-outlined">analytics</span>
            Analisar com IA
          </button>
        </div>
      </div>
    </div>
  )
}