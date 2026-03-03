import { memo } from 'react'

const STATS_CONFIG = {
  solvability: {
    title: 'Taux de solvabilité',
    value: '70%',
    icon: 'fa-chart-line',
    color: 'purple',
    width: '70%',
    description: 'Clients solvables',
    trend: '+5.2%',
    trendUp: true
  },
  amount: {
    title: 'Montant moyen',
    value: '€3.2k',
    icon: 'fa-coins',
    color: 'pink',
    width: '65%',
    description: 'Crédit moyen',
    trend: '+2.1%',
    trendUp: true
  },
  duration: {
    title: 'Durée moyenne',
    value: '21 mois',
    icon: 'fa-hourglass-half',
    color: 'blue',
    width: '45%',
    description: 'Période de remboursement',
    trend: '-3 mois',
    trendUp: false
  },
  accuracy: {
    title: 'Précision modèle',
    value: '85%',
    icon: 'fa-bullseye',
    color: 'green',
    width: '85%',
    description: 'Fiabilité des prédictions',
    trend: '+1.5%',
    trendUp: true
  },
}

const colorClasses = {
  purple: {
    bg: 'bg-purple-600',
    bgLight: 'bg-purple-600/10',
    text: 'text-purple-400',
    border: 'border-purple-600/20',
    hover: 'hover:border-purple-600/40',
    glow: 'shadow-purple-600/20'
  },
  pink: {
    bg: 'bg-pink-600',
    bgLight: 'bg-pink-600/10',
    text: 'text-pink-400',
    border: 'border-pink-600/20',
    hover: 'hover:border-pink-600/40',
    glow: 'shadow-pink-600/20'
  },
  blue: {
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-600/10',
    text: 'text-blue-400',
    border: 'border-blue-600/20',
    hover: 'hover:border-blue-600/40',
    glow: 'shadow-blue-600/20'
  },
  green: {
    bg: 'bg-green-600',
    bgLight: 'bg-green-600/10',
    text: 'text-green-400',
    border: 'border-green-600/20',
    hover: 'hover:border-green-600/40',
    glow: 'shadow-green-600/20'
  }
}

function StatsCards({ onMetricClick, currentMetric }) {
  const metrics = ['solvability', 'amount', 'duration', 'accuracy']

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const config = STATS_CONFIG[metric]
        const colors = colorClasses[config.color]
        const isActive = currentMetric === metric
        
        return (
          <div
            key={metric}
            className={`
              group relative overflow-hidden
              bg-[#16161F] rounded-2xl border 
              transition-all duration-500 cursor-pointer
              hover:scale-[1.02] hover:shadow-xl
              ${colors.border} ${colors.hover}
              ${isActive ? `ring-2 ${colors.bg} ring-offset-2 ring-offset-[#0A0A0F]` : ''}
              animate-fade-in-up
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onMetricClick(metric)}
          >
            {/* Effet de brillance au survol */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 
              transition-opacity duration-700 pointer-events-none
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              -translate-x-full group-hover:translate-x-full
              duration-1000
            `} />

            {/* Icône de fond */}
            <div className={`
              absolute -right-4 -top-4 w-24 h-24 rounded-full 
              ${colors.bgLight} opacity-30 group-hover:opacity-50 
              transition-opacity duration-500 blur-2xl
            `} />

            <div className="relative p-5">
              {/* En-tête avec icône et valeur */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`
                    text-3xl font-bold tracking-tight
                    ${colors.text} transition-all duration-300
                    group-hover:scale-105 group-hover:translate-x-1
                  `}>
                    {config.value}
                  </div>
                  <div className="text-sm font-medium text-gray-400 mt-1">
                    {config.title}
                  </div>
                </div>
                
                {/* Icône avec animation */}
                <div className={`
                  w-12 h-12 rounded-xl ${colors.bgLight} 
                  flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110
                  ${isActive ? colors.bg : ''}
                `}>
                  <i className={`
                    fas ${config.icon} text-xl
                    ${isActive ? 'text-white' : colors.text}
                    transition-all duration-300
                  `} />
                </div>
              </div>

              {/* Description et tendance */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  {config.description}
                </span>
                <span className={`
                  text-xs font-medium flex items-center gap-1
                  ${config.trendUp ? 'text-green-400' : 'text-red-400'}
                `}>
                  <i className={`fas fa-arrow-${config.trendUp ? 'up' : 'down'} text-[10px]`} />
                  {config.trend}
                </span>
              </div>

              {/* Barre de progression avec animation */}
              <div className="relative h-2 bg-[#252530] rounded-full overflow-hidden">
                <div
                  className={`
                    absolute left-0 top-0 h-full rounded-full
                    transition-all duration-1000 ease-out
                    ${colors.bg}
                  `}
                  style={{ 
                    width: config.width,
                    transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Effet de pulsation sur la barre */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                    -translate-x-full animate-shimmer
                  `} />
                </div>
              </div>

              {/* Indicateur de sélection */}
              {isActive && (
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1 
                  ${colors.bg} transform scale-x-100
                  transition-transform duration-300
                `}>
                  <div className={`
                    absolute inset-0 ${colors.bg} 
                    animate-pulse opacity-50
                  `} />
                </div>
              )}
            </div>

            {/* Effet de bordure lumineuse au survol */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
              transition-opacity duration-500 pointer-events-none
              shadow-[0_0_30px_-5px] ${colors.glow}
            `} />
          </div>
        )
      })}
    </div>
  )
}

export default memo(StatsCards)