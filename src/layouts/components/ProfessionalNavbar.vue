<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { menuConfig } from '@/config/MenuItems.js';
import { useDashboard, useLayout } from '@/composables/useLayout';
import ProfessionalHeder from './ProfessionalHeder.vue';

const props = defineProps({
  notificationCounts: {
    type: Object,
    default: () => ({})
  }
});

// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['logout', 'toggle-notif']);

const route = useRoute();
const { userRole, toggleRightPanel } = useDashboard();
const { userFullName } = useLayout();

// Profile Dropdown
const showProfileDropdown = ref(false);
const profileDropdownRef = ref(null);

// Mobile Tabs Logic
const showMobileDropdown = ref(false);
const mobileDropdownRef = ref(null);
const MAX_MOBILE_VISIBLE = 4;

const filteredMenu = computed(() => {
  if (!userRole.value) return menuConfig;
  return menuConfig.filter(item => !item.roles || item.roles.includes(userRole.value.toUpperCase()));
});

const hasOverflow = computed(() => filteredMenu.value.length > MAX_MOBILE_VISIBLE);

const visibleMobileItems = computed(() => {
  if (!hasOverflow.value) return filteredMenu.value;
  return filteredMenu.value.slice(0, MAX_MOBILE_VISIBLE - 1);
});

const overflowMobileItems = computed(() => {
  if (!hasOverflow.value) return [];
  return filteredMenu.value.slice(MAX_MOBILE_VISIBLE - 1);
});

const isActive = (path) => {
  return route.path === path;
};

