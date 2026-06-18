<script setup>
import { computed } from "vue";
import DashSidebar from "@/layouts/components/DashSidebar.vue";
import DashHeader from "@/layouts/components/DashHeader.vue";
import DashRightPanel from "@/layouts/components/DashRightPanel.vue";
import { useDashboard, useLayout } from "@/composables/useLayout";
import { useUiStore } from "@/router/ui";
import MedAppLoader from "@/components/main/MedAppLoader.vue";
import MedConfirm from "@/components/common/MedConfirm.vue";
import { useConfirm } from "@/composables/useConfirm";

const { isSidebarExpanded } = useDashboard();
const { userFullName, logout } = useLayout();

const defaultRole = computed(() => "ADMINISTRATEUR");
const uiStore = useUiStore();
const { confirmState, handleConfirm, handleCancel, confirm } = useConfirm()

const handleLogout = async () => {
  const result = await confirm({
    title: "Déconnexion",
    text: "Êtes-vous sûr de vouloir vous déconnecter ?",
    type: "warning",
    confirmButtonText: "Déconnexion",
    confirmButtonClass: "btn btn-danger px-4",
  });

  if (result.isConfirmed) {
    logout();
  }
};
</script>

<template>
  <div class="d-flex vh-100 w-100 overflow-hidden main-layout-root">
    <!-- INJECTION DU LOADER GLOBAL (Il se téléporte tout seul sur le body) -->
    <MedAppLoader :visible="uiStore.isDashLoading" />

    <MedConfirm
      v-model="confirmState.isVisible"
      v-bind="confirmState.options"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <DashSidebar :role="defaultRole" @logout="handleLogout" />

    <div
      class="d-flex flex-column flex-grow-1 h-100 min-w-0 overflow-hidden main-workspace-wrapper transition-layout"
      :class="
        isSidebarExpanded
          ? 'sidebar-expanded-spacing'
          : 'sidebar-collapsed-spacing'
      "
    >
      <DashHeader :username="userFullName" />

      <main
        class="flex-grow-1 overflow-y-auto p-3 p-md-4 main-content-viewport"
      >
        <div class="container-fluid px-0 h-100">
          <RouterView v-slot="{ Component }">
            <Transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>

    <DashRightPanel />
  </div>
</template>

<style scoped>
/* ==========================================================================
   📐 CONFIGURATION STRUCTURELLE DU MASTER LAYOUT (BéninSanté V2)
   ========================================================================== */

.main-layout-root {
  background-color: #f8fafc; /* Fond très clair et reposant (Slate 50) */
  font-family: var(--body-family, "Inter", sans-serif);
}

/* Zone d'affichage des vues applicatives */
.main-content-viewport {
  background-color: #f8fafc;
  scroll-behavior: smooth;
}

/* Transition de décalage de la zone de contenu sur desktop */
.transition-layout {
  transition: padding-left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gestion fine des barres de défilement pour un rendu épuré */
.main-content-viewport::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.main-content-viewport::-webkit-scrollbar-track {
  background: transparent;
}
.main-content-viewport::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.08);
  border-radius: 8px;
}
.main-content-viewport::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 23, 42, 0.15);
}

/* ==========================================================================
   🎬 ANIMATIONS DES CHANGEMENTS DE PAGES (RouterView Transition)
   ========================================================================== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px); /* Léger effet de montée de la page */
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Ajustements responsives pour tablettes et PC */
@media (min-width: 992px) {
  /* On anticipe le décalage pour éviter les sauts visuels si nécessaire */
  .sidebar-expanded-spacing {
    padding-left: 0px;
  }
  .sidebar-collapsed-spacing {
    padding-left: 0px;
  }
}
</style>