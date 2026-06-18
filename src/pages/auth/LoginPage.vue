<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Importation des composants atomiques officiels (convections README.md)
import MedInput from '@/components/common/MedInput.vue'
import MedPasswordField from '@/components/common/MedPasswordField.vue'
import MedOtpInput from '@/components/common/MedOtpInput.vue'
import MedAvatar from '@/components/common/MedAvatar.vue'
import MedButton from '@/components/common/MedButton.vue'

// Importation du composant de marque principal utilisé par le layout
import MainAuthLogo from '@/components/auth/MainAuthLogo.vue'

import {useToast } from '@/composables/useToast'
import AuthService from '@/api/endpoints/auth/login'
import { getAuthToken, setAuthToken, setUserRole, setNpiForReset } from '@/api/clients/auth'

const router = useRouter()
const route = useRoute()
const medicalToast = useToast()

// Étape locale du formulaire (1: NPI, 2: Mot de passe, 3: Code OTP)
const step = ref(1)
const isLoading = ref(false)

const loginData = reactive({
  npi: '',
  password: '',
  otpCode: '',
  user: null,
  otpType: '',
  tempToken: null
})

// Synchronisation avec la propriété 'formStep' d'AuthLayout via les métadonnées de la route
watch(step, (newStep) => {
  route.meta.formStep = newStep
}, { immediate: true })

// Gestion du compte à rebours pour le renvoi de l'OTP
const resendTimer = ref(0)
let timerInterval = null

