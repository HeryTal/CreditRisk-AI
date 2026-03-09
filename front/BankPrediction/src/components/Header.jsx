function Header({ serverAvailable, apiUrl }) {
  return (
    <header className="relative overflow-hidden py-6 sm:py-8 md:py-12">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-4 inline-block">
          <span className="rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            <i className="fas fa-robot mr-2 text-purple-500" />
            AI Analytics Dashboard
          </span>
        </div>
        <h1 className="mb-3 text-3xl font-black leading-tight text-white sm:text-5xl md:mb-4 md:text-6xl">CreditRisk AI</h1>
        <p className="mx-auto max-w-2xl px-2 text-sm text-gray-400 sm:text-base md:text-lg">
          Analyse interactive de crédit avec visualisation en temps réel
        </p>
        {!serverAvailable && (
          <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-300 sm:text-sm">
            Backend non détecté sur {apiUrl}. Vérifie que Flask tourne.
          </p>
        )}
      </div>
    </header>
  )
}

export default Header
