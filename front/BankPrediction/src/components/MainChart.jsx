import { useCallback, useEffect, useRef, useState, memo } from 'react'

const METRIC_CONFIG = {
  evolution: {
    title: 'Évolution des crédits',
    icon: 'fa-chart-line',
    approved: [65, 72, 68, 75, 70, 78],
    denied: [28, 25, 30, 22, 27, 20],
    unit: '%',
    description: 'Volume de crédits sur 6 mois'
  },
  solvability: {
    title: 'Taux de solvabilité',
    icon: 'fa-shield-alt',
    approved: [65, 68, 70, 72, 71, 70],
    denied: [35, 32, 30, 28, 29, 30],
    unit: '%',
    description: 'Capacité de remboursement'
  },
  amount: {
    title: 'Average amounts',
    icon: 'fa-coins',
    approved: [2.8, 3.0, 3.1, 3.2, 3.3, 3.2],
    denied: [1.7, 1.8, 1.9, 2.1, 2.0, 2.2],
    unit: 'kEUR',
    description: 'Montant moyen des crédits'
  },
  duration: {
    title: 'Durées moyennes',
    icon: 'fa-hourglass-half',
    approved: [18, 19, 20, 21, 21, 21],
    denied: [29, 28, 27, 26, 27, 25],
    unit: 'months',
    description: 'Durée moyenne des crédits'
  },
  accuracy: {
    title: 'Précision du modèle',
    icon: 'fa-bullseye',
    approved: [82, 83, 84, 85, 85, 85],
    denied: [18, 17, 16, 15, 15, 15],
    unit: '%',
    description: 'Fiabilité des prédictions'
  },
}

const MAIN_CHART_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']

