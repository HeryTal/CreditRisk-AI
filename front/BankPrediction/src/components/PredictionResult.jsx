import { useEffect, useState, memo } from 'react'

function PredictionResult({ predictionData, onReset }) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [animatedRisk, setAnimatedRisk] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const probability = Number(predictionData?.probability ?? 0)
  const isGoodPrediction = predictionData?.prediction === 'good'
  const confidence = Math.min(100, Number((probability * 100).toFixed(1)))
  const riskScore = Math.min(
    100,
    Number((predictionData?.risk_score ?? probability * 100).toFixed(1)),
  )
  const explanationFactors = Array.isArray(predictionData?.explanation)
    ? predictionData.explanation.slice(0, 3)
    : []

  // Animation des scores
  useEffect(() => {
    if (!predictionData) {
      return undefined
    }

    const duration = 1500
    const startTime = Date.now()
    let frameId

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing elastic out
      const eased = progress === 1 
        ? 1 
        : 1 - Math.pow(2, -10 * progress) * Math.sin((progress - 0.075) * (2 * Math.PI) / 0.3)
      
      setAnimatedConfidence(confidence * eased)
      setAnimatedRisk(riskScore * eased)
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }
    
    frameId = requestAnimationFrame(animate)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [predictionData, confidence, riskScore])

  if (!predictionData) return null

  const getRiskLevel = (score) => {
    if (score < 30) return { label: 'Très faible', color: 'green', icon: 'fa-shield-alt' }
    if (score < 50) return { label: 'Faible', color: 'emerald', icon: 'fa-check-circle' }
    if (score < 70) return { label: 'Modéré', color: 'yellow', icon: 'fa-exclamation-triangle' }
    if (score < 85) return { label: 'Élevé', color: 'orange', icon: 'fa-exclamation-circle' }
    return { label: 'Très élevé', color: 'red', icon: 'fa-times-circle' }
  }

  const riskLevel = getRiskLevel(riskScore)

  return (
    <div className={`
      relative overflow-hidden
      bg-[#16161F] rounded-2xl border 
      transition-all duration-500
      animate-fade-in-up
      ${isGoodPrediction 
        ? 'border-green-600/30 hover:border-green-600/50' 
        : 'border-red-600/30 hover:border-red-600/50'
      }
    `}>
      {/* Effet de fond avec particules */}
      <div className="absolute inset-0 opacity-10">
        <div className={`
          absolute inset-0 bg-gradient-to-br 
          ${isGoodPrediction 
            ? 'from-green-600/20 via-transparent to-transparent' 
            : 'from-red-600/20 via-transparent to-transparent'
          }
        `} />
      </div>

      {/* En-tête avec icône animée */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-300 transform
              ${isGoodPrediction 
                ? 'bg-green-600/20 group-hover:scale-110' 
                : 'bg-red-600/20 group-hover:scale-110'
              }
            `}>
              <i className={`
                fas fa-robot text-2xl
                ${isGoodPrediction ? 'text-green-400' : 'text-red-400'}
              `} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Résultat de l'analyse
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Prédiction IA • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Badge de risque avec animation */}
          <div className={`
            relative px-4 py-2 rounded-xl border
            ${isGoodPrediction 
              ? 'bg-green-600/10 border-green-600/30' 
              : 'bg-red-600/10 border-red-600/30'
            }
          `}>
            <div className="flex items-center gap-2">
              <span className={`
                w-2 h-2 rounded-full animate-pulse
                ${isGoodPrediction ? 'bg-green-500' : 'bg-red-500'}
              `} />
              <span className={`
                font-bold text-sm
                ${isGoodPrediction ? 'text-green-400' : 'text-red-400'}
              `}>
                {isGoodPrediction ? 'RISQUE FAIBLE' : 'RISQUE ÉLEVÉ'}
              </span>
            </div>
          </div>
        </div>

        {/* Cartes de scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A1A24] rounded-xl border border-[#2A2A35] p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-brain text-purple-400 text-sm" />
              <span className="text-xs text-gray-500">Confiance IA</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {animatedConfidence.toFixed(0)}%
            </div>
            <div className="h-2 bg-[#252530] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${animatedConfidence}%` }}
              />
            </div>
          </div>

          <div className="bg-[#1A1A24] rounded-xl border border-[#2A2A35] p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className={`fas ${riskLevel.icon} text-sm ${isGoodPrediction ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-xs text-gray-500">Score risque</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {animatedRisk.toFixed(0)}%
            </div>
            <div className="h-2 bg-[#252530] rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-300
                  ${riskLevel.color === 'green' ? 'bg-green-500' :
                    riskLevel.color === 'emerald' ? 'bg-emerald-500' :
                    riskLevel.color === 'yellow' ? 'bg-yellow-500' :
                    riskLevel.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'}
                `}
                style={{ width: `${animatedRisk}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Niveau: <span className={`
                font-medium
                ${riskLevel.color === 'green' ? 'text-green-400' :
                  riskLevel.color === 'emerald' ? 'text-emerald-400' :
                  riskLevel.color === 'yellow' ? 'text-yellow-400' :
                  riskLevel.color === 'orange' ? 'text-orange-400' :
                  'text-red-400'}
              `}>{riskLevel.label}</span>
            </div>
          </div>
        </div>

        {/* Section recommandation */}
        <div className={`
          relative mb-6 p-5 rounded-xl border
          ${isGoodPrediction 
            ? 'bg-green-600/5 border-green-600/20' 
            : 'bg-red-600/5 border-red-600/20'
          }
        `}>
          <div className="flex items-start gap-3">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${isGoodPrediction ? 'bg-green-600/20' : 'bg-red-600/20'}
            `}>
              <i className={`fas fa-${isGoodPrediction ? 'check' : 'times'} ${isGoodPrediction ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">
                Recommandation du système
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isGoodPrediction
                  ? 'Ce client présente un faible risque de défaut. Le prêt peut être accordé avec des conditions standards.'
                  : 'Ce client présente un risque élevé. Recommandation: refus du prêt ou demande de garanties supplémentaires.'}
              </p>
            </div>
          </div>
        </div>

        {/* Facteurs explicatifs */}
        {explanationFactors.length > 0 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 bg-[#1A1A24] rounded-xl border border-[#2A2A35] hover:border-purple-600/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-bar text-purple-400 text-sm" />
                <span className="font-medium text-white">Facteurs d'influence</span>
              </div>
              <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'} text-gray-500 transition-transform`} />
            </button>

            {showDetails && (
              <div className="mt-3 space-y-2 animate-slide-down">
                {explanationFactors.map((factor, index) => {
                  const increasesRisk = factor.direction === 'increases_risk' || factor.direction === 'increases'
                  const impact = Math.abs(Number(factor.impact) * 100).toFixed(1)
                  
                  return (
                    <div
                      key={`${factor.feature}-${index}`}
                      className="p-4 bg-[#1A1A24] rounded-xl border border-[#2A2A35] hover:border-purple-600/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {index + 1}. {factor.feature}
                          </span>
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${increasesRisk 
                              ? 'bg-red-600/10 text-red-400' 
                              : 'bg-green-600/10 text-green-400'
                            }
                          `}>
                            {increasesRisk ? 'Risque +' : 'Risque -'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-purple-400">
                          {impact} pts
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {factor.rule}
                      </p>

                      {/* Barre d'impact */}
                      <div className="mt-2 h-1 bg-[#252530] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            increasesRisk ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, Number(impact))}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 px-4 bg-[#1A1A24] rounded-xl border border-[#2A2A35] 
                     text-gray-300 font-medium transition-all
                     hover:bg-[#1F1F2B] hover:border-purple-600/30 hover:text-white
                     flex items-center justify-center gap-2"
          >
            <i className="fas fa-redo text-sm" />
            Nouvelle analyse
          </button>
          
          <button
            type="button"
            className="p-3 bg-[#1A1A24] rounded-xl border border-[#2A2A35] 
                     text-gray-400 transition-all
                     hover:bg-[#1F1F2B] hover:border-purple-600/30 hover:text-purple-400"
          >
            <i className="fas fa-download" />
          </button>
        </div>
      </div>

      {/* Ligne de progression temporelle */}
      <div className="relative h-1 bg-[#1A1A24] overflow-hidden">
        <div
          className={`
            absolute inset-y-0 left-0 w-1/3 rounded-full
            transition-all duration-1000
            ${isGoodPrediction ? 'bg-green-500' : 'bg-red-500'}
          `}
          style={{
            width: `${animatedConfidence}%`,
            transition: 'width 0.5s ease'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default memo(PredictionResult)
