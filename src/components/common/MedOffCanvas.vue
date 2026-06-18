<script setup>
import { watch, onMounted, onUnmounted } from "vue";

const model = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "end",
    validator: (value) => ["start", "end", "top", "bottom"].includes(value),
  },
  backdrop: {
    type: Boolean,
    default: true,
  },
  scroll: {
    type: Boolean,
    default: false,
  },
  // 1. Amélioration : Classe de fond pour le Header (ex: 'bg-primary text-white')
  headerBg: {
    type: String,
    default: "bg-white text-dark",
  },
});

const handleBodyScroll = (shouldLock) => {
  if (props.scroll) return;
  if (shouldLock) {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
};

const handleKeyDown = (event) => {
  if (event.key === "Escape" && model.value) {
    model.value = false;
  }
};

watch(model, (isOpen) => {
  handleBodyScroll(isOpen);
});

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  if (model.value) handleBodyScroll(true);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  handleBodyScroll(false);
});
</script>

<template>
  <div class="med-offcanvas-wrapper">
    <Transition name="backdrop-fade">
      <div
        v-if="model && backdrop"
        class="offcanvas-backdrop fade show"
        @click="model = false"
      ></div>
    </Transition>

    <Transition :name="`offcanvas-slide-${position}`">
      <div
        v-if="model"
        :class="['offcanvas', `offcanvas-${position}`, 'show']"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div :class="['offcanvas-header border-bottom py-3 px-4', headerBg]">
          <slot name="header">
            <h5 class="offcanvas-title fw-bold text-truncate">
              {{ title }}
            </h5>
          </slot>

          <button
            type="button"
            :class="[
              'btn-close-custom border-0 bg-transparent ms-auto d-flex align-items-center justify-content-center',
              headerBg.includes('text-white')
                ? 'text-white-50 hover-light'
                : 'text-muted',
            ]"
            @click="model = false"
            aria-label="Fermer"
          >
            <i class="fas fa-times fs-5"></i>
          </button>
        </div>

        <div class="offcanvas-body p-4 custom-scrollbar">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="offcanvas-footer border-top py-3 px-4 bg-light"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.offcanvas.show {
  visibility: visible;
}

.btn-close-custom {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
}
.btn-close-custom:hover {
  background-color: rgba(0, 0, 0, 0.08);
  color: var(--bs-danger) !important;
  transform: rotate(90deg);
}
/* Adaptation si fond sombre */
.btn-close-custom.hover-light:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}

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

/* --- ANIMATION DU BACKDROP --- */
.backdrop-fade-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.backdrop-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 1, 1); /* Sortie plus rapide */
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* --- 2. AMÉLIORATION : CINÉMATIQUE DE RETRAIT FLUIDE (ASYNCHRONE) --- */

/* --- DROITE (End) --- */
.offcanvas-slide-end-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Entrée amortie */
}
.offcanvas-slide-end-leave-active {
  transition: transform 0.28s cubic-bezier(0.36, 0.07, 0.19, 0.97); /* Retrait accéléré et fluide */
}
.offcanvas-slide-end-enter-from,
.offcanvas-slide-end-leave-to {
  transform: translateX(100%);
}

/* --- GAUCHE (Start) --- */
.offcanvas-slide-start-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.offcanvas-slide-start-leave-active {
  transition: transform 0.28s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
.offcanvas-slide-start-enter-from,
.offcanvas-slide-start-leave-to {
  transform: translateX(-100%);
}

/* --- HAUT (Top) --- */
.offcanvas-slide-top-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.offcanvas-slide-top-leave-active {
  transition: transform 0.28s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
.offcanvas-slide-top-enter-from,
.offcanvas-slide-top-leave-to {
  transform: translateY(-100%);
}

/* --- BAS (Bottom) --- */
.offcanvas-slide-bottom-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.offcanvas-slide-bottom-leave-active {
  transition: transform 0.28s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
.offcanvas-slide-bottom-enter-from,
.offcanvas-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>