const startResendTimer = () => {
  resendTimer.value = 60
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

onMounted(() => {
  if (getAuthToken()) {
    router.push('/services')
  }
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

/* ── ÉTAPE 1 : RECHERCHE ET VÉRIFICATION DU NPI ── */
const handleInit = async () => {
  if (loginData.npi.length !== 10) {
    medicalToast.warning("Le NPI doit comporter exactement 10 chiffres.")
    return
  }

  isLoading.value = true
  try {
    const response = await AuthService.init(loginData.npi)
    if (response && response.success !== false) {
      loginData.user = {
        nom: response.nom,
        photo: response.photo
      }
      step.value = 2
    }
  } catch (error) {
    medicalToast.error(error.message || "Identifiant inconnu ou compte inactif.")
  } finally {
    isLoading.value = false
  }
}

/* ── ÉTAPE 2 : VÉRIFICATION DU MOT DE PASSE CLINIQUE ── */
const handleVerify = async () => {
  if (!loginData.password) {
    medicalToast.warning("Le mot de passe est requis.")
    return
  }

  isLoading.value = true
  try {
    const response = await AuthService.verifyPassword(loginData.npi, loginData.password)
    if (response && response.success !== false) {
      loginData.otpType = response.type
      loginData.tempToken = response.temp_token
      if (response.user) {
         loginData.user = response.user
      }
      step.value = 3
      if (loginData.otpType !== 'via totp') {
        startResendTimer()
      }
    }
  } catch (error) {
    medicalToast.error(error.message || "Mot de passe incorrect.")
  } finally {
    isLoading.value = false
  }
}

/* ── ÉTAPE 3 : VALIDATION DE LA CLÉ DE SÉCURITÉ OTP ── */
const handleValidate = async () => {
  if (!loginData.otpCode || loginData.otpCode.length < 6) {
    medicalToast.error("Veuillez saisir le code complet à 6 chiffres.")
    return
  }

  isLoading.value = true
  try {
    const response = await AuthService.verifyCode(loginData.otpType, loginData.otpCode, loginData.tempToken)
    if (response && response.success !== false) {
      if (response.auth_token) {
        setAuthToken(response.auth_token)
        setUserRole(response.user.roles)
      }

      medicalToast.success("Authentification réussie. Bienvenue sur BéninSanté.")
      setTimeout(() => {
         router.push('/services')
      }, 2000)
    }
  } catch (error) {
    medicalToast.error(error.message || "Code de sécurité invalide ou expiré.")
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  setNpiForReset(loginData.npi)
  router.push('/forgot-password')
}

const handleResendCode = async () => {
  if (resendTimer.value > 0) return
  isLoading.value = true
  try {
    const response = await AuthService.verifyPassword(loginData.npi, loginData.password)
    if (response && response.success !== false) {
       medicalToast.success("Un nouveau code vient de vous être envoyé.")
       startResendTimer()
    }
  } catch (error) {
    medicalToast.error(error.message || "Échec de réexpédition du code.")
  } finally {
    isLoading.value = false
  }
}

const resetToStep1 = () => {
  step.value = 1
  loginData.password = ''
  loginData.otpCode = ''
  loginData.npi = ''
  loginData.user = null
}

const otpMessage = computed(() => {
  if (loginData.otpType === 'via totp') return "Saisissez le jeton d'authentification généré par votre application de sécurité (Google Authenticator / Duo)."
  if (loginData.otpType === 'via email') return "Un code d'accès à usage unique a été envoyé à votre adresse email professionnelle chiffrée."
  if (loginData.otpType === 'via whatsapp') return "Un code de validation confidentiel vous a été transmis sur votre numéro WhatsApp lié."
  return "Veuillez renseigner votre clé de sécurité à usage unique."
})
</script>

<template>
  <div class="w-100 login-view-wrapper">
    
    <div class="d-flex flex-column d-lg-none mobile-brand-header bg-light p-3 rounded-3 border">
      <div class="d-flex align-items-center justify-content-between">
        <MainAuthLogo :step="step" variant="dark" />
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace text-uppercase fw-bold tracking-wider rounded-1 fs-8 px-2 py-1">
          Étape {{ step }}/3
        </span>
      </div>
    </div>

    <div class="mb-4 text-layout-header">
      <h2 class="fw-extrabold text-dark tracking-tight mb-1 font-title h3">
        {{ step === 1 ? 'Portail National' : step === 2 ? 'Habilitation Requise' : 'Double Facteur' }}
      </h2>
      <p class="text-muted small mb-0">
        {{ step === 1 ? 'Veuillez renseigner vos identifiants pour accéder à votre espace de santé.' : step === 2 ? 'Confirmez votre identité à l’aide de votre clé secrète.' : 'Une vérification de sécurité supplémentaire est requise.' }}
      </p>
    </div>

    <div class="max-w-form mx-auto">
      
      <form v-if="step === 1" @submit.prevent="handleInit" class="d-flex flex-column gap-3 animate-step">
        <MedInput 
          v-model="loginData.npi" 
          label="Numéro Personnel d'Identification (NPI)"
          placeholder="Ex: 2433504913"
          maxlength="10"
          required 
        />
        
        <MedButton 
          type="submit"
          variant="primary"
          class="w-100 py-3 mt-2 rounded-xl shadow-sm fw-bold"
          :loading="isLoading"
          :disabled="loginData.npi.length !== 10"
        >
          Continuer
          <i class="pi pi-arrow-right ms-2 small"></i>
        </MedButton>
      </form>

      <form v-else-if="step === 2" @submit.prevent="handleVerify" class="d-flex flex-column gap-3 animate-step">
        
        <div class="d-flex align-items-center gap-3 bg-light p-3 rounded-xl border border-light-subtle my-1">
          <MedAvatar :url="loginData.user?.photo" :name="loginData.user?.nom" size="md" shape="rounded" />
          <div class="d-flex flex-column min-w-0">
            <span class="text-uppercase text-muted fw-bold tracking-wider fs-8">Session identifiée</span>
            <span class="text-dark fw-bold text-truncate pr-2">{{ loginData.user?.nom }}</span>
          </div>
        </div>

        <div>
          <MedPasswordField 
            v-model="loginData.password" 
            label="Mot de passe confidentiel"
            placeholder="Saisissez votre clé d'accès"
            required 
          />
          <div class="d-flex justify-content-end mt-2">
            <button 
              type="button" 
              @click="handleForgotPassword" 
              class="btn btn-link p-0 text-decoration-underline fs-7 text-primary border-0 bg-transparent fw-medium transition-colors cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <div class="d-flex flex-column gap-2 mt-2">
          <MedButton 
            type="submit"
            variant="primary"
            class="w-100 py-3 rounded-xl shadow-sm fw-bold"
            :loading="isLoading"
            :disabled="!loginData.password"
          >
            S'authentifier
          </MedButton>

          <MedButton 
            type="button"
            variant="outline-secondary"
            class="w-100 py-2 rounded-xl text-muted border-0 bg-transparent btn-abort"
            @click="resetToStep1"
          >
            Ce n'est pas mon compte
          </MedButton>
        </div>
      </form>

      <form v-else-if="step === 3" @submit.prevent="handleValidate" class="d-flex flex-column gap-3 animate-step">
        
        <div class="text-center p-3 bg-light rounded-xl border border-light-subtle mb-1">
          <div class="otp-shield-box rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center">
             <i :class="loginData.otpType === 'via totp' ? 'pi pi-shield text-primary' : 'pi pi-envelope text-success'" class="fs-4"></i>
          </div>
          <p class="text-secondary small mb-0 px-1 lh-base">
            {{ otpMessage }}
          </p>
        </div>

        <div class="d-flex justify-content-center my-2">
          <MedOtpInput 
            v-model="loginData.otpCode" 
            :length="6"
          />
        </div>

        <div class="d-flex flex-column gap-2">
          <MedButton 
            type="submit"
            variant="primary"
            class="w-100 py-3 rounded-xl shadow-sm fw-bold"
            :loading="isLoading"
            :disabled="loginData.otpCode.length < 6"
          >
            Confirmer le code d'accès
          </MedButton>

          <MedButton 
            type="button"
            variant="outline-secondary"
            class="w-100 py-2 rounded-xl text-muted border-0 bg-transparent btn-abort"
            @click="step = 2"
          >
            Retour à l'étape précédente
          </MedButton>
          
          <button 
            v-if="loginData.otpType !== 'via totp'"
            type="button"
            @click="handleResendCode"
            :disabled="resendTimer > 0 || isLoading"
            class="btn border-0 bg-transparent text-xs font-monospace mt-2 text-center"
            :class="resendTimer > 0 ? 'text-muted cursor-not-allowed' : 'text-primary text-decoration-underline fw-bold'"
          >
            {{ resendTimer > 0 ? `Renvoyer un nouveau code dans ${resendTimer}s` : "Je n'ai pas reçu mon code de validation" }}
          </button>
        </div>
      </form>
      
    </div>

    <div class="mt-4 pt-4 border-top border-light d-flex flex-column gap-2">
      <a 
        v-if="step === 1"
        href="https://eservices.anip.bj/" 
        target="_blank"
        class="text-muted hover:text-primary transition-colors fs-7 text-decoration-underline"
      >
        Besoin d'aide pour retrouver votre numéro NPI ANIP ?
      </a>
      
      <p class="text-muted text-xs mb-0 font-monospace text-uppercase tracking-wider opacity-75 fs-8 pt-1">
        Service BeninSanté - République du Bénin
      </p>
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
.text-xs { font-size: 0.75rem; }
.cursor-not-allowed { cursor: not-allowed; }

/* Styles d'habillage mobiles et ajustements de positionnement haut */
.mobile-brand-header {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
}

/* On neutralise l'excès de padding imposé par le parent sur mobile */
@media (max-width: 991.98px) {
  .mobile-brand-header {
    margin-top: -1.75rem; /* Remonte le bloc tout en haut du composant de garde */
  }
  .text-layout-header {
    margin-top: 0.5rem;
  }
}

.otp-shield-box {
  width: 3rem;
  height: 3rem;
  background-color: rgba(49, 105, 155, 0.08);
}

.btn-abort:hover {
  background-color: #f8fafc !important;
  color: var(--medical-gray-900, #1e293b) !important;
}

/* Animation d'apparition fluide */
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