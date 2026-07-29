import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('reverse')
  
  const [targetRating, setTargetRating] = useState('89')
  const [excludedRatingsInput, setExcludedRatingsInput] = useState('')
  const [combinations, setCombinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false) // NOVO: Controle de exibição do filtro

  const [ratingsInput, setRatingsInput] = useState('')
  const [calculatedRating, setCalculatedRating] = useState(null)
  const [directError, setDirectError] = useState('')

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
    
    // Limpa a lista na tela para dar o efeito visual de carregamento novo
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
      
      // NOVO: Libera a exibição do filtro avançado após a primeira busca dar certo
      setShowAdvanced(true)
      
    } catch (err) {
      alert('Erro ao conectar com o backend Java. Verifique se o servidor está rodando na porta 8080.')
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateDirect = async (e) => {
    e.preventDefault()
    setDirectError('')
    setCalculatedRating(null)

    try {
      const ratingsArray = ratingsInput
        .split(',')
        .map((r) => parseInt(r.trim()))
        .filter((r) => !isNaN(r))

      if (ratingsArray.length === 0 || ratingsArray.length > 11) {
        setDirectError('Por favor, insira de 1 a 11 números válidos separados por vírgula.')
        return
      }

      const response = await fetch('http://localhost:8080/api/sbc/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratings: ratingsArray }),
      })

      if (!response.ok) throw new Error()
      const data = await response.json()
      setCalculatedRating(data)
    } catch (err) {
      setDirectError('Erro ao conectar com o backend.')
    }
  }

  return (
    <div className="app-container">
      <h1 className="header-title">⚽ SBC Calculator</h1>
      <p className="header-subtitle">Otimize seus elencos no EA Sports FC</p>

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'reverse' ? 'active' : ''}`}
          onClick={() => setActiveTab('reverse')}
        >
          🔍 Gerador de Combinações
        </button>
        <button 
          className={`tab-button ${activeTab === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveTab('direct')}
        >
          🧮 Calculadora de Elenco
        </button>
      </div>

      {activeTab === 'reverse' && (
        <div>
          <form onSubmit={handleSearchCombinations} className="form-container">
            <label className="input-label">Overall do DME:</label>
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
            
            {/* NOVO: Só exibe essa parte se showAdvanced for true */}
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
      )}

      {activeTab === 'direct' && (
        <div className="form-container">
          <label className="input-label">Digite as notas do seu clube (separadas por vírgula):</label>
          <form onSubmit={handleCalculateDirect}>
            <input
              type="text"
              className="styled-input"
              value={ratingsInput}
              onChange={(e) => setRatingsInput(e.target.value)}
              placeholder="Ex: 88, 87, 85, 84, 83"
              style={{ width: '80%', maxWidth: '350px', marginBottom: '15px' }}
            />
            <br />
            <button type="submit" className="action-button" style={{ marginLeft: 0 }}>
              Calcular Overall
            </button>
          </form>

          {calculatedRating !== null && (
            <div className="result-box">
              <span className="result-text">⭐ Overall do Elenco: {calculatedRating}</span>
            </div>
          )}

          {directError && <div className="error-text">{directError}</div>}
        </div>
      )}
    </div>
  )
}

export default App