import { useEffect, useState, useCallback, memo } from 'react'
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
  evolution: 'Credit trends',
  solvability: 'Solvency rate',
  amount: 'Average amounts (kEUR)',
  duration: 'Average durations (months)',
  accuracy: 'Model accuracy (%)',
}

// Composants memoïsés pour éviter les re-rendus inutiles
const MemoizedStatsCards = memo(StatsCards)
const MemoizedMainChart = memo(MainChart)
const MemoizedRiskDistributionChart = memo(RiskDistributionChart)
const MemoizedAmountDistributionChart = memo(AmountDistributionChart)
const MemoizedRadarChart = memo(RadarChart)
const MemoizedPredictionForm = memo(PredictionForm)
const MemoizedPredictionResult = memo(PredictionResult)
const MemoizedLiveScore = memo(LiveScore)
const MemoizedHistory = memo(History)

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
  const [isAnimating, setIsAnimating] = useState(false)

  const chartTitle = METRIC_TITLES[currentMetric] || METRIC_TITLES.evolution

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({ 
        duration: 800, 
        once: true,
        easing: 'ease-out-cubic'
      })
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
    const interval = setInterval(checkServerHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleFieldChange = useCallback((name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }, [])

  const validateForm = useCallback((payload) => {
    const age = Number(payload.age)
    const creditAmount = Number(payload.credit_amount)
    const duration = Number(payload.duration)

    if (age < 18 || age > 100) {
      return 'Age must be between 18 and 100 years'
    }
    if (creditAmount <= 0) {
      return 'Credit amount must be greater than 0'
    }
    if (duration < 1 || duration > 72) {
      return 'Duration must be between 1 and 72 months'
    }
    return ''
  }, [])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    setError('')
    setPredictionData(null)
    setIsAnimating(true)

    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      setIsAnimating(false)
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
        setError(data?.error || `Server error (${response.status})`)
        return
      }

      setPredictionData(data)
      const isGood = data.prediction === 'good'
      setPieRiskData(isGood ? [85, 15] : [30, 70])
      setRiskFilter('all')
    } catch {
      setError('Server connection error')
    } finally {
      setLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }, [formData, validateForm])

  const handleReset = useCallback(() => {
    setIsAnimating(true)
    setFormData(INITIAL_FORM_DATA)
    setError('')
    setPredictionData(null)
    setRiskFilter('all')
    setPieRiskData([70, 30])
    setTimeout(() => setIsAnimating(false), 300)
  }, [])

  const handleChartTypeChange = useCallback((type) => {
    setCurrentChartType(type)
  }, [])

  const handleMetricClick = useCallback((metric) => {
    setCurrentMetric(metric)
  }, [])

  const handleRiskFilterChange = useCallback((filter) => {
    setRiskFilter(filter)
  }, [])

  const handleViewChange = useCallback((view) => {
    setIsAnimating(true)
    setActiveView(view)
    setTimeout(() => setIsAnimating(false), 300)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-sans antialiased">
      {/* Effet de grille futuriste */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      
      {/* Particules animées */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      <Header serverAvailable={serverAvailable} apiUrl={API_URL} />

      <main className="container mx-auto max-w-7xl px-4 pb-16 relative z-10">
        {/* Navigation */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="inline-flex rounded-2xl bg-[#16161F] p-1.5 border border-[#2A2A35] shadow-lg">
            <button
              type="button"
              onClick={() => handleViewChange('dashboard')}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeView === 'dashboard'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {activeView === 'dashboard' && (
                <span className="absolute inset-0 bg-purple-600 rounded-xl animate-slide-in" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-chart-pie text-sm" />
                Dashboard
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('history')}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeView === 'history'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {activeView === 'history' && (
                <span className="absolute inset-0 bg-purple-600 rounded-xl animate-slide-in" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-history text-sm" />
                History
              </span>
            </button>
          </div>
        </div>

        {/* Contenu avec animation de transition */}
        <div className={`transition-all duration-300 transform ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          {activeView === 'history' ? (
            <div className="animate-fade-in-up">
              <MemoizedHistory />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="animate-fade-in-up animation-delay-100">
                <MemoizedStatsCards
                  onMetricClick={handleMetricClick}
                  currentMetric={currentMetric}
                />
              </div>

              {/* Contrôles des graphiques */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up animation-delay-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleChartTypeChange('line')}
                    className={`w-10 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                      currentChartType === 'line'
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-[#16161F] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-purple-500/50'
                    }`}
                  >
                    <i className="fas fa-chart-line text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChartTypeChange('bar')}
                    className={`w-10 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                      currentChartType === 'bar'
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-[#16161F] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-purple-500/50'
                    }`}
                  >
                    <i className="fas fa-chart-bar text-sm" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleRiskFilterChange('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      riskFilter === 'all'
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-[#16161F] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-purple-500/50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-sm font-medium">All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRiskFilterChange('good')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      riskFilter === 'good'
                        ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20'
                        : 'bg-[#16161F] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-green-500/50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm font-medium">Approved</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRiskFilterChange('bad')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      riskFilter === 'bad'
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20'
                        : 'bg-[#16161F] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-red-500/50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm font-medium">Rejected</span>
                  </button>
                </div>
              </div>

              {/* Graphiques principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="animate-fade-in-up animation-delay-300">
                  <MemoizedMainChart
                    chartType={currentChartType}
                    metric={currentMetric}
                    riskFilter={riskFilter}
                    title={chartTitle}
                  />
                </div>
                <div className="animate-fade-in-up animation-delay-400">
                  <MemoizedRiskDistributionChart
                    riskData={pieRiskData}
                    riskFilter={riskFilter}
                    onRiskFilterChange={handleRiskFilterChange}
                  />
                </div>
              </div>

              {/* Graphiques secondaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="animate-fade-in-up animation-delay-500">
                  <MemoizedAmountDistributionChart amountValue={formData.credit_amount} />
                </div>
                <div className="animate-fade-in-up animation-delay-600">
                  <MemoizedRadarChart formData={formData} />
                </div>
              </div>

              {/* Formulaire et résultats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up animation-delay-700">
                <MemoizedPredictionForm
                  formData={formData}
                  onChange={handleFieldChange}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                  loading={loading}
                />

                <div className="space-y-6">
                  {error && (
                    <div className="bg-[#16161F] rounded-2xl border border-red-500/30 p-6 animate-shake">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                          <i className="fas fa-exclamation-triangle text-2xl text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-500">Error</h3>
                          <p className="text-sm text-gray-400 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <MemoizedPredictionResult
                    predictionData={predictionData}
                    onReset={handleReset}
                  />

                  <MemoizedLiveScore formData={formData} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 z-[100] bg-[#0A0A0F]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-purple-600/20" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
            <p className="mt-6 text-gray-100 text-lg font-semibold">
              AI analysis in progress...
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Please wait while the score is being calculated
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
