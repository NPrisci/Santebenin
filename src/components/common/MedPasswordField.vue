<script setup>
import { ref, computed } from 'vue'

const model = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `med-password-${Math.random().toString(36).substring(2, 9)}`
  },
  placeholder: {
    type: String,
    default: '••••••••'
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
  // 'current-password' ou 'new-password'
  autocomplete: {
    type: String,
    default: 'current-password'
  }
})

// État local pour la visibilité du texte
const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  if (!props.disabled) {
    isPasswordVisible.value = !isPasswordVisible.value
  }
}

// Détermine dynamiquement le type HTML de l'input
const inputType = computed(() => isPasswordVisible.value ? 'text' : 'password')

// Détermine l'icône Font Awesome appropriée
const toggleIcon = computed(() => isPasswordVisible.value ? 'fas fa-eye-slash' : 'fas fa-eye')
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label fw-medium text-secondary small mb-1">
      {{ label }}
    </label>

    <div class="input-group standard-password-group">
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :class="['form-control', { 'is-invalid': !!error }]"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
      />
      
      <button
        class="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
        :class="{ 'border-danger text-danger': !!error }"
        type="button"
        :disabled="disabled"
        @click="togglePasswordVisibility"
        aria-label="Afficher ou masquer le mot de passe"
      >
        <i :class="[toggleIcon, 'med-password-icon']"></i>
      </button>
    </div>

    <div v-if="error" class="invalid-feedback d-block mt-1 small font-medium">
      <i class="fas fa-exclamation-triangle me-1"></i> {{ error }}
    </div>

    <div v-if="helpText && !error" class="form-text text-muted mt-1">
      {{ helpText }}
    </div>
  </div>
</template>

<style scoped>
.form-control:focus {
  border-color: rgba(var(--bs-primary-rgb), 0.5);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.125);
  z-index: 3;
}

/* Style de l'icône Font Awesome */
.med-password-icon {
  font-size: 0.95rem; /* Ajustement de taille pour Font Awesome */
  transition: transform 0.15s ease-in-out;
}

.btn-outline-secondary:hover:not(:disabled) .med-password-icon {
  transform: scale(1.08);
}

.input-group > .form-control.is-invalid + .btn {
  border-left: none;
}
</style>