<!-- layouts/AuthLayout.vue -->
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'

// Importation de nos 3 logos cinétiques
import FirstAuthLogo from '@/components/auth/FirstAuthLogo.vue'
import SecondAuthLogo from '@/components/auth/SecondAuthLogo.vue'
import ThirdAuthLogo from '@/components/auth/ThirdAuthLogo.vue'
import MainAuthLogo from '@/components/auth/MainAuthLogo.vue'

const props = defineProps({
  // Permet au composant enfant (ex: Login) de piloter le logo affiché
  formStep: {
    type: Number,
    default: null
  }
})

const route = useRoute()
const isRegister = computed(() => route.path.includes('/register'))

// Contenu narratif unifié pour le mode carrousel (utilisé si formStep n'est pas fourni)
const slides = [
  {
    component: FirstAuthLogo,
    title: 'BeninSanté',
    subtitle: 'Le numérique au service de la vie',
    accent: '#38bdf8'
  },
  {
    component: SecondAuthLogo,
    title: 'Chaque seconde compte',
    subtitle: "L'information médicale en temps réel",
    accent: '#ffffff'
  },
  {
    component: ThirdAuthLogo,
    title: 'Vos données, protégées',
    subtitle: 'Confidentialité et haute sécurité HDS',
    accent: '#0a7f70'
  }
]

const currentSlide = ref(0)
let carrouselTimer = null

// Gestion intelligente de la cinétique visuelle
const activeData = computed(() => {
  // Si le formulaire parent impose son étape (Mode Login Synchrone)
  if (props.formStep !== null) {
    const step = props.formStep
    if (step === 1) return { component: FirstAuthLogo, title: 'Identifiant unique de santé', subtitle: 'Connexion via le nœud national certifié ANIP' }
    if (step === 2) return { component: SecondAuthLogo, title: 'Habilitation & Chiffrement', subtitle: 'Accès sécurisé aux privilèges cliniques' }
    return { component: ThirdAuthLogo, title: 'Authentification forte HDS', subtitle: 'Validation finale par double facteur' }
  }
  // Sinon, repli sur le carrousel automatique (Mode Register Autonome)
  return slides[currentSlide.value]
})

onMounted(() => {
  // Le carrousel automatique ne s'active que si aucune étape de formulaire n'est imposée
  if (props.formStep === null) {
    carrouselTimer = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }, 5000)
  }
})

onUnmounted(() => {
  if (carrouselTimer) clearInterval(carrouselTimer)
})

const router = useRouter()
const goToAuth = () => isRegister.value ? router.push('/login') : router.push('/register')
</script>

