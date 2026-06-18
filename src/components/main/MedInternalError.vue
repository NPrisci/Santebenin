<script setup>
import { ref } from 'vue'
import MedButton from '@/components/common/MedButton.vue'

const props = defineProps({
  errorToken: {
    type: String,
    default: 'BS-ERR-500-HDS-77X99'
  }
})

const isCopied = ref(false)

// Action 1 : Réessayer la requête (Rechargement de la page active)
const handleRetry = () => {
  window.location.reload()
}

// Action 2 : Copier le code d'erreur pour la maintenance avec retour visuel éphémère
const handleCopyToken = async () => {
  try {
    await navigator.clipboard.writeText(props.errorToken)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch (err) {
    console.error('Impossible de copier le token : ', err)
  }
}
</script>

<template>
  <div class="med-500-container d-flex flex-column align-items-center justify-content-center px-4 text-center bg-radial-danger-clear">
    
    <div class="med-svg-wrapper mb-4 animate-float">
      <svg viewBox="0 0 450 220" width="380" height="185" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-danger" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(239, 68, 68, 0.04)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-danger)" rx="16" />

        <text
          x="95"
          y="155"
          font-family="var(--title-family), sans-serif"
          font-weight="900"
          font-size="130"
          fill="var(--medical-primary)"
          text-anchor="middle"
        >
          5
        </text>

        <g transform="translate(225, 105)">
          <circle cx="-5" cy="0" r="45" fill="none" stroke="rgba(2, 132, 199, 0.15)" stroke-width="3" />
          <path 
            d="M -45 10 L -25 10 L -20 0 L -15 20 L -10 -15 L -5 10 L 45 10" 
            fill="none" 
            stroke="var(--medical-accent-danger)" 
            stroke-width="3" 
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-flatline"
          />
          <circle cx="-5" cy="-5" r="14" fill="var(--medical-accent-danger)" class="alert-pulse" />
          <text x="-5" y="-1" font-family="var(--title-family)" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">!</text>
        </g>

        <g transform="translate(345, 105)">
          <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(2, 132, 199, 0.15)" stroke-width="3" />
          <circle 
            cx="0" 
            cy="0" 
            r="45" 
            fill="none" 
            stroke="var(--medical-secondary-light)" 
            stroke-width="3" 
            stroke-dasharray="283" 
            stroke-dashoffset="70" 
            class="animate-server-reset" 
          />
        </g>
      </svg>
    </div>

    <h2 class="fw-bold text-dark mb-2 font-title fs-3">Surcharge temporaire du système</h2>
    <p class="text-muted max-w-text mb-4 font-sans">
      Notre serveur médical subit une interruption de service inattendue. L'intégrité de vos dossiers cliniques ainsi que le chiffrement de bout en bout <span class="text-success fw-bold">restent 100% sécurisés</span>. Le système tente actuellement de réinitialiser la liaison.
    </p>

    <div class="error-badge-box d-inline-flex align-items-center gap-2 px-3 py-1.5 mb-5 rounded bg-light border">
      <span class="text-uppercase tracking-wider font-monospace extra-small text-muted">Code Incident :</span>
      <code class="text-dark fw-bold font-monospace small">{{ errorToken }}</code>
    </div>

    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 w-100">
      
      <MedButton 
        variant="primary" 
        icon="pi pi-refresh" 
        class="px-4 py-2.5 fw-bold text-uppercase tracking-wider btn-responsive"
        @click="handleRetry"
      >
        Réessayer la requête
      </MedButton>

      <MedButton 
        :variant="isCopied ? 'success' : 'outline-secondary'" 
        :icon="isCopied ? 'pi pi-check' : 'pi pi-copy'" 
        class="px-4 py-2.5 fw-bold text-uppercase tracking-wider btn-responsive transition-fast"
        @click="handleCopyToken"
      >
        {{ isCopied ? 'Code d\'erreur copié !' : 'Copier le code d\'erreur' }}
      </MedButton>

    </div>

    <div class="hds-badge d-flex align-items-center justify-content-center gap-2 position-absolute bottom-0 mb-5 start-50 translate-middle-x text-nowrap opacity-50">
      <i class="pi pi-shield text-success"></i>
      <span class="font-sans text-dark text-uppercase tracking-wider extra-small-tag">Sûreté HDS Active · Aucune donnée compromise</span>
    </div>
  </div>
</template>

<style scoped>
.med-500-container {
  font-family: var(--body-family);
  min-height: 80vh;
}

/* Fond radial teinté de rouge ultra-léger pour signaler l'alerte sans stress */
.bg-radial-danger-clear {
  background: radial-gradient(circle at center, #ffffff 0%, rgba(239, 64, 64, 0.02) 70%, var(--medical-gray-50) 100%);
}

.max-w-text {
  max-width: 560px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.btn-responsive {
  min-width: 250px;
}

.extra-small {
  font-size: 0.72rem;
}

.extra-small-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.error-badge-box {
  background-color: #f8fafc;
}

/* ==========================================================================
   ANIMATIONS DES COMPOSANTS SVG
   ========================================================================== */

/* Flottaison macro */
@keyframes float-box {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}
.animate-float {
  animation: float-box 3.5s ease-in-out infinite alternate;
}

/* Oscillation du signal ECG défaillant */
@keyframes flatline-pulse {
  0% { opacity: 0.3; transform: scaleX(0.98); }
  50% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0.3; transform: scaleX(0.98); }
}
.animate-flatline {
  transform-origin: center;
  animation: flatline-pulse 2s ease-in-out infinite;
}

/* Pulsation d'alerte lumineuse sur la pastille centrale */
@keyframes alert-glow {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.alert-pulse {
  transform-origin: -5px -5px;
  animation: alert-glow 1.8s infinite ease-in-out;
}

/* Rotation fluide infinie du second zéro représentant la réinitialisation du serveur */
@keyframes server-reset-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-server-reset {
  transform-origin: center;
  animation: server-reset-spin 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>