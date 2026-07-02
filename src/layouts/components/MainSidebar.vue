<!-- src/components/main/MainSidebar.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  userFullName: { type: String, default: 'Auriol Sènan' },
  userAvatar: { type: String, default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  menuItems: { type: Array, default: () => [] }
})

defineEmits(['logout'])
const route = useRoute()

// États de gestion d'affichage Mobile
const showMobileDropdown = ref(false)
const mobileDropdownRef = ref(null)

const MAX_MOBILE_VISIBLE = 4
const hasOverflow = computed(() => props.menuItems.length > MAX_MOBILE_VISIBLE)

const visibleMobileItems = computed(() => {
  if (!hasOverflow.value) return props.menuItems
  return props.menuItems.slice(0, MAX_MOBILE_VISIBLE - 1)
})

const overflowMobileItems = computed(() => {
  if (!hasOverflow.value) return []
  return props.menuItems.slice(MAX_MOBILE_VISIBLE - 1)
})

const isActive = (path) => {
  if (!route) return false
  return route.path === path
}

const isOverflowActive = computed(() => {
  return overflowMobileItems.value.some(item => isActive(item.path))
})

const handleClickOutside = (event) => {
  if (mobileDropdownRef.value && !mobileDropdownRef.value.contains(event.target)) {
    showMobileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div>
    <!-- ========================================== -->
    <!-- 🖥️ VERSION DESKTOP : DESIGN FIDÈLE TEMPLATE -->
    <!-- ========================================== -->
    <aside class="d-none d-lg-flex flex-column align-items-center py-4 position-relative med-template-sidebar">
      
      <!-- 💊 SECTION SUPÉRIEURE : LOGO EN PILULE VERTICALE -->
      <div class="mb-5 d-flex align-items-center justify-content-center med-logo-vertical-pill">
        <div class="logo-graphic-core">
          <i class="pi pi-chart-bar text-white fs-5"></i>
        </div>
      </div>

      <!-- 🧭 SECTION CENTRALE : ACCORDÉON SUR RAIL ET HALO DE SÉLECTION -->
      <nav class="d-flex flex-column align-items-center gap-4 w-100 my-auto position-relative navigation-spine">
        <!-- La piste/rail translucide est générée via le CSS pseudo-element ::before de .navigation-spine -->
        
        <router-link
          v-for="item in menuItems"
          :key="'desktop-' + item.name"
          :to="item.path" 
          class="template-nav-circle d-flex align-items-center justify-content-center position-relative text-decoration-none"
          :class="{ 'active': isActive(item.path) }"
          :data-indicator="item.name"
        >
          <i :class="[item.icon, 'fs-5']"></i>
        </router-link>
      </nav>

      <!-- 🧑‍⚕️ SECTION INFÉRIEURE : PROFIL ISOLÉ & ACTION DECONEXION -->
      <div class="mt-auto d-flex flex-column align-items-center gap-3 position-relative user-profile-baseline">
        
        <!-- Bouton Déconnexion en floating aérien discret -->
        <button 
          @click="$emit('logout')" 
          class="btn-logout-floating d-flex align-items-center justify-content-center rounded-circle border-0 text-danger"
          data-indicator="Déconnexion"
        >
          <i class="pi pi-power-off fs-6"></i>
        </button>

        <!-- Cadre Avatar Circulaire Strict -->
        <div class="avatar-frame position-relative">
          <img 
            :src="userAvatar" 
            :alt="userFullName" 
            class="rounded-circle object-fit-cover template-patient-avatar"
          />
          <span class="position-absolute bottom-0 end-0 p-1 bg-success border-2 border-white rounded-circle online-dot"></span>
        </div>
      </div>

    </aside>

    <!-- ========================================== -->
    <!-- 📱 VERSION MOBILE : SÉCURISÉE ET OPÉRATIONNELLE -->
    <!-- ========================================== -->
    <div class="d-lg-none fixed-bottom w-100 m-0 p-0 z-3">
      <div class="med-mobile-nav-bar d-flex justify-content-around align-items-center py-2 m-0 border-top border-light shadow-lg">
        
        <router-link
          v-for="item in visibleMobileItems"
          :key="'mobile-' + item.name"
          :to="item.path"
          class="mobile-tab-btn d-flex flex-column align-items-center justify-content-center text-decoration-none"
          :class="{ 'active': isActive(item.path) }"
        >
          <div class="mobile-icon-holder d-flex align-items-center justify-content-center rounded-circle mb-1">
            <i :class="item.icon"></i>
          </div>
          <span class="mobile-text font-body">{{ item.name.substring(0, 8) }}</span>
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

          <Transition name="dropdown-slide">
            <div v-if="showMobileDropdown" class="med-mobile-dropdown shadow-lg border rounded-3 position-absolute">
              <div class="px-2 py-1">
                <router-link
                  v-for="item in overflowMobileItems"
                  :key="'overflow-' + item.name"
                  :to="'#'"
                  @click="showMobileDropdown = false"
                  class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-secondary"
                  :class="{ 'active bg-primary text-white': isActive(item.path) }"
                >
                  <i :class="[item.icon, 'fs-5']"></i>
                  <span class="fw-medium">{{ item.name }}</span>
                </router-link>
                
                <div class="dropdown-divider my-1.5"></div>
                
                <button @click="$emit('logout')" class="dropdown-item d-flex align-items-center gap-3 py-2 px-3 text-danger rounded-2 bg-transparent border-0 w-100 text-start">
                  <i class="pi pi-power-off"></i>
                  <span class="fw-medium">Déconnexion</span>
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
/* --- FOND ET EMPLACEMENT DE LA SIDEBAR DESKTOP --- */
.med-template-sidebar {
  width: 100px;
  height: 100%;
  background: transparent !important; /* Aucun fond propre pour fusionner avec le panneau en verre */
  border-right: none !important;
  z-index: 20;
}

/* 💊 LOGO : PILULE VERTICALE ALLONGÉE */
.med-logo-vertical-pill {
  width: 50px;
  height: 74px;
  border-radius: 25px;
  background: linear-gradient(145deg, #2563eb 0%, #06b6d4 100%);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}
.logo-graphic-core {
  transform: rotate(-45deg);
}

/* 🧵 LE RAIL VISUEL TRACÉ EN ARRIÈRE PLAN */
.navigation-spine {
  position: relative;
  z-index: 1;
}
.navigation-spine::before {
  content: '';
  position: absolute;
  top: -40px;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  background: rgba(255, 255, 255, 0.35); /* Bande verticale ultra translucide claire */
  border-radius: 20px;
  z-index: -2;
}

/* ⚪ ICÔNES INACTIVES : CERCLE BLANC CONTRASTÉ */
.template-nav-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.template-nav-circle:hover {
  color: #1d4ed8;
  transform: scale(1.05);
}

/* 🔵 ICÔNE ACTIVE (Bleu profond + Halo liquide vertical sur le rail) */
.template-nav-circle.active {
  background: #1d4ed8 !important; /* Bleu Roi Foncé */
  color: #ffffff !important;
  border-color: #1e40af;
  z-index: 5;
}
.template-nav-circle.active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 94px; /* Halo de lumière fluide s'étirant le long du rail */
  background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.7) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 80%);
  z-index: -1;
  pointer-events: none;
}

/* 🏷️ INDICATIFS TEXTUELS (TOOLTIPS CHICS EN VERRE GIVRÉ) */
.template-nav-circle::before,
.btn-logout-floating::before {
  content: attr(data-indicator);
  position: absolute;
  left: 62px;
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  background: rgba(15, 23, 42, 0.8) !important;
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.template-nav-circle:hover::before,
.btn-logout-floating:hover::before {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ⚙️ ISOLATION DU PROFIL ET ACTIONS EN BAS */
.btn-logout-floating {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}
.btn-logout-floating:hover {
  background: #fee2e2;
  color: #dc2626 !important;
  transform: translateY(-2px);
}
.template-patient-avatar {
  width: 46px;
  height: 46px;
  border: 2px solid #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}
.online-dot { width: 12px; height: 12px; }

/* --- SYSTÈME MOBILE PARFAIT SANS EFFET DE BORD --- */
.med-mobile-nav-bar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  width: 100%;
  height: 70px;
}
.mobile-tab-btn { color: #8c9ba5; font-size: 11px; font-weight: 500; }
.mobile-icon-holder { width: 38px; height: 38px; font-size: 18px; }
.mobile-tab-btn.active { color: #1a56db !important; }
.mobile-tab-btn.active .mobile-icon-holder {
  background-color: #1a56db;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);
  transform: translateY(-3px);
}
.med-mobile-dropdown {
  position: absolute;
  bottom: 80px;
  right: 10px;
  width: 210px;
  background: #ffffff;
  border-radius: 12px !important;
  z-index: 1060;
}
</style>