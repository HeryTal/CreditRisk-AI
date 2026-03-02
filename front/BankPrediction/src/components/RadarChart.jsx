import { useCallback, useEffect, useRef } from 'react'

function RadarChart({ formData }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const buildRadarScores = useCallback(() => {
    const age = Number(formData.age) || 35
    const job = Number(formData.job) || 2
    const duration = Number(formData.duration) || 24
    const amount = Number(formData.credit_amount) || 5000

    const ageScore = Math.min(100, Math.max(0, (age - 18) * 2))
    const jobScore = (job + 1) * 25

    const savingScore =
      formData.saving_accounts === 'rich'
        ? 100
        : formData.saving_accounts === 'quite rich'
          ? 75
          : formData.saving_accounts === 'moderate'
            ? 50
            : 25

    const checkingScore =
      formData.checking_account === 'rich'
        ? 100
        : formData.checking_account === 'moderate'
          ? 60
          : 30

    const housingScore =
      formData.housing === 'own' ? 100 : formData.housing === 'free' ? 80 : 55

    const stabilityPenalty = (duration > 36 ? 15 : 0) + (amount > 10000 ? 20 : 0)
    const stabilityScore = Math.max(25, 90 - stabilityPenalty)

    return [ageScore, jobScore, savingScore, checkingScore, housingScore, stabilityScore]
  }, [formData])

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) {
      return undefined
    }

    const context = canvasRef.current.getContext('2d')
    const radarData = buildRadarScores()

    if (!chartRef.current) {
      chartRef.current = new Chart(context, {
        type: 'radar',
        data: {
          labels: ['Âge', 'Emploi', 'Épargne', 'Compte courant', 'Logement', 'Stabilité'],
          datasets: [
            {
              label: 'Profil client',
              data: radarData,
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              borderColor: '#8b5cf6',
              pointBackgroundColor: '#8b5cf6',
              pointBorderColor: '#fff',
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
            r: {
              beginAtZero: true,
              max: 100,
              grid: { color: '#2d2d3a' },
              pointLabels: { color: '#9ca3af' },
            },
          },
        },
      })
    } else {
      chartRef.current.data.datasets[0].data = radarData
      chartRef.current.update()
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [buildRadarScores])

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <i className="fas fa-bullseye mr-2 text-yellow-500" />
        Profil client
      </h3>
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default RadarChart
