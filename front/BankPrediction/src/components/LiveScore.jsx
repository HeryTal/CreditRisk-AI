import { useMemo, useState, useEffect, memo } from 'react'

function LiveScore({ formData }) {
  const [animatedScore, setAnimatedScore] = useState(50)
  const [previousScore, setPreviousScore] = useState(50)
  const [showTooltip, setShowTooltip] = useState(false)

  const score = useMemo(() => {
    const age = Number(formData.age) || 35
    const amount = Number(formData.credit_amount) || 5000
    const duration = Number(formData.duration) || 24
    
    // Calcul plus sophistiqué
    let baseScore = 75
    
    // Facteurs d'âge
    if (age < 25) baseScore -= 5
    else if (age > 60) baseScore -= 8
    else if (age > 45) baseScore += 3
    
    // Facteurs de crédit
    if (amount > 15000) baseScore -= 25
    else if (amount > 10000) baseScore -= 15
    else if (amount > 5000) baseScore -= 5
    
    if (duration > 48) baseScore -= 20
    else if (duration > 36) baseScore -= 10
    else if (duration < 12) baseScore += 5
    
    // Bonus épargne
    const savingsBonus = 
      formData.saving_accounts === 'rich' ? 15 :
      formData.saving_accounts === 'quite rich' ? 10 :
      formData.saving_accounts === 'moderate' ? 5 : 0
    
    // Bonus compte courant
    const checkingBonus = 
      formData.checking_account === 'rich' ? 12 :
      formData.checking_account === 'moderate' ? 6 : 0
    
    // Bonus emploi
    const jobBonus = 
      formData.job === '3' ? 10 :
      formData.job === '2' ? 5 : 0
    
    // Bonus logement
    const housingBonus = 
      formData.housing === 'own' ? 8 :
      formData.housing === 'free' ? 5 : 0

    const finalScore = Math.max(0, Math.min(100, 
      baseScore + savingsBonus + checkingBonus + jobBonus + housingBonus
    ))
    
    return Math.round(finalScore)
  }, [formData])

  // Animation du score
  useEffect(() => {
    setPreviousScore(animatedScore)
    const duration = 1000
    const startTime = Date.now()
    const startValue = animatedScore
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing cubic-out
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (score - startValue) * eased
      
      setAnimatedScore(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score])

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-400', label: 'Excellent' }
    if (score >= 65) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Bon' }
    if (score >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Moyen' }
    if (score >= 35) return { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Faible' }
    return { bg: 'bg-red-500', text: 'text-red-400', label: 'Critique' }
  }

  const scoreColor = getScoreColor(score)
  const scorePercentage = animatedScore

  return (
    <div className={`
      relative overflow-hidden
      bg-[#16161F] rounded-2xl border border-[#2A2A35] p-6
      transition-all duration-500 hover:border-purple-600/30
      animate-fade-in-up
    `}>
      {/* Effet de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-r ${scoreColor.bg} opacity-20`} />
      </div>

      {/* En-tête */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
            <i className="fas fa-bolt text-purple-400 text-sm" />
          </div>
          <h3 className="text-sm font-medium text-gray-300">
            Score en temps réel
          </h3>
        </div>
        
        {/* Badge de niveau */}
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${scoreColor.bg} bg-opacity-20 ${scoreColor.text}
          border border-current border-opacity-30
        `}>
          {scoreColor.label}
        </div>
      </div>

      {/* Score principal */}
      <div className="relative flex items-end justify-between mb-4">
        <div>
          <div className="text-4xl font-bold text-white">
            {Math.round(scorePercentage)}
            <span className="text-lg text-gray-500 ml-1">/100</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Évolution: {score > previousScore ? (
              <span className="text-green-400">
                <i className="fas fa-arrow-up mr-1" />
                +{Math.round(score - previousScore)} pts
              </span>
            ) : score < previousScore ? (
              <span className="text-red-400">
                <i className="fas fa-arrow-down mr-1" />
                -{Math.round(previousScore - score)} pts
              </span>
            ) : (
              <span className="text-gray-400">Stable</span>
            )}
          </div>
        </div>

        {/* Cercle de progression */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#252530"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - scorePercentage / 100)}`}
              className={`${scoreColor.text} transition-all duration-1000`}
              style={{ stroke: `var(--${scoreColor.bg.replace('bg-', '')})` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${scoreColor.text}`}>
              {Math.round(scorePercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Barre de progression principale */}
      <div 
        className="relative h-3 bg-[#1A1A24] rounded-full overflow-hidden mb-3 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ${scoreColor.bg}`}
          style={{ width: `${scorePercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                        bg-[#1E1E2A] border border-[#2A2A35] rounded-lg px-3 py-2
                        text-xs text-white whitespace-nowrap z-10
                        animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Score actuel:</span>
              <span className={`font-bold ${scoreColor.text}`}>
                {Math.round(scorePercentage)}%
              </span>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {scoreColor.label}
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs de seuils */}
      <div className="relative h-1 mb-4">
        <div className="absolute inset-0 flex justify-between">
          {[0, 25, 50, 75, 100].map((threshold) => (
            <div
              key={threshold}
              className="relative"
              style={{ left: `${threshold}%` }}
            >
              <div className="absolute w-px h-2 bg-[#2A2A35] -translate-x-1/2" />
              <div className="absolute -translate-x-1/2 mt-3 text-[10px] text-gray-600">
                {threshold}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Légendes */}
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>Risque élevé</span>
        <span>Risque faible</span>
      </div>

      {/* Facteurs d'influence */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <i className="fas fa-check-circle text-green-500/50 text-[10px]" />
          <span className="text-gray-500">Âge: </span>
          <span className="text-gray-300">{formData.age} ans</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-check-circle text-green-500/50 text-[10px]" />
          <span className="text-gray-500">Montant: </span>
          <span className="text-gray-300">{Number(formData.credit_amount).toLocaleString()} €</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-check-circle text-green-500/50 text-[10px]" />
          <span className="text-gray-500">Durée: </span>
          <span className="text-gray-300">{formData.duration} mois</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-check-circle text-green-500/50 text-[10px]" />
          <span className="text-gray-500">Épargne: </span>
          <span className="text-gray-300">{formData.saving_accounts}</span>
        </div>
      </div>

      {/* Ligne de séparation décorative */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />
    </div>
  )
}

export default memo(LiveScore)