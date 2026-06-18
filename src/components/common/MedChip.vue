<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  icon: {
    type: String,
    default: "", // Exemple : 'fas fa-user-md', 'fas fa-notes-medical'
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
});

defineEmits(["click"]);
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="active"
    :disabled="disabled"
    @click="$emit('click')"
    :class="[
      'chip med-chip d-inline-flex align-items-center justify-content-center rounded-pill fw-medium',
      { 'med-chip--active': active, 'med-chip--disabled': disabled, 'chip-primary': color === 'primary' },
    ]"
  >
    <i v-if="icon && !active" :class="[icon, 'med-chip-icon me-1']"></i>

    <Transition name="scale">
      <i v-if="active" class="fas fa-check med-chip-check me-1"></i>
    </Transition>

    <span class="med-chip-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.med-chip {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  /* Alignement avec le look Slate/Light de Bootstrap 5.3 par défaut */
  background-color: var(--bs-gray-100);
  border: 1px solid var(--bs-gray-300);
  color: var(--bs-gray-700);
}

/* Effet au survol (uniquement si non sélectionné et non désactivé) */
.med-chip:hover:not(.med-chip--active):not(:disabled) {
  background-color: var(--bs-gray-200);
  color: var(--bs-gray-900);
  border-color: var(--bs-gray-400);
}

/* Focus accessibilité basé sur l'ombre de focus Bootstrap */
.med-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.2);
}

/* --- ÉTAT SÉLECTIONNÉ (Utilisation des tokens subtils de Bootstrap 5.3) --- */
.med-chip--active {
  background-color: var(--bs-primary-bg-subtle);
  border-color: var(--bs-primary);
  color: var(--bs-primary);
  font-weight: 600;
}
.med-chip--active:hover {
  /* Maintien du visuel actif même au survol */
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* --- ÉTAT DÉSACTIVÉ --- */
.med-chip--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* Bloque les interactions indésirables */
}

/* Styles des icônes internes */
.med-chip-icon {
  font-size: 0.85rem;
  color: var(--bs-gray-500);
  transition: color 0.2s;
}

.med-chip-check {
  font-size: 0.75rem;
  color: var(--bs-primary);
}

/* --- ANIMATION DE L'ICÔNE CHECK --- */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>