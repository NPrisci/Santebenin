<script setup>
import { computed } from "vue";

// Désactiver l'héritage automatique pour cibler précisément le textarea
defineOptions({
  inheritAttrs: false,
});

// Gestion du v-model (Vue 3.3+)
const model = defineModel({
  type: String,
  default: "",
});

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: () => `med-textarea-${Math.random().toString(36).substring(2, 9)}`,
  },
  rows: {
    type: [Number, String],
    default: 4,
  },
  // Options de redimensionnement : 'none', 'vertical', 'horizontal', 'both'
  resize: {
    type: String,
    default: "vertical",
    validator: (value) =>
      ["none", "vertical", "horizontal", "both"].includes(value),
  },
  error: {
    type: String,
    default: "",
  },
  helpText: {
    type: String,
    default: "",
  },
  // Active le style d'étiquette flottante de Bootstrap 5
  floating: {
    type: Boolean,
    default: false,
  },
});

// Classes dynamiques pour le textarea
const textareaClasses = computed(() => [
  "form-control",
  { "is-invalid": !!props.error },
]);
</script>

<template>
  <div :class="[floating ? 'form-floating' : '', 'mb-3 position-relative']">
    <label
      v-if="label && !floating"
      :for="id"
      class="form-label fw-medium text-secondary small mb-1"
    >
      {{ label }}
    </label>

    <textarea
      :id="id"
      v-model="model"
      :rows="rows"
      :class="textareaClasses"
      :style="{ resize: resize }"
      v-bind="$attrs"
    ></textarea>

    <label v-if="label && floating" :for="id" class="text-secondary">
      {{ label }}
    </label>

    <div v-if="error" class="invalid-feedback d-block mt-1 small font-medium">
      <i class="bi bi-exclamation-circle-fill me-1"></i> {{ error }}
    </div>

    <div v-if="helpText && !error" class="form-text text-muted mt-1">
      {{ helpText }}
    </div>
  </div>
</template>

<style scoped>
/* Focus personnalisé pour adoucir le contour Bootstrap */
.form-control:focus {
  border-color: rgba(var(--bs-primary-rgb), 0.5);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.125);
}

/* Ajustement spécifique pour les étiquettes flottantes */
.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
}
</style>