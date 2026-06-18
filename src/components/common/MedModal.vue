<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const model = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  // Tailles : 'sm', 'md', 'lg', 'xl', 'fullscreen'
  size: {
    type: String,
    default: 'md'
  },
  // Centre le modal verticalement
  centered: {
    type: Boolean,
    default: true
  },
  // Permet le défilement du contenu interne si le texte dépasse
  scrollable: {
    type: Boolean,
    default: true
  },
  // Si vrai, interdit la fermeture lors du clic à l'extérieur
  staticBackdrop: {
    type: Boolean,
    default: false
  },
  // Arrière-plan personnalisé de l'en-tête (ex: 'bg-primary text-white')
  headerBg: {
    type: String,
    default: 'bg-white text-dark'
  }
})

// Verrouillage du scroll global
const handleBodyScroll = (shouldLock) => {
  if (shouldLock) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Clôture via la touche Échap (uniquement si le backdrop n'est pas statique)
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && model.value && !props.staticBackdrop) {
    model.value = false
  }
}

watch(model, (isOpen) => {
  handleBodyScroll(isOpen)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  if (model.value) handleBodyScroll(true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  handleBodyScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <div class="med-modal-wrapper" style="position: relative; z-index: 1050;">
      <Transition name="backdrop-fade">
        <div 
          v-if="model" 
          class="modal-backdrop fade show" 
          @click="!staticBackdrop ? model = false : null"
        ></div>
      </Transition>

      <Transition name="modal-scale">
        <div 
          v-if="model" 
          class="modal d-block" 
          tabindex="-1" 
          role="dialog" 
          aria-modal="true"
          @click.self="!staticBackdrop ? model = false : null"
        >
          <div 
            :class="[
              'modal-dialog',
              { 'modal-dialog-centered': centered },
              { 'modal-dialog-scrollable': scrollable },
              size !== 'md' && size !== 'fullscreen' ? `modal-${size}` : '',
              { 'modal-fullscreen': size === 'fullscreen' }
            ]"
          >
            <div class="modal-content shadow-lg border-0">
              
              <div :class="['modal-header py-3 px-4 align-items-center', headerBg]">
                <slot name="header">
                  <h5 :class="['modal-title fw-bold text-truncate', headerBg.includes('text-white') ? 'text-white' : '']">
                    {{ title }}
                  </h5>
                </slot>
                
                <button 
                  type="button" 
                  :class="[
                    'btn-close-custom border-0 bg-transparent ms-auto d-flex align-items-center justify-content-center',
                    headerBg.includes('text-white') ? 'text-white-50 hover-light' : 'text-muted'
                  ]"
                  @click="model = false"
                  aria-label="Fermer"
                >
                  <i class="fas fa-times fs-5"></i>
                </button>
              </div>

              <div class="modal-body p-4 custom-scrollbar">
                <slot />
              </div>

              <div v-if="$slots.footer" class="modal-footer py-3 px-4 bg-light border-top">
                <slot name="footer" />
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
/* Alignement structurel de la superposition */
.modal {
  background: transparent;
}

/* Bouton de fermeture customisé à rotation fluide */
.btn-close-custom {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
}
.btn-close-custom:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: var(--bs-danger) !important;
  transform: rotate(90deg);
}
.btn-close-custom.hover-light:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}

/* Barre de défilement interne optimisée */
.custom-scrollbar {
  overflow-y: auto;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--bs-gray-300);
  border-radius: 4px;
}

/* --- ANIMATION DU BACKDROP (Fade) --- */
.backdrop-fade-enter-active {
  transition: opacity 0.3s ease-out;
}
.backdrop-fade-leave-active {
  transition: opacity 0.2s ease-in;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* --- ANIMATION DU MODAL CONTENT (Scale + Fade) --- */
.modal-scale-enter-active {
  /* Courbe cubic-bezier créant une micro-élasticité à l'ouverture */
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-scale-leave-active {
  /* Sortie ultra-rapide et nette */
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>