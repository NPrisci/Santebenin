<!-- src/components/main/MedNotification.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  // Le mode Desktop : 'popup' (sous la cloche) ou 'drawer' (panneau offcanvas latéral)
  desktopMode: {
    type: String,
    default: "popup",
    validator: (value) => ["popup", "drawer"].includes(value),
  },
  // Les notifications sont maintenant injectées dynamiquement
  notifications: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "read-all", "card-click"]);

const popupRef = ref(null);

// Gestion de la fermeture automatique au clic extérieur uniquement pour le mode 'popup'
const handleClickOutside = (event) => {
  if (props.isOpen && props.desktopMode === "popup") {
    // Si on clique sur la cloche (qui ouvre le composant) ou à l'intérieur du popup, on ne ferme pas
    if (
      popupRef.value &&
      !popupRef.value.contains(event.target) &&
      !event.target.closest(".btn-action-trigger")
    ) {
      emit("close");
    }
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="med-notification-architecture">
    <!-- ========================================== -->
    <!-- 📱 INTERFACE MOBILE : RIDEAU BAS (BOTTOM SHEET) -->
    <!-- ========================================== -->
    <!-- Teleport vers body pour échapper au backdrop-filter du layout parent -->
    <Teleport to="body">
      <div class="d-lg-none">
        <Transition name="fade">
          <div
            v-if="isOpen"
            class="med-notif-backdrop-mobile"
            @click="$emit('close')"
          ></div>
        </Transition>

        <Transition name="slide-bottom-sheet">
          <div v-if="isOpen" class="med-notif-bottom-sheet">
            <div class="med-notif-bottom-sheet-handle"></div>

            <div
              class="panel-header-core px-3 pb-3 d-flex align-items-center justify-content-between border-bottom border-light"
            >
              <h5 class="fw-bold mb-0 text-dark font-title">Notifications</h5>
              <button
                @click="$emit('read-all')"
                class="btn btn-link btn-sm text-decoration-none p-0 text-primary fw-medium text-xs"
              >
                Tout lire
              </button>
            </div>

            <div class="panel-body-core flex-grow-1 overflow-y-auto p-3">
              <div
                v-if="notifications.length === 0"
                class="text-center py-5 text-muted small"
              >
                Aucune notification
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <div
                  v-for="item in notifications"
                  :key="item.id"
                  class="notification-card p-3 rounded-4 d-flex gap-3"
                  :class="{ 'unread-style': item.unread }"
                  @click="$emit('card-click', item)"
                >
                  <div
                    :class="[
                      'icon-avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0',
                      item.iconBg || 'bg-light text-secondary',
                    ]"
                  >
                    <i :class="item.icon || 'fas fa-bell'"></i>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div
                      class="d-flex justify-content-between align-items-center mb-0.5"
                    >
                      <span class="fw-bold text-dark text-sm text-truncate">{{
                        item.title
                      }}</span>
                      <span class="text-muted text-xxs flex-shrink-0">{{
                        item.time
                      }}</span>
                    </div>
                    <p
                      class="text-secondary text-xs mb-0 text-clamp-2 leading-relaxed"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>


    <!-- ========================================== -->
    <!-- 🖥️ INTERFACES DESKTOP (DRAWER vs POPUP)    -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div class="d-none d-lg-block">
      <!-- 📐 COUCHE 1 : RENDU MODE DRAWER (OFFCANVAS BOOTSTRAP STYLE) -->
      <template v-if="desktopMode === 'drawer'">
        <Transition name="fade">
          <div
            v-if="isOpen"
            class="notification-backdrop-desktop"
            @click="$emit('close')"
          ></div>
        </Transition>

        <Transition name="slide-drawer">
          <div v-if="isOpen" class="desktop-drawer-panel d-flex flex-column">
            <div
              class="panel-header-core p-3 d-flex align-items-center justify-content-between border-bottom border-light"
            >
              <h5 class="fw-bold mb-0 text-dark font-title">Notifications</h5>
              <div class="d-flex align-items-center gap-3">
                <button
                  @click="$emit('read-all')"
                  class="btn btn-link btn-sm text-decoration-none p-0 text-primary text-xs"
                >
                  Tout lire
                </button>
                <button
                  @click="$emit('close')"
                  class="btn-close-action d-flex align-items-center justify-content-center rounded-circle border-0"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
            <div class="panel-body-core flex-grow-1 overflow-y-auto p-3">
              <div
                v-if="notifications.length === 0"
                class="text-center py-5 text-muted small"
              >
                Aucune notification
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <div
                  v-for="item in notifications"
                  :key="item.id"
                  class="notification-card p-3 rounded-4 d-flex gap-3"
                  :class="{ 'unread-style': item.unread }"
                  @click="$emit('card-click', item)"
                >
                  <div
                    :class="[
                      'icon-avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0',
                      item.iconBg || 'bg-light text-secondary',
                    ]"
                  >
                    <i :class="item.icon || 'pi pi-bell'"></i>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div
                      class="d-flex justify-content-between align-items-center mb-0.5"
                    >
                      <span class="fw-bold text-dark text-sm text-truncate">{{
                        item.title
                      }}</span
                      ><span class="text-muted text-xxs ms-2">{{
                        item.time
                      }}</span>
                    </div>
                    <p class="text-secondary text-xs mb-0 text-clamp-2">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>

      <!-- 📐 COUCHE 2 : RENDU MODE POPUP CLASSIQUE GIVRÉ -->
      <template v-if="desktopMode === 'popup'">
        <Transition name="popup-scale">
          <div v-if="isOpen" ref="popupRef" class="desktop-popup-modal">
            <!-- 📐 La petite flèche d'ancrage pointant vers la cloche -->
            <div class="popup-arrow"></div>

            <!-- 📌 EN-TÊTE DU POPUP -->
            <div
              class="panel-header-core px-3 py-3 d-flex align-items-center justify-content-between border-bottom"
            >
              <span class="fw-bold text-dark font-title text-sm"
                >Notifications</span
              >
              <button
                @click="$emit('read-all')"
                class="btn btn-link btn-sm text-decoration-none p-0 text-primary fw-medium text-xxs btn-read-all-link"
              >
                Tout marquer comme lu
              </button>
            </div>

            <!-- 📜 FLUX DE NOTIFICATIONS STYLE ÉPURÉ -->
            <div
              class="panel-body-core overflow-y-auto p-2"
              style="max-height: 360px"
            >
              <div
                v-if="notifications.length === 0"
                class="text-center py-4 text-muted text-xs"
              >
                <i class="pi pi-bell-slash d-block mb-1 text-light fs-5"></i>
                Aucune notification
              </div>

              <div v-else class="d-flex flex-column gap-1">
                <div
                  v-for="item in notifications"
                  :key="item.id"
                  class="notification-card-compact p-2 rounded-3 d-flex align-items-center gap-3 hover:text-secondary"
                  :class="{ 'unread-style-compact': item.unread }"
                  @click="$emit('card-click', item)"
                >
                  <!-- Cercle d'icône minimaliste -->
                  <div
                    :class="[
                      'icon-avatar-compact rounded-circle d-flex align-items-center justify-content-center flex-shrink-0',
                      item.iconBg || 'bg-light text-secondary',
                    ]"
                  >
                    <i :class="item.icon || 'pi pi-bell'"></i>
                  </div>

                  <!-- Contenu de la notification -->
                  <div class="flex-grow-1 min-w-0">
                    <div
                      class="d-flex justify-content-between align-items-baseline mb-0.5"
                    >
                      <span
                        class="fw-semibold text-dark text-xs text-truncate"
                        >{{ item.title }}</span
                      >
                      <span
                        class="text-muted text-xxs flex-shrink-0 ms-2"
                        >{{ item.time }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
      </div><!-- /d-none d-lg-block -->
    </Teleport>
  </div><!-- /med-notification-architecture -->
</template>

<style>
.med-notif-backdrop-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(4px);
  z-index: 1060;
}
.med-notif-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 70vh;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1070;
  display: flex;
  flex-direction: column;
}
.med-notif-bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background-color: #cbd5e1;
  border-radius: 2px;
  margin: 0.5rem auto;
}
/* Transitions du Teleport mobile */
.slide-bottom-sheet-enter-active,
.slide-bottom-sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.94, 0.6, 1);
}
.slide-bottom-sheet-enter-from,
.slide-bottom-sheet-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.text-xs {
  font-size: 0.85rem;
}
.text-xxs {
  font-size: 0.75rem;
}
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 💊 STRUCTURE COMMUNE DES CARTES DE NOTIFICATION */
.notification-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.notification-card:hover {
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.unread-style {
  background: #ffffff !important;
  border-left: 3px solid #2563eb !important;
}
.icon-avatar {
  width: 36px;
  height: 36px;
}


/* ==========================================================================
   🖥️ STYLE 2 : DESKTOP DRAWER (OFFCANVAS FUSIONNÉ)
   ========================================================================== */
.notification-backdrop-desktop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(2px);
  z-index: 1040;
}
.desktop-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(35px) saturate(110%);
  border-left: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.03);
  z-index: 1050;
}
.btn-close-action {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.04);
  color: #64748b;
}