function MainChart({ chartType, metric, riskFilter, title }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [animatedData, setAnimatedData] = useState({ approved: [], denied: [] })

  const config = METRIC_CONFIG[metric] || METRIC_CONFIG.evolution

  // Animation des données à l'entrée
  useEffect(() => {
    let startTime
    const duration = 1200
    const startApproved = Array(6).fill(0)
    const startDenied = Array(6).fill(0)
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing elastic out pour un effet plus dynamique
      const eased = progress === 1 
        ? 1 
        : 1 - Math.pow(2, -10 * progress) * Math.sin((progress - 0.075) * (2 * Math.PI) / 0.3)
      
      const newApproved = config.approved.map((val, i) => 
        startApproved[i] + (config.approved[i] - startApproved[i]) * eased
      )
      
      const newDenied = config.denied.map((val, i) => 
        startDenied[i] + (config.denied[i] - startDenied[i]) * eased
      )
      
      setAnimatedData({ approved: newApproved, denied: newDenied })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [config])

  const buildMainChart = useCallback(() => {
    const isBar = chartType === 'bar'

    return {
      type: chartType,
      data: {
        labels: MAIN_CHART_LABELS,
        datasets: [
          {
            label: 'Crédits accordés',
            data: animatedData.approved,
            borderColor: '#22C55E',
            backgroundColor: isBar ? '#22C55E' : 'transparent',
            borderWidth: 3,
            pointBackgroundColor: (ctx) => {
              const index = ctx.dataIndex
              return hoveredPoint === index ? '#F59E0B' : '#22C55E'
            },
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: (ctx) => hoveredPoint === ctx.dataIndex ? 6 : 4,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#F59E0B',
            pointHoverBorderColor: '#fff',
            tension: 0.4,
            fill: isBar ? undefined : false,
            hidden: riskFilter === 'bad',
          },
          {
            label: 'Crédits refusés',
            data: animatedData.denied,
            borderColor: '#EF4444',
            backgroundColor: isBar ? '#EF4444' : 'transparent',
            borderWidth: 3,
            pointBackgroundColor: (ctx) => {
              const index = ctx.dataIndex
              return hoveredPoint === index ? '#F59E0B' : '#EF4444'
            },
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: (ctx) => hoveredPoint === ctx.dataIndex ? 6 : 4,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#F59E0B',
            pointHoverBorderColor: '#fff',
            tension: 0.4,
            fill: isBar ? undefined : false,
            hidden: riskFilter === 'good',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // Désactivé car nous avons notre propre animation
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#1E1E2A',
            titleColor: '#F3F4F6',
            bodyColor: '#9CA3AF',
            borderColor: '#2A2A35',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ''
                const value = context.raw.toFixed(1)
                return `${label}: ${value}${config.unit}`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: (ctx) => {
                return ctx.tick.value === 0 ? '#8B5CF6' : '#2A2A35'
              },
              lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1,
            },
            ticks: {
              color: '#9CA3AF',
              callback: (value) => `${value}${config.unit}`,
              stepSize: 20,
            },
          },
          x: {
            grid: { display: false },
            ticks: { 
              color: '#9CA3AF',
              font: { size: 12 }
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        onHover: (event, elements) => {
          if (elements.length > 0) {
            setHoveredPoint(elements[0].index)
          } else {
            setHoveredPoint(null)
          }
        },
      },
    }
  }, [chartType, riskFilter, animatedData, hoveredPoint, config.unit])

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, buildMainChart())

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [buildMainChart])

  const getStats = () => {
    const avgApproved = (animatedData.approved.reduce((a, b) => a + b, 0) / 6).toFixed(1)
    const avgDenied = (animatedData.denied.reduce((a, b) => a + b, 0) / 6).toFixed(1)
    const totalApproved = animatedData.approved.reduce((a, b) => a + b, 0).toFixed(0)
    const totalDenied = animatedData.denied.reduce((a, b) => a + b, 0).toFixed(0)
    
    return { avgApproved, avgDenied, totalApproved, totalDenied }
  }

  const stats = getStats()

  return (
    <div className={`
      bg-[#16161F] rounded-2xl border border-[#2A2A35] p-6
      transition-all duration-500 hover:border-purple-600/30
      animate-fade-in-up
    `}>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <i className={`fas ${config.icon} text-purple-400`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
          </div>
        </div>
        
        {/* Mini statistiques */}
        <div className="flex items-center gap-4">
          {riskFilter !== 'bad' && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Moy. accordés</div>
              <div className="text-sm font-bold text-green-400">{stats.avgApproved}{config.unit}</div>
            </div>
          )}
          {riskFilter !== 'good' && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Moy. refusés</div>
              <div className="text-sm font-bold text-red-400">{stats.avgDenied}{config.unit}</div>
            </div>
          )}
        </div>
      </div>

      {/* Graphique */}
      <div className="relative h-64 mb-6">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Overlay au survol */}
        {hoveredPoint !== null && (
          <div className="absolute top-2 right-2 bg-[#1E1E2A] rounded-lg border border-[#2A2A35] p-3">
            <div className="text-xs text-gray-400 mb-1">
              {MAIN_CHART_LABELS[hoveredPoint]}
            </div>
            <div className="space-y-1">
              {riskFilter !== 'bad' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-300">Accordés:</span>
                  <span className="text-xs font-bold text-green-400">
                    {animatedData.approved[hoveredPoint]?.toFixed(1)}{config.unit}
                  </span>
                </div>
              )}
              {riskFilter !== 'good' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-300">Refusés:</span>
                  <span className="text-xs font-bold text-red-400">
                    {animatedData.denied[hoveredPoint]?.toFixed(1)}{config.unit}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Légendes interactives */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">Accordés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-400">Refusés</span>
          </div>
        </div>
        
        {/* Totaux */}
        <div className="text-xs text-gray-500">
          Total: {stats.totalApproved}{config.unit} / {stats.totalDenied}{config.unit}
        </div>
      </div>

      {/* Ligne de tendance */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />
    </div>
  )
}

export default memo(MainChart)