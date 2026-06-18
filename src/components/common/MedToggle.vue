<script setup>
import { computed } from 'vue'

// Utilisation de defineModel (Vue 3.3+) pour une gestion fluide du v-model
const model = defineModel({
  type: [Boolean, String, Number],
  default: false
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `med-switch-${Math.random().toString(36).substring(2, 9)}`
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // Permet d'utiliser autre chose que true/false (ex: 'active'/'inactive')
  trueValue: {
    type: [Boolean, String, Number],
    default: true
  },
  falseValue: {
    type: [Boolean, String, Number],
    default: false
  },
  // Tailles : 'normal', 'md', 'lg'
  size: {
    type: String,
    default: 'normal'
  },
  // Variantes : 'primary', 'success', 'danger', 'warning', 'info', 'dark'
  variant: {
    type: String,
    default: 'primary'
  }
})

// Calcul des classes dynamiques pour le conteneur et l'input
const sizeClass = computed(() => props.size !== 'normal' ? `med-switch-${props.size}` : '')
const variantStyle = computed(() => {
  return {
    '--switch-active-color': `var(--bs-${props.variant})`
  }
})
</script>

<template>
  <div class="form-check form-switch d-flex align-items-center gap-2 ps-0" :class="sizeClass" :style="variantStyle">
    <input
      v-model="model"
      :true-value="trueValue"
      :false-value="falseValue"
      class="form-check-input ms-0 cursor-pointer"
      type="checkbox"
      role="switch"
      :id="id"
      :disabled="disabled"
    />
    
    <label 
      v-if="label" 
      class="form-check-label fw-medium user-select-none cursor-pointer text-dark" 
      :for="id"
    >
      {{ label }}
    </label>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* --- Améliorations visuelles et Tailles personnalisées --- */

/* Taille Medium (md) */
.med-switch-md .form-check-input {
  width: 2.5rem;
  height: 1.25rem;
}
.med-switch-md .form-check-label {
  font-size: 1.1rem;
}

/* Taille Large (lg) */
.med-switch-lg .form-check-input {
  width: 3.2rem;
  height: 1.6rem;
}
.med-switch-lg .form-check-label {
  font-size: 1.25rem;
}

/* Gestion de la couleur dynamique Bootstrap lors de l'activation */
.form-check-input:checked {
  background-color: var(--switch-active-color, var(--bs-primary));
  border-color: var(--switch-active-color, var(--bs-primary));
}

/* Ombre légère au focus pour correspondre à la variante */
.form-check-input:focus {
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
}
</style>