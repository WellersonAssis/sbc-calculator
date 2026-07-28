import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('reverse') // 'reverse' ou 'direct'
  
  // Estados para o Gerador Reverso
  const [targetRating, setTargetRating] = useState('90')
  const [combinations, setCombinations] = useState([])
  const [loadingReverse, setLoadingReverse] = useState(false)

  // Estados para a Calculadora Direta
  const [ratingsInput, setRatingsInput] = useState('')
  const [calculatedRating, setCalculatedRating] = useState(null)
  const [directError, setDirectError] = useState('')

  // Função para agrupar as cartas repetidas e contar (Ex: [92, 91, 91] -> "1x 92, 2x 91")
  const formatRatingsSummary = (ratings) => {
    const counts = {}
    ratings.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1
    })

    return Object.entries(counts)
      .sort((a, b) => Number(b[0]) - Number(a[0])) // Ordena do maior para o menor overall
      .map(([rating, count]) => `${count}x ${rating}`)
      .join('  •  ')
  }

  // Busca as combinações para a nota alvo
  const handleSearchCombinations = async (e) => {
    e.preventDefault()
    setLoadingReverse(true)

    try {
      const response = await fetch(`http://localhost:8080/api/sbc/combinations/${targetRating}`)
      const data = await response.json()
      setCombinations(data)
    } catch (err) {
      alert('Erro ao conectar com o backend. O Spring Boot está rodando na porta 8080?')
    } finally {
      setLoadingReverse(false)
    }
  }

  // Calcula a nota exata do elenco digitado
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
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '40px auto', padding: '20px', color: '#1f2937' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>⚽ EA Sports FC - SBC Calculator</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>
        Ferramenta completa para otimizar seus Desafios de Montagem de Elenco.
      </p>

      {/* Navegação por Abas */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('reverse')}
          style={{
            padding: '10px 20px',
            fontSize: '15px',
            fontWeight: 'bold',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'reverse' ? '#2563eb' : '#e5e7eb',
            color: activeTab === 'reverse' ? 'white' : '#374151',
          }}
        >
          🔍 Gerador de Combinações
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          style={{
            padding: '10px 20px',
            fontSize: '15px',
            fontWeight: 'bold',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'direct' ? '#2563eb' : '#e5e7eb',
            color: activeTab === 'direct' ? 'white' : '#374151',
          }}
        >
          🧮 Calculadora de Elenco
        </button>
      </div>

      {/* ABA 1: GERADOR REVERSO */}
      {activeTab === 'reverse' && (
        <div>
          <form onSubmit={handleSearchCombinations} style={{ textAlign: 'center', marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Digite a nota mínima exigida pelo DME:
            </label>
            <input
              type="number"
              value={targetRating}
              onChange={(e) => setTargetRating(e.target.value)}
              placeholder="Ex: 90"
              min="75"
              max="99"
              style={{ padding: '10px', width: '100px', fontSize: '18px', textAlign: 'center', borderRadius: '6px', border: '1px solid #d1d5db', marginRight: '10px' }}
            />
            <button
              type="submit"
              style={{ padding: '11px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              {loadingReverse ? 'Buscando...' : 'Buscar Opções'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {combinations.map((combo, index) => (
              <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#111827' }}>{combo.title}</h3>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '12px' }}>
                    {formatRatingsSummary(combo.ratings)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {combo.ratings.map((rating, rIndex) => (
                    <span key={rIndex} style={{ backgroundColor: '#2563eb', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                      {rating}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: CALCULADORA DIRETA */}
      {activeTab === 'direct' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
            Digite as notas dos jogadores do seu clube (separadas por vírgula):
          </p>
          <form onSubmit={handleCalculateDirect}>
            <input
              type="text"
              value={ratingsInput}
              onChange={(e) => setRatingsInput(e.target.value)}
              placeholder="Ex: 88, 87, 85, 84, 83"
              style={{ padding: '12px', width: '320px', fontSize: '16px', borderRadius: '6px', border: '1px solid #d1d5db', marginRight: '10px' }}
            />
            <button
              type="submit"
              style={{ padding: '12px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              Calcular Overall
            </button>
          </form>

          {calculatedRating !== null && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '24px', color: '#047857', fontWeight: 'bold' }}>
                ⭐ Overall do Elenco: {calculatedRating}
              </span>
            </div>
          )}

          {directError && (
            <div style={{ marginTop: '20px', color: '#ef4444', fontWeight: 'bold' }}>
              {directError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App