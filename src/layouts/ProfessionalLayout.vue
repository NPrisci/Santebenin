<template>
  <div class="min-vh-100 p-2 p-md-2 professional-wrapper">
    <div class="professional-layout rounded-4 shadow-sm border-primary-subtle min-vh-100 position-relative d-flex flex-column">
      
      <ProfessionalNavbar 
        @logout="handleLogout" 
        @toggle-notif="isNotifOpen = !isNotifOpen"
        :notificationCounts="notificationCounts" 
      />
      
      <!-- Conteneur principal pour les pages -->
      <main class="flex-grow-1 position-relative custom-overflow-y w-100">
        <RouterView />
      </main>

      <!-- Composants partagés (Notifications et Panneau Latéral) -->
      <MedNotification 
        :isOpen="isNotifOpen" 
        @close="isNotifOpen = false" 
        desktopMode="drawer" 
        :notifications="notifications" 
      />
      <DashRightPanel />
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import ProfessionalNavbar from '@/layouts/components/ProfessionalNavbar.vue';
import MedNotification from '@/components/common/MedNotification.vue';
import DashRightPanel from '@/layouts/components/DashRightPanel.vue';
import { useLayout } from '@/composables/useLayout';

const { notifications, logout } = useLayout();
const isNotifOpen = ref(false);

const handleLogout = () => {
  if (logout) {
    logout();
  } else {
    console.warn("Logout function not found in useLayout");
  }
};

// Simulation du calcul des notifications dynamiques par onglet.
// À relier plus tard avec un vrai store d'état si nécessaire.
const notificationCounts = computed(() => {
  const unreadTotal = notifications.value ? notifications.value.filter(n => n.unread).length : 0;
  return { 
    'Annonces': unreadTotal 
  };
});
</script>

<style scoped>
.professional-wrapper {
  background-color: #f8fafc; /* medical-gray-50 fallback */
  background-color: var(--medical-gray-50);
}

.professional-layout {
  background-color: var(--medical-gray-50);
  overflow: hidden;
}

.custom-overflow-y {
  overflow-y: auto;
  overflow-x: hidden;
  height: 0; /* Important pour que flex-grow gère la hauteur avec overflow */
}

/* Scrollbar discrète pour le contenu */
.custom-overflow-y::-webkit-scrollbar {
  width: 6px;
}
.custom-overflow-y::-webkit-scrollbar-track {
  background: transparent;
}
.custom-overflow-y::-webkit-scrollbar-thumb {
  background-color: rgba(15, 23, 42, 0.1);
  border-radius: 10px;
}
.custom-overflow-y::-webkit-scrollbar-thumb:hover {
  background-color: rgba(15, 23, 42, 0.2);
}
</style>
