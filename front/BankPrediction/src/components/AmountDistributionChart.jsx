import { useEffect, useRef } from 'react'

const AMOUNT_LABELS = ['0-2k', '2-4k', '4-6k', '6-8k', '8-10k', '10k+']
const BASE_AMOUNT_DISTRIBUTION = [120, 200, 150, 80, 40, 20]

function AmountDistributionChart({ amountValue }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const buildAmountDistribution = (amount) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return [...BASE_AMOUNT_DISTRIBUTION]
    }

    const bucket =
      amount <= 2000
        ? 0
        : amount <= 4000
          ? 1
          : amount <= 6000
            ? 2
            : amount <= 8000
              ? 3
              : amount <= 10000
                ? 4
                : 5

    return BASE_AMOUNT_DISTRIBUTION.map((value, index) =>
      index === bucket ? Math.round(value * 1.35) : Math.max(12, Math.round(value * 0.85)),
    )
  }

  useEffect(() => {
    const Chart = window.Chart
    if (!Chart || !canvasRef.current) {
      return undefined
    }

    const context = canvasRef.current.getContext('2d')
    const data = buildAmountDistribution(Number(amountValue))

    if (!chartRef.current) {
      chartRef.current = new Chart(context, {
        type: 'bar',
        data: {
          labels: AMOUNT_LABELS,
          datasets: [
            {
              label: 'Number of credits',
              data: data,
              backgroundColor: '#8b5cf6',
              borderRadius: 4,
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
      })
    } else {
      chartRef.current.data.datasets[0].data = data
      chartRef.current.update()
    }

    return undefined
  }, [amountValue])

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <i className="fas fa-chart-bar mr-2 text-blue-500" />
        Amount distribution
      </h3>
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default AmountDistributionChart
