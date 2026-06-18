<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '' // Exemple: 'fas fa-heartbeat'
  },
  loading: {
    type: Boolean,
    default: false
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  // Niveau d'ombre Bootstrap : 'none', 'sm', 'md', 'lg'
  shadow: {
    type: String,
    default: 'sm',
    validator: (val) => ['none', 'sm', 'md', 'lg'].includes(val)
  },
  borderless: {
    type: Boolean,
    default: false
  },
  hoverLift: {
    type: Boolean,
    default: false
  },
  headerBg: {
    type: String,
    default: 'bg-transparent'
  },
  bodyClass: {
    type: String,
    default: 'p-4'
  }
})

const emit = defineEmits(['toggle'])
const isCollapsed = ref(false)

const toggleCollapse = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
    emit('toggle', isCollapsed.value)
  }
}
</script>

<template>
  <div 
    :class="[
      'card med-card border-0',
      shadow !== 'none' ? `shadow-${shadow}` : '',
      { 'med-card--borderless': borderless },
      { 'med-card--hover-lift': hoverLift },
      { 'med-card--loading': loading }
    ]"
  >
    <div 
      v-if="title || $slots.header || $slots.actions || icon"
      :class="['card-header d-flex align-items-center justify-content-between border-bottom py-3 px-4', headerBg]"
    >
      <slot name="header">
        <div class="d-flex align-items-center gap-2 text-truncate">
          <i v-if="icon" :class="[icon, 'text-primary fs-5 med-card-icon']"></i>
          <div class="text-truncate">
            <h5 class="card-title fw-bold text-dark mb-0 fs-6 text-truncate">{{ title }}</h5>
            <small v-if="subtitle" class="text-muted d-block text-truncate small">{{ subtitle }}</small>
          </div>
        </div>
      </slot>

      <div class="d-flex align-items-center gap-2 ms-3">
        <slot name="actions" />
        
        <button 
          v-if="collapsible" 
          type="button"
          class="btn btn-link text-muted p-1 border-0 d-flex align-items-center justify-content-center med-card-toggle-btn"
          @click="toggleCollapse"
          :aria-expanded="!isCollapsed"
          aria-label="Réduire/Agrandir"
        >
          <i :class="['fas fa-chevron-up', { 'rotate-180': isCollapsed }]"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="card-body p-4">
      <div class="med-skeleton-line short mb-3"></div>
      <div class="med-skeleton-line mb-2"></div>
      <div class="med-skeleton-line mb-2"></div>
      <div class="med-skeleton-line medium"></div>
    </div>

    <div v-else class="med-card-collapse-wrapper" :class="{ 'collapsed': isCollapsed }">
      <div :class="['card-body', bodyClass]">
        <slot />
      </div>

      <div v-if="$slots.footer" class="card-footer py-3 px-4 bg-light border-top">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: var(--bs-card-bg, #fff);
  border-radius: 0.75rem; /* Coins arrondis modernes */
}

/* Modificateur d'interactivité au survol */
.med-card--hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--bs-box-shadow-md) !important;
}

.med-card--borderless {
  box-shadow: none !important;
  border: none !important;
}

/* Style de l'en-tête de la carte */
.card-header {
  border-bottom: 1px solid var(--bs-border-color-translucent) !important;
}

/* Animation fluide du bouton chevron */
.med-card-toggle-btn i {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.med-card-toggle-btn i.rotate-180 {
  transform: rotate(180deg);
}

/* --- ANIMATION DE REPLIEMENT --- */
.med-card-collapse-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  overflow: hidden;
  opacity: 1;
}

.med-card-collapse-wrapper.collapsed {
  grid-template-rows: 0fr;
  opacity: 0;
  border-top: none !important;
}

.med-card-collapse-wrapper > div {
  min-height: 0;
}

/* --- LOGIQUE DU SKELETON LOADER (Shimmer) --- */
.med-skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, var(--bs-gray-200) 25%, var(--bs-gray-300) 50%, var(--bs-gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 0.25rem;
}
.med-skeleton-line.short { width: 40%; height: 1.25rem; }
.med-skeleton-line.medium { width: 70%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>