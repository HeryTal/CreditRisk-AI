// Configuration de l'API
const API_URL = 'http://localhost:5000';

// Éléments du DOM
const form = document.getElementById('creditForm');
const submitBtn = document.getElementById('submitBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const resultDiv = document.getElementById('result');

// Gestionnaire de soumission du formulaire
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = {
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        job: document.getElementById('job').value,
        housing: document.getElementById('housing').value,
        saving_accounts: document.getElementById('saving_accounts').value,
        checking_account: document.getElementById('checking_account').value,
        credit_amount: document.getElementById('credit_amount').value,
        duration: document.getElementById('duration').value
    };
    
    // Validation basique
    if (!validateForm(formData)) {
        return;
    }
    
    // Afficher le chargement
    showLoading(true);
    hideError();
    hideResult();
    
    try {
        // Appel à l'API
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResult(data);
        } else {
            showError(data.error || 'Erreur lors de la prédiction');
        }
    } catch (err) {
        showError('Erreur de connexion au serveur. Vérifiez que le backend est lancé.');
        console.error('Erreur:', err);
    } finally {
        showLoading(false);
    }
});

// Validation du formulaire
function validateForm(data) {
    if (data.age < 18 || data.age > 100) {
        showError('L\'âge doit être compris entre 18 et 100 ans');
        return false;
    }
    
    if (data.credit_amount <= 0) {
        showError('Le montant du crédit doit être supérieur à 0');
        return false;
    }
    
    if (data.duration < 1 || data.duration > 72) {
        showError('La durée doit être comprise entre 1 et 72 mois');
        return false;
    }
    
    return true;
}

// Afficher le résultat
function displayResult(data) {
    const isGood = data.prediction === 'good';
    const confidence = (data.probability * 100).toFixed(1);
    const riskScore = (data.risk_score * 100).toFixed(1);
    
    const resultHTML = `
        <div class="glass-card rounded-2xl p-8 ${isGood ? 'result-card-good' : 'result-card-bad'}" data-aos="fade-up">
            <div class="flex items-center space-x-3 mb-6">
                <div class="w-1 h-8 bg-gradient-to-b ${isGood ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'} rounded-full"></div>
                <h2 class="text-2xl font-bold">Résultat de l'analyse</h2>
            </div>
            
            <div class="text-center mb-8">
                <div class="inline-block mb-4">
                    <span class="px-6 py-3 rounded-full text-xl font-bold ${isGood ? 'badge-good' : 'badge-bad'}">
                        ${isGood ? '✅ RISQUE FAIBLE' : '⚠️ RISQUE ÉLEVÉ'}
                    </span>
                </div>
                <p class="text-gray-400">Client classé comme: 
                    <span class="font-bold ${isGood ? 'text-green-500' : 'text-red-500'}">
                        ${isGood ? 'Fiable' : 'À risque'}
                    </span>
                </p>
            </div>
            
            <!-- Barre de confiance -->
            <div class="mb-6">
                <div class="flex justify-between text-sm font-medium text-gray-400 mb-2">
                    <span>Confiance de l'IA</span>
                    <span class="text-purple-500">${confidence}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${confidence}%"></div>
                </div>
            </div>
            
            <!-- Score de risque -->
            <div class="mb-8">
                <div class="flex justify-between text-sm font-medium text-gray-400 mb-2">
                    <span>Score de risque</span>
                    <span class="${isGood ? 'text-green-500' : 'text-red-500'}">${riskScore}%</span>
                </div>
                <div class="progress-bar">
                    <div class="h-full rounded-full transition-all duration-500 ${isGood ? 'bg-green-500' : 'bg-red-500'}"
                         style="width: ${riskScore}%"></div>
                </div>
            </div>
            
            <!-- Recommandation détaillée -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white/5 rounded-xl p-4">
                    <div class="text-sm text-gray-400 mb-1">Montant demandé</div>
                    <div class="text-xl font-bold text-white">€${document.getElementById('credit_amount').value}</div>
                </div>
                <div class="bg-white/5 rounded-xl p-4">
                    <div class="text-sm text-gray-400 mb-1">Durée</div>
                    <div class="text-xl font-bold text-white">${document.getElementById('duration').value} mois</div>
                </div>
            </div>
            
            <!-- Recommandation -->
            <div class="mt-6 p-6 rounded-xl ${isGood ? 'bg-green-500/10' : 'bg-red-500/10'}">
                <div class="flex items-start space-x-4">
                    <div class="text-3xl ${isGood ? 'text-green-500' : 'text-red-500'}">
                        ${isGood ? '✓' : '✗'}
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2 ${isGood ? 'text-green-500' : 'text-red-500'}">
                            Recommandation du système
                        </h3>
                        <p class="text-gray-300">
                            ${isGood 
                                ? 'Ce client présente un faible risque de défaut. Le prêt peut être accordé avec des conditions standards.'
                                : 'Ce client présente un risque élevé. Recommandation : refus du prêt ou demande de garanties supplémentaires (caution, garant, taux majoré).'}
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Bouton nouvelle prédiction -->
            <button onclick="resetForm()" 
                    class="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40">
                <i class="fas fa-redo mr-2"></i>
                Nouvelle analyse
            </button>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.remove('hidden');
    
    // Reinitialiser AOS pour animer le nouveau contenu
    AOS.refresh();
}

// Réinitialiser le formulaire
window.resetForm = function() {
    form.reset();
    hideResult();
    hideError();
    
    // Réinitialiser les valeurs par défaut
    document.getElementById('sex').value = 'male';
    document.getElementById('job').value = '2';
    document.getElementById('housing').value = 'own';
    document.getElementById('saving_accounts').value = 'little';
    document.getElementById('checking_account').value = 'little';
    
    // Scroll vers le formulaire
    form.scrollIntoView({ behavior: 'smooth' });
}

// Afficher/Masquer le chargement
function showLoading(show) {
    if (show) {
        loadingDiv.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        loadingDiv.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// Afficher une erreur
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.scrollIntoView({ behavior: 'smooth' });
}

// Masquer l'erreur
function hideError() {
    errorDiv.classList.add('hidden');
}

// Masquer le résultat
function hideResult() {
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';
}

// Vérifier la santé du serveur au chargement
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            console.log('✅ Serveur connecté');
            // Afficher une notification discrète
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-green-500/20 border border-green-500/30 text-green-500 px-6 py-3 rounded-xl fade-in';
            toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Serveur connecté';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    } catch (err) {
        console.warn('⚠️ Serveur non disponible');
        showError('Le serveur backend n\'est pas accessible. Lancez-le avec "python app.py"');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkServerHealth();
});