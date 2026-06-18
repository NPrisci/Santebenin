<!-- components/MedAppLoader.vue -->
<script setup>
defineProps({
  text: {
    type: String,
    default: 'Synchronisation des constantes cliniques...',
  },
  visible: {
    type: Boolean,
    default: true,
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="med-splash-fade">
      <div
        v-if="visible"
        class="fixed-backdrop d-flex flex-column align-items-center justify-content-center p-5 select-none text-center"
      >
        <!-- CONTENEUR CENTRAL : LOGO + STATUS -->
        <div class="d-flex flex-column align-items-center gap-5 position-relative layout-center-box">
          
          <!-- THÉÂTRE DU LOGO ET DE L'ECG CINÉTIQUE -->
          <div class="med-logo-theater position-relative">
            <svg viewBox="0 0 340 110" width="320" height="103" xmlns="http://www.w3.org/2000/svg">
              
              <!-- 1. LA LIGNE HORIZONTALE ECG TRADITIONNELLE -->
              <path
                d="M 0 55 L 42 55 L 48 42 L 53 68 L 60 14 L 68 96 L 74 55 L 340 55"
                fill="none"
                stroke="var(--medical-secondary-light)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="animate-ecg-line"
              />

              <!-- 2. LE TEXTE VERTICAL "SANTÉ" -->
              <text
                x="22"
                y="18"
                font-family="var(--title-family)"
                font-weight="800"
                font-size="19"
                fill="rgba(255,255,255,0.8)"
                text-anchor="middle"
                letter-spacing="2"
                class="reveal-sante"
              >
                <tspan x="22" dy="0">S</tspan>
                <tspan x="22" dy="20">A</tspan>
                <tspan x="22" dy="20">N</tspan>
                <tspan x="22" dy="20">T</tspan>
                <tspan x="22" dy="20">É</tspan>
              </text>

              <!-- Séparateur vertical discret -->
              <line
                x1="48"
                y1="10"
                x2="48"
                y2="100"
                stroke="rgba(255,255,255,0.15)"
                stroke-width="1.5"
                class="reveal-spine"
              />

              <!-- 3. LA COLONNE VERTÉBRALE DU LOGO -->
              <line
                x1="68"
                y1="14"
                x2="68"
                y2="96"
                stroke="var(--medical-white)"
                stroke-width="6"
                stroke-linecap="round"
                class="reveal-stem"
              />
              
              <!-- 4. LES BRANCHES HORIZONTALES -->
              <line x1="68" y1="14" x2="103" y2="14" stroke="var(--medical-white)" stroke-width="5" stroke-linecap="round" class="reveal-branch branch-t" />
              <line x1="68" y1="55" x2="99" y2="55" stroke="var(--medical-white)" stroke-width="5" stroke-linecap="round" class="reveal-branch branch-m" />
              <line x1="68" y1="96" x2="103" y2="96" stroke="var(--medical-white)" stroke-width="5" stroke-linecap="round" class="reveal-branch branch-b" />

              <!-- 5. LES COURBES DU "B" -->
              <path
                d="M 103 14 A 20.5 20.5 0 0 1 103 55"
                fill="none"
                stroke="var(--medical-white)"
                stroke-width="5"
                stroke-linecap="round"
                class="reveal-curve curve-t"
              />
              <path
                d="M 103 55 A 20.5 20.5 0 0 1 103 96"
                fill="none"
                stroke="var(--medical-white)"
                stroke-width="5"
                stroke-linecap="round"
                class="reveal-curve curve-b"
              />

              <!-- 6. LE TEXTE PRINCIPAL "énin" -->
              <text
                x="126"
                y="96"
                font-family="var(--title-family)"
                font-weight="800"
                font-size="75"
                fill="var(--medical-white)"
                letter-spacing="-2"
                class="reveal-enin"
              >
                énin
              </text>
            </svg>
            
            <!-- LENS FLARE : Version adoucie et ultra-translucide -->
            <div class="shimmer-sweep"></div>
          </div>

          <!-- INDICATEUR DE STATUT (Isolé pour éviter toute collision) -->
          <div class="loader-status-wrapper mt-2">
            <div class="pulse-glow-dot"></div>
            <p class="status-text text-uppercase tracking-widest m-0 font-sans fw-bold">
              {{ text }}
            </p>
          </div>
        </div>

        <!-- ANCRAGE DE SÉCURITÉ BAS (Correction Bootstrap 5.3 stricte) -->
        <div class="hds-badge d-flex align-items-center justify-content-center gap-2 position-absolute bottom-0 mb-5 start-50 translate-middle-x text-nowrap">
          <i class="pi pi-shield text-success animate-shield-pulse"></i>
          <span class="font-sans text-white-50 text-uppercase tracking-wider extra-small">
            Données Chiffrées de bout en bout · Norme HDS Bénin
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fixed-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--medical-dashboard);
  z-index: 99999;
  overflow: hidden;
}

.layout-center-box {
  z-index: 2;
}

.med-logo-theater {
  width: 320px;
  height: 103px;
}

.extra-small {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

/* ==========================================================================
   ANIMATIONS DES TRACÉS SVG
   ========================================================================== */
@keyframes ecg-runner {
  0% { stroke-dashoffset: 800; }
  60% { stroke-dashoffset: 0; opacity: 1; }
  80% { opacity: 0.4; }
  100% { stroke-dashoffset: -800; opacity: 0; }
}
.animate-ecg-line {
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: ecg-runner 1.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

@keyframes stem-reveal {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}
.reveal-stem {
  transform-origin: center;
  animation: stem-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.6s;
  opacity: 0;
}

@keyframes branch-expand {
  from { stroke-dashoffset: 50; opacity: 0; }
  to { stroke-dashoffset: 0; opacity: 1; }
}
.reveal-branch {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: branch-expand 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.branch-t { animation-delay: 0.8s; }
.branch-m { animation-delay: 0.85s; }
.branch-b { animation-delay: 0.9s; }

@keyframes curve-draw {
  from { stroke-dashoffset: 100; opacity: 0; }
  to { stroke-dashoffset: 0; opacity: 1; }
}
.reveal-curve {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: curve-draw 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.curve-t { animation-delay: 1.0s; }
.curve-b { animation-delay: 1.15s; }

@keyframes text-slide-reveal {
  from { opacity: 0; transform: translateX(-12px); filter: blur(4px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}
.reveal-enin {
  animation: text-slide-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.3s;
  opacity: 0;
}
.reveal-sante {
  animation: text-slide-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.4s;
  opacity: 0;
}
.reveal-spine {
  animation: text-slide-reveal 0.4s ease forwards;
  animation-delay: 1.2s;
  opacity: 0;
}

/* ==========================================================================
   REFONTE DU SHIMMER EFFECT (Plus fluide, plus discret)
   ========================================================================== */
@keyframes lens-sweep {
  0% { transform: translate(-150%, -50%) skewX(-25deg); opacity: 0; }
  15% { opacity: 0.25; }
  45% { opacity: 0.25; }
  60% { transform: translate(150%, -50%) skewX(-25deg); opacity: 0; }
  100% { transform: translate(150%, -50%) skewX(-25deg); opacity: 0; }
}
.shimmer-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 160px;
  /* Utilisation d'une opacité très fine (0.15) pour ne pas masquer l'écriture */
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: lens-sweep 3.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
  animation-delay: 1.8s;
  pointer-events: none;
  z-index: 3;
}

/* ==========================================================================
   ELEMENTS ACCESSOIRES
   ========================================================================== */
.loader-status-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.45);
}

.pulse-glow-dot {
  width: 6px;
  height: 6px;
  background-color: var(--medical-secondary-light);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--medical-secondary-light);
  animation: dot-glow 1.2s infinite alternate;
}

@keyframes dot-glow {
  from { transform: scale(0.8); opacity: 0.4; }
  to { transform: scale(1.3); opacity: 1; }
}

.animate-shield-pulse {
  animation: shield-beat 2s infinite ease-in-out;
}
@keyframes shield-beat {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.12); opacity: 0.9; }
}

/* TRANSITION GENERALE */
.med-splash-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.76, 0, 0.24, 1);
}
.med-splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
  filter: blur(6px);
}
</style>