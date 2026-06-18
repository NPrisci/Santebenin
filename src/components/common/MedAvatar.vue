<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  // Tailles : 'xs', 'sm', 'md', 'lg', 'xl'
  size: {
    type: String,
    default: "md",
    validator: (val) => ["xs", "sm", "md", "lg", "xl"].includes(val),
  },
  // Formes : 'circle', 'rounded'
  shape: {
    type: String,
    default: "circle",
    validator: (val) => ["circle", "rounded"].includes(val),
  },
  // Statuts médicaux : 'available', 'busy', 'away', 'offline', ''
  status: {
    type: String,
    default: "",
    validator: (val) =>
      ["", "available", "busy", "away", "offline"].includes(val),
  },
  // Compteur de notifications (ex: 3, '9+', etc.)
  badge: {
    type: [String, Number],
    default: "",
  },
  // Couleur de fond pour le mode initiales (variante Bootstrap)
  bgVariant: {
    type: String,
    default: "primary-subtle",
  },
});

const hasImageError = ref(false);

// Réinitialiser l'état d'erreur si la source de l'image change dynamiquement
watch(
  () => props.src,
  () => {
    hasImageError.value = false;
  }
);

// Extraction des initiales (Prend la première lettre du prénom et du nom)
const initials = computed(() => {
  if (!props.name) return "";
  const parts = props.name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

// Détermination du statut de rendu
const showImage = computed(() => props.src && !hasImageError.value);
</script>

<template>
  <div
    :class="[
      'med-avatar-container d-inline-block position-relative user-select-none',
      `med-avatar-${size}`,
    ]"
  >
    <img
      v-if="showImage"
      :src="src"
      :alt="name"
      :class="[
        'med-avatar-img w-100 h-100 object-fit-cover',
        shape === 'circle' ? 'rounded-circle' : 'rounded-3',
      ]"
      @error="hasImageError = true"
    />

    <div
      v-else
      :class="[
        'med-avatar-fallback w-100 h-100 d-flex align-items-center justify-content-center fw-bold',
        `bg-${bgVariant}`,
        bgVariant.includes('subtle')
          ? `text-${bgVariant.split('-')[0]}`
          : 'text-white',
        shape === 'circle' ? 'rounded-circle' : 'rounded-3',
      ]"
    >
      <slot name="placeholder">
        <span v-if="initials" class="med-avatar-text">{{ initials }}</span>
        <i v-else class="fas fa-user-md med-avatar-default-icon"></i>
      </slot>
    </div>

    <span
      v-if="status"
      :class="[
        'med-avatar-status position-absolute rounded-circle border-2 border-white',
        { 'bg-success': status === 'available' },
        { 'bg-danger': status === 'busy' },
        { 'bg-warning': status === 'away' },
        { 'bg-secondary': status === 'offline' },
      ]"
      :title="`Statut : ${status}`"
    ></span>

    <span
      v-if="badge"
      class="med-avatar-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm border border-white font-monospace"
    >
      {{ badge }}
    </span>
  </div>
</template>

<style scoped>
/* Conteneur de base */
.med-avatar-container {
  vertical-align: middle;
}

/* --- GRILLE DES TAILLES STANDARDS --- */
.med-avatar-xs {
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
}
.med-avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
}
.med-avatar-md {
  width: 44px;
  height: 44px;
  font-size: 1rem;
}
.med-avatar-lg {
  width: 64px;
  height: 64px;
  font-size: 1.35rem;
}
.med-avatar-xl {
  width: 88px;
  height: 88px;
  font-size: 1.85rem;
}

/* Gestion de l'icône par défaut */
.med-avatar-default-icon {
  font-size: 1.1em;
}

/* --- PASTILLES DE STATUT --- */
.med-avatar-status {
  bottom: 1px;
  right: 1px;
  width: 28%;
  height: 28%;
  min-width: 8px;
  min-height: 8px;
}
/* Ajustement cosmétique précis pour la taille XL */
.med-avatar-xl .med-avatar-status {
  border-width: 3px !important;
  bottom: 3px;
  right: 3px;
}

/* --- BADGE DE NOTIFICATION --- */
.med-avatar-badge {
  font-size: 0.68rem;
  padding: 0.25em 0.5em;
  z-index: 2;
}
.med-avatar-xs .med-avatar-badge {
  font-size: 0.5rem;
  padding: 0.15em 0.35em;
}
</style>