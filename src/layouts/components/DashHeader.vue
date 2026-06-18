<script setup>
import { ref, computed } from "vue";
import { useDashboard, useLayout } from "@/composables/useLayout";
import MedNotification from "@/components/common/MedNotification.vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  // Nom de l'utilisateur transmis par le layout parent
  username: {
    type: String,
    default: "",
  },
});

// Récupération des états globaux partagés de l'application
const {
  isSidebarExpanded,
  toggleSidebar,
  toggleMobileSidebar,
  toggleRightPanel,
  isRightPanelOpen,
} = useDashboard();

const { welcomeMessage, notifications } = useLayout();

// État local pour le tiroir de notifications injecté
const isNotificationOpen = ref(false);

const toggleNotificationDrawer = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};

const shortUsername = computed(() => {
  if (!props.username) return "";
  return props.username.trim().split(" ")[0];
});
</script>

<template>
  <header
    class="navbar navbar-expand-lg px-4 py-3 border-bottom flex-shrink-0 main-header-container"
  >
    <div
      class="container-fluid d-flex align-items-center justify-content-between px-0"
    >
      <div class="d-flex align-items-center gap-2">
        <button
          @click="toggleMobileSidebar"
          class="btn d-lg-none p-2 rounded-3 border-0 text-header-interactive hamburger-mobile"
          type="button"
          aria-label="Ouvrir le menu mobile"
        >
          <i class="pi pi-bars fs-4 align-middle"></i>
        </button>

        <button
          @click="toggleSidebar"
          class="btn d-none d-lg-inline-flex p-2 rounded-3 border-0 text-header-interactive collapse-desktop-btn"
          type="button"
          :title="
            isSidebarExpanded
              ? 'Réduire la barre latérale'
              : 'Agrandir la barre latérale'
          "
        >
          <i
            class="pi fs-5 align-middle"
            :class="isSidebarExpanded ? 'pi-align-left' : 'pi-align-justify'"
          ></i>
        </button>

        <div class="lh-sm ms-1 header-greetings">
          <span
            class="d-block text-muted small fw-medium text-uppercase tracking-wider dynamic-greetings"
          >
            {{ welcomeMessage }}
          </span>
          <h5
            class="d-flex gap-2 mb-0 fw-bold font-title text-header-title text-truncate"
          >
            <span class="d-none d-lg-block">Ravi de vous revoir,</span>

            <span class="text-medical-gradient d-lg-none">{{
              shortUsername
            }}</span>

            <span class="text-medical-gradient d-none d-lg-block">{{
              username
            }}</span>
          </h5>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 header-actions-wrapper">
        <button
          @click="toggleNotificationDrawer"
          class="btn position-relative p-2.5 rounded-circle border-0 action-circle-btn me-1"
          type="button"
          title="Notifications d'analyses"
        >
          <i class="pi pi-bell fs-5 align-middle text-header-interactive"></i>
          <span
            v-if="notifications.length > 0"
            class="position-absolute top-1 start-100 translate-middle badge rounded-circle bg-danger p-1"
          >
            <span class="visually-hidden">Alertes en attente</span>
          </span>
        </button>

        <button
          @click="toggleRightPanel"
          class="btn p-2.5 rounded-circle border-0 action-circle-btn text-header-interactive"
          :class="{ 'tools-active': isRightPanelOpen }"
          type="button"
          title="Boîte à outils de configuration"
        >
          <i class="pi pi-sliders-h fs-5 align-middle"></i>
        </button>
      </div>
    </div>
  </header>

  <MedNotification
    :is-open="isNotificationOpen"
    desktop-mode="drawer"
    :notifications="notifications"
    @close="isNotificationOpen = false"
  />
</template>

<style scoped>
/* ==========================================================================
   CHARTE STRUCTURELLE ET ÉTANCHÉITÉ DU HEADER (Bootstrap 5 + Custom Scoped)
   ========================================================================== */

.main-header-container {
  height: 76px;
  background-color: #ffffff;
  border-color: rgba(15, 23, 42, 0.06) !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Couleurs interactives par défaut (Desktop) */
.text-header-interactive {
  color: #475569 !important;
}
.text-header-title {
  color: #0f172a;
}
.text-medical-gradient {
  color: var(--medical-primary, #0284c7);
}

/* Boutons circulaires d'action */
.action-circle-btn {
  background: rgba(15, 23, 42, 0.02);
  transition: all 0.15s ease-in-out;
}
.action-circle-btn:hover {
  background: rgba(15, 23, 42, 0.06);
}
.tools-active {
  background: rgba(2, 132, 199, 0.1) !important;
  color: var(--medical-primary, #0284c7) !important;
}

.collapse-desktop-btn {
  background: transparent;
  transition: transform 0.15s ease;
}
.collapse-desktop-btn:hover {
  background: rgba(15, 23, 42, 0.04);
  transform: scale(1.03);
}

.dynamic-greetings {
  font-size: 10px;
  letter-spacing: 0.06em;
}

/* ==========================================================================
   📱 ADAPTATION MOBILE STRICTE (Même fond sombre ardoise que la Sidebar)
   ========================================================================== */
@media (max-width: 991.98px) {
  .main-header-container {
    background-color: #1e293b !important; /* Calé sur le fond de DashSidebar */
    border-color: rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Inversion complète des couleurs de texte pour lisibilité sur fond sombre */
  .text-header-interactive,
  .text-header-title {
    color: #f8fafc !important;
  }

  .dynamic-greetings {
    color: rgba(255, 255, 255, 0.45) !important;
  }

  .text-medical-gradient {
    color: var(--medical-primary-light, #38bdf8);
  }

  /* Adaptation des boutons pour fond sombre */
  .action-circle-btn {
    background: rgba(255, 255, 255, 0.06);
  }
  .action-circle-btn:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  .hamburger-mobile {
    background: transparent;
  }
  .hamburger-mobile:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>