<script setup>
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

const model = defineModel({
  type: [String, Number],
  default: ''
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `med-input-${Math.random().toString(36).substring(2, 9)}`
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // Tailles : 'sm', 'md', 'lg'
  size: {
    type: String,
    default: 'md'
  },
  // Icône Font Awesome à gauche (ex: 'fas fa-user')
  iconLeft: {
    type: String,
    default: ''
  },
  // Texte d'unité ou suffixe à droite (ex: 'bpm', 'kg', 'mmHg')
  addonRight: {
    type: String,
    default: ''
  },
  // Active les étiquettes flottantes Bootstrap 5
  floating: {
    type: Boolean,
    default: false
  }
})

// Détermination des classes de dimensionnement
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'form-control-sm'
  if (props.size === 'lg') return 'form-control-lg'
  return ''
})

const inputGroupSizeClass = computed(() => {
  if (props.size === 'sm') return 'input-group-sm'
  if (props.size === 'lg') return 'input-group-lg'
  return ''
})

// Validation de la présence d'un groupe d'habillage
const hasGroup = computed(() => !!props.iconLeft || !!props.addonRight)
</script>

<template>
  <div class="mb-3">
    
    <label 
      v-if="label && !floating" 
      :for="id" 
      class="form-label fw-semibold text-secondary small mb-1"
    >
      {{ label }}
    </label>

    <div :class="[hasGroup ? 'input-group' : '', inputGroupSizeClass, floating ? 'form-floating' : '']">
      
      <span v-if="iconLeft" class="input-group-text bg-light text-muted border-end-0">
        <i :class="iconLeft"></i>
      </span>

      <input
        :id="id"
        v-model="model"
        :type="type"
        :class="[
          'form-control', 
          sizeClass, 
          { 'is-invalid': !!error, 'ps-3': !iconLeft }
        ]"
        :disabled="disabled"
        v-bind="$attrs"
      />

      <label v-if="label && floating" :for="id" class="text-secondary">
        {{ label }}
      </label>

      <span v-if="addonRight" class="input-group-text bg-light fw-bold text-secondary font-monospace border-start-0 text-sm">
        {{ addonRight }}
      </span>
      
    </div>

    <div v-if="error" class="invalid-feedback d-block mt-1 small font-medium">
      <i class="fas fa-exclamation-circle me-1"></i> {{ error }}
    </div>

    <div v-if="helpText && !error" class="form-text text-muted mt-1">
      {{ helpText }}
    </div>

  </div>
</template>

<style scoped>
/* Focus hautement fluide et visible pour guider l'œil du médecin */
.form-control:focus {
  border-color: rgba(var(--bs-primary-rgb), 0.6);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
  z-index: 4;
}

/* Fluidité visuelle pour les éléments adjacents du groupe lors du focus */
.input-group:focus-within .input-group-text {
  border-color: rgba(var(--bs-primary-rgb), 0.6);
  transition: border-color 0.15s ease-in-out;
}

/* Gestion fine des bordures pour les icônes à gauche */
.input-group > .input-theme-icon + .form-control {
  border-left: none;
}

/* Désactivation des flèches d'incrémentation natives agressives sur les inputs numériques */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>