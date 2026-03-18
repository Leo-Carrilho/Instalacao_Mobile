import { useState, useEffect } from "react"
import "../../../styles/App/Explore.css"

const API_KEY = "d77668673cf15b7d0488f921007cbd6b"

export default function ClimaTab({ farmData }) {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState("celsius")

  // Buscar clima baseado nos dados da fazenda recebidos como prop
  useEffect(() => {
    const fetchWeatherByFarmLocation = async () => {
      if (!farmData) {
        setError("Dados da fazenda não disponíveis")
        setLoading(false)
        return
      }

      // Verifica se tem os dados necessários
      if (!farmData.municipio || !farmData.uf) {
        setError("Dados de localização da fazenda incompletos")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const city = farmData.municipio
        const state = farmData.uf

        console.log(`Buscando clima para: ${city}/${state}`) // Debug

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},BR&appid=${API_KEY}&units=metric&lang=pt_br`
        )
        const data = await response.json()

        if (data.cod === 200) {
          setWeatherData({
            city: data.name,
            state: state,
            farmName: farmData.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            windDeg: data.wind.deg,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            clouds: data.clouds.all,
            visibility: data.visibility / 1000,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('pt-BR'),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('pt-BR'),
            date: new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          })
        } else {
          setError(`Clima não disponível para ${city}/${state}`)
        }
      } catch (err) {
        setError("Erro ao buscar dados do clima")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (farmData) {
      fetchWeatherByFarmLocation()
    }
  }, [farmData])

  // Converter temperatura
  const convertTemp = (celsius) => {
    if (unit === "fahrenheit") {
      return Math.round((celsius * 9/5) + 32)
    }
    return celsius
  }

  // Pegar ícone do clima
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  // Cor de fundo baseada na temperatura
  const getTempColor = (temp) => {
    if (temp < 15) return '#00ccff'
    if (temp < 25) return '#00ff88'
    if (temp < 35) return '#ffaa00'
    return '#ff4d4d'
  }

  // Formatar direção do vento
  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(deg / 22.5) % 16]
  }

  // Botão para tentar novamente
  const handleRetry = () => {
    setLoading(true)
    setError(null)
    // Força recarregar os dados
    if (farmData) {
      // O useEffect será executado novamente
      setLoading(true)
    }
  }

  if (loading) {
    return (
      <div className="clima-tab-container">
        <div className="clima-tab-loading">
          <div className="clima-tab-loading-logo">
            <span className="material-symbols-outlined">cloud</span>
          </div>
          <div className="clima-tab-loading-spinner"></div>
          <h3>Buscando clima</h3>
          <p className="text-secondary">
            {farmData ? `Obtendo dados para ${farmData.municipio || 'sua região'}...` : 'Carregando dados da fazenda...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="clima-tab-container">
        <div className="empty-state">
          <div className="empty-icon">
            <span className="material-symbols-outlined">cloud_off</span>
            <div className="empty-icon-ring"></div>
          </div>
          <h3>Clima indisponível</h3>
          <p>{error || "Não foi possível obter os dados do clima"}</p>
          {farmData && (
            <button 
              className="empty-action-btn"
              onClick={handleRetry}
            >
              <span>Tentar novamente</span>
              <span className="material-symbols-outlined">refresh</span>
              <span className="btn-glow"></span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="clima-tab-container">
      {/* Header com informações da fazenda e toggle de unidade */}
      <div className="clima-tab-header">
        <div className="clima-tab-location-info">
          <span className="material-symbols-outlined">agriculture</span>
          <div>
            <h4>{weatherData.farmName || weatherData.city}</h4>
            <p>
              <span className="material-symbols-outlined">location_on</span>
              {weatherData.city}, {weatherData.state}
            </p>
          </div>
        </div>

        {/* Toggle de unidade */}
        <div className="clima-tab-unit-toggle">
          <button
            className={unit === "celsius" ? "clima-tab-active" : ""}
            onClick={() => setUnit("celsius")}
          >
            °C
          </button>
          <button
            className={unit === "fahrenheit" ? "clima-tab-active" : ""}
            onClick={() => setUnit("fahrenheit")}
          >
            °F
          </button>
        </div>
      </div>

      {/* Card principal do clima */}
      <div className="clima-tab-main-card">
        <div className="clima-tab-header-content">
          <div className="clima-tab-location">
            <h2>{weatherData.city}</h2>
            <p className="clima-tab-date">
              <span className="material-symbols-outlined">calendar_today</span>
              {weatherData.date}
            </p>
          </div>
          <div className="clima-tab-condition">
            <img 
              src={getWeatherIcon(weatherData.icon)} 
              alt={weatherData.description}
            />
            <p className="clima-tab-description">{weatherData.description}</p>
          </div>
        </div>

        <div className="clima-tab-temperature-section">
          <div 
            className="clima-tab-temp-circle"
            style={{ 
              background: `radial-gradient(circle at 30% 30%, ${getTempColor(weatherData.temperature)}, #0a0c0e)`
            }}
          >
            <span className="clima-tab-temp-value">{convertTemp(weatherData.temperature)}</span>
            <span className="clima-tab-temp-unit">{unit === "celsius" ? "°C" : "°F"}</span>
          </div>
          <div className="clima-tab-feels-like">
            <span className="material-symbols-outlined">thermostat</span>
            Sensação térmica: {convertTemp(weatherData.feelsLike)}°{unit === "celsius" ? "C" : "F"}
          </div>
        </div>

        <div className="clima-tab-stats-grid">
          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">humidity_percentage</span>
            <div className="clima-tab-stat-info">
              <label>Umidade</label>
              <strong>{weatherData.humidity}%</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">air</span>
            <div className="clima-tab-stat-info">
              <label>Vento</label>
              <strong>{weatherData.windSpeed} m/s {getWindDirection(weatherData.windDeg)}</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">speed</span>
            <div className="clima-tab-stat-info">
              <label>Pressão</label>
              <strong>{weatherData.pressure} hPa</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">visibility</span>
            <div className="clima-tab-stat-info">
              <label>Visibilidade</label>
              <strong>{weatherData.visibility} km</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">cloud</span>
            <div className="clima-tab-stat-info">
              <label>Nuvens</label>
              <strong>{weatherData.clouds}%</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">sunny</span>
            <div className="clima-tab-stat-info">
              <label>Nascer do sol</label>
              <strong>{weatherData.sunrise}</strong>
            </div>
          </div>

          <div className="clima-tab-stat-item">
            <span className="material-symbols-outlined">nightlight</span>
            <div className="clima-tab-stat-info">
              <label>Pôr do sol</label>
              <strong>{weatherData.sunset}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações agrícolas */}
      <div className="clima-tab-recommendations">
        <h3>
          <span className="material-symbols-outlined">agriculture</span>
          Recomendações para {weatherData.farmName || weatherData.city}
        </h3>
        
        <div className="clima-tab-recommendations-list">
          {weatherData.humidity < 50 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined clima-tab-warning">water_drop</span>
              <div>
                <strong>Umidade baixa</strong>
                <p>Considere irrigar suas plantações hoje</p>
              </div>
            </div>
          )}

          {weatherData.humidity > 80 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined clima-tab-warning">humidity_high</span>
              <div>
                <strong>Umidade alta</strong>
                <p>Risco de fungos - monitore suas plantações</p>
              </div>
            </div>
          )}

          {weatherData.temperature > 30 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined clima-tab-warning">thermostat</span>
              <div>
                <strong>Temperatura elevada</strong>
                <p>Proteja plantas sensíveis do sol forte</p>
              </div>
            </div>
          )}

          {weatherData.temperature < 15 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined clima-tab-warning">ac_unit</span>
              <div>
                <strong>Temperatura baixa</strong>
                <p>Proteja plantas sensíveis à geada</p>
              </div>
            </div>
          )}

          {weatherData.windSpeed > 5 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined clima-tab-warning">wind_power</span>
              <div>
                <strong>Ventos fortes</strong>
                <p>Verifique a estrutura de suporte das plantas</p>
              </div>
            </div>
          )}

          {weatherData.clouds > 70 && (
            <div className="clima-tab-recommendation-item">
              <span className="material-symbols-outlined">cloud</span>
              <div>
                <strong>Dia nublado</strong>
                <p>Bom para transplantar mudas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}