<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDashboard, useLayout } from "@/composables/useLayout";
import { adminItems } from "@/config/MenuItems.js";

defineEmits(['logout'])
const { 
  isSidebarExpanded, 
  toggleSidebar, 
  userRole, 
  isMobileSidebarOpen, 
  closeMobileSidebar,
  userRoleText 
} = useDashboard();

const { userFullName } = useLayout();

const props = defineProps({
  role: { type: String, default: "" }
});

const router = useRouter();
const route = useRoute();

const isHovered = ref(false);
const expandedMenus = ref({});

const isFullyExpanded = computed(() => isSidebarExpanded.value || isHovered.value);
const displayRole = computed(() => props.role || userRoleText?.value || userRole.value || 'Utilisateur');

const isActive = (path) => route.path === path;
const isChildActive = (children) => children?.some(child => route.path === child.route);

const filteredMenu = computed(() => {
  return adminItems
});

const handleItemClick = (item, isMobile = false) => {
  if (item.children) {
    expandedMenus.value[item.id] = !expandedMenus.value[item.id];
  } else {
    if (item.route) router.push(item.route);
    if (isMobile) closeMobileSidebar();
  }
};

const handleChildClick = (child, isMobile = false) => {
  if (child.route) router.push(child.route);
  if (isMobile) closeMobileSidebar();
};
</script>

<template>
  <aside
    class="d-none d-lg-flex flex-column py-4 text-white shadow h-100 vh-100 transition-base sidebar-container"
    :style="{ width: isFullyExpanded ? '250px' : '85px' }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="d-flex align-items-center gap-3 px-3 mb-5 flex-shrink-0 overflow-hidden">
      <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 logo-icon-box">
        <i class="pi pi-shield text-info fs-4"></i>
      </div>
      <Transition name="fade-fast">
        <span v-if="isFullyExpanded" class="fw-bold tracking-tight text-white font-title text-nowrap fs-5">
          Bénin<span class="text-info">Santé</span>
        </span>
      </Transition>
    </div>

    <div class="flex-grow-1 custom-overflow-y px-2 vstack gap-4">
      <div v-for="section in filteredMenu" :key="section.id" class="vstack gap-1">
        <Transition name="fade-fast">
          <p v-if="isFullyExpanded" class="text-uppercase text-white opacity-50 fw-bold px-3 mb-2 font-mono section-title">
            {{ section.title }}
          </p>
        </Transition>

        <div v-for="item in section.items" :key="item.id" class="vstack gap-1">
          <button
            @click="handleItemClick(item, false)"
            class="w-100 d-flex align-items-center justify-content-between p-3 rounded-3 border-0 transition-base bg-transparent text-start nav-link-custom"
            :class="{ 'active-tab shadow-sm': isActive(item.route) || isChildActive(item.children) }"
            :title="!isFullyExpanded ? (item.label || item.name || item.title) : ''"
          >
            <div class="d-flex align-items-center gap-3 min-w-0 row-content">
              <i :class="[item.icon, 'fs-5 flex-shrink-0 item-icon']"></i>
              <span v-if="isFullyExpanded" class="small tracking-wide text-truncate fw-medium item-text">
                {{ item.label || item.name || item.title }}
              </span>
            </div>
            <i 
              v-if="item.children && isFullyExpanded" 
              class="pi pi-chevron-down opacity-50 transition-base text-white"
              style="font-size: 10px;"
              :class="{ 'rotate-180': expandedMenus[item.id] }"
            ></i>
          </button>

          <div v-if="item.children && expandedMenus[item.id] && isFullyExpanded" class="ms-4 ps-2 border-start border-white-20 vstack gap-1 animate-slide-down my-1">
            <button
              v-for="child in item.children"
              :key="child.id"
              @click="handleChildClick(child, false)"
              class="w-100 text-start py-2 px-3 border-0 rounded-2 bg-transparent text-nowrap transition-base sub-link-custom"
              :class="{ 'sub-active': isActive(child.route) }"
            >
              {{ child.label || child.name || child.title }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-3 px-3 border-top border-white-10 vstack gap-3 flex-shrink-0 align-items-center overflow-hidden">
      <div class="d-flex flex-column align-items-center w-100 py-2 rounded-3 bg-black bg-opacity-10">
        <div class="rounded-circle border border-2 border-white-20 d-flex align-items-center justify-content-center bg-light text-dark fw-bold shadow-sm flex-shrink-0 transition-base" :style="{ width: isFullyExpanded ? '48px' : '38px', height: isFullyExpanded ? '48px' : '38px' }">
          {{ userFullName?.substring(0, 2).toUpperCase() || 'US' }}
        </div>
        <div v-if="isFullyExpanded" class="mt-2 min-w-0 px-2 text-center">
          <p class="mb-0 small fw-bold text-white text-truncate lh-sm">{{ userFullName }}</p>
          <span class="d-block text-info fw-medium text-truncate mt-1 role-badge text-uppercase">Role : {{ displayRole }}</span>
        </div>
        <button @click="$emit('logout')" class="btn btn-sm text-danger mt-2 border-0 bg-transparent d-flex align-items-center justify-content-center gap-2 w-100 text-hover-danger" :class="isFullyExpanded ? 'px-3 justify-content-center' : 'p-2'">
          <i class="pi pi-power-off"></i>
          <span v-if="isFullyExpanded" class="small fw-bold">Déconnexion</span>
        </button>
      </div>
      <button @click="toggleSidebar" class="w-100 border-0 text-white-50 hover-bg-white-10 text-hover-white rounded-3 d-flex align-items-center justify-content-center transition-base border border-white-10" style="height: 36px; background: rgba(255, 255, 255, 0.02);">
        <i class="pi" :class="isSidebarExpanded ? 'pi-angle-double-left' : 'pi-angle-double-right'" style="font-size: 13px;"></i>
      </button>
    </div>
  </aside>

  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isMobileSidebarOpen" 
        class="d-lg-none mobile-overlay" 
        @click="closeMobileSidebar" 
      />
    </Transition>

    <Transition name="slide">
      <aside 
        v-if="isMobileSidebarOpen" 
        class="d-lg-none mobile-drawer text-white p-3 shadow-lg vstack sidebar-container"
      >
        <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-white-10">
          <span class="fw-bold font-title fs-5">Bénin<span class="text-info">Santé</span></span>
          <button @click="closeMobileSidebar" class="btn btn-sm text-white border-0 mobile-close-btn rounded-circle p-2 d-flex align-items-center justify-content-center">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="flex-grow-1 custom-overflow-y vstack gap-3">
          <div v-for="section in filteredMenu" :key="section.id" class="vstack gap-1">
            <p class="text-uppercase text-white opacity-50 fw-bold px-2 mb-1 font-mono section-title">{{ section.title }}</p>
            
            <div v-for="item in section.items" :key="item.id" class="vstack gap-1">
              <button
                @click="handleItemClick(item, true)"
                class="w-100 d-flex align-items-center justify-content-between p-3 border-0 rounded-3 bg-transparent text-start nav-link-custom"
                :class="{ 'active-tab opacity-100 fw-medium': isActive(item.route) || isChildActive(item.children) }"
              >
                <div class="d-flex align-items-center gap-3">
                  <i :class="[item.icon, 'fs-5 item-icon']"></i>
                  <span class="small fw-medium item-text">{{ item.label || item.name || item.title }}</span>
                </div>
                <i v-if="item.children" class="pi pi-chevron-down opacity-50 text-white" :class="{ 'rotate-180': expandedMenus[item.id] }" style="font-size: 10px;"></i>
              </button>

              <div v-if="item.children && expandedMenus[item.id]" class="ms-4 ps-2 border-start border-white-20 vstack gap-1">
                <button
                  v-for="child in item.children"
                  :key="child.id"
                  @click="handleChildClick(child, true)"
                  class="w-100 text-start py-2 px-3 border-0 rounded-2 bg-transparent text-nowrap transition-base sub-link-custom"
                  :class="{ 'sub-active': isActive(child.route) }"
                >
                  {{ child.label || child.name || child.title }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Conteneur principal */
.sidebar-container {
  background-color: #1e293b !important; 
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}
.logo-icon-box {
  width: 40px; height: 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* --- DESIGN ET DIMENSIONS DU DRAWER MOBILE (80% WIDTH) --- */
.mobile-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4) !important; /* Fond assombri mais très translucide */
  backdrop-filter: blur(4px); /* Léger effet de flou pour préserver le design haut de gamme */
  z-index: 99999 !important; /* Écrase absolument tout le layout parent */
}

.mobile-drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 80% !important; /* Contrainte stricte de 80% demandée */
  max-width: 320px; /* Sécurité pour ne pas être trop large sur tablette intermédiaire */
  z-index: 100000 !important; /* Se place juste au-dessus de l'arrière-plan flouté */
}

