function PredictionResult({ predictionData, onReset }) {
  if (!predictionData) return null

  const isGoodPrediction = predictionData.prediction === 'good'
  const confidence = (Number(predictionData.probability) * 100).toFixed(1)
  const riskScore = (Number(predictionData.risk_score ?? predictionData.probability) * 100).toFixed(1)
  const explanationFactors = Array.isArray(predictionData.explanation)
    ? predictionData.explanation.slice(0, 3)
    : []

  return (
    <div className={`glass-card rounded-2xl p-4 sm:p-6 lg:p-8 ${isGoodPrediction ? 'result-card-good' : 'result-card-bad'}`}>
      <div className="mb-4 flex items-center space-x-3 sm:mb-6">
        <div className={`h-8 w-1 rounded-full ${isGoodPrediction ? 'bg-green-500' : 'bg-red-500'}`} />
        <h2 className="text-xl font-bold sm:text-2xl">Resultat de l analyse</h2>
      </div>

      <div className="mb-6 text-center sm:mb-8">
        <span className={`inline-block rounded-full px-4 py-2 text-base font-bold sm:px-6 sm:py-3 sm:text-xl ${isGoodPrediction ? 'badge-good' : 'badge-bad'}`}>
          {isGoodPrediction ? 'RISQUE FAIBLE' : 'RISQUE ELEVE'}
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm font-medium text-gray-400">
          <span>Confiance de l IA</span>
          <span className="text-purple-500">{confidence}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm font-medium text-gray-400">
          <span>Score de risque</span>
          <span className={isGoodPrediction ? 'text-green-500' : 'text-red-500'}>{riskScore}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isGoodPrediction ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className={`rounded-xl p-4 sm:p-6 ${isGoodPrediction ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        <h3 className={`mb-2 text-lg font-semibold ${isGoodPrediction ? 'text-green-500' : 'text-red-500'}`}>
          Recommandation du systeme
        </h3>
        <p className="text-sm text-gray-300 sm:text-base">
          {isGoodPrediction
            ? 'Ce client presente un faible risque de defaut. Le pret peut etre accorde avec des conditions standards.'
            : 'Ce client presente un risque eleve. Recommandation: refus du pret ou demande de garanties supplementaires.'}
        </p>
      </div>

      {explanationFactors.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900/50 p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Top 3 facteurs explicatifs</h3>

          <div className="space-y-3">
            {explanationFactors.map((factor, index) => (
              (() => {
                const increasesRisk = factor.direction === 'increases_risk' || factor.direction === 'increases'
                const signedImpact = Number(
                  factor.signed_impact ?? (increasesRisk ? factor.impact : -Number(factor.impact)),
                )

                return (
                  <div
                    key={`${factor.feature}-${index}`}
                    className="rounded-lg border border-gray-700 bg-gray-800/40 p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <p className="text-sm font-semibold text-gray-200">
                        {index + 1}. {factor.feature}
                      </p>
                      <span className={`text-xs font-semibold ${increasesRisk ? 'text-red-400' : 'text-green-400'}`}>
                        {increasesRisk ? 'Augmente le risque' : 'Reduit le risque'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Variation estimee du score: {signedImpact >= 0 ? '+' : ''}{(signedImpact * 100).toFixed(1)} pts
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Regle: {factor.rule}</p>
                  </div>
                )
              })()
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-semibold text-white transition-all hover:bg-gray-700"
      >
        <i className="fas fa-redo mr-2" />
        Nouvelle analyse
      </button>
    </div>
  )
}

export default PredictionResult
