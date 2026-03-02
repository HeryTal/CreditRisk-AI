import { useMemo } from 'react'

function LiveScore({ formData }) {
  const score = useMemo(() => {
    const age = Number(formData.age) || 35
    const amount = Number(formData.credit_amount) || 5000
    const duration = Number(formData.duration) || 24
    const savingsBonus =
      formData.saving_accounts === 'rich' ? 8 : formData.saving_accounts === 'quite rich' ? 4 : 0
    const checkingBonus = formData.checking_account === 'rich' ? 6 : formData.checking_account === 'moderate' ? 2 : 0

    const score = 70 - (age > 50 ? 10 : 0) - (amount > 10000 ? 20 : 0) - (duration > 36 ? 15 : 0) + savingsBonus + checkingBonus

    return Math.max(0, Math.min(100, score))
  }, [formData])

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-400">Score en temps réel</h3>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className="h-full rounded-full bg-purple-500 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Risque élevé</span>
        <span>Risque faible</span>
      </div>
    </div>
  )
}

export default LiveScore
