<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'fas fa-folder-open'
  },
  title: {
    type: String,
    default: 'Aucune donnée disponible'
  },
  description: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  // Tailles disponibles : 'sm' (dans un petit widget), 'md' (standard), 'lg' (pleine page)
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  // Si vrai, encapsule l'état vide dans une structure bordée similaire à une carte clinique
  bordered: {
    type: Boolean,
    default: false
  }
})

defineEmits(['action-click'])

// Ajustement dynamique des classes de conteneur
const containerClasses = computed(() => {
  return [
    'med-empty-state d-flex flex-column align-items-center justify-content-center text-center',
    props.bordered ? 'border rounded-lg p-5 bg-white shadow-sm' : 'py-4 px-3',
    `med-empty-state-${props.size}`
  ]
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Zone de l'icône avec halo médical subtil -->
    <div class="med-empty-state-icon-wrapper d-flex align-items-center justify-content-center rounded-circle mb-3 bg-light">
      <i :class="[icon, 'text-muted']"></i>
    </div>

    <!-- Titre de l'état -->
    <h5 class="fw-bold text-dark mb-2 med-empty-title">
      {{ title }}
    </h5>

    <!-- Description explicative -->
    <p v-if="description" class="text-muted small mb-0 mx-auto med-empty-description" style="max-width: 420px;">
      {{ description }}
    </p>

    <!-- Slot par défaut pour injecter du contenu HTML complexe si nécessaire -->
    <div v-if="$slots.default" class="mt-3 w-100">
      <slot />
    </div>

    <!-- Bouton d'action contextuel rattaché à main.css -->
    <div v-if="actionLabel || $slots.action" class="mt-4 w-100">
      <slot name="action">
        <button
          type="button"
          class="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 text-white"
          @click="$emit('action-click')"
        >
          <i v-if="actionIcon" :class="actionIcon"></i>
          {{ actionLabel }}
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.med-empty-state {
  font-family: var(--body-family);
  transition: all var(--transition-base);
}

/* --- ADAPTATION AUX TAILLES --- */
.med-empty-state-md .med-empty-state-icon-wrapper {
  width: 72px;
  height: 72px;
}
.med-empty-state-md .med-empty-state-icon-wrapper i {
  font-size: 1.75rem;
}
.med-empty-state-md .med-empty-title {
  font-size: 1.125rem;
}

/* Version Compacte (ex: Fin de liste dans un composant de barre latérale) */
.med-empty-state-sm .med-empty-state-icon-wrapper {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem !important;
}
.med-empty-state-sm .med-empty-state-icon-wrapper i {
  font-size: 1.2rem;
}
.med-empty-state-sm .med-empty-title {
  font-size: 0.95rem;
  margin-bottom: 0.25rem !important;
}
.med-empty-state-sm .med-empty-description {
  font-size: 0.8rem;
}

/* Version Majeure (ex: Écran d'accueil d'un module sans historique) */
.med-empty-state-lg .med-empty-state-icon-wrapper {
  width: 96px;
  height: 96px;
  background-color: var(--medical-primary-bg) !important; /* Emploi du bleu ciel de main.css */
}
.med-empty-state-lg .med-empty-state-icon-wrapper i {
  font-size: 2.5rem;
  color: var(--medical-primary) !important;
}
.med-empty-state-lg .med-empty-title {
  font-size: 1.35rem;
  font-family: var(--title-family);
}

/* Alignement cosmétique des bordures */
.border {
  border-color: var(--medical-gray-200) !important;
}
.bg-light {
  background-color: var(--medical-gray-100) !important;
}
</style>