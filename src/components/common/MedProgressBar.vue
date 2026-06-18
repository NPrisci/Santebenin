<script setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  // Variantes de couleur Bootstrap : 'primary', 'success', 'danger', 'warning', 'info', 'dark'
  variant: {
    type: String,
    default: "primary",
  },
  // Hauteur de la barre (ex: '8px', '1.25rem')
  height: {
    type: String,
    default: "0.75rem",
  },
  // Active les rayures en biais
  striped: {
    type: Boolean,
    default: false,
  },
  // Anime les rayures (force l'activation de striped)
  animated: {
    type: Boolean,
    default: false,
  },
  // Affiche le texte de progression
  showLabel: {
    type: Boolean,
    default: false,
  },
  // Position du texte : 'inside', 'outside-top', 'outside-bottom'
  labelPosition: {
    type: String,
    default: "inside",
    validator: (value) =>
      ["inside", "outside-top", "outside-bottom"].includes(value),
  },
  // Suffixe textuel (ex: '%', '/10', ' Mo')
  labelSuffix: {
    type: String,
    default: "%",
  },
});

// Calcul du pourcentage réel borné entre 0 et 100%
const percentage = computed(() => {
  if (props.max <= props.min) return 0;
  const progress = ((props.value - props.min) / (props.max - props.min)) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
});

// Classes dynamiques pour la barre interne de Bootstrap
const progressBarClasses = computed(() => [
  "progress-bar",
  `bg-${props.variant}`,
  {
    "progress-bar-striped": props.striped || props.animated,
    "progress-bar-animated": props.animated,
  },
]);
</script>

<template>
  <div class="med-progress-container w-100">
    <div
      v-if="showLabel && labelPosition === 'outside-top'"
      class="d-flex justify-content-between mb-1 small fw-semibold text-secondary"
    >
      <span>Progression</span>
      <span>{{ percentage }}{{ labelSuffix }}</span>
    </div>

    <div class="progress" :style="{ height: height }">
      <div
        :class="progressBarClasses"
        role="progressbar"
        :style="{ width: `${percentage}%` }"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
      >
        <span
          v-if="showLabel && labelPosition === 'inside' && percentage > 7"
          class="fw-bold small px-1 text-truncate"
        >
          {{ percentage }}{{ labelSuffix }}
        </span>
      </div>
    </div>

    <div
      v-if="showLabel && labelPosition === 'outside-bottom'"
      class="d-flex justify-content-end mt-1 small text-muted font-monospace"
    >
      <span>{{ value }} / {{ max }} {{ labelSuffix.trim() }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Ajout d'une transition CSS pour fluidifier les changements de largeur (v-model/prop) */
.progress-bar {
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ombre interne discrète sur le conteneur pour donner de la profondeur */
.progress {
  background-color: var(--bs-gray-200);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  overflow: visible; /* Permet aux ombres ou animations fines de respirer */
}
</style>