/* ==========================================================================
   🖥️ STYLE 3 : DESKTOP POPUP MODAL (SOUS LA CLOCHE)
   ========================================================================== */
.desktop-popup-modal {
  position: fixed;
  top: 70px; /* Juste sous l'en-tête du header */
  right: 16px; /* Aligné sur le bord droit de l'écran */
  width: 340px;
  background: #ffffff;
  border-radius: 1rem !important;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12),
    0 4px 16px rgba(15, 23, 42, 0.06) !important;
  z-index: 9999;
  transform-origin: top right;
  overflow: hidden;
}

/* Petite flèche d'ancrage du popup */
.popup-arrow {
  display: none; /* Désactivé pour le moment, peut être réactivé */
}
.notification-card-compact {
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.notification-card-compact:hover {
  background: rgba(255, 255, 255, 0.8);
}
.unread-style-compact {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
  border-radius: 6px;
}
.unread-style-compact::before {
  content: "";
  position: absolute;
  left: 6px;
  width: 4px;
  height: 4px;
  background-color: #2563eb;
  border-radius: 50%;
}
.icon-avatar-compact {
  width: 28px;
  height: 28px;
}

/* ==========================================================================
   🎬 ANIMATIONS DES TRANSITIONS (Desktop uniquement — les transitions mobile sont en global)
   ========================================================================== */
.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.94, 0.6, 1);
}
.slide-drawer-enter-from,
.slide-drawer-leave-to {
  transform: translateX(100%);
}

.popup-scale-enter-active,
.popup-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.popup-scale-enter-from,
.popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}
</style>