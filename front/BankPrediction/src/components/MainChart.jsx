import { useCallback, useEffect, useRef } from 'react'

const METRIC_CONFIG = {
  evolution: {
    title: 'Évolution des crédits',
    approved: [65, 72, 68, 75, 70, 78],
    denied: [28, 25, 30, 22, 27, 20],
  },
  solvability: {
    title: 'Taux de solvabilité',
    approved: [65, 68, 70, 72, 71, 70],
    denied: [35, 32, 30, 28, 29, 30],
  },
  amount: {
    title: 'Montants moyens (k€)',
    approved: [2.8, 3.0, 3.1, 3.2, 3.3, 3.2],
    denied: [1.7, 1.8, 1.9, 2.1, 2.0, 2.2],
  },
  duration: {
    title: 'Durées moyennes (mois)',
    approved: [18, 19, 20, 21, 21, 21],
    denied: [29, 28, 27, 26, 27, 25],
  },
  accuracy: {
    title: 'Précision du modèle (%)',
    approved: [82, 83, 84, 85, 85, 85],
    denied: [18, 17, 16, 15, 15, 15],
  },
}

const MAIN_CHART_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']

function MainChart({ chartType, metric, riskFilter, title }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const buildMainChart = useCallback(() => {
    const config = METRIC_CONFIG[metric] || METRIC_CONFIG.evolution
    const isBar = chartType === 'bar'

    return {
      type: chartType,
      data: {
        labels: MAIN_CHART_LABELS,
        datasets: [
          {
            label: 'Crédits accordés',
            data: config.approved,
            borderColor: '#10b981',
            backgroundColor: isBar ? '#10b981' : 'transparent',
            tension: 0.4,
            fill: false,
            hidden: riskFilter === 'bad',
          },
          {
            label: 'Crédits refusés',
            data: config.denied,
            borderColor: '#ef4444',
            backgroundColor: isBar ? '#ef4444' : 'transparent',
            tension: 0.4,
            fill: false,
            hidden: riskFilter === 'good',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            grid: { color: '#2d2d3a' },
            ticks: { color: '#9ca3af' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af' },
          },
        },
      },
    }
  }, [chartType, metric, riskFilter])

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) {
      return undefined
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const context = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(context, buildMainChart())

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [buildMainChart])

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold">
          <i className="fas fa-chart-line mr-2 text-purple-500" />
          {title}
        </h3>
      </div>
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default MainChart
