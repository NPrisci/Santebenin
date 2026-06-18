<!-- views/auth/ResetPassword.vue -->
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Importation des composants atomiques officiels
import MedInput from '@/components/common/MedInput.vue'
import MedPasswordField from '@/components/common/MedPasswordField.vue'
import MedOtpInput from '@/components/common/MedOtpInput.vue'
import MedButton from '@/components/common/MedButton.vue'

// Importation du composant de marque pour l'en-tête mobile
import MainAuthLogo from '@/components/auth/MainAuthLogo.vue'

import { useToast } from '@/composables/useToast'
import ResetPasswordService from '@/api/endpoints/auth/reset-password'
import { getNpiForReset } from '@/api/clients/auth'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const step = ref(1)
const isLoading = ref(false)
const communicationChannel = ref('')

const resetData = reactive({
  npi: '',
  otpCode: '',
  password: '',
  password_confirmation: '',
})

// Synchronisation de l'état d'avancement avec le layout parent
watch(step, (newStep) => {
  route.meta.formStep = newStep
}, { immediate: true })

// Récupération automatique du NPI dès le montage du composant
onMounted(() => {
  const storedNpi = getNpiForReset()
  if (storedNpi) {
    resetData.npi = storedNpi
  } else {
    toast.error("Aucune session de récupération active. Veuillez renseigner vos identifiants.")
    router.push('login')
  }
})

/* ── ÉTAPE 1 : INITIALISATION DE LA DEMANDE ── */
const handleInit = async () => {
  isLoading.value = true
  try {
    const response = await ResetPasswordService.init(resetData.npi)
    communicationChannel.value = response.type || ''
    toast.success(response.message || "Code de vérification expédié.")
    step.value = 2 // Passage à la saisie de l'OTP
  } catch (error) {
    toast.error(error.message || "Impossible d'initier la procédure de réinitialisation.")
  } finally {
    isLoading.value = false
  }
}

/* ── ÉTAPE 2 : VÉRIFICATION DU CODE OTP RECEIVED ── */
const handleVerify = async () => {
  if (!resetData.otpCode || resetData.otpCode.length < 6) {
    toast.error("Veuillez renseigner un code de sécurité complet à 6 chiffres.")
    return
  }

  isLoading.value = true
  try {
    const successMessage = await ResetPasswordService.verify(resetData.npi, resetData.otpCode, communicationChannel.value)
    toast.success(successMessage || "Code validé avec succès.")
    step.value = 3 // Passage à la mise à jour du mot de passe
  } catch (error) {
    toast.error(error.message || "Code de vérification incorrect ou expiré.")
  } finally {
    isLoading.value = false
  }
}

/* ── ÉTAPE 3 : CONFIRMATION DU NOUVEAU MOT DE PASSE ── */
const handleConfirm = async () => {
  if (!resetData.password || resetData.password.length < 6) {
    toast.warning("Le mot de passe doit contenir au moins 6 caractères.")
    return
  }
  if (resetData.password !== resetData.password_confirmation) {
    toast.warning("Les deux mots de passe ne correspondent pas.")
    return
  }

  isLoading.value = true
  try {
    const finalMessage = await ResetPasswordService.confirm(resetData.npi, resetData.otpCode, resetData.password)
    toast.success(finalMessage || "Votre mot de passe a été mis à jour avec succès.")
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    toast.error(error.message || "Erreur lors de la mise à jour de vos accès de sécurité.")
  } finally {
    isLoading.value = false
  }
}

// En-têtes dynamiques configurés selon l'étape courante
const dynamicHeader = computed(() => {
  switch (step.value) {
    case 1: return { title: 'Récupération d\'accès', desc: 'Confirmez votre identifiant national pour recevoir votre clé d\'authentification unique.' }
    case 2: return { title: 'Validation de sécurité', desc: 'Saisissez le code d\'activation sécurisé envoyé sur votre terminal.' }
    case 3: return { title: 'Nouveau mot de passe', desc: 'Définissez votre nouvelle clé de sécurité haute protection.' }
    default: return { title: 'Réinitialisation', desc: 'Mise à jour sécurisée de vos accès.' }
  }
})
</script>

