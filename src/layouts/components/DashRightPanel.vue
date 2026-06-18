<script setup>
import { useDashboard } from '@/composables/useLayout'

const { isRightPanelOpen, toggleRightPanel } = useDashboard();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-overlay">
      <div 
        v-if="isRightPanelOpen" 
        class="position-fixed top-0 start-0 end-0 bottom-0 tools-backdrop"
        @click="toggleRightPanel" 
      />
    </Transition>

    <Transition name="slide-panel">
      <aside 
        v-if="isRightPanelOpen" 
        class="position-fixed top-0 end-0 bottom-0 bg-white shadow-xl d-flex flex-column tools-panel-container"
      >
        <div class="d-flex align-items-center justify-content-between p-4 border-bottom panel-header">
          <div class="d-flex align-items-center gap-2">
            <div class="tool-avatar-box rounded-3 bg-primary bg-opacity-10 text-primary p-2 d-flex align-items-center justify-content-center">
              <i class="pi pi-cog fs-5"></i>
            </div>
            <div>
              <h6 class="mb-0 fw-bold font-title text-dark">Outils de session</h6>
              <span class="text-muted small">Préférences & Configurations</span>
            </div>
          </div>
          
          <button 
            @click="toggleRightPanel" 
            class="btn-close panel-close-btn p-2 rounded-circle" 
            type="button" 
            aria-label="Fermer le panneau"
          ></button>
        </div>

        <div class="flex-grow-1 p-4 overflow-y-auto panel-body-content vstack gap-4">
          
          <div class="card border-0 bg-light p-3 rounded-3">
            <span class="text-uppercase text-muted fw-bold font-mono tracking-wide d-block mb-2" style="font-size: 10px;">
              Module Sécurité
            </span>
            <p class="small text-secondary mb-0">
              Ce panneau vous permettra de permuter entre vos différents profils de santé assignés ou d'ajuster les configurations du terminal de soin.
            </p>
          </div>

          <div class="vstack gap-2">
            <span class="text-uppercase text-muted fw-bold font-mono tracking-wide d-block" style="font-size: 10px;">
              Accessibilité Rapide
            </span>
            <button class="btn btn-outline-secondary w-100 text-start py-2.5 px-3 rounded-3 small border-1 text-dark">
              <i class="pi pi-refresh me-2 text-muted"></i> Synchroniser les dossiers
            </button>
            <button class="btn btn-outline-secondary w-100 text-start py-2.5 px-3 rounded-3 small border-1 text-dark">
              <i class="pi pi-print me-2 text-muted"></i> Configurer l'imprimante d'ordonnance
            </button>
          </div>

        </div>

        <div class="p-3 bg-light border-top text-center text-muted small font-mono">
          BéninSanté V2.0 — Client Web
        </div>

      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Conteneur principal du panneau d'outils */
.tools-panel-container {
  width: 340px;
  max-width: 100vw;
  z-index: 1050 !important; /* S'aligne parfaitement au-dessus du layout principal */
  border-left: 1px solid rgba(15, 23, 42, 0.06);
}

.tools-backdrop {
  background-color: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(3px);
  z-index: 1040 !important;
}

.tool-avatar-box {
  width: 36px; height: 36px;
}

.panel-close-btn {
  transition: background-color 0.15s ease;
}
.panel-close-btn:hover {
  background-color: rgba(15, 23, 42, 0.05);
}

/* Animations d'ouvertures latérales */
.slide-panel-enter-active, .slide-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-panel-enter-from, .slide-panel-leave-to {
  transform: translateX(100%);
}

.fade-overlay-enter-active, .fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from, .fade-overlay-leave-to {
  opacity: 0;
}
</style>