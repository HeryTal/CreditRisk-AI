const STATS_CONFIG = {
  solvability: {
    title: 'Taux de solvabilité',
    value: '70%',
    icon: 'fa-chart-line',
    color: 'purple',
    width: '70%',
  },
  amount: {
    title: 'Montant moyen',
    value: '€3.2k',
    icon: 'fa-chart-bar',
    color: 'pink',
    width: '65%',
  },
  duration: {
    title: 'Durée moyenne',
    value: '21 mois',
    icon: 'fa-clock',
    color: 'blue',
    width: '45%',
  },
  accuracy: {
    title: 'Précision modèle',
    value: '85%',
    icon: 'fa-check-circle',
    color: 'green',
    width: '85%',
  },
}

function StatsCards({ onMetricClick, currentMetric }) {
  const metrics = ['solvability', 'amount', 'duration', 'accuracy']

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const config = STATS_CONFIG[metric]
        const isActive = currentMetric === metric
        return (
          <div
            key={metric}
            className={`stat-card cursor-pointer rounded-xl p-3 transition-all sm:p-4 ${
              isActive ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => onMetricClick(metric)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xl font-bold text-${config.color}-500 sm:text-2xl`}>
                  {config.value}
                </div>
                <div className="text-xs text-gray-400">{config.title}</div>
              </div>
              <i className={`fas ${config.icon} text-xl text-${config.color}-500/50 sm:text-2xl`} />
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full bg-${config.color}-500`}
                style={{ width: config.width }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
