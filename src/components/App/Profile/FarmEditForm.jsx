// components/App/Profile/FarmEditForm.jsx
import { useState } from "react"
import { motion } from "framer-motion"

const FarmEditForm = ({ farmData, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    name: farmData?.name || "",
    area_total: farmData?.area_total || "",
    plantacao: farmData?.plantacao || "",
    municipio: farmData?.municipio || "",
    uf: farmData?.uf || "",
    bairro: farmData?.bairro || "",
    cep: farmData?.cep || "",
    data_aquisicao: farmData?.data_aquisicao || "",
    telefone: farmData?.telefone || "",
    tipo_proprietario: farmData?.tipo_proprietario || "Proprietário"
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome da fazenda é obrigatório"
    }
    
    if (!formData.area_total) {
      newErrors.area_total = "Área total é obrigatória"
    } else if (isNaN(formData.area_total) || parseFloat(formData.area_total) <= 0) {
      newErrors.area_total = "Área deve ser um número positivo"
    }
    
    if (!formData.municipio.trim()) {
      newErrors.municipio = "Município é obrigatório"
    }
    
    if (!formData.uf.trim()) {
      newErrors.uf = "UF é obrigatória"
    } else if (formData.uf.length > 2) {
      newErrors.uf = "Use apenas a sigla (ex: SP)"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const ufList = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  const culturaList = [
    "Soja", "Milho", "Café", "Cana-de-açúcar", "Algodão", 
    "Trigo", "Arroz", "Feijão", "Pastagem", "Eucalipto",
    "Laranja", "Outros"
  ]

  return (
    <motion.div 
      className="profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="card-corner"></div>
      
      <div className="card-header">
        <div className="header-icon">
          <span className="material-symbols-outlined">edit_note</span>
          <div className="icon-glow"></div>
        </div>
        <h3>Editar Fazenda</h3>
        <div className="header-line"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          {/* Nome da Fazenda */}
          <div className="input-group">
            <span className="material-symbols-outlined">agriculture</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome da Fazenda"
              className={`tech-input ${errors.name ? 'error' : ''}`}
              disabled={saving}
            />
            <div className="input-glow"></div>
          </div>
          {errors.name && <span className="error-message">{errors.name}</span>}

          {/* Área Total e Cultura */}
          <div className="input-row-tech">
            <div className="input-group small">
              <span className="material-symbols-outlined">square_foot</span>
              <input
                type="number"
                name="area_total"
                value={formData.area_total}
                onChange={handleChange}
                placeholder="Área total (ha)"
                className={`tech-input ${errors.area_total ? 'error' : ''}`}
                step="0.1"
                min="0"
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>

            <div className="input-group small">
              <span className="material-symbols-outlined">grass</span>
              <select
                name="plantacao"
                value={formData.plantacao}
                onChange={handleChange}
                className="tech-select"
                disabled={saving}
              >
                <option value="">Cultura</option>
                {culturaList.map(cultura => (
                  <option key={cultura} value={cultura}>{cultura}</option>
                ))}
              </select>
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Localização */}
          <div className="input-row-tech">
            <div className="input-group small">
              <span className="material-symbols-outlined">location_city</span>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                placeholder="Município"
                className={`tech-input ${errors.municipio ? 'error' : ''}`}
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>

            <div className="input-group small">
              <span className="material-symbols-outlined">flag</span>
              <select
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className={`tech-select ${errors.uf ? 'error' : ''}`}
                disabled={saving}
              >
                <option value="">UF</option>
                {ufList.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Bairro e CEP */}
          <div className="input-row-tech">
            <div className="input-group small">
              <span className="material-symbols-outlined">map</span>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro/Distrito"
                className="tech-input"
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>

            <div className="input-group small">
              <span className="material-symbols-outlined">mail</span>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="CEP"
                className="tech-input"
                maxLength="9"
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Telefone e Data de Aquisição */}
          <div className="input-row-tech">
            <div className="input-group small">
              <span className="material-symbols-outlined">call</span>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="tech-input"
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>

            <div className="input-group small">
              <span className="material-symbols-outlined">calendar_month</span>
              <input
                type="date"
                name="data_aquisicao"
                value={formData.data_aquisicao}
                onChange={handleChange}
                className="tech-input"
                disabled={saving}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Tipo de Proprietário */}
          <div className="input-group">
            <span className="material-symbols-outlined">badge</span>
            <select
              name="tipo_proprietario"
              value={formData.tipo_proprietario}
              onChange={handleChange}
              className="tech-select"
              disabled={saving}
            >
              <option value="Proprietário">Proprietário</option>
              <option value="Arrendatário">Arrendatário</option>
              <option value="Parceiro">Parceiro</option>
              <option value="Comodatário">Comodatário</option>
              <option value="Outros">Outros</option>
            </select>
            <div className="input-glow"></div>
          </div>

          {/* Botões de ação */}
          <div className="edit-form-actions">
            <button 
              type="button" 
              className="action-btn cancel-btn"
              onClick={onCancel}
              disabled={saving}
            >
              <span className="material-symbols-outlined">close</span>
              Cancelar
            </button>
            
            <button 
              type="submit" 
              className="action-btn save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="btn-spinner"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="info-note">
        <span className="material-symbols-outlined">info</span>
        <p>Preencha os dados da sua fazenda para um monitoramento mais preciso</p>
      </div>

      <style jsx>{`
        .error-message {
          color: #ff4d4d;
          font-size: 12px;
          margin-top: -12px;
          margin-bottom: 8px;
          display: block;
          padding-left: 16px;
        }
        
        .tech-input.error,
        .tech-select.error {
          border-color: #ff4d4d;
        }
        
        .edit-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: none;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
        }
        
        .cancel-btn {
          background: rgba(255, 68, 68, 0.1);
          border-color: rgba(255, 68, 68, 0.3);
          color: #ff4444;
        }
        
        .cancel-btn:hover {
          background: rgba(255, 68, 68, 0.2);
          transform: translateY(-2px);
        }
        
        .save-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: #000;
          border: none;
        }
        
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px var(--primary-glow);
        }
        
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}

export default FarmEditForm