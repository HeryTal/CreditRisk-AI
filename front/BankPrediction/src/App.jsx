import { useEffect, useState } from 'react'
import './App.css'
import { API_URL } from './config/api'

import {
  Header,
  StatsCards,
  MainChart,
  RiskDistributionChart,
  AmountDistributionChart,
  RadarChart,
  PredictionForm,
  PredictionResult,
  LiveScore,
  History,
} from './components'

const INITIAL_FORM_DATA = {
  age: '35',
  sex: 'male',
  job: '2',
  housing: 'own',
  saving_accounts: 'little',
  checking_account: 'little',
  credit_amount: '5000',
  duration: '24',
}

const METRIC_TITLES = {
  evolution: 'Évolution des crédits',
  solvability: 'Taux de solvabilité',
  amount: 'Montants moyens (k€)',
  duration: 'Durées moyennes (mois)',
  accuracy: 'Précision du modèle (%)',
}

function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [activeView, setActiveView] = useState('dashboard')
  const [currentChartType, setCurrentChartType] = useState('line')
  const [currentMetric, setCurrentMetric] = useState('evolution')
  const [riskFilter, setRiskFilter] = useState('all')
  const [pieRiskData, setPieRiskData] = useState([70, 30])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictionData, setPredictionData] = useState(null)
  const [serverAvailable, setServerAvailable] = useState(true)

  const chartTitle = METRIC_TITLES[currentMetric] || METRIC_TITLES.evolution

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({ duration: 1000, once: true })
    }
  }, [])

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`)
        setServerAvailable(response.ok)
      } catch {
        setServerAvailable(false)
      }
    }

    checkServerHealth()
  }, [])

  const handleFieldChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const validateForm = (payload) => {
    const age = Number(payload.age)
    const creditAmount = Number(payload.credit_amount)
    const duration = Number(payload.duration)

    if (age < 18 || age > 100) {
      return "L'âge doit être compris entre 18 et 100 ans"
    }
    if (creditAmount <= 0) {
      return 'Le montant du crédit doit être supérieur à 0'
    }
    if (duration < 1 || duration > 72) {
      return 'La durée doit être comprise entre 1 et 72 mois'
    }
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setPredictionData(null)

    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        setError(data?.error || `Erreur serveur (${response.status})`)
        return
      }

      setPredictionData(data)
      const isGood = data.prediction === 'good'
      setPieRiskData(isGood ? [85, 15] : [30, 70])
      setRiskFilter('all')
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA)
    setError('')
    setPredictionData(null)
    setRiskFilter('all')
    setPieRiskData([70, 30])
  }

  const handleChartTypeChange = (type) => {
    setCurrentChartType(type)
  }

  const handleMetricClick = (metric) => {
    setCurrentMetric(metric)
  }

  const handleRiskFilterChange = (filter) => {
    setRiskFilter(filter)
  }

  return (
    <div className="font-sans">
      <Header serverAvailable={serverAvailable} apiUrl={API_URL} />

      <main className="container mx-auto max-w-7xl px-3 pb-12 sm:px-4 sm:pb-16">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex w-full max-w-xs rounded-xl border border-gray-700 bg-gray-900/70 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition sm:flex-none ${
                activeView === 'dashboard'
                  ? 'bg-purple-600/50 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveView('history')}
              className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition sm:flex-none ${
                activeView === 'history'
                  ? 'bg-purple-600/50 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Historique
            </button>
          </div>
        </div>

        {activeView === 'history' ? (
          <History />
        ) : (
          <>
            <StatsCards
              onMetricClick={handleMetricClick}
              currentMetric={currentMetric}
            />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChartTypeChange('line')}
                  className={`rounded-lg border border-purple-500/30 px-3 py-1 text-sm transition hover:bg-purple-600/40 ${
                    currentChartType === 'line' ? 'bg-purple-600/40' : 'bg-purple-600/20'
                  }`}
                >
                  <i className="fas fa-chart-line" />
                </button>
                <button
                  type="button"
                  onClick={() => handleChartTypeChange('bar')}
                  className={`rounded-lg border border-purple-500/30 px-3 py-1 text-sm transition hover:bg-purple-600/40 ${
                    currentChartType === 'bar' ? 'bg-purple-600/40' : 'bg-purple-600/20'
                  }`}
                >
                  <i className="fas fa-chart-bar" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="flex items-center rounded-lg px-2 py-1 transition hover:bg-gray-800/70"
                  onClick={() => handleRiskFilterChange('all')}
                >
                  <div className="mr-2 h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-gray-400">Tous</span>
                </button>
                <button
                  type="button"
                  className="flex items-center rounded-lg px-2 py-1 transition hover:bg-gray-800/70"
                  onClick={() => handleRiskFilterChange('good')}
                >
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400">Accordés</span>
                </button>
                <button
                  type="button"
                  className="flex items-center rounded-lg px-2 py-1 transition hover:bg-gray-800/70"
                  onClick={() => handleRiskFilterChange('bad')}
                >
                  <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-400">Refusés</span>
                </button>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <MainChart
                chartType={currentChartType}
                metric={currentMetric}
                riskFilter={riskFilter}
                title={chartTitle}
              />
              <RiskDistributionChart
                riskData={pieRiskData}
                riskFilter={riskFilter}
                onRiskFilterChange={handleRiskFilterChange}
              />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AmountDistributionChart amountValue={formData.credit_amount} />
              <RadarChart formData={formData} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PredictionForm
                formData={formData}
                onChange={handleFieldChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                loading={loading}
              />

              <div className="space-y-6">
                {loading && (
                  <div className="glass-card rounded-2xl p-8 text-center sm:p-12">
                    <div className="spinner-modern mx-auto" />
                    <p className="mt-6 font-medium text-gray-400">Analyse en cours...</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-500 sm:p-6">
                    <i className="fas fa-exclamation-triangle mb-3 text-2xl" />
                    <p className="text-base sm:text-lg">{error}</p>
                  </div>
                )}

                <PredictionResult
                  predictionData={predictionData}
                  onReset={handleReset}
                />

                <LiveScore formData={formData} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
