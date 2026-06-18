<!-- src/components/main/MainHeader.vue -->
<script setup>
import { ref, watch } from "vue";
import MedTypeWritter from "@/components/common/MedTypeWritter.vue";
import MedAutoComplete from "@/components/common/MedAutoComplete.vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  titleText: { type: String, default: "Schedule" },
  userFullName: { type: String, default: "Auriol Sènan" },
  userAvatar: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  searchCategories: { type: Array, default: () => [] },
  isSearchLoading: { type: Boolean, default: false },
});

const emit = defineEmits(["profile-click", "search", "select-search-item", "open-notifications"]);

const isMobileSearchOpen = ref(false);
const selectedSearchItem = ref(null);

watch(selectedSearchItem, (newVal) => {
  if (newVal) {
    emit("select-search-item", newVal);
  }
});

const handleSearchChange = (query) => {
  emit("search", query);
};
</script>

<template>
  <div class="w-100 med-header-container">
    <!-- ========================================== -->
    <!-- 🖥️ CONFIGURATION DESKTOP (Inchangée)         -->
    <!-- ========================================== -->
    <header
      class="d-none d-lg-flex align-items-center justify-content-between py-3 px-2 mb-4 med-main-header-desktop"
    >
      <div class="header-title-zone">
        <h1
          class="fw-bold text-dark tracking-tight mb-0 d-flex align-items-center gap-1 template-page-title"
        >
          <MedTypeWritter :text="titleText" :speed="70" :delay="100" />
        </h1>
      </div>

      <div class="d-flex align-items-center gap-3 header-controls-zone">
        <div class="med-header-search-container rounded-pill">
          <MedAutoComplete
            class="rounded-pill-search"
            v-model="selectedSearchItem"
            :categories="searchCategories"
            :loading="isSearchLoading"
            placeholder="Search..."
            @search-change="handleSearchChange"
          />
        </div>

        <div
          class="d-flex align-items-center gap-2 px-2 py-1 rounded-pill header-actions-capsule"
        >
          <button
            class="btn-action-trigger position-relative d-flex align-items-center justify-content-center rounded-circle border-0"
            @click="$emit('open-notifications')"
          >
            <i class="fas fa-bell fs-5"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle notification-ping"
            ></span>
          </button>

          <button
            class="btn-action-trigger d-flex align-items-center justify-content-center rounded-circle border-0"
          >
            <i class="fas fa-comment fs-5"></i>
          </button>

          <div class="mini-profile-wrapper ms-1">
            <img
              :src="userAvatar"
              :alt="userFullName"
              class="rounded-circle object-fit-cover mini-header-avatar"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================== -->
    <!-- 📱 CONFIGURATION MOBILE CRÉATIVE ET SÉCURISÉE -->
    <!-- ========================================== -->
    <header class="d-lg-none w-100 med-main-header-mobile">
      <div
        class="d-flex align-items-center justify-content-between py-2 px-1 navigation-mobile-row"
      >
        <!-- 🔍 GAUCHE : Icône recherche minimaliste pour déploiement -->
        <button
          @click="isMobileSearchOpen = !isMobileSearchOpen"
          class="mobile-action-btn d-flex align-items-center justify-content-center rounded-circle border-0"
          :class="{ 'active-search-trigger': isMobileSearchOpen }"
          aria-label="Rechercher"
        >
          <i
            class="fas"
            :class="isMobileSearchOpen ? 'fa-times text-danger' : 'fa-search'"
          ></i>
        </button>

        <!-- 🏛️ MILIEU : Marque de l'application élégante -->
        <div class="mobile-app-branding">
          <span class="app-brand-text"
            >Bénin<span class="brand-accent">Santé</span></span
          >
        </div>

        <!-- 🧑‍⚕️ DROITE : Cloche de notification + Avatar interchangeable -->
        <div class="d-flex align-items-center gap-2">
          <button
            class="mobile-action-btn position-relative d-flex align-items-center justify-content-center rounded-circle border-0"
            @click="$emit('open-notifications')"
          >
            <i class="fas fa-bell"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle mobile-ping"
            ></span>
          </button>

          <!-- Remplacement du bouton message par la photo de profil de l'utilisateur -->
          <div
            class="mobile-avatar-profile-container"
            @click="$emit('profile-click')"
          >
            <img
              :src="userAvatar"
              :alt="userFullName"
              class="rounded-circle object-fit-cover mobile-header-avatar"
            />
          </div>
        </div>
      </div>

      <!-- 📉 RAIL DE RECHERCHE EXTENSIBLE (Déroulement fluide sous l'en-tête) -->
      <Transition name="slide-down">
        <div
          v-if="isMobileSearchOpen"
          class="mobile-expanded-search-container p-2 mt-1 rounded-4 shadow-sm"
        >
          <MedAutoComplete
            v-model="selectedSearchItem"
            :categories="searchCategories"
            :loading="isSearchLoading"
            placeholder="Rechercher un dossier, praticien..."
            icon="fas fa-search"
            @search-change="handleSearchChange"
          />
        </div>
      </Transition>
    </header>
  </div>
</template>

<style scoped>
/* Styles Desktop existants */
.template-page-title {
  font-size: 1.85rem;
  font-family: var(--title-family), sans-serif;
}
.med-header-search-container {
  width: 280px;
}
.header-actions-capsule {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
}
.btn-action-trigger {
  width: 38px;
  height: 38px;
  background: transparent;
  color: #64748b;
}
.mini-header-avatar {
  width: 32px;
  height: 32px;
  border: 1px solid #ffffff;
}

/* Rendre le composant d'autocomplétion arrondi en Desktop */
:deep(.rounded-pill-search .input-group-text) {
  border-top-left-radius: 50rem !important;
  border-bottom-left-radius: 50rem !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
}
:deep(.rounded-pill-search .form-control),
:deep(.rounded-pill-search .btn) {
  border-top-right-radius: 50rem !important;
  border-bottom-right-radius: 50rem !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
}

/* ==========================================================================
   📱 DESIGN ET POLISH GLOBAL POUR LOGIQUE MOBILE
   ========================================================================== */
.med-main-header-mobile {
  background: transparent;
  position: relative;
  z-index: 110;
}

/* Boutons d'action circulaires mobiles */
.mobile-action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  color: #475569;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;
}
.mobile-action-btn:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.9);
}
.active-search-trigger {
  background: rgba(254, 226, 226, 0.9);
}

/* 🏛️ MARQUE ÉLÉGANTE CENTRALISÉE */
.mobile-app-branding {
  font-family: var(--title-family), sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #1e293b;
}
.brand-accent {
  background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 1px;
}

/* 🧑‍⚕️ AVATAR INTERACTIF DE SUBSTITUTION */
.mobile-avatar-profile-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(145deg, #ffffff 0%, #e2e8f0 100%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}
.mobile-header-avatar {
  width: 100%;
  height: 100%;
}
.mobile-ping {
  width: 7px;
  height: 7px;
}

/* 📉 BLOC DE RECHERCHE MOBILE EXPANSÉ */
.mobile-expanded-search-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Surcharges locales de l'AutoComplete sur mobile pour épouser la largeur */
:deep(.med-autocomplete .input-group) {
  border-radius: 30px !important;
  background: #ffffff !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02) !important;
}

/* Animation de transition */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>