<template>
  <div 
    class="container-fluid min-vh-100 p-0 overflow-hidden bg-light d-flex flex-column med-auth-layout"
  >
    <div class="row g-0 flex-grow-1 min-vh-100">
      
      <!-- ── 🎨 PANNEAU DÉCORATIF DE GAUCHE/DROITE (60% ou 50%) ── -->
      <div 
        class="col-lg-7 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative brand-aside panel-border-login"
      >
        <!-- Image de fond et calque de contraste fusionnés -->
        <div class="absolute-fill brand-aside-bg"></div>
        <div class="absolute-fill brand-aside-overlay"></div>

        <!-- Grille technique décorative (SVG médical discret) -->
        <div class="absolute-fill technical-grid opacity-10">
          <svg width="100%" height="100%">
            <pattern id="auth-grid-mesh" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#auth-grid-mesh)" />
          </svg>
        </div>

        <!-- En-tête de marque + bouton bascule Login/Register -->
        <div class="position-relative z-index-top d-flex align-items-center justify-content-between">
          <MainAuthLogo :step="formStep || currentSlide + 1" variant="light" />
          <!-- Bouton bascule en haut à droite du panneau image -->
          <button class="auth-toggle-pill" @click="goToAuth">
            <span v-if="!isRegister">
              <i class="pi pi-user-plus me-1"></i>M'inscrire
            </span>
            <span v-else>
              <i class="pi pi-sign-in me-1"></i>Me connecter
            </span>
          </button>
        </div>

        <!-- Centre : Cadre en verre (Glassmorphic Box) et morphing du composant logo -->
        <div class="d-flex flex-column align-items-center justify-content-center flex-grow-1 position-relative z-index-top my-4">
          <div class="glass-logo-card p-5 rounded-4 d-flex align-items-center justify-content-center shadow-lg">
            <Transition name="logo-morph" mode="out-in">
              <component 
                :is="activeData.component" 
                :key="props.formStep !== null ? props.formStep : currentSlide" 
                strokeWidth="8"
                class="layout-vector-logo"
              />
            </Transition>
          </div>
        </div>

        <!-- Bas : Slogan dynamique synchronisé -->
        <div class="position-relative z-index-top border-start border-3 ps-3 validation-slogan-tray">
          <Transition name="text-slide" mode="out-in">
            <div :key="props.formStep !== null ? props.formStep : currentSlide">
              <h4 class="fw-extrabold font-title mb-1 tracking-tight text-white">
                {{ activeData.title }}
              </h4>
              <p class="text-white-50 small text-uppercase tracking-wider font-monospace mb-0">
                {{ activeData.subtitle }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- ── 📝 CONTENEUR DE FORMULAIRE ENFANT (40% ou 50%) ── -->
      <div 
        class="col-12 col-lg-5 d-flex flex-column justify-content-center p-4 p-sm-5 bg-white position-relative form-content-pane"
      >
        <!-- Orbes esthétiques d'ambiance pour les versions mobiles -->
        <div class="mobile-ambient-orb core-primary d-lg-none"></div>
        <div class="mobile-ambient-orb core-secondary d-lg-none"></div>

        <div class="w-100 position-relative z-index-top">
          <!-- Point d'injection du formulaire (Login.vue ou Register.vue) -->
          <RouterView />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.font-title {
  font-family: var(--title-family), sans-serif;
}
.absolute-fill {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}
.z-index-top {
  z-index: 10;
}

/* ── GESTION DES ARRIÈRE-PLANS ET EFFETS CLINIQUES ── */
.brand-aside {
  background-color: #1e3a5f;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  /* overflow:hidden indispensable pour que border-radius coupe l'image de fond */
  overflow: hidden;
}
.brand-aside-bg {
  background-image: url('medical-workspace-bg.jpg');
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.brand-aside-overlay {
  /* Opacité réduite pour laisser l'image médicale plus lisible */
  background: linear-gradient(135deg, rgba(26, 58, 92, 0.68) 0%, rgba(8, 105, 92, 0.62) 100%);
  z-index: 2;
}
.technical-grid {
  z-index: 3;
}

/* ── BOUTON BASCULE LOGIN / REGISTER ── */
.auth-toggle-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  flex-shrink: 0;
}
.auth-toggle-pill:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
  transform: translateY(-1px);
}

/* Boîte en verre floutée pour sublimer le logo cinétique */
.glass-logo-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1.2 / 1;
}
.layout-vector-logo {
  width: 220px;
  height: auto;
}

/* Ajustements de bordures lors des transitions de panneaux */
.panel-border-login { border-radius: 0 2rem 2rem 0; }
.panel-border-register { border-radius: 2rem 0 0 2rem; }

/* ── HABILLAGE AMBIANT SUR MOBILE ── */
.form-content-pane {
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  pointer-events: none;
  z-index: 1;
}
.mobile-ambient-orb.core-primary {
  width: 260px; height: 260px;
  background-color: rgba(49, 105, 155, 0.15);
  top: -60px; left: -60px;
}
.mobile-ambient-orb.core-secondary {
  width: 220px; height: 220px;
  background-color: rgba(10, 127, 112, 0.12);
  bottom: -40px; right: -40px;
}

/* ── DESIGN KINÉTIQUE ET TRANSITIONS DE CONTENU ── */
.logo-morph-enter-active,
.logo-morph-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.logo-morph-enter-from { opacity: 0; transform: scale(0.92) rotate(-3deg); }
.logo-morph-leave-to { opacity: 0; transform: scale(0.95) rotate(3deg); }

.text-slide-enter-active,
.text-slide-leave-active {
  transition: all 0.4s ease-in-out;
}
.text-slide-enter-from { opacity: 0; transform: translateY(8px); }
.text-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>