// components/Home/ActivitiesList.jsx
export default function ActivitiesList({ hasFarm, onViewAll, onRegister }) {
  if (!hasFarm) {
    return (
      <div className="empty-state glass">
        <div className="empty-icon">
          <span className="material-symbols-outlined">inbox</span>
          <div className="empty-icon-ring"></div>
        </div>
        <h3>Nenhuma atividade registrada</h3>
        <p>Cadastre uma fazenda para começar a monitorar suas atividades em tempo real</p>
        <button className="empty-action-btn" onClick={onRegister}>
          <span className="material-symbols-outlined">add</span>
          <span>Cadastrar Fazenda</span>
          <div className="btn-glow"></div>
        </button>
      </div>
    )
  }

  return (
    <div className="activities-list">
      <div className="activity-card glass">
        <div className="activity-icon voo">
          <span className="material-symbols-outlined">flight_takeoff</span>
          <div className="icon-pulse"></div>
        </div>
        <div className="activity-content">
          <div className="activity-header">
            <h4 className="activity-title">Voo de Mapeamento</h4>
            <span className="activity-time">2h atrás</span>
          </div>
          <p className="activity-description">Setor A12 • Imagens multiespectrais</p>
          <div className="activity-metrics">
            <div className="metric">
              <span className="material-symbols-outlined">straighten</span>
              <span>45.5 ha</span>
            </div>
            <div className="metric">
              <span className="material-symbols-outlined">photo_camera</span>
              <span>124 imagens</span>
            </div>
            <div className="metric">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Concluído</span>
            </div>
          </div>
        </div>
      </div>

      <div className="activity-card glass">
        <div className="activity-icon relatorio">
          <span className="material-symbols-outlined">analytics</span>
          <div className="icon-pulse"></div>
        </div>
        <div className="activity-content">
          <div className="activity-header">
            <h4 className="activity-title">Análise de Umidade</h4>
            <span className="activity-time">1 dia atrás</span>
          </div>
          <p className="activity-description">Setor B3 • Estresse hídrico detectado</p>
          <div className="activity-metrics">
            <div className="metric">
              <span className="material-symbols-outlined">water_drop</span>
              <span>32% umidade</span>
            </div>
            <div className="metric warning">
              <span className="material-symbols-outlined">warning</span>
              <span>Atenção necessária</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}