.mobile-close-btn {
  background: rgba(255, 255, 255, 0.06) !important;
  width: 32px; height: 32px;
}

/* Couleurs des onglets */
.nav-link-custom { color: rgba(255, 255, 255, 0.75) !important; }
.nav-link-custom .item-icon, .nav-link-custom .item-text { color: rgba(255, 255, 255, 0.75) !important; transition: color 0.2s ease; }
.nav-link-custom:hover { background-color: rgba(255, 255, 255, 0.08) !important; }
.nav-link-custom:hover .item-icon, .nav-link-custom:hover .item-text { color: #ffffff !important; }

.active-tab { background-color: #0284c7 !important; }
.active-tab .item-icon, .active-tab .item-text { color: #ffffff !important; font-weight: 600 !important; }

/* Sous-menus */
.sub-link-custom { color: rgba(255, 255, 255, 0.65) !important; font-size: 13.5px; padding: 7px 12px; }
.sub-link-custom:hover { color: #ffffff !important; background-color: rgba(255, 255, 255, 0.05) !important; padding-left: 18px !important; }
.sub-active { color: #38bdf8 !important; font-weight: bold !important; }

/* Scrollbars */
.custom-overflow-y { overflow-y: auto !important; overflow-x: hidden !important; }
.custom-overflow-y::-webkit-scrollbar { width: 4px; }
.custom-overflow-y::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 6px; }

.text-hover-danger:hover { background-color: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }
.border-white-10 { border-color: rgba(255, 255, 255, 0.08) !important; }
.border-white-20 { border-color: rgba(255, 255, 255, 0.15) !important; }
.section-title { font-size: 10.5px; letter-spacing: 0.06em; }
.role-badge { font-size: 10.5px; }

/* --- TRANSITIONS FLUIDES --- */
.transition-base { transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1), padding 0.22s ease, all 0.2s ease; }
.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 0.1s ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }
.animate-slide-down { animation: slideDown 0.18s ease-out forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }

/* Animations Mobiles dédiées */
.slide-enter-active, .slide-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>