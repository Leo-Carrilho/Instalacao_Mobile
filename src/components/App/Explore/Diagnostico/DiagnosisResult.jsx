export default function DiagnosisResult({ result, onRestart }) {

  const disease = result?.doenca || "Não identificado"
  const confidence = result?.confianca || 0

  const percent = (confidence * 100).toFixed(2)

  return (

    <div className="result-container">

      <h2>Resultado do Diagnóstico</h2>

      <p className="result-disease">
        🌱 {disease.replaceAll("_"," ")}
      </p>

      <p className="result-confidence">
        Confiança da IA: {percent}%
      </p>

      {result?.probabilidades && (

        <div className="probabilities">

          <h3>Probabilidades</h3>

          {Object.entries(result.probabilidades).map(([name, value]) => (

            <div key={name} className="probability-item">

              <span>{name.replaceAll("_"," ")}</span>

              <span>{(value * 100).toFixed(1)}%</span>

            </div>

          ))}

        </div>

      )}
  
      <br />
      <button className="btn restart" onClick={onRestart}>
        Novo Diagnóstico
      </button>

    </div>

  )
}
