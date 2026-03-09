import { useEffect, useRef, useState, useCallback, memo } from 'react'

function RiskDistributionChart({ riskData, riskFilter, onRiskFilterChange }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [hoveredSegment, setHoveredSegment] = useState(null)
  const [animatedData, setAnimatedData] = useState(riskData)

  useEffect(() => {
    let startTime
    const duration = 1000
    const startData = [50, 50]

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)

      const newData = [
        startData[0] + (riskData[0] - startData[0]) * eased,
        startData[1] + (riskData[1] - startData[1]) * eased
      ]

      setAnimatedData(newData)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [riskData])

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) {
      return undefined
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient1.addColorStop(0, '#22C55E')
    gradient1.addColorStop(1, '#16A34A')

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient2.addColorStop(0, '#EF4444')
    gradient2.addColorStop(1, '#DC2626')

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low risk', 'High risk'],
        datasets: [
          {
            data: animatedData,
            backgroundColor: [gradient1, gradient2],
            borderColor: 'transparent',
            borderRadius: 8,
            spacing: 4,
            hoverOffset: 15,
            weight: 0.5
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        radius: '90%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: '#1E1E2A',
            titleColor: '#F3F4F6',
            bodyColor: '#9CA3AF',
            borderColor: '#2A2A35',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const value = context.raw.toFixed(1)
                return `${value}% of applications`
              },
              afterLabel: (context) => {
                const total = riskData[0] + riskData[1]
                const percentage = ((context.raw / total) * 100).toFixed(1)
                return `Rate: ${percentage}%`
              }
            }
          }
        },
        onClick: (_event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index
            onRiskFilterChange(index === 0 ? 'good' : 'bad')
          }
        },
        onHover: (_event, elements) => {
          if (elements.length > 0) {
            setHoveredSegment(elements[0].index)
          } else {
            setHoveredSegment(null)
          }
        }
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [animatedData, onRiskFilterChange, riskData])

  const handleFilterChange = useCallback((filter) => {
    onRiskFilterChange(filter)
  }, [onRiskFilterChange])

  return (
    <div className={`
      bg-[#16161F] rounded-2xl border border-[#2A2A35] p-6
      transition-all duration-500 hover:border-purple-600/30
      animate-fade-in-up
    `}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <i className="fas fa-chart-pie text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Risk distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Application analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{riskData[0]}%</span>
          <span className="text-gray-500">/</span>
          <span className="text-sm font-medium text-white">{riskData[1]}%</span>
        </div>
      </div>

      <div className="relative h-64 mb-6">
        <canvas ref={canvasRef} className="w-full h-full" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {riskData[0] + riskData[1]}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total applications</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => handleFilterChange('good')}
          className={`
            relative overflow-hidden group
            bg-[#1A1A24] rounded-xl border p-4
            transition-all duration-300
            ${riskFilter === 'good'
              ? 'border-green-600/50 bg-green-600/5'
              : 'border-[#2A2A35] hover:border-green-600/30 hover:bg-green-600/5'
            }
          `}
        >
          {riskFilter === 'good' && (
            <div className="absolute inset-0 bg-green-600/5 animate-pulse" />
          )}

          <div className="relative flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full bg-green-500
              transition-all duration-300
              ${riskFilter === 'good' ? 'scale-125' : ''}
              ${hoveredSegment === 0 ? 'animate-ping' : ''}
            `} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">
                Low risk
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Applications</span>
                <span className="text-sm font-bold text-green-400">
                  {riskData[0].toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2A2A35]">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${riskData[0]}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('bad')}
          className={`
            relative overflow-hidden group
            bg-[#1A1A24] rounded-xl border p-4
            transition-all duration-300
            ${riskFilter === 'bad'
              ? 'border-red-600/50 bg-red-600/5'
              : 'border-[#2A2A35] hover:border-red-600/30 hover:bg-red-600/5'
            }
          `}
        >
          {riskFilter === 'bad' && (
            <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
          )}

          <div className="relative flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full bg-red-500
              transition-all duration-300
              ${riskFilter === 'bad' ? 'scale-125' : ''}
              ${hoveredSegment === 1 ? 'animate-ping' : ''}
            `} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">
                High risk
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Applications</span>
                <span className="text-sm font-bold text-red-400">
                  {riskData[1].toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2A2A35]">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${riskData[1]}%` }}
            />
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={() => handleFilterChange('all')}
        className={`
          w-full py-3 rounded-xl border transition-all duration-300
          flex items-center justify-center gap-2 text-sm font-medium
          ${riskFilter === 'all'
            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
            : 'bg-[#1A1A24] border-[#2A2A35] text-gray-400 hover:bg-[#1F1F2B] hover:border-purple-600/30'
          }
        `}
      >
        <i className={`fas fa-eye text-xs ${riskFilter === 'all' ? 'text-white' : 'text-gray-500'}`} />
        View all applications
      </button>
    </div>
  )
}

export default memo(RiskDistributionChart)