<template>
  <div class="w-100 reset-password-wrapper">
    
    <!-- ── EN-TÊTE DE MARQUE MOBILE (Symétrie parfaite avec Login/Register) ── -->
    <div class="d-flex flex-column d-lg-none mobile-brand-header bg-light p-3 rounded-3 border">
      <div class="d-flex align-items-center justify-content-between">
        <MainAuthLogo :step="step" variant="dark" />
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace text-uppercase fw-bold tracking-wider rounded-1 fs-8 px-2 py-1">
          Étape {{ step }}/3
        </span>
      </div>
    </div>

    <!-- Titre et descriptif de la phase active -->
    <div class="mb-4 text-layout-header">
      <h2 class="fw-extrabold text-dark tracking-tight mb-1 font-title h3">
        {{ dynamicHeader.title }}
      </h2>
      <p class="text-muted small mb-0">
        {{ dynamicHeader.desc }}
      </p>
    </div>

    <!-- ── FORMULAIRES SÉQUENTIELS ── -->
    <div class="max-w-form mx-auto">
      
      <!-- ÉTAPE 1 : CONFIRMATION DU NPI AUTO-REMPLI -->
      <form v-if="step === 1" @submit.prevent="handleInit" class="d-flex flex-column gap-3 animate-step">
        <MedInput 
          v-model="resetData.npi" 
          label="Numéro Personnel d'Identification (NPI)"
          placeholder="Chargement de votre NPI..."
          maxlength="10"
          disabled
          required 
        />
        
        <MedButton 
          type="submit"
          variant="primary"
          class="w-100 py-3 mt-2 rounded-xl shadow-sm fw-bold"
          :loading="isLoading"
          :disabled="!resetData.npi"
        >
          Demander mon code de sécurité
          <i class="pi pi-send ms-2 small"></i>
        </MedButton>
      </form>

      <!-- ÉTAPE 2 : SAISIE DU CODE OTP (ADAPTATIF WHATSAPP / EMAIL) -->
      <form v-else-if="step === 2" @submit.prevent="handleVerify" class="d-flex flex-column gap-3 animate-step">
        <div class="text-center p-3 bg-light rounded-xl border border-light-subtle mb-1">
          <div 
            class="step-icon-box rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
            :class="communicationChannel === 'via whatsapp' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'"
          >
            <i :class="communicationChannel === 'via whatsapp' ? 'pi pi-whatsapp' : 'pi pi-envelope'" class="fs-4"></i>
          </div>
          <p class="text-secondary small mb-0 px-2 lh-base">
            Saisissez le code de vérification unique reçu <strong class="text-dark">{{ communicationChannel === 'via whatsapp' ? 'via WhatsApp' : 'par Email' }}</strong>.
          </p>
        </div>

        <div class="d-flex justify-content-center my-2">
          <MedOtpInput v-model="resetData.otpCode" :length="6" />
        </div>

        <div class="d-flex flex-column gap-2">
          <MedButton 
            type="submit"
            variant="primary"
            class="w-100 py-3 rounded-xl shadow-sm fw-bold"
            :loading="isLoading"
            :disabled="resetData.otpCode.length < 6"
          >
            Valider le protocole
          </MedButton>

          <MedButton 
            type="button"
            variant="outline-secondary"
            class="w-100 py-2 rounded-xl text-muted border-0 bg-transparent btn-abort"
            @click="step = 1"
          >
            Renvoyer une demande
          </MedButton>
        </div>
      </form>

      <!-- ÉTAPE 3 : RENSEIGNEMENT DE LA NOUVELLE CLÉ SÉCURISÉE -->
      <form v-else-if="step === 3" @submit.prevent="handleConfirm" class="d-flex flex-column gap-3 animate-step">
        <MedPasswordField 
          v-model="resetData.password" 
          label="Nouveau mot de passe confidentiel"
          placeholder="Minimum 6 caractères complexes"
          required 
        />

        <MedPasswordField 
          v-model="resetData.password_confirmation" 
          label="Confirmez votre nouveau mot de passe"
          placeholder="Répétez la même clé d'accès"
          required 
        />

        <MedButton 
          type="submit"
          variant="primary"
          class="w-100 py-3 mt-2 rounded-xl shadow-sm fw-bold"
          :loading="isLoading"
          :disabled="!resetData.password || resetData.password !== resetData.password_confirmation"
        >
          Appliquer le nouveau mot de passe
        </MedButton>
      </form>

    </div>

    <!-- ── FOOTER SECONDAIRE D'ORIENTATION ── -->
    <div class="mt-4 pt-4 border-top border-light text-center text-lg-start">
      <router-link 
        to="/auth/login" 
        class="text-muted text-decoration-none hover-link fs-7"
      >
        <i class="pi pi-arrow-left me-1 small"></i> Retourner à l'écran de <span class="text-primary fw-bold text-decoration-underline">connexion</span>
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.font-title {
  font-family: var(--title-family), sans-serif;
}
.max-w-form {
  max-width: 100%;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.fs-7 { font-size: 0.825rem; }
.fs-8 { font-size: 0.65rem; }

.mobile-brand-header {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
}

@media (max-width: 991.98px) {
  .mobile-brand-header {
    margin-top: -1.75rem; /* Alignement millimétré identique aux autres vues */
  }
  .text-layout-header {
    margin-top: 0.5rem;
  }
}

.step-icon-box {
  width: 3.5rem;
  height: 3.5rem;
}
.btn-abort:hover {
  background-color: #f8fafc !important;
  color: #1e293b !important;
}
.hover-link:hover span {
  color: #1d4ed8 !important;
}

/* Animations de transition fluides */
.animate-step {
  animation: step-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes step-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>