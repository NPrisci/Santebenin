<script setup>
import { ref, computed } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'

const model = defineModel({
  type: [Date, String, Object],
  default: null
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `med-date-${Math.random().toString(36).substring(2, 9)}`
  },
  placeholder: {
    type: String,
    default: 'JJ/MM/AAAA'
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
  // Permet de passer des attributs spécifiques à VCalendar (ex: min-date, max-date)
  calendarAttrs: {
    type: Object,
    default: () => ({})
  }
})

// Configuration des masques au format francophone standard
const masks = ref({
  input: 'DD/MM/YYYY',
  modelValue: 'YYYY-MM-DD'
})

// Vérifie si une date est actuellement sélectionnée pour afficher le bouton Reset
const hasValue = computed(() => model.value !== null && model.value !== '')

// Fonction pour vider le champ instantanément
const clearDate = () => {
  if (!props.disabled) {
    model.value = null
  }
}
</script>

<template>
  <div class="mb-3 med-date-field-container">
    <label v-if="label" :for="id" class="form-label fw-semibold text-secondary small mb-1">
      {{ label }}
    </label>

    <VDatePicker
      v-model="model"
      :masks="masks"
      locale="fr"
      :disabled="disabled"
      v-bind="calendarAttrs"
    >
      <template #default="{ inputValue, inputEvents }">
        <div class="input-group med-date-group">
          <span class="input-group-text bg-light text-muted border-end-0">
            <i class="fas fa-calendar-day"></i>
          </span>

          <input
            :id="id"
            :value="inputValue"
            v-on="inputEvents"
            :class="['form-control', { 'is-invalid': !!error }]"
            :placeholder="placeholder"
            :disabled="disabled"
            readonly
            style="background-color: var(--bs-body-bg); cursor: pointer;"
          />

          <button
            v-if="hasValue && !disabled"
            class="btn btn-outline-secondary border-start-0 text-muted px-3 d-flex align-items-center justify-content-center"
            type="button"
            @click.stop="clearDate"
            aria-label="Effacer la date"
          >
            <i class="fas fa-times small"></i>
          </button>
        </div>
      </template>
    </VDatePicker>

    <div v-if="error" class="invalid-feedback d-block mt-1 small font-medium">
      <i class="fas fa-exclamation-circle me-1"></i> {{ error }}
    </div>

    <div v-if="helpText && !error" class="form-text text-muted mt-1">
      {{ helpText }}
    </div>
  </div>
</template>

<style scoped>
/* Focus synchrone avec l'identité de l'application médicale */
.form-control:focus {
  border-color: rgba(var(--bs-primary-rgb), 0.6);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
  z-index: 3;
}

/* Fluidité visuelle de l'input group */
.input-group:focus-within .input-group-text {
  border-color: rgba(var(--bs-primary-rgb), 0.6);
  transition: border-color 0.15s ease-in-out;
}

/* Correction cosmétique pour les boutons de groupe */
.med-date-group .btn-outline-secondary {
  border-color: var(--bs-border-color);
}
.med-date-group .btn-outline-secondary:hover {
  background-color: var(--bs-gray-100);
  color: var(--bs-danger) !important;
}
</style>