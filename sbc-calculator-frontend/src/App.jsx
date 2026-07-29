import { useState } from 'react'
import './App.css'

function App() {
  const [targetRating, setTargetRating] = useState('89')
  const [excludedRatingsInput, setExcludedRatingsInput] = useState('')
  const [combinations, setCombinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const formatRatingsSummary = (ratings) => {
    if (!Array.isArray(ratings)) return ''
    const counts = {}
    ratings.forEach((r) => { counts[r] = (counts[r] || 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([rating, count]) => `${count}x ${rating}`)
      .join('  •  ')
  }

  const handleSearchCombinations = async (e) => {
    e.preventDefault()
    setLoading(true)
    setCombinations([])

    const excludedArray = excludedRatingsInput
      .split(',')
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r))
    
    const excludeQuery = excludedArray.length > 0 ? `?exclude=${excludedArray.join(',')}` : ''

    try {
      const response = await fetch(`http://localhost:8080/api/sbc/combinations/${targetRating}${excludeQuery}`)
      if (!response.ok) throw new Error('Erro na resposta do backend')
      
      const comboData = await response.json()
      setCombinations(comboData)
      setShowAdvanced(true)
      
    } catch (err) {
      alert('Erro ao conectar com o backend Java. Verifique se o servidor está rodando na porta 8080.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1 className="header-title">⚽ SBC Calculator</h1>
      <p className="header-subtitle">Seu apoio na hora de fazer DME no EAFC</p>

      <div>
        <form onSubmit={handleSearchCombinations} className="form-container">
          <label className="input-label">CLASSIFICAÇÃO GERAL DO DME</label>
          <input
            type="number"
            className="styled-input"
            value={targetRating}
            onChange={(e) => setTargetRating(e.target.value)}
            placeholder="Ex: 90"
            min="45"
            max="99"
            style={{ width: '100px', marginBottom: '15px' }}
          />
          
          {showAdvanced && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
              <label className="input-label">Cartas que você NÃO tem (separadas por vírgula):</label>
              <input
                type="text"
                className="styled-input"
                value={excludedRatingsInput}
                onChange={(e) => setExcludedRatingsInput(e.target.value)}
                placeholder="Ex: 88, 87, 86"
                style={{ width: '80%', maxWidth: '350px' }}
              />
            </div>
          )}
          <br /><br />

          <button type="submit" className="action-button" style={{ marginLeft: 0 }} disabled={loading}>
            {loading ? 'Calculando...' : (showAdvanced ? 'Recalcular com Filtro' : 'Buscar Combinações')}
          </button>
        </form>

        {loading && <p className="loading-text">⏳ Mapeando as melhores opções...</p>}

        <div className="results-container">
          {combinations.length === 0 && showAdvanced && !loading && (
            <p className="error-text" style={{textAlign: 'center'}}>Nenhuma combinação encontrada excluindo essas notas.</p>
          )}
          
          {combinations.map((combo, index) => (
            <div key={index} className="combo-card">
              <h3 className="combo-title">{combo.title}</h3>
              <span className="combo-badge">
                {formatRatingsSummary(combo.ratings)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App