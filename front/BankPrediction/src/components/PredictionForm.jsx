function PredictionForm({ formData, onChange, onSubmit, onReset, loading }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center space-x-3 sm:mb-8">
        <div className="h-8 w-1 rounded-full bg-purple-500" />
        <h2 className="text-xl font-bold sm:text-2xl">Analyse client</h2>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-calendar-alt mr-2 text-purple-500" />
              Âge
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="100"
              required
              className="modern-input w-full rounded-xl px-4 py-3"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-venus-mars mr-2 text-purple-500" />
              Sexe
            </label>
            <select
              name="sex"
              className="modern-select w-full rounded-xl px-4 py-3"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-briefcase mr-2 text-purple-500" />
              Emploi
            </label>
            <select
              name="job"
              className="modern-select w-full rounded-xl px-4 py-3"
              value={formData.job}
              onChange={handleChange}
            >
              <option value="0">Non qualifié - Non résident</option>
              <option value="1">Non qualifié - Résident</option>
              <option value="2">Qualifié</option>
              <option value="3">Très qualifié / Cadre</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-home mr-2 text-purple-500" />
              Logement
            </label>
            <select
              name="housing"
              className="modern-select w-full rounded-xl px-4 py-3"
              value={formData.housing}
              onChange={handleChange}
            >
              <option value="own">Propriétaire</option>
              <option value="rent">Locataire</option>
              <option value="free">Logement gratuit</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-piggy-bank mr-2 text-purple-500" />
              Épargne
            </label>
            <select
              name="saving_accounts"
              className="modern-select w-full rounded-xl px-4 py-3"
              value={formData.saving_accounts}
              onChange={handleChange}
            >
              <option value="little">Peu</option>
              <option value="moderate">Modéré</option>
              <option value="quite rich">Assez riche</option>
              <option value="rich">Riche</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-credit-card mr-2 text-purple-500" />
              Compte courant
            </label>
            <select
              name="checking_account"
              className="modern-select w-full rounded-xl px-4 py-3"
              value={formData.checking_account}
              onChange={handleChange}
            >
              <option value="little">Peu</option>
              <option value="moderate">Modéré</option>
              <option value="rich">Riche</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-euro-sign mr-2 text-purple-500" />
              Montant (€)
            </label>
            <input
              type="number"
              name="credit_amount"
              min="0"
              step="100"
              required
              className="modern-input w-full rounded-xl px-4 py-3"
              value={formData.credit_amount}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <i className="fas fa-clock mr-2 text-purple-500" />
              Durée (mois)
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              max="72"
              required
              className="modern-input w-full rounded-xl px-4 py-3"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="modern-button w-full rounded-xl px-4 py-3 text-base font-bold text-white sm:flex-1 sm:px-6 sm:py-4 sm:text-lg"
          >
            <i className="fas fa-brain mr-2" />
            {loading ? 'Analyse en cours...' : "Analyser avec l'IA"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-semibold text-white transition-all hover:bg-gray-700 sm:w-auto sm:px-6 sm:py-4"
          >
            <i className="fas fa-redo mr-2" />
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  )
}

export default PredictionForm