const isOverflowActive = computed(() => {
  return overflowMobileItems.value.some(item => isActive(item.path));
});

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false;
  }
  if (mobileDropdownRef.value && !mobileDropdownRef.value.contains(event.target)) {
    showMobileDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const totalNotifications = computed(() => {
  return Object.values(props.notificationCounts).reduce((a, b) => a + b, 0);
});
</script>

<template>
  <div>
    <!-- HEADER MOBILE -->
    <ProfessionalHeder :title="userFullName || 'BéninSanté'" :notificationCount="totalNotifications" />

    <!-- NAVBAR DESKTOP -->
    <nav class="d-none d-lg-flex align-items-center justify-content-between py-3 px-4 bg-transparent w-100">
      
      <!-- Left: Logo -->
      <div class="d-flex align-items-center gap-3">
        <div class="rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm border logo-icon-box" style="width: 42px; height: 42px;">
          <i class="pi pi-shield text-info fs-5"></i>
        </div>
        <span class="fw-bold tracking-tight text-dark font-title fs-5">
          Bénin<span class="text-info">Santé</span>
        </span>
      </div>

      <!-- Center: Navigation Links -->
      <div class="d-flex justify-content-center flex-grow-1">
        <ul class="d-flex align-items-center gap-2 m-0 p-0 list-unstyled">
          <li v-for="item in filteredMenu" :key="item.name">
            <router-link
              :to="item.path"
              class="d-flex align-items-center gap-2 px-3 py-2 rounded-pill text-decoration-none transition-base nav-item-desktop"
              :class="isActive(item.path) ? 'bg-primary text-white shadow-sm active-nav' : 'bg-white text-secondary hover-custom-primary shadow-sm'"
            >
              <i :class="item.icon"></i>
              <span class="fw-medium small">{{ item.name }}</span>
              <span v-if="notificationCounts[item.name]" class="badge rounded-pill p-1" :class="isActive(item.path) ? 'bg-white text-primary' : 'bg-danger text-white'">
                {{ notificationCounts[item.name] > 99 ? '99+' : notificationCounts[item.name] }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Right: Actions & Profile -->
      <div class="d-flex align-items-center gap-3">
        <button @click="toggleRightPanel" class="btn btn-icon btn-light rounded-circle text-secondary border-0 transition-base">
          <i class="pi pi-question-circle"></i>
        </button>
        
        <button @click="$emit('toggle-notif')" class="btn btn-icon btn-light rounded-circle text-secondary border-0 transition-base position-relative">
          <i class="pi pi-bell"></i>
          <span v-if="totalNotifications" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
            {{ totalNotifications > 99 ? '99+' : totalNotifications }}
          </span>
        </button>
        
        <div class="position-relative" ref="profileDropdownRef">
          <div 
            class="d-flex align-items-center gap-2 cursor-pointer p-1 pe-3 rounded-pill hover-bg-light transition-base border bg-white"
            @click="showProfileDropdown = !showProfileDropdown"
          >
            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 36px; height: 36px; font-size: 0.85rem;">
              {{ userFullName ? userFullName.substring(0, 2).toUpperCase() : 'US' }}
            </div>
            <div class="d-flex flex-column lh-1">
              <span class="fw-bold small">{{ userFullName || 'Utilisateur' }}</span>
              <span class="text-muted mt-1" style="font-size: 0.7rem;">{{ userRole || 'Professionnel' }}</span>
            </div>
            <i class="pi pi-angle-down text-muted ms-1" style="font-size: 0.8rem;"></i>
          </div>

          <Transition name="fade-down">
            <div v-if="showProfileDropdown" class="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border py-2" style="width: 200px; z-index: 1050;">
              <router-link to="/patient/settings" class="dropdown-item py-2 px-3 text-secondary d-flex align-items-center gap-2 small text-decoration-none hover-bg-light">
                <i class="pi pi-user"></i> Mon profil
              </router-link>
              <button @click="toggleRightPanel" class="dropdown-item py-2 px-3 text-secondary d-flex align-items-center gap-2 small border-0 bg-transparent w-100 text-start hover-bg-light">
                <i class="pi pi-cog"></i> Paramètres
              </button>
              <div class="dropdown-divider my-1"></div>
              <button @click="$emit('logout')" class="dropdown-item py-2 px-3 text-danger d-flex align-items-center gap-2 small border-0 bg-transparent w-100 text-start hover-bg-light">
                <i class="pi pi-power-off"></i> Déconnexion
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </nav>

    <!-- NAVBAR MOBILE (BOTTOM TABS) -->
    <div class="d-lg-none fixed-bottom w-100 m-0 p-0 z-3">
      <div class="med-mobile-nav-bar d-flex justify-content-around align-items-center py-2 m-0 border-top border-light shadow-lg bg-white">
        
        <router-link
          v-for="item in visibleMobileItems"
          :key="'mobile-' + item.name"
          :to="item.path"
          class="mobile-tab-btn d-flex flex-column align-items-center justify-content-center text-decoration-none"
          :class="{ 'active': isActive(item.path) }"
        >
          <div class="mobile-icon-holder d-flex align-items-center justify-content-center rounded-circle mb-1 position-relative">
            <i :class="item.icon"></i>
            <span v-if="notificationCounts[item.name]" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.5rem; padding: 0.2rem 0.3rem;">
              {{ notificationCounts[item.name] > 9 ? '9+' : notificationCounts[item.name] }}
            </span>
          </div>
          <span class="mobile-text font-body">{{ item.name.substring(0, 10) }}</span>
        </router-link>

        <div v-if="hasOverflow" class="position-relative" ref="mobileDropdownRef">
          <button 
            @click.stop="showMobileDropdown = !showMobileDropdown"
            class="mobile-tab-btn border-0 bg-transparent d-flex flex-column align-items-center justify-content-center"
            :class="{ 'active': isOverflowActive || showMobileDropdown }"
          >
            <div class="mobile-icon-holder d-flex align-items-center justify-content-center rounded-circle mb-1">
              <i class="pi" :class="showMobileDropdown ? 'pi-times' : 'pi-ellipsis-h'"></i>
            </div>
            <span class="mobile-text font-body">Plus</span>
          </button>

          <Transition name="fade-up">
            <div v-if="showMobileDropdown" class="med-mobile-dropdown shadow-lg border rounded-3 position-absolute bg-white">
              <div class="px-2 py-1">
                <router-link
                  v-for="item in overflowMobileItems"
                  :key="'overflow-' + item.name"
                  :to="item.path"
                  @click="showMobileDropdown = false"
                  class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-secondary text-decoration-none hover-bg-light"
                  :class="{ 'bg-primary text-white': isActive(item.path) }"
                >
                  <i :class="[item.icon, 'fs-5']"></i>
                  <span class="fw-medium small d-flex justify-content-between w-100 align-items-center">
                    {{ item.name }}
                    <span v-if="notificationCounts[item.name]" class="badge rounded-pill bg-danger" style="font-size: 0.6rem;">
                      {{ notificationCounts[item.name] }}
                    </span>
                  </span>
                </router-link>
                
                <div class="dropdown-divider my-2"></div>
                
                <!-- Profil Mobile -->
                <router-link to="/patient/settings" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 text-secondary rounded-2 text-decoration-none hover-bg-light">
                  <i class="pi pi-user fs-5"></i>
                  <span class="fw-medium small">Mon Profil</span>
                </router-link>
                
                <button @click="toggleRightPanel(); showMobileDropdown = false;" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 text-secondary rounded-2 bg-transparent border-0 w-100 text-start hover-bg-light">
                  <i class="pi pi-cog fs-5"></i>
                  <span class="fw-medium small">Paramètres</span>
                </button>

                <div class="dropdown-divider my-2"></div>

                <button @click="$emit('logout')" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 text-danger rounded-2 bg-transparent border-0 w-100 text-start mb-1 hover-bg-light">
                  <i class="pi pi-power-off fs-5"></i>
                  <span class="fw-medium small">Déconnexion</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* DESKTOP NAV CLASSES */
.nav-item-desktop {
  background-color: transparent;
}
.active-nav {
  background-color: var(--medical-primary) !important;
}

.hover-bg-light:hover {
  background-color: rgba(0,0,0,0.04);
}

.cursor-pointer {
  cursor: pointer;
}

.logo-icon-box {
  border-color: rgba(0,0,0,0.08) !important;
}

/* MOBILE NAV CLASSES */
.med-mobile-nav-bar {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  height: 70px;
}
.mobile-tab-btn { color: #8c9ba5; font-size: 11px; font-weight: 500; }
.mobile-icon-holder { width: 38px; height: 38px; font-size: 18px; transition: all 0.2s ease; }
.mobile-tab-btn.active { color: var(--medical-primary) !important; }
.mobile-tab-btn.active .mobile-icon-holder {
  background-color: var(--medical-primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
  transform: translateY(-3px);
}
.med-mobile-dropdown {
  bottom: 80px;
  right: 10px;
  width: 230px;
  z-index: 1060;
}

/* TRANSITIONS */
.fade-down-enter-active, .fade-down-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-down-enter-from, .fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.transition-base {
  transition: all 0.2s ease;
}

.desktop-onglet-color{
  background-color: var(--medical-primary-bg);
}

.hover-custom-primary:hover {
  background-color: var(--medical-primary-bg) !important;
  color: var(--medical-primary) !important;
}
</style>
