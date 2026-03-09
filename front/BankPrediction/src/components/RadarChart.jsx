import { useCallback, useEffect, useRef, useState, memo } from 'react'

function RadarChart({ formData }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [animatedScores, setAnimatedScores] = useState([50, 50, 50, 50, 50, 50])
  const [hoveredDimension, setHoveredDimension] = useState(null)

  const buildRadarScores = useCallback(() => {
    const age = Number(formData.age) || 35
    const job = Number(formData.job) || 2
    const duration = Number(formData.duration) || 24
    const amount = Number(formData.credit_amount) || 5000

    const ageScore = Math.min(100, Math.max(0, ((age - 18) / 62) * 100))

    const jobScore =
      job === 0 ? 20 :
        job === 1 ? 45 :
          job === 2 ? 70 :
            job === 3 ? 90 : 100

    const savingScore =
      formData.saving_accounts === 'rich' ? 100 :
        formData.saving_accounts === 'quite rich' ? 85 :
          formData.saving_accounts === 'moderate' ? 60 :
            formData.saving_accounts === 'little' ? 35 : 15

    const checkingScore =
      formData.checking_account === 'rich' ? 100 :
        formData.checking_account === 'moderate' ? 70 :
          formData.checking_account === 'little' ? 40 : 20

    const housingScore =
      formData.housing === 'own' ? 100 :
        formData.housing === 'free' ? 85 :
          formData.housing === 'rent' ? 60 : 40

    const stabilityScore = Math.max(20,
      100 - (duration > 36 ? (duration - 36) * 2 : 0)
      - (amount > 10000 ? (amount - 10000) / 500 : 0)
    )

    return [ageScore, jobScore, savingScore, checkingScore, housingScore, stabilityScore]
  }, [formData])

  useEffect(() => {
    const targetScores = buildRadarScores()
    let startTime
    const duration = 1200

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const eased = progress === 1
        ? 1
        : 1 - Math.pow(2, -10 * progress) * Math.sin((progress - 0.075) * (2 * Math.PI) / 0.3)

      const newScores = animatedScores.map((start, i) =>
        start + (targetScores[i] - start) * eased
      )

      setAnimatedScores(newScores)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [buildRadarScores])

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)')
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)')

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Age', 'Employment', 'Savings', 'Checking account', 'Housing', 'Stability'],
        datasets: [
          {
            label: 'Client profile',
            data: animatedScores,
            backgroundColor: gradient,
            borderColor: '#8B5CF6',
            borderWidth: 2,
            pointBackgroundColor: (context) => {
              const index = context.dataIndex
              return hoveredDimension === index ? '#F59E0B' : '#8B5CF6'
            },
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: (context) => hoveredDimension === context.dataIndex ? 6 : 4,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#F59E0B',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
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
            callbacks: {
              label: (context) => {
                const value = context.raw.toFixed(1)
                const label = context.label
                const descriptions = {
                  Age: 'Score based on the applicant age',
                  Employment: 'Employment stability and type',
                  Savings: 'Available savings level',
                  'Checking account': 'Checking account balance',
                  Housing: 'Housing type',
                  Stability: 'Credit duration/amount ratio'
                }
                return [
                  `Score: ${value}%`,
                  descriptions[label] || ''
                ]
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: (context) => {
                const value = context.tick.value
                return value === 100 ? '#8B5CF6' : '#2A2A35'
              },
              lineWidth: (context) => context.tick.value === 100 ? 2 : 1,
            },
            angleLines: {
              color: '#2A2A35',
            },
            pointLabels: {
              color: (context) => {
                return hoveredDimension === context.index ? '#F59E0B' : '#9CA3AF'
              },
              font: {
                size: (context) => hoveredDimension === context.index ? 13 : 12,
                weight: (context) => hoveredDimension === context.index ? '600' : '400',
              },
            },
            ticks: {
              stepSize: 20,
              color: '#6B7280',
              backdropColor: 'transparent',
            },
          },
        },
        onHover: (_event, elements) => {
          if (elements.length > 0) {
            setHoveredDimension(elements[0].index)
          } else {
            setHoveredDimension(null)
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
  }, [animatedScores, hoveredDimension])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-blue-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const dimensions = [
    { key: 'age', label: 'Age', icon: 'fa-calendar' },
    { key: 'job', label: 'Employment', icon: 'fa-briefcase' },
    { key: 'saving', label: 'Savings', icon: 'fa-piggy-bank' },
    { key: 'checking', label: 'Checking account', icon: 'fa-credit-card' },
    { key: 'housing', label: 'Housing', icon: 'fa-home' },
    { key: 'stability', label: 'Stability', icon: 'fa-shield-alt' },
  ]

  return (
    <div className={`
      bg-[#16161F] rounded-2xl border border-[#2A2A35] p-6
      transition-all duration-500 hover:border-purple-600/30
      animate-fade-in-up
    `}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <i className="fas fa-bullseye text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Client profile</h3>
            <p className="text-xs text-gray-500 mt-0.5">Multidimensional analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Average score</span>
          <span className="font-bold text-white">
            {(animatedScores.reduce((a, b) => a + b, 0) / 6).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="relative h-64 mb-6">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {dimensions.map((dim, index) => (
          <div
            key={dim.key}
            className={`
              p-3 rounded-xl border transition-all duration-300
              ${hoveredDimension === index
                ? 'border-purple-600/50 bg-purple-600/5'
                : 'border-[#2A2A35] bg-[#1A1A24]'
              }
            `}
            onMouseEnter={() => setHoveredDimension(index)}
            onMouseLeave={() => setHoveredDimension(null)}
          >
            <div className="flex items-center gap-2">
              <div className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${hoveredDimension === index ? 'bg-purple-400 scale-125' : 'bg-gray-600'}
              `} />
              <i className={`fas ${dim.icon} text-xs text-gray-500`} />
              <span className="text-xs text-gray-400 flex-1">{dim.label}</span>
              <span className={`text-sm font-bold ${getScoreColor(animatedScores[index])}`}>
                {animatedScores[index].toFixed(0)}%
              </span>
            </div>

            <div className="mt-2 h-1 bg-[#252530] rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-500
                  ${animatedScores[index] >= 80 ? 'bg-green-500' :
                    animatedScores[index] >= 60 ? 'bg-blue-500' :
                      animatedScores[index] >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'}
                `}
                style={{ width: `${animatedScores[index]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {hoveredDimension !== null && (
        <div className="mt-4 p-3 rounded-xl bg-purple-600/5 border border-purple-600/20">
          <div className="flex items-center gap-2 text-xs">
            <i className="fas fa-info-circle text-purple-400" />
            <span className="text-gray-400">
              Selected dimension: <span className="text-white font-medium">
                {dimensions[hoveredDimension].label}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(RadarChart)
