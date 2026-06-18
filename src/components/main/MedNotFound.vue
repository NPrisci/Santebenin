<!-- components/MedNotFound.vue -->
<script setup>
import { useRouter } from 'vue-router'
import MedButton from '@/components/common/MedButton.vue' // Votre composant de bouton standardisé

const router = useRouter()

// Actions de secours programmées
const navigateToDashboard = () => {
  router.push('/services')
}

const navigateToPreviousPage = () => {
  router.back()
}

const triggerCustomerSupport = () => {
  window.location.href = 'mailto:[EMAIL_ADDRESS]?subject=Erreur 404 - Navigation Clinique'
}
</script>

<template>
  <div class="med-404-container min-vh-100 d-flex flex-column align-items-center justify-content-center px-4 text-center bg-radial-clear">
    
    <!-- CONTENEUR DE L'ILLUSTRATION SVG CINÉTIQUE -->
    <div class="med-svg-wrapper mb-4 animate-float">
      <svg viewBox="0 0 450 220" width="380" height="185" xmlns="http://www.w3.org/2000/svg">
        <!-- Grille de fond type papier millimétré médical -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10, 127, 112, 0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" rx="16" />

        <!-- PREMIER CHIFFRE : 4 -->
        <text
          x="100"
          y="155"
          font-family="var(--title-family), sans-serif"
          font-weight="900"
          font-size="130"
          fill="var(--medical-primary)"
          text-anchor="middle"
          class="num-static"
        >
          4
        </text>

        <!-- DEUXIÈME CHIFFRE : LE 0 REVISITÉ EN RADAR CLINIQUE -->
        <g transform="translate(225, 105)">
          <!-- Anneau extérieur pulsant -->
          <circle cx="0" cy="0" r="55" fill="none" stroke="rgba(49, 105, 155, 0.15)" stroke-width="2" class="radar-pulse-outer" />
          
          <!-- Anneau intermédiaire avec pointillés de balayage -->
          <circle cx="0" cy="0" r="42" fill="none" stroke="var(--medical-secondary)" stroke-width="3" stroke-dasharray="8, 6" class="radar-sweep" />
          
          <!-- La Croix Médicale centrale égarée -->
          <path 
            d="M -12 -4 L -4 -4 L -4 -12 L 4 -12 L 4 -4 L 12 -4 L 12 4 L 4 4 L 4 12 L -4 12 L -4 4 L -12 4 Z" 
            fill="var(--medical-secondary-light)" 
            class="medical-cross-glow"
          />
        </g>

        <!-- TROISIÈME CHIFFRE : 4 -->
        <text
          x="350"
          y="155"
          font-family="var(--title-family), sans-serif"
          font-weight="900"
          font-size="130"
          fill="var(--medical-primary)"
          text-anchor="middle"
          class="num-static"
        >
          4
        </text>
      </svg>
    </div>

    <!-- EN-TÊTE ET TEXTES EXPLICITÉS (UX BIENVEILLANTE) -->
    <h2 class="fw-bold text-dark mb-2 font-title fs-3">Destination clinique introuvable</h2>
    <p class="text-muted max-w-text mb-5 font-sans">
      Le dossier, le rapport médical ou la page que vous recherchez semble avoir été déplacé, archivé ou le lien d'accès est temporairement obsolète. Vos données cliniques globales restent parfaitement protégées.
    </p>

    <!-- HUB DE REDIRECTION (VOS 3 BOUTONS AVEC MEDBUTTON) -->
    <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 w-100">
      
      <!-- BOUTON 1 : RETOUR A MON ESPACE (PRIMARY ACTION) -->
      <MedButton 
        variant="primary" 
        icon="pi pi-home" 
        class="px-4 py-2.5 fw-bold text-uppercase tracking-wider btn-responsive"
        @click="navigateToDashboard"
      >
        Retour à mon espace
      </MedButton>

      <!-- BOUTON 2 : RETOUR PAGE PRECEDENTE (SECONDARY ACTION) -->
      <MedButton 
        variant="outline-secondary" 
        icon="pi pi-arrow-left" 
        class="px-4 py-2.5 fw-bold text-uppercase tracking-wider btn-responsive"
        @click="navigateToPreviousPage"
      >
        Page précédente
      </MedButton>

      <!-- BOUTON 3 : CONTACTER SERVICE CLIENT (SUPPORT ACTION) -->
      <MedButton 
        variant="link" 
        icon="pi pi-phone" 
        class="text-decoration-none fw-bold extra-small text-uppercase tracking-wider link-support mt-2 mt-sm-0"
        @click="triggerCustomerSupport"
      >
        Contacter le service client
      </MedButton>

    </div>
  </div>
</template>

<style scoped>
.med-404-container {
  font-family: var(--body-family);
  min-height: 100vh;
}

/* Fond doux en dégradé radial pour installer une ambiance sereine */
.bg-radial-clear {
  background: radial-gradient(circle at center, #ffffff 0%, var(--medical-gray-50) 100%);
}

.max-w-text {
  max-width: 540px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.btn-responsive {
  min-width: 230px;
}

.extra-small {
  font-size: 0.8rem;
}

.link-support {
  color: var(--medical-primary);
  transition: color var(--transition-fast) ease;
}
.link-support:hover {
  color: var(--medical-primary-dark);
}

/* ==========================================================================
   ANIMATIONS DU MODULE GEOMÉTRIQUE (STYLE SIGNATURE)
   ========================================================================== */

/* Flottaison douce de l'ensemble de la carte SVG */
@keyframes float-box {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}
.animate-float {
  animation: float-box 3.5s ease-in-out infinite alternate;
}

/* Rotation fluide et infinie du radar (le zéro) */
@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.radar-sweep {
  transform-origin: center;
  animation: radar-spin 6s linear infinite;
}

/* Onde de choc circulaire pulsante */
@keyframes pulse-ring {
  0% { transform: scale(0.92); opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { transform: scale(1.08); opacity: 0; }
}
.radar-pulse-outer {
  transform-origin: center;
  animation: pulse-ring 2.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
}

/* Battement de luminosité sur la croix médicale centrale */
@keyframes cross-glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(10, 127, 112, 0.3)); opacity: 0.8; }
  50% { filter: drop-shadow(0 0 8px rgba(10, 127, 112, 0.7)); opacity: 1; }
}
.medical-cross-glow {
  animation: cross-glow 2s ease-in-out infinite;
}

.num-static {
  user-select: none;
}
</style>