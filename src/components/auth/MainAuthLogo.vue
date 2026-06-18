<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Étape actuelle du formulaire (1: Identification, 2: Habilitation, 3: Sécurité OTP)
  step: {
    type: Number,
    default: 1
  },
  // Variante de couleur selon le fond ('dark' pour écriture sombre, 'light' pour écriture blanche)
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  }
})

// Libellés cliniques dynamiques pour rendre le wordmark utile à l'UX
const stepMetadata = computed(() => {
  switch (props.step) {
    case 1:
      return { label: 'Identification', colorClass: 'bg-primary-subtle text-primary border-primary-subtle' }
    case 2:
      return { label: 'Habilitation', colorClass: 'bg-info-subtle text-info border-info-subtle' }
    case 3:
      return { label: 'Sécurité HDS', colorClass: 'bg-success-subtle text-success border-success-subtle' }
    default:
      return { label: 'Portail National', colorClass: 'bg-secondary-subtle text-secondary' }
  }
})
</script>

<template>
  <div 
    class="med-wordmark d-inline-flex align-items-center unselectable"
    :class="`variant-${variant}`"
  >
    <div class="emblem-container me-2 position-relative">
      <svg 
        viewBox="0 0 24 24" 
        width="28" 
        height="28" 
        xmlns="http://www.w3.org/2000/svg"
        class="emblem-svg"
      >
        <line 
          x1="3" 
          y1="12" 
          x2="21" 
          y2="12" 
          class="line-horizontal"
          stroke-width="3.5" 
          stroke-linecap="round" 
        />
        <line 
          x1="12" 
          y1="3" 
          x2="12" 
          y2="21" 
          class="line-vertical"
          stroke-width="3.5" 
          stroke-linecap="round" 
        />
      </svg>
      <span class="activity-heartbeat"></span>
    </div>

    <div class="d-flex flex-column align-items-start lh-1">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <h5 class="brand-text font-title mb-0 fw-extrabold tracking-tight fs-2">
          Bénin<span class="brand-subtext fw-light">Santé</span>
        </h5>
        
        <Transition name="badge-pop" mode="out-in">
          <span 
            :key="step"
            class="badge step-context-badge border font-monospace text-uppercase"
            :class="stepMetadata.colorClass"
          >
            {{ stepMetadata.label }}
          </span>
        </Transition>
      </div>
      <small class="brand-caption text-uppercase tracking-widest mt-1">
        Ministère de la Santé
      </small>
    </div>
  </div>
</template>

<style scoped>
.med-wordmark {
  user-select: none;
}

/* --- LOGIQUE DES COULEURS PAR VARIANTE --- */
.variant-dark .brand-text { color: var(--medical-gray-900, #1e293b); }
.variant-dark .brand-subtext { color: var(--medical-primary, #31699b); }
.variant-dark .brand-caption { color: var(--medical-gray-500, #64748b); }

.variant-light .brand-text { color: #ffffff; }
.variant-light .brand-subtext { color: var(--medical-secondary-light, #38bdf8); }
.variant-light .brand-caption { color: rgba(255, 255, 255, 0.6); }

/* --- TYPOGRAPHIES RIGOUREUSES --- */
.brand-text {
  font-size: 1.15rem;
  letter-spacing: -0.025em;
}
.brand-caption {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}
.step-context-badge {
  font-size: 0.62rem;
  padding: 0.25em 0.6em;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* --- ANIMATIONS ET VITALITÉ DE L'EMBLÈME --- */
.emblem-svg {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
/* Micro-rotation de l'emblème au survol pour simuler la réactivité technique */
.med-wordmark:hover .emblem-svg {
  transform: rotate(90deg);
}

.variant-dark .line-horizontal { stroke: var(--medical-secondary, #0a7f70); }
.variant-dark .line-vertical { stroke: var(--medical-primary, #31699b); }

.variant-light .line-horizontal { stroke: var(--medical-secondary-light, #38bdf8); }
.variant-light .line-vertical { stroke: #ffffff; }

/* Pulsation organique discrète sur le point d'intersection de la croix */
.activity-heartbeat {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: var(--medical-secondary-light, #38bdf8);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  animation: clinical-pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes clinical-pulse {
  0% { transform: translate(-50%, -50__) scale(0.9); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
  70% { transform: translate(-50%, -50__) scale(1); box-shadow: 0 0 0 6px rgba(56, 189, 248, 0); }
  100% { transform: translate(-50%, -50__) scale(0.9); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
}

/* --- TRANSITION DU BADGE CONTEXTUEL --- */
.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.badge-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(3px);
}
.badge-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-3px);
}
</style>