<!-- src/layouts/MainLayout.vue -->
<script setup>
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import MainSidebar from '@/layouts/components/MainSidebar.vue'
import MainHeader from '@/layouts/components/MainHeader.vue'
import { menuItems } from '@/config/MenuItems'
import { useUiStore } from '@/router/ui'
import MedAppLoader from '@/components/main/MedAppLoader.vue'
import MedConfirm from '@/components/common/MedConfirm.vue'
import { useLayout } from '@/composables/useLayout'
import { useConfirm } from '@/composables/useConfirm'
import MedNotification from '@/components/common/MedNotification.vue'

const uiStore = useUiStore()
const { confirmState, handleConfirm, handleCancel, confirm } = useConfirm()

// eslint-disable-next-line no-unused-vars
const { userFullName, userPhoto, currentDate, welcomeMessage, logout, notifications } = useLayout()

// 🧑‍⚕️ État centralisé de l'utilisateur connecté (Props transmises aux enfants)
const currentUser = computed(() => ({
  name: userFullName.value,
  avatar: userPhoto.value
}))

const chosenDesktopMode = ref('drawer') 

const isNotificationOpen = ref(false)

// 🏷️ Récupération dynamique du titre via les métadonnées de la route active
const currentRouteTitle = computed(() => {
  return welcomeMessage.value
})

// 🔍 États de recherche globale
const globalSearchCategories = ref([])
const isGlobalSearchLoading = ref(false)

const handleGlobalSearch = (query) => {
  isGlobalSearchLoading.value = true
  
  // Simulation d'une recherche asynchrone
  setTimeout(() => {
    if (query.trim() === '') {
      globalSearchCategories.value = []
    } else {
      globalSearchCategories.value = [
        {
          id: 'patients',
          title: 'Résultats',
          items: [
            { id: 1, title: 'Patient ' + query, subtitle: 'Résultat simulé' },
            { id: 2, title: 'Dossier ' + query, subtitle: 'Document' }
          ]
        }
      ]
    }
    isGlobalSearchLoading.value = false
  }, 500)
}

const handleSelectSearchItem = (item) => {
  console.log('Elément sélectionné:', item)
}

// 🔌 Logiques d'interactivité globales
const handleLogout = async () => {
  const result = await confirm({
    title: 'Déconnexion',
    text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    type: 'warning',
    confirmButtonText: 'Déconnexion',
    confirmButtonClass: 'btn btn-danger px-4'
  })
  
  if (result.isConfirmed) {
    logout()
  }
}

const handleProfileNavigation = () => {
  console.log('Évènement profil intercepté. Redirection utilisateur...')
  // router.push('/profile')
}

// 🔌 Actions métier déclenchées par les composants enfants
const handleReadAll = () => {
  notifications.value.forEach(item => item.unread = false)
}

const handleCardClick = (notificationItem) => {
  console.log('Fiche cliquée :', notificationItem)
  notificationItem.unread = false // Marque la fiche courante comme lue au clic
}
</script>

<template>
  <!-- 🌫️ L'ATMOSPHÈRE DE FOND (Dégradé opalin discret d'arrière-plan global) -->
  <div class="app-layout-master-spine min-vh-screen w-100 d-flex align-items-center justify-content-center">
    
    <!-- INJECTION DU LOADER GLOBAL (Il se téléporte tout seul sur le body) -->
    <MedAppLoader :visible="uiStore.isMainLoading" />

    <!-- GESTIONNAIRE GLOBAL DE CONFIRMATION -->
    <MedConfirm
      v-model="confirmState.isVisible"
      v-bind="confirmState.options"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- 🪟 LE CANEVAS EN VERRE FUSIONNÉ UNIQUE (Sans coupure graphique) -->
    <div class="d-flex w-100 h-100 med-application-glass-canvas overflow-hidden">
      
      <!-- 🧭 AXE DE NAVIGATION GAUCHE (Flottant sur Desktop / Fixe bas sur Mobile) -->
      <MainSidebar 
        :user-full-name="currentUser.name"
        :user-avatar="currentUser.avatar"
        :menu-items="menuItems"
        @logout="handleLogout"
      />

      <!-- 🖥️ CHÂSSIS DE RENDU CENTRAL (En-tête + Pages applicatives) -->
      <div class="flex-grow-1 d-flex flex-column p-2 p-md-3 main-content-viewport overflow-y-auto">
        
        <!-- 🎯 EN-TÊTE HARMONISÉ (Prend en charge le TypeWriter et l'AutoComplete) -->
        <MainHeader 
          :title-text="currentRouteTitle"
          :user-full-name="currentUser.name"
          :user-avatar="currentUser.avatar"
          :search-categories="globalSearchCategories"
          :is-search-loading="isGlobalSearchLoading"
          @profile-click="handleProfileNavigation"
          @search="handleGlobalSearch"
          @select-search-item="handleSelectSearchItem"
          @open-notifications="isNotificationOpen = !isNotificationOpen"
        />

        <!-- 📄 ZONE D'INJECTION DYNAMIQUE DES PAGES (Vue Router) -->
        <main class="container-fluid px-0 flex-grow-1 application-page-router-target">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>

      </div>

      <!-- Notifications globales (hors du conteneur scrollable) -->
      <MedNotification 
        :is-open="isNotificationOpen"
        :desktop-mode="chosenDesktopMode"
        :notifications="notifications"
        @close="isNotificationOpen = false"
        @read-all="handleReadAll"
        @card-click="handleCardClick"
      />

    </div>
  </div>
</template>

<style scoped>
/* Fond d'ambiance neutre et haut de gamme qui traverse le panneau transparent */
.app-layout-master-spine {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  height: 100vh;
  padding: 0.75rem; /* Marge externe minimale pour détacher élégamment le canvas sur Desktop */
}

/* 🪟 LE PANNEAU CENTRAL DE RÉFÉRENCE (Glassmorphism strict copié sur le template) */
.med-application-glass-canvas {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(40px) saturate(110%);
  -webkit-backdrop-filter: blur(40px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 2rem !important;
  height: 96vh !important; /* Maximise l'espace vertical disponible */
  box-shadow: 0 20px 50px rgba(148, 163, 184, 0.12);
}

/* Optimisation du scroll interne du Viewport global */
.main-content-viewport {
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.05) transparent;
}
.main-content-viewport::-webkit-scrollbar {
  width: 5px;
}
.main-content-viewport::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

/* ==========================================================================
   📱 ADAPTATION RESPONSIVE : SUPPRESSION DES SATELLITES DE MARGE SUR MOBILE
   ========================================================================== */
@media (max-width: 991.98px) {
  .app-layout-master-spine {
    padding: 0; /* Suppression des marges externes sur smartphone */
  }
  .med-application-glass-canvas {
    border-radius: 0 !important; /* Rendu fluide plein écran */
    border: none;
    height: 100vh !important;
    flex-direction: column; /* Alignement vertical natif sur mobile */
  }
  .main-content-viewport {
    padding-top: 0.5rem !important;
    padding-bottom: 90px !important; /* Protection anti-chevauchement avec la barre basse */
  }
}

/* 🎬 ANIMATION DE TRANSITION DOUCE ENTRE LES PAGES */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.2s ease-out;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>