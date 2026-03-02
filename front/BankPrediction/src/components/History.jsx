import { useCallback, useEffect, useMemo, useState } from 'react'

import { API_URL } from '../config/api'

function History() {
  const [predictions, setPredictions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showStats, setShowStats] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [selectedPredictionId, setSelectedPredictionId] = useState(null)

  const fetchHistory = useCallback(async (options = {}) => {
    const { withLoading = true } = options
    if (withLoading) {
      setLoading(true)
    }
    setError('')

    try {
      const response = await fetch(`${API_URL}/history`)
      const data = await response.json()
      if (!data.success) {
        setError(data.error || 'Erreur lors du chargement de l historique')
        return
      }
      setPredictions(Array.isArray(data.predictions) ? data.predictions : [])
    } catch {
      setError('Erreur de connexion')
    } finally {
      if (withLoading) {
        setLoading(false)
      }
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/history/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch {
      // silent: stats are optional
    }
  }, [])

  const refreshHistoryData = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchHistory({ withLoading: false }), fetchStats()])
    setLoading(false)
  }, [fetchHistory, fetchStats])

  const clearHistory = async () => {
    if (!window.confirm('Voulez-vous vraiment effacer tout l historique ?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/history/clear`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        setPredictions([])
        setStats({
          total: 0,
          good: 0,
          bad: 0,
          good_percentage: 0,
          average_confidence: 0,
        })
        setSelectedPredictionId(null)
      } else {
        setError(data.error || 'Erreur lors de l effacement')
      }
    } catch {
      setError('Erreur lors de l effacement')
    }
  }

  useEffect(() => {
    refreshHistoryData()
  }, [refreshHistoryData])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) {
      return 'Date inconnue'
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredPredictions = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()
    const now = Date.now()

    return [...predictions]
      .filter((prediction) => {
        if (riskFilter !== 'all' && prediction.prediction !== riskFilter) {
          return false
        }

        if (periodFilter !== 'all') {
          const timestamp = new Date(prediction.timestamp).getTime()
          if (!Number.isFinite(timestamp)) {
            return false
          }

          const oneDayMs = 24 * 60 * 60 * 1000
          const maxAgeMs = periodFilter === '7d' ? 7 * oneDayMs : 30 * oneDayMs
          if (now - timestamp > maxAgeMs) {
            return false
          }
        }

        if (!normalizedSearch) {
          return true
        }

        const searchableText = [
          prediction.id,
          prediction.prediction,
          prediction.input?.age,
          prediction.input?.credit_amount,
          prediction.input?.duration,
          formatDate(prediction.timestamp),
        ]
          .join(' ')
          .toLowerCase()

        return searchableText.includes(normalizedSearch)
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [predictions, searchText, riskFilter, periodFilter])

  const selectedPrediction = useMemo(
    () => predictions.find((prediction) => prediction.id === selectedPredictionId) || null,
    [predictions, selectedPredictionId],
  )

  const getRiskBadge = (prediction) => {
    const isGood = prediction === 'good'
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-bold ${isGood ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {isGood ? 'Risque Faible' : 'Risque Eleve'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="spinner-modern mx-auto" />
        <p className="mt-6 font-medium text-gray-400">Chargement de l historique...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Historique des Predictions</h2>
            <p className="mt-1 text-gray-400">
              {filteredPredictions.length} resultat{filteredPredictions.length !== 1 ? 's' : ''} filtre{filteredPredictions.length !== 1 ? 's' : ''}
              {' / '}
              {predictions.length} total
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refreshHistoryData}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700 sm:w-auto"
            >
              <i className="fas fa-rotate-right mr-2" />
              Recharger
            </button>
            <button
              type="button"
              onClick={() => setShowStats((prev) => !prev)}
              className="w-full rounded-xl border border-purple-500/30 bg-purple-600/20 px-4 py-2 text-sm hover:bg-purple-600/40 sm:w-auto"
            >
              <i className="fas fa-chart-bar mr-2" />
              {showStats ? 'Masquer stats' : 'Voir stats'}
            </button>
            <button
              type="button"
              onClick={clearHistory}
              className="w-full rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-2 text-sm text-red-400 hover:bg-red-600/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              disabled={predictions.length === 0}
            >
              <i className="fas fa-trash mr-2" />
              Effacer
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Rechercher (ID, age, montant, date...)"
            className="modern-input rounded-xl px-4 py-3 text-sm"
          />

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="modern-select rounded-xl px-4 py-3 text-sm"
          >
            <option value="all">Tous les resultats</option>
            <option value="good">Risque faible</option>
            <option value="bad">Risque eleve</option>
          </select>

          <select
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
            className="modern-select rounded-xl px-4 py-3 text-sm"
          >
            <option value="all">Toutes les periodes</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
        </div>
      </div>

      {showStats && stats && (
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold">Statistiques globales</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.good}</div>
              <div className="text-xs text-gray-400">Risque faible</div>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{stats.bad}</div>
              <div className="text-xs text-gray-400">Risque eleve</div>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.good_percentage}%</div>
              <div className="text-xs text-gray-400">Taux acceptation</div>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.average_confidence}%</div>
              <div className="text-xs text-gray-400">Confiance moyenne</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-500">
          <i className="fas fa-exclamation-triangle mr-2" />
          {error}
        </div>
      )}

      {filteredPredictions.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center sm:p-12">
          <i className="fas fa-inbox mb-4 text-4xl text-gray-600" />
          <p className="text-gray-400">Aucun resultat pour ces filtres</p>
          <p className="mt-2 text-sm text-gray-500">Change les filtres ou lance de nouvelles predictions.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="space-y-3 p-3 lg:hidden">
            {filteredPredictions.map((prediction) => (
              <div key={prediction.id} className="rounded-xl border border-gray-700 bg-gray-900/40 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">#{prediction.id}</p>
                    <p className="text-xs text-gray-400">{formatDate(prediction.timestamp)}</p>
                  </div>
                  {getRiskBadge(prediction.prediction)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <p>Age: {prediction.input?.age} ans</p>
                  <p>Duree: {prediction.input?.duration} mois</p>
                  <p className="col-span-2">Montant: {prediction.input?.credit_amount} EUR</p>
                </div>

                <div className="mt-3 flex items-center">
                  <div className="mr-2 h-2 w-24 rounded-full bg-gray-700">
                    <div
                      className={`h-full rounded-full ${prediction.prediction === 'good' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(Number(prediction.probability) * 100).toFixed(0)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{(Number(prediction.probability) * 100).toFixed(0)}%</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPredictionId((previous) =>
                      previous === prediction.id ? null : prediction.id,
                    )
                  }
                  className="mt-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-200 hover:bg-gray-700"
                >
                  {selectedPredictionId === prediction.id ? 'Fermer les details' : 'Voir les details'}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Duree</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Resultat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Confiance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="transition hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-400">#{prediction.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(prediction.timestamp)}</td>
                    <td className="px-4 py-3 text-sm text-white">{prediction.input?.age} ans</td>
                    <td className="px-4 py-3 text-sm text-white">{prediction.input?.credit_amount} EUR</td>
                    <td className="px-4 py-3 text-sm text-white">{prediction.input?.duration} mois</td>
                    <td className="px-4 py-3">{getRiskBadge(prediction.prediction)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-16 rounded-full bg-gray-700">
                          <div
                            className={`h-full rounded-full ${prediction.prediction === 'good' ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${(Number(prediction.probability) * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-gray-400">{(Number(prediction.probability) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPredictionId((previous) =>
                            previous === prediction.id ? null : prediction.id,
                          )
                        }
                        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700"
                      >
                        {selectedPredictionId === prediction.id ? 'Fermer' : 'Voir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPrediction && (
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h3 className="mb-4 text-base font-semibold sm:text-lg">
            Detail prediction #{selectedPrediction.id}
          </h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-gray-800/40 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-300">Entree client</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Age: {selectedPrediction.input?.age}</li>
                <li>Sexe: {selectedPrediction.input?.sex}</li>
                <li>Job: {selectedPrediction.input?.job}</li>
                <li>Logement: {selectedPrediction.input?.housing}</li>
                <li>Epargne: {selectedPrediction.input?.saving_accounts}</li>
                <li>Compte courant: {selectedPrediction.input?.checking_account}</li>
                <li>Montant: {selectedPrediction.input?.credit_amount} EUR</li>
                <li>Duree: {selectedPrediction.input?.duration} mois</li>
              </ul>
            </div>

            <div className="rounded-xl bg-gray-800/40 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-300">Top facteurs IA</h4>
              {Array.isArray(selectedPrediction.explanation) && selectedPrediction.explanation.length > 0 ? (
                <div className="space-y-3">
                  {selectedPrediction.explanation.slice(0, 3).map((factor, index) => (
                    (() => {
                      const increasesRisk = factor.direction === 'increases_risk' || factor.direction === 'increases'
                      const signedImpact = Number(
                        factor.signed_impact ?? (increasesRisk ? factor.impact : -Number(factor.impact)),
                      )

                      return (
                        <div key={`${factor.feature}-${index}`} className="rounded-lg border border-gray-700 bg-gray-900/40 p-3">
                          <p className="text-sm font-semibold text-white">
                            {index + 1}. {factor.feature}
                          </p>
                          <p className={`text-xs ${increasesRisk ? 'text-red-400' : 'text-green-400'}`}>
                            {increasesRisk ? 'Augmente le risque' : 'Reduit le risque'} ({signedImpact >= 0 ? '+' : ''}
                            {(signedImpact * 100).toFixed(1)} pts)
                          </p>
                          <p className="mt-1 text-xs text-gray-500">Regle: {factor.rule}</p>
                        </div>
                      )
                    })()
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune explication disponible pour cette prediction.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
