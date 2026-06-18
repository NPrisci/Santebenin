<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Variantes Bootstrap : 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
  // Accepte aussi les versions 'outline-*' (ex: 'outline-primary')
  variant: {
    type: String,
    default: 'primary'
  },
  // Tailles : 'sm', 'md', 'lg'
  size: {
    type: String,
    default: 'md'
  },
  type: {
    type: String,
    default: 'button'
  },
  // État de chargement (affiche un spinner et désactive le bouton)
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // Icône Font Awesome à gauche (ex: 'fas fa-plus')
  icon: {
    type: String,
    default: ''
  },
  // Icône Font Awesome à droite (ex: 'fas fa-arrow-right')
  iconRight: {
    type: String,
    default: ''
  },
  // Transforme le bouton en bloc pleine largeur (w-100)
  block: {
    type: Boolean,
    default: false
  },
  // Si renseigné, transforme le composant en lien <a>
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: '_self'
  }
})

defineEmits(['click'])

// Détermination dynamique du tag HTML
const tagName = computed(() => (props.href ? 'a' : 'button'))

// Cumul des états de blocage
const isInteractiveDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="tagName"
    :type="!href ? type : undefined"
    :href="href || undefined"
    :target="href ? target : undefined"
    :disabled="!href && isInteractiveDisabled ? true : undefined"
    :aria-disabled="isInteractiveDisabled ? 'true' : undefined"
    :class="[
      'btn med-btn d-inline-flex align-items-center justify-content-center fw-semibold',
      `btn-${variant}`,
      size !== 'md' ? `btn-${size}` : '',
      { 'w-100': block, 'disabled': isInteractiveDisabled }
    ]"
    @click="!isInteractiveDisabled ? $emit('click', $event) : $event.preventDefault()"
  >
    <span 
      v-if="loading" 
      class="spinner-border spinner-border-sm med-btn-spinner me-2" 
      role="status" 
      aria-hidden="true"
    ></span>

    <i v-if="icon && !loading" :class="[icon, 'med-btn-icon-left', { 'me-2': $slots.default }]"></i>

    <span v-if="$slots.default" class="med-btn-text text-truncate">
      <slot />
    </span>

    <i v-if="iconRight" :class="[iconRight, 'med-btn-icon-right', { 'ms-2': $slots.default }]"></i>
  </component>
</template>

<style scoped>
.med-btn {
  letter-spacing: -0.01em;
  transition: all 0.15s ease-in-out;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem; /* Coins adoucis cohérents avec notre charte */
}

/* Alignement parfait des icônes et du texte */
.med-btn :deep(i),
.med-btn-spinner {
  flex-shrink: 0;
}

/* Micro-interaction physique au clic / pression */
.med-btn:active:not(.disabled) {
  transform: scale(0.98);
}

/* Optimisation de la transition du spinner */
.med-btn-spinner {
  animation: spinner-border .65s linear infinite;
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.15em;
}

/* Éviter les sauts de couleur abrupts sur le focus d'accessibilité */
.med-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.35);
}

/* Adaptation spécifique pour les variantes sombres ou outline */
.btn-outline-secondary:focus-visible {
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-gray-500-rgb), 0.25);
}
</style>