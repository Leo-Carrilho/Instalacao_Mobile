import { useState, useEffect } from "react"
import { useFarm } from "./hooks/useFarm"
import "../../../styles/App/Explore.css"

const API_KEY = "d77668673cf15b7d0488f921007cbd6b"

export default function ClimaTab() {
  const { farmData, loading: farmLoading } = useFarm()

  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = async () => {
    if (!farmData) {
      setError("Nenhuma fazenda cadastrada")
      setLoading(false)
      return
    }

    if (!farmData.municipio || !farmData.uf) {
      setError("Localização da fazenda incompleta")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const city = encodeURIComponent(farmData.municipio)
      const state = farmData.uf

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},BR&appid=${API_KEY}&units=metric&lang=pt_br`
      )

      const data = await response.json()

      if (data.cod === 200) {
        setWeatherData({
          city: data.name,
          state,
          farmName: farmData.name,

          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          tempMin: Math.round(data.main.temp_min),
          tempMax: Math.round(data.main.temp_max),

          humidity: data.main.humidity,
          pressure: data.main.pressure,

          windSpeed: data.wind.speed,
          windDeg: data.wind.deg,
          windGust: data.wind.gust || 0,

          rain: data.rain?.["1h"] || 0,

          description: data.weather[0].description,
          icon: data.weather[0].icon,
          clouds: data.clouds.all,

          visibility: data.visibility / 1000,

          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),

          date: new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
        })
      } else {
        setError("Cidade não encontrada")
      }
    } catch (err) {
      console.error(err)
      setError("Erro ao buscar clima")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!farmLoading) fetchWeather()
  }, [farmData, farmLoading])

  const getWindDirection = (deg) => {
    const dirs = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"]
    return dirs[Math.round(deg / 45) % 8]
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const retry = () => fetchWeather()

  // LOADING
  if (loading || farmLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>cloud</span>
          </div>
          <h3 style={styles.loadingTitle}>Buscando clima</h3>
          <p style={styles.loadingText}>
            {farmData ? `Obtendo dados para ${farmData.municipio}...` : 'Carregando...'}
          </p>
        </div>
      </div>
    )
  }

  // ERRO
  if (error || !weatherData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--danger)' }}>error</span>
          </div>
          <h3 style={styles.errorTitle}>Ops!</h3>
          <p style={styles.errorText}>{error || "Não foi possível obter os dados"}</p>
          {farmData && (
            <button style={styles.retryButton} onClick={retry}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* CARD PRINCIPAL */}
      <div style={styles.mainCard}>
        <div style={styles.mainCardHeader}>
          <div>
            <h1 style={styles.cityName}>{weatherData.city}</h1>
            <p style={styles.date}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }}>calendar_today</span>
              {weatherData.date}
            </p>
          </div>
          <div style={styles.weatherIcon}>
            <img 
              src={getWeatherIcon(weatherData.icon)} 
              alt={weatherData.description}
              style={{ width: '50px', height: '50px' }}
            />
            <p style={styles.weatherDesc}>{weatherData.description}</p>
          </div>
        </div>

        {/* TEMPERATURA PRINCIPAL */}
        <div style={styles.tempSection}>
          <div style={styles.tempCircle}>
            <span style={styles.tempValue}>{weatherData.temperature}</span>
            <span style={styles.tempUnit}>°C</span>
          </div>
          
          <div style={styles.tempDetails}>
            <div style={styles.tempDetail}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--primary)' }}>thermostat</span>
              <span>Sensação {weatherData.feelsLike}°</span>
            </div>
            <div style={styles.tempRange}>
              <span style={styles.tempMin}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle' }}>arrow_downward</span>
                {weatherData.tempMin}°
              </span>
              <span style={styles.tempMax}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle' }}>arrow_upward</span>
                {weatherData.tempMax}°
              </span>
            </div>
          </div>
        </div>

        {/* GRID DE ESTATÍSTICAS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>humidity_percentage</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Umidade</span>
              <strong style={styles.statValue}>{weatherData.humidity}%</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>air</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Vento</span>
              <div>
                <strong style={styles.statValue}>{weatherData.windSpeed} m/s</strong>
                <span style={styles.statSub}>{getWindDirection(weatherData.windDeg)}</span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>speed</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Pressão</span>
              <strong style={styles.statValue}>{weatherData.pressure} hPa</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>rainy</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Chuva</span>
              <strong style={styles.statValue}>{weatherData.rain} mm</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>airwave</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Rajada</span>
              <strong style={styles.statValue}>{weatherData.windGust} m/s</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>visibility</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Visibilidade</span>
              <strong style={styles.statValue}>{weatherData.visibility} km</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>cloud</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Nuvens</span>
              <strong style={styles.statValue}>{weatherData.clouds}%</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>sunny</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Nascer</span>
              <strong style={styles.statValue}>{weatherData.sunrise}</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <span className="material-symbols-outlined" style={styles.statIcon}>nightlight</span>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Pôr</span>
              <strong style={styles.statValue}>{weatherData.sunset}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      <div style={styles.recommendationsCard}>
        <h3 style={styles.recommendationsTitle}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--primary)' }}>psychology</span>
          Recomendações
        </h3>
        
        <div style={styles.recommendationsList}>
          {weatherData.humidity < 50 && weatherData.rain === 0 && (
            <div style={styles.recommendation}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>water_drop</span>
              <div style={styles.recommendationText}>
                <strong>Solo seco</strong>
                <p>Irrigação recomendada</p>
              </div>
            </div>
          )}

          {weatherData.humidity > 80 && (
            <div style={{...styles.recommendation, ...styles.recommendationWarning}}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>humidity_high</span>
              <div style={styles.recommendationText}>
                <strong>Alta umidade</strong>
                <p>Risco de fungos</p>
              </div>
            </div>
          )}

          {weatherData.temperature > 32 && (
            <div style={{...styles.recommendation, ...styles.recommendationWarning}}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>whatshot</span>
              <div style={styles.recommendationText}>
                <strong>Calor intenso</strong>
                <p>Proteja plantas sensíveis</p>
              </div>
            </div>
          )}

          {weatherData.temperature < 15 && (
            <div style={{...styles.recommendation, ...styles.recommendationWarning}}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>ac_unit</span>
              <div style={styles.recommendationText}>
                <strong>Temperatura baixa</strong>
                <p>Risco de geada</p>
              </div>
            </div>
          )}

          {weatherData.windSpeed > 8 && (
            <div style={{...styles.recommendation, ...styles.recommendationWarning}}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>wind_power</span>
              <div style={styles.recommendationText}>
                <strong>Vento forte</strong>
                <p>Evite pulverização</p>
              </div>
            </div>
          )}

          {weatherData.rain > 5 && (
            <div style={styles.recommendation}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>rainy</span>
              <div style={styles.recommendationText}>
                <strong>Chuva forte</strong>
                <p>Suspenda irrigação</p>
              </div>
            </div>
          )}

          {weatherData.humidity >= 50 && weatherData.humidity <= 70 && 
           weatherData.temperature >= 20 && weatherData.temperature <= 30 && 
           weatherData.windSpeed <= 5 && (
            <div style={styles.recommendation}>
              <span className="material-symbols-outlined" style={styles.recommendationIcon}>sentiment_satisfied</span>
              <div style={styles.recommendationText}>
                <strong>Condições ideais</strong>
                <p>Perfeito para campo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <p style={styles.footer}>
        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>update</span>
        Atualizado agora
      </p>
    </div>
  )
}

// Estilos responsivos com design mais clean
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },

  // Card principal
  mainCard: {
    background: 'rgba(18, 22, 28, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '28px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    width: '100%',
    boxSizing: 'border-box',
  },
  mainCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cityName: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 4px 0',
    lineHeight: 1.2,
  },
  date: {
    fontSize: '0.85rem',
    color: '#a0a8b4',
    margin: 0,
    textTransform: 'capitalize',
    display: 'flex',
    alignItems: 'center',
  },
  weatherIcon: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.02)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    minWidth: '100px',
  },
  weatherDesc: {
    fontSize: '0.8rem',
    color: '#fff',
    margin: '2px 0 0 0',
    textTransform: 'capitalize',
  },

  // Temperatura
  tempSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  tempCircle: {
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff88, #0066ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(0,255,136,0.3)',
  },
  tempValue: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#000',
  },
  tempUnit: {
    fontSize: '1rem',
    color: '#000',
    alignSelf: 'flex-start',
    marginTop: '20px',
  },
  tempDetails: {
    flex: 1,
    minWidth: '140px',
  },
  tempDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#a0a8b4',
    marginBottom: '6px',
    fontSize: '0.9rem',
  },
  tempRange: {
    display: 'flex',
    gap: '12px',
  },
  tempMin: {
    color: '#00ccff',
    fontWeight: '500',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  tempMax: {
    color: '#ffaa00',
    fontWeight: '500',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },

  // Grid de estatísticas
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '18px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'transform 0.2s',
  },
  statIcon: {
    fontSize: '22px',
    color: 'var(--primary)',
    minWidth: '32px',
  },
  statInfo: {
    flex: 1,
    minWidth: 0,
  },
  statLabel: {
    display: 'block',
    fontSize: '0.65rem',
    color: '#a0a8b4',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  statValue: {
    fontSize: '0.95rem',
    color: '#fff',
    fontWeight: '600',
    display: 'inline-block',
    marginRight: '4px',
  },
  statSub: {
    fontSize: '0.65rem',
    color: '#6b7280',
    marginLeft: '2px',
  },

  // Recomendações
  recommendationsCard: {
    background: 'rgba(18, 22, 28, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '28px',
    padding: '20px',
    marginBottom: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  recommendationsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff',
    fontSize: '1.1rem',
    margin: '0 0 16px 0',
    fontWeight: '500',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recommendation: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '18px',
    transition: 'all 0.2s',
  },
  recommendationWarning: {
    borderLeft: '4px solid #ffaa00',
    background: 'rgba(255,170,0,0.05)',
  },
  recommendationIcon: {
    fontSize: '22px',
    color: 'var(--primary)',
    minWidth: '32px',
  },
  recommendationText: {
    flex: 1,
  },

  // Loading e erro
  loadingContainer: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  loadingCard: {
    background: 'rgba(18, 22, 28, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '28px',
    padding: '32px 24px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '280px',
  },
  loadingIcon: {
    marginBottom: '14px',
  },
  loadingTitle: {
    color: '#fff',
    margin: '0 0 6px 0',
    fontSize: '1.2rem',
  },
  loadingText: {
    color: '#a0a8b4',
    margin: 0,
    fontSize: '0.9rem',
  },
  errorCard: {
    background: 'rgba(18, 22, 28, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,68,68,0.2)',
    borderRadius: '28px',
    padding: '32px 24px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '280px',
  },
  errorIcon: {
    marginBottom: '14px',
  },
  errorTitle: {
    color: '#ff4d4d',
    margin: '0 0 6px 0',
    fontSize: '1.2rem',
  },
  errorText: {
    color: '#a0a8b4',
    margin: '0 0 16px 0',
    fontSize: '0.9rem',
  },
  retryButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '26px',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Footer
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '8px',
  },
}