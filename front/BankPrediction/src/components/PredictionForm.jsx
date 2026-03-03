import { useState, useCallback, memo } from 'react'

function PredictionForm({ formData, onChange, onSubmit, onReset, loading }) {
  const [focusedField, setFocusedField] = useState(null)
  const [touchedFields, setTouchedFields] = useState({})

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    onChange(name, value)
  }, [onChange])

  const handleFocus = useCallback((field) => {
    setFocusedField(field)
  }, [])

  const handleBlur = useCallback((field) => {
    setFocusedField(null)
    setTouchedFields(prev => ({ ...prev, [field]: true }))
  }, [])

  const getFieldStatus = (field) => {
    if (!formData[field]) return 'empty'
    if (focusedField === field) return 'focused'
    if (touchedFields[field]) return 'touched'
    return 'default'
  }

  const fields = [
    {
      name: 'age',
      label: 'Âge',
      icon: 'fa-calendar-alt',
      type: 'number',
      min: 18,
      max: 100,
      placeholder: '18-100 ans',
      tooltip: 'L\'âge du demandeur (18-100 ans)'
    },
    {
      name: 'sex',
      label: 'Sexe',
      icon: 'fa-venus-mars',
      type: 'select',
      options: [
        { value: 'male', label: 'Homme' },
        { value: 'female', label: 'Femme' }
      ],
      tooltip: 'Genre du demandeur'
    },
    {
      name: 'job',
      label: 'Emploi',
      icon: 'fa-briefcase',
      type: 'select',
      options: [
        { value: '0', label: 'Non qualifié - Non résident' },
        { value: '1', label: 'Non qualifié - Résident' },
        { value: '2', label: 'Qualifié' },
        { value: '3', label: 'Très qualifié / Cadre' }
      ],
      tooltip: 'Niveau de qualification et statut'
    },
    {
      name: 'housing',
      label: 'Logement',
      icon: 'fa-home',
      type: 'select',
      options: [
        { value: 'own', label: 'Propriétaire' },
        { value: 'rent', label: 'Locataire' },
        { value: 'free', label: 'Logement gratuit' }
      ],
      tooltip: 'Type de logement actuel'
    },
    {
      name: 'saving_accounts',
      label: 'Épargne',
      icon: 'fa-piggy-bank',
      type: 'select',
      options: [
        { value: 'little', label: 'Peu' },
        { value: 'moderate', label: 'Modéré' },
        { value: 'quite rich', label: 'Assez riche' },
        { value: 'rich', label: 'Riche' }
      ],
      tooltip: 'Niveau d\'épargne disponible'
    },
    {
      name: 'checking_account',
      label: 'Compte courant',
      icon: 'fa-credit-card',
      type: 'select',
      options: [
        { value: 'little', label: 'Peu' },
        { value: 'moderate', label: 'Modéré' },
        { value: 'rich', label: 'Riche' }
      ],
      tooltip: 'Solde du compte courant'
    },
    {
      name: 'credit_amount',
      label: 'Montant (€)',
      icon: 'fa-euro-sign',
      type: 'number',
      min: 0,
      step: 100,
      placeholder: 'Montant du crédit',
      tooltip: 'Montant demandé en euros'
    },
    {
      name: 'duration',
      label: 'Durée (mois)',
      icon: 'fa-clock',
      type: 'number',
      min: 1,
      max: 72,
      placeholder: '1-72 mois',
      tooltip: 'Durée de remboursement en mois'
    }
  ]

  return (
    <div className={`
      relative overflow-hidden
      bg-[#16161F] rounded-2xl border border-[#2A2A35] p-6
      transition-all duration-500 hover:border-purple-600/30
      animate-fade-in-up
    `}>
      {/* Effet de fond futuriste */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* En-tête */}
      <div className="relative flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <i className="fas fa-robot text-2xl text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Analyse client
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Renseignez les informations du demandeur
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {fields.map((field) => {
            const status = getFieldStatus(field.name)
            
            return (
              <div
                key={field.name}
                className={`
                  relative group transition-all duration-300
                  ${status === 'focused' ? 'scale-[1.02]' : ''}
                `}
              >
                {/* Label avec icône */}
                <label className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <i className={`fas ${field.icon} text-purple-400 transition-all duration-300 ${
                    status === 'focused' ? 'scale-110' : ''
                  }`} />
                  <span className="text-gray-300">{field.label}</span>
                  
                  {/* Tooltip */}
                  <div className="relative ml-auto">
                    <i className="fas fa-info-circle text-gray-600 hover:text-gray-400 cursor-help transition-colors" />
                    <div className="absolute right-0 top-6 w-48 p-2 bg-[#252530] rounded-lg border border-[#2A2A35] text-xs text-gray-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      {field.tooltip}
                    </div>
                  </div>
                </label>

                {/* Champ de saisie */}
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field.name)}
                    onBlur={() => handleBlur(field.name)}
                    className={`
                      w-full px-4 py-3 bg-[#1A1A24] rounded-xl border
                      text-white outline-none appearance-none
                      transition-all duration-300
                      ${status === 'focused' 
                        ? 'border-purple-600 ring-2 ring-purple-600/20' 
                        : status === 'touched'
                          ? 'border-green-600/30'
                          : 'border-[#2A2A35] hover:border-purple-600/30'
                      }
                    `}
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#1A1A24]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field.name)}
                    onBlur={() => handleBlur(field.name)}
                    className={`
                      w-full px-4 py-3 bg-[#1A1A24] rounded-xl border
                      text-white outline-none
                      transition-all duration-300
                      ${status === 'focused' 
                        ? 'border-purple-600 ring-2 ring-purple-600/20' 
                        : status === 'touched'
                          ? 'border-green-600/30'
                          : 'border-[#2A2A35] hover:border-purple-600/30'
                      }
                    `}
                  />
                )}

                {/* Indicateur de validation */}
                {status === 'touched' && formData[field.name] && (
                  <div className="absolute right-3 top-9 text-green-500">
                    <i className="fas fa-check-circle text-sm" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Barre de progression du formulaire */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Complétion du formulaire</span>
            <span className="text-xs font-medium text-purple-400">
              {Object.values(formData).filter(Boolean).length}/{fields.length}
            </span>
          </div>
          <div className="h-1.5 bg-[#1A1A24] rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ 
                width: `${(Object.values(formData).filter(Boolean).length / fields.length) * 100}%` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-1 relative overflow-hidden group
              py-4 px-6 rounded-xl font-semibold
              transition-all duration-300 transform
              ${loading 
                ? 'bg-purple-600/50 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98]'
              }
              text-white shadow-lg shadow-purple-600/20
            `}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-brain" />
                  <span>Analyser avec l'IA</span>
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="
              px-6 py-4 bg-[#1A1A24] rounded-xl border border-[#2A2A35]
              text-gray-300 font-semibold
              transition-all duration-300
              hover:bg-[#1F1F2B] hover:border-purple-600/30 hover:text-white
              active:scale-[0.98]
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <i className="fas fa-redo-alt" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>

        {/* Indicateur de champs requis */}
        <p className="text-xs text-gray-600 mt-4 text-center">
          <i className="fas fa-shield-alt mr-1 text-purple-400/50" />
          Toutes les informations sont confidentielles et sécurisées
        </p>
      </form>
    </div>
  )
}

export default memo(PredictionForm)