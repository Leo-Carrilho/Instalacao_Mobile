import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFarm } from "./hooks/useFarm"
import "../../../styles/App/MapaTab.css"

// Importar Leaflet
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import "leaflet-draw"

// Configurar ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export default function MapaTab() {
  const { farmData, loading: farmLoading } = useFarm()
  const mapContainerRef = useRef(null)
  const drawnItemsRef = useRef(null)
  const [map, setMap] = useState(null)
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null)
  const [locationStatus, setLocationStatus] = useState("loading")
  const [searchAddress, setSearchAddress] = useState("")
  const [searching, setSearching] = useState(false)

  // Carregar áreas salvas
  useEffect(() => {
    const saved = localStorage.getItem("farmPolygons")
    if (saved) {
      setAreas(JSON.parse(saved))
    }
  }, [])

  // Salvar áreas
  const saveAreas = (newAreas) => {
    setAreas(newAreas)
    localStorage.setItem("farmPolygons", JSON.stringify(newAreas))
    
    // Atualizar camadas no mapa
    if (map && drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers()
      newAreas.forEach(area => {
        const polygon = L.polygon(area.coordinates, {
          color: area.color,
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.3
        })
        polygon.bindPopup(`
          <strong>${area.name}</strong><br>
          Cultura: ${area.crop}<br>
          Área: ${area.areaHa.toFixed(2)} ha
        `)
        polygon.addTo(drawnItemsRef.current)
      })
    }
  }

  // Buscar localização por endereço
  const searchLocation = async (address) => {
    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      )
      const data = await response.json()
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        
        if (map) {
          map.setView([lat, lng], 16)
        }
        
        setLocationStatus("success")
        return { lat, lng }
      } else {
        setLocationStatus("not-found")
        return null
      }
    } catch (error) {
      console.error("Erro ao buscar localização:", error)
      setLocationStatus("error")
      return null
    } finally {
      setSearching(false)
    }
  }

  // Buscar localização pelo CEP
  const getLocationByCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        throw new Error("CEP não encontrado")
      }
      
      const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`
      return await searchLocation(fullAddress)
      
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      return null
    }
  }

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || map) return

    // Criar mapa com centro padrão (Brasil)
    const mapInstance = L.map(mapContainerRef.current).setView([-15.7934, -47.8823], 4)
    
    // Adicionar camada de tiles (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(mapInstance)

    // Criar camada para os polígonos
    const drawnItems = L.featureGroup().addTo(mapInstance)
    drawnItemsRef.current = drawnItems

    // Configurar controles de desenho
    const drawControl = L.Control.draw({
      position: "topleft",
      draw: {
        polygon: {
          shapeOptions: {
            color: "#00ff88",
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.3
          },
          allowIntersection: false,
          drawError: {
            color: "#ff4444",
            message: "Não é permitido cruzamento de linhas!"
          },
          showArea: true,
          showLength: false,
          metric: true
        },
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    }).addTo(mapInstance)

    // Carregar áreas salvas
    const savedAreas = localStorage.getItem("farmPolygons")
    if (savedAreas) {
      const parsedAreas = JSON.parse(savedAreas)
      parsedAreas.forEach(area => {
        const polygon = L.polygon(area.coordinates, {
          color: area.color,
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.3
        })
        polygon.bindPopup(`
          <strong>${area.name}</strong><br>
          Cultura: ${area.crop}<br>
          Área: ${area.areaHa.toFixed(2)} ha
        `)
        polygon.addTo(drawnItems)
      })
    }

    // Evento quando um polígono é criado
    mapInstance.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer
      const coordinates = layer.getLatLngs()[0].map(p => [p.lat, p.lng])
      
      // Calcular área em hectares
      const areaSqm = L.GeometryUtil.geodesicArea(coordinates)
      const areaHa = areaSqm / 10000
      
      // Abrir modal para informações da área
      const areaName = prompt("Nome da área:", `Área ${areas.length + 1}`)
      if (areaName) {
        const crop = prompt("Cultura plantada:", "Soja")
        
        const newArea = {
          id: Date.now(),
          name: areaName,
          crop: crop || "Soja",
          coordinates: coordinates,
          areaHa: areaHa,
          color: "#" + Math.floor(Math.random()*16777215).toString(16),
          createdAt: new Date().toISOString()
        }
        
        layer.bindPopup(`
          <strong>${newArea.name}</strong><br>
          Cultura: ${newArea.crop}<br>
          Área: ${newArea.areaHa.toFixed(2)} ha
        `)
        
        drawnItems.addLayer(layer)
        saveAreas([...areas, newArea])
      } else {
        drawnItems.removeLayer(layer)
      }
    })

    // Evento quando um polígono é editado
    mapInstance.on(L.Draw.Event.EDITED, (e) => {
      const layers = e.layers
      layers.eachLayer(layer => {
        const coordinates = layer.getLatLngs()[0].map(p => [p.lat, p.lng])
        const areaSqm = L.GeometryUtil.geodesicArea(coordinates)
        const areaHa = areaSqm / 10000
        
        const updatedAreas = areas.map(area => {
          const areaCoords = JSON.stringify(area.coordinates)
          const layerCoords = JSON.stringify(coordinates)
          if (areaCoords === layerCoords) {
            return { ...area, areaHa: areaHa, coordinates: coordinates }
          }
          return area
        })
        saveAreas(updatedAreas)
      })
    })

    // Evento quando um polígono é deletado
    mapInstance.on(L.Draw.Event.DELETED, (e) => {
      const layers = e.layers
      layers.eachLayer(layer => {
        const coordinates = layer.getLatLngs()[0].map(p => [p.lat, p.lng])
        const updatedAreas = areas.filter(area => {
          return JSON.stringify(area.coordinates) !== JSON.stringify(coordinates)
        })
        saveAreas(updatedAreas)
      })
    })

    setMap(mapInstance)

    // Tentar localizar a fazenda pelo CEP
    const locateFarm = async () => {
      if (farmData?.cep) {
        setLocationStatus("loading")
        const location = await getLocationByCep(farmData.cep.replace(/\D/g, ''))
        if (!location) {
          setLocationStatus("error")
        }
      } else if (farmData?.cidade && farmData?.uf) {
        setLocationStatus("loading")
        const location = await searchLocation(`${farmData.cidade}, ${farmData.uf}`)
        if (!location) {
          setLocationStatus("error")
        }
      } else {
        setLocationStatus("no-location")
      }
    }

    if (!farmLoading && farmData) {
      locateFarm()
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [farmData, farmLoading])

  const deleteArea = (id) => {
    if (window.confirm("Tem certeza que deseja remover esta área?")) {
      const updatedAreas = areas.filter(area => area.id !== id)
      saveAreas(updatedAreas)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchAddress.trim()) {
      await searchLocation(searchAddress)
    }
  }

  const totalArea = areas.reduce((sum, area) => sum + (area.areaHa || 0), 0)

  return (
    <div className="mapa-container">
      {/* Header */}
      <div className="mapa-header">
        <h2>Mapa da Fazenda</h2>
        <p>Desenhe as áreas da sua plantação diretamente no mapa</p>
      </div>

      {/* Barra de Busca */}
      <form className="mapa-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar endereço, cidade ou CEP..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <button type="submit" disabled={searching}>
          <span className="material-symbols-outlined">search</span>
          Buscar
        </button>
      </form>

      {/* Status da Localização */}
      {locationStatus === "loading" && (
        <div className="location-status loading">
          <span className="material-symbols-outlined">location_searching</span>
          <p>Buscando localização da fazenda...</p>
        </div>
      )}
      
      {locationStatus === "error" && (
        <div className="location-status error">
          <span className="material-symbols-outlined">error</span>
          <p>Não foi possível localizar o endereço. Use a busca acima para encontrar sua fazenda.</p>
        </div>
      )}
      
      {locationStatus === "not-found" && (
        <div className="location-status warning">
          <span className="material-symbols-outlined">search</span>
          <p>Endereço não encontrado. Tente um termo mais específico.</p>
        </div>
      )}
      
      {locationStatus === "no-location" && (
        <div className="location-status info">
          <span className="material-symbols-outlined">info</span>
          <p>Nenhuma localização cadastrada. Use a busca acima para encontrar sua fazenda.</p>
        </div>
      )}

      {/* Mapa */}
      <div className="mapa-area">
        <div ref={mapContainerRef} className="map-container"></div>
      </div>

      {/* Instruções */}
      <div className="mapa-instructions">
        <div className="instruction">
          <span className="material-symbols-outlined">draw</span>
          <p>Clique no ícone <strong>✏️ Polígono</strong> no canto superior esquerdo</p>
        </div>
        <div className="instruction">
          <span className="material-symbols-outlined">ads_click</span>
          <p>Clique no mapa para criar os vértices</p>
        </div>
        <div className="instruction">
          <span className="material-symbols-outlined">check_circle</span>
          <p>Feche o polígono clicando no primeiro ponto</p>
        </div>
      </div>

      {/* Resumo */}
      {areas.length > 0 && (
        <div className="mapa-summary">
          <div className="summary-card">
            <span className="material-symbols-outlined">agriculture</span>
            <div>
              <strong>{areas.length}</strong>
              <p>Áreas demarcadas</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="material-symbols-outlined">square_foot</span>
            <div>
              <strong>{totalArea.toFixed(2)} ha</strong>
              <p>Área total plantada</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Áreas */}
      {areas.length > 0 && (
        <div className="mapa-areas-list">
          <h3>Minhas Áreas de Plantio</h3>
          <div className="areas-grid">
            {areas.map((area, index) => (
              <motion.div
                key={area.id}
                className="area-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (map) {
                    const bounds = L.latLngBounds(area.coordinates.map(p => [p[0], p[1]]))
                    map.fitBounds(bounds, { padding: [50, 50] })
                  }
                  setSelectedArea(area)
                }}
              >
                <div className="area-color" style={{ background: area.color }}></div>
                <div className="area-info">
                  <h4>{area.name}</h4>
                  <div className="area-details">
                    <span className="crop-badge">
                      <span className="material-symbols-outlined">eco</span>
                      {area.crop}
                    </span>
                    <span className="area-size">{area.areaHa.toFixed(2)} ha</span>
                  </div>
                </div>
                <button
                  className="delete-area"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteArea(area.id)
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      <AnimatePresence>
        {selectedArea && (
          <motion.div
            className="mapa-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArea(null)}
          >
            <motion.div
              className="area-detail-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedArea(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="detail-header">
                <div className="detail-color" style={{ background: selectedArea.color }}></div>
                <div>
                  <h3>{selectedArea.name}</h3>
                  <p>Cultura: {selectedArea.crop}</p>
                </div>
              </div>
              <div className="detail-stats">
                <div className="detail-stat">
                  <span className="material-symbols-outlined">square_foot</span>
                  <div>
                    <strong>{selectedArea.areaHa.toFixed(2)} ha</strong>
                    <p>Área total</p>
                  </div>
                </div>
                <div className="detail-stat">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <div>
                    <strong>{new Date(selectedArea.createdAt).toLocaleDateString()}</strong>
                    <p>Data de cadastro</p>
                  </div>
                </div>
              </div>
              <div className="detail-actions">
                <button className="action-btn" onClick={() => {
                  if (map) {
                    const bounds = L.latLngBounds(selectedArea.coordinates.map(p => [p[0], p[1]]))
                    map.fitBounds(bounds, { padding: [50, 50] })
                    setSelectedArea(null)
                  }
                }}>
                  <span className="material-symbols-outlined">center_focus_strong</span>
                  Centralizar no mapa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}