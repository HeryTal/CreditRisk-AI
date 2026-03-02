import { useEffect, useRef } from 'react'

function RiskDistributionChart({ riskData, riskFilter, onRiskFilterChange }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) {
      return undefined
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const context = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(context, {
      type: 'doughnut',
      data: {
        labels: ['Risque faible', 'Risque eleve'],
        datasets: [
          {
            data: riskData,
            backgroundColor: ['#10b981', '#ef4444'],
            borderColor: 'transparent',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.raw}%`
              },
            },
          },
        },
        onClick: (_event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index
            onRiskFilterChange(index === 0 ? 'good' : 'bad')
          }
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [riskData, onRiskFilterChange])

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold">
          <i className="fas fa-chart-pie mr-2 text-pink-500" />
          Distribution des risques
        </h3>
        <div className="text-sm text-gray-400">
          <span>{riskData[0]}%</span> / <span>{riskData[1]}%</span>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className={`flex cursor-pointer items-center rounded-lg px-2 py-1 transition ${
            riskFilter === 'good' ? 'bg-green-500/20 text-green-300' : 'text-gray-300'
          }`}
          onClick={() => onRiskFilterChange('good')}
        >
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400">Risque faible</span>
        </button>
        <button
          type="button"
          className={`flex cursor-pointer items-center rounded-lg px-2 py-1 transition ${
            riskFilter === 'bad' ? 'bg-red-500/20 text-red-300' : 'text-gray-300'
          }`}
          onClick={() => onRiskFilterChange('bad')}
        >
          <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-400">Risque eleve</span>
        </button>
        <button
          type="button"
          className={`rounded-lg border px-2 py-1 text-xs transition ${
            riskFilter === 'all'
              ? 'border-purple-500/50 bg-purple-600/30 text-white'
              : 'border-gray-700 bg-gray-800 text-gray-300'
          }`}
          onClick={() => onRiskFilterChange('all')}
        >
          Tous
        </button>
      </div>
    </div>
  )
}

export default RiskDistributionChart
