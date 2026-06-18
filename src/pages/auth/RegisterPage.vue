<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// Importation des composants atomiques officiels
import MedInput from "@/components/common/MedInput.vue";
import MedPasswordField from "@/components/common/MedPasswordField.vue";
import MedOtpInput from "@/components/common/MedOtpInput.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedModal from "@/components/common/MedModal.vue";

// Importation du composant de marque principal pour l'en-tête mobile
import MainAuthLogo from "@/components/auth/MainAuthLogo.vue";

import { useToast } from "@/composables/useToast";
import RegisterService from "@/api/endpoints/auth/register";
import { setUserRole } from "@/api/clients/auth";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const step = ref(1);
const isLoading = ref(false);

const registerData = reactive({
  npi: "",
  hashed_phone: "",
  reduced_phone: "",
  otpCodeFirebase: "",
  password: "",
  password_confirmation: "",
  channel: "", // 'via email' ou 'via whatsapp'
  email: "",
  phone: "",
  otpCodeFinal: "",
  userId: null,
});

const showTermsModal = ref(false);

// Synchronisation réactive de l'état d'avancement avec le layout parent
watch(
  step,
  (newStep) => {
    route.meta.formStep = newStep;
  },
  { immediate: true }
);

/* ── ÉTAPE 1 : PROFILING & VÉRIFICATION DU NPI ANIP ── */
const handleInit = async () => {
  if (registerData.npi.length !== 10) {
    toast.warning("Le NPI doit comporter exactement 10 chiffres.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await RegisterService.init(registerData.npi);
    if (response && response.success !== false) {
      registerData.hashed_phone = response.hashed_phone;
      registerData.reduced_phone = response.reuced_phone; // Respect du mapping de clé de l'ancienne API

      // Déclenchement automatique de la brique d'infrastructure SMS (Étape 2 en arrière-plan)
      await sendFirebaseCode();
    }
  } catch (error) {
    toast.error(
      error.message ||
        "Le NPI spécifié n'existe pas ou n'est pas éligible à l'enrôlement."
    );
  } finally {
    isLoading.value = false;
  }
};

/* ── ÉTAPE 2 (BACKGROUND) : EXPÉDITION DU CODE DE SÉCURITÉ VIA FIREBASE ── */
const sendFirebaseCode = async () => {
  try {
    await RegisterService.sendCode(
      registerData.npi,
      registerData.hashed_phone,
      "recaptcha-container"
    );
    toast.success(
      "Un code de sécurité de contrôle a été envoyé sur votre téléphone."
    );
    step.value = 3; // Transition immédiate vers l'interface de saisie OTP
  } catch (error) {
    toast.error(
      error.message || "Impossible d'expédier le code SMS de sécurité."
    );
  }
};

/* ── ÉTAPE 3 : VÉRIFICATION DU JETON FIREBASE OTP ── */
const handleVerifyFirebase = async () => {
  if (
    !registerData.otpCodeFirebase ||
    registerData.otpCodeFirebase.length < 6
  ) {
    toast.error("Veuillez renseigner un code OTP valide à 6 chiffres.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await RegisterService.verifyAndRegister(
      registerData.npi,
      registerData.otpCodeFirebase
    );
    if (response && response.success !== false) {
      toast.success("Numéro de téléphone vérifié avec succès.");
      step.value = 4;
    }
  } catch (error) {
    toast.error(error.message || "Code de vérification invalide ou expiré.");
  } finally {
    isLoading.value = false;
  }
};

/* ── ÉTAPE 4 : CRÉATION DU MOT DE PASSE HAUTE SÉCURITÉ ── */
const handlePassword = async () => {
  if (!registerData.password || registerData.password.length < 6) {
    toast.error("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }
  if (registerData.password !== registerData.password_confirmation) {
    toast.error("Les deux mots de passe saisis ne correspondent pas.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await RegisterService.setPassword(
      registerData.npi,
      registerData.password
    );
    if (response && response.success !== false) {
      registerData.email = response.email || "";
      registerData.phone = response.phone || "";
      toast.success("Clé d'authentification enregistrée.");
      step.value = 5;
    }
  } catch (error) {
    toast.error(
      error.message ||
        "Erreur critique lors de la configuration du mot de passe."
    );
  } finally {
    isLoading.value = false;
  }
};

/* ── ÉTAPE 5 : CONFIGURATION DU CANAL DE DOUBLE FACTEUR (2FA) ── */
const handleChannel = async () => {
  if (!registerData.channel) {
    toast.error("Veuillez sélectionner un canal de notification obligatoire.");
    return;
  }

  let formattedPhone = registerData.phone;
  if (registerData.channel === "via whatsapp") {
    formattedPhone = formattedPhone.replace(/\D/g, "");
    if (formattedPhone.startsWith("229")) {
      formattedPhone = formattedPhone.substring(3);
    }
    if (formattedPhone.length === 10 && formattedPhone.startsWith("01")) {
      formattedPhone = "229" + formattedPhone.substring(2);
    } else if (formattedPhone.length === 8) {
      formattedPhone = "229" + formattedPhone;
    } else {
      toast.error(
        "Le numéro WhatsApp saisi n'est pas au format béninois valide."
      );
      return;
    }

    if (!formattedPhone) {
      toast.warning("Le numéro WhatsApp est requis pour cette liaison.");
      return;
    }
  } else if (registerData.channel === "via email") {
    if (!registerData.email) {
      toast.warning("L'adresse email est requise pour cette liaison.");
      return;
    }
  }

  isLoading.value = true;
  try {
    const response = await RegisterService.setNotificationChannel(
      registerData.npi,
      registerData.channel,
      registerData.email,
      formattedPhone
    );
    if (response && response.success !== false) {
      toast.success(response.message || "Code de validation 2FA expédié.");
      step.value = 6;
    }
  } catch (error) {
    toast.error(
      error.message || "Erreur d'initialisation du canal de sécurité."
    );
  } finally {
    isLoading.value = false;
  }
};

/* ── ÉTAPE 6 : VALIDATION FINALE & ACTIVATION DU COMPTE ── */
const handleActivate = async () => {
  if (!registerData.otpCodeFinal || registerData.otpCodeFinal.length < 6) {
    toast.error("Veuillez saisir le code d'activation complet.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await RegisterService.activate(
      registerData.npi,
      registerData.otpCodeFinal,
      registerData.channel
    );
    if (response && response.success !== false) {
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        setUserRole(["PATIENT"]);
      }
      registerData.userId = response.user_id;
      showTermsModal.value = true;
    }
  } catch (error) {
    toast.error(error.message || "Code d'activation incorrect ou expiré.");
  } finally {
    isLoading.value = false;
  }
};

const acceptAndContinue = () => {
  showTermsModal.value = false;
  toast.success(
    "Votre espace patient BéninSanté est désormais pleinement opérationnel !"
  );
  setTimeout(() => {
    router.push("/services");
  }, 2000);
};

const selectChannel = (chan) => {
  registerData.channel = chan;
};

// Gestion des textes d'en-tête contextuels dynamiques
const dynamicHeader = computed(() => {
  switch (step.value) {
    case 1:
      return {
        title: "Création de compte",
        desc: "Saisissez vos identifiants républicains pour initier votre affiliation.",
      };
    case 3:
      return {
        title: "Vérification SMS",
        desc: "Un protocole de sécurité externe valide la conformité de votre ligne.",
      };
    case 4:
      return {
        title: "Clé de Sécurité",
        desc: "Configurez un mot de passe robuste dédié à la protection de vos données.",
      };
    case 5:
      return {
        title: "Canal de Confiance",
        desc: "Sélectionnez le point de contact privilégié pour vos futurs jetons 2FA.",
      };
    case 6:
      return {
        title: "Activation Finale",
        desc: "Saisissez la clé reçue sur votre canal de confiance pour finaliser le processus.",
      };
    default:
      return {
        title: "Portail National",
        desc: "Création de compte sécurisée BéninSanté.",
      };
  }
});
</script>

<template>
  <div class="w-100 register-view-wrapper">
    <!-- ── EN-TÊTE DE MARQUE MOBILE (Alignement remonté basé sur les ajustements d'image_f84982.jpg) ── -->
    <div
      class="d-flex flex-column d-lg-none mobile-brand-header bg-light p-3 rounded-3 border"
    >
      <div class="d-flex align-items-center justify-content-between">
        <MainAuthLogo :step="step" variant="dark" />
        <span
          class="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace text-uppercase fw-bold tracking-wider rounded-1 fs-8 px-2 py-1"
        >
          Étape
          {{
            step === 3
              ? 2
              : step === 4
              ? 3
              : step === 5
              ? 4
              : step === 6
              ? 5
              : step
          }}/5
        </span>
      </div>
    </div>

    <!-- Titre et sous-titre de l'étape active -->
    <div class="mb-4 text-layout-header">
      <h2 class="fw-extrabold text-dark tracking-tight mb-1 font-title h3">
        {{ dynamicHeader.title }}
      </h2>
      <p class="text-muted small mb-0">
        {{ dynamicHeader.desc }}
      </p>
    </div>

    <!-- Conteneur d'ancrage invisible pour le reCAPTCHA Firebase Invisible -->
    <div
      id="recaptcha-container"
      class="position-absolute opacity-0 pointer-events-none"
    ></div>

    <!-- ── BLOC DES FORMULAIRES INTERACTIFS PAR ÉTAPES ── -->
    <div class="max-w-form mx-auto">
      <!-- ÉTAPE 1 : RECHERCHE INITIALE PAR NPI -->
      <form
        v-if="step === 1"
        @submit.prevent="handleInit"
        class="d-flex flex-column gap-3 animate-step"
      >
        <MedInput
          v-model="registerData.npi"
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
          :disabled="registerData.npi.length !== 10"
        >
          Initier mon enrôlement
          <i class="pi pi-arrow-right ms-2 small"></i>
        </MedButton>
      </form>

      <!-- ÉTAPE 3 : CONFIRMATION DU SMS DE SÉCURITÉ (FIREBASE) -->
      <form
        v-else-if="step === 3"
        @submit.prevent="handleVerifyFirebase"
        class="d-flex flex-column gap-3 animate-step"
      >
        <div
          class="text-center p-3 bg-light rounded-xl border border-light-subtle mb-1"
        >
          <div
            class="step-icon-box rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
          >
            <i class="pi pi-mobile fs-4"></i>
          </div>
          <p class="text-secondary small mb-0 px-2 lh-base">
            Un SMS contenant un code d'authentification a été transmis au numéro
            de téléphone enregistré auprès de l'ANIP se terminant par
            <strong class="text-dark">{{ registerData.reduced_phone }}</strong
            >.
          </p>
        </div>

        <div class="d-flex justify-content-center my-2">
          <MedOtpInput v-model="registerData.otpCodeFirebase" :length="6" />
        </div>

        <div class="d-flex flex-column gap-2">
          <MedButton
            type="submit"
            variant="primary"
            class="w-100 py-3 rounded-xl shadow-sm fw-bold"
            :loading="isLoading"
            :disabled="registerData.otpCodeFirebase.length < 6"
          >
            Vérifier le code SMS
          </MedButton>

          <MedButton
            type="button"
            variant="outline-secondary"
            class="w-100 py-2 rounded-xl text-muted border-0 bg-transparent btn-abort"
            @click="step = 1"
          >
            Modifier mon identifiant NPI
          </MedButton>
        </div>
      </form>

      <!-- ÉTAPE 4 : DÉFINITION DU MOT DE PASSE -->
      <form
        v-else-if="step === 4"
        @submit.prevent="handlePassword"
        class="d-flex flex-column gap-3 animate-step"
      >
        <MedPasswordField
          v-model="registerData.password"
          label="Nouveau mot de passe"
          placeholder="Créez une clé d'accès forte"
          required
        />

        <MedPasswordField
          v-model="registerData.password_confirmation"
          label="Confirmation de la clé d'accès"
          placeholder="Répétez votre mot de passe"
          required
        />

        <MedButton
          type="submit"
          variant="primary"
          class="w-100 py-3 mt-2 rounded-xl shadow-sm fw-bold"
          :loading="isLoading"
          :disabled="
            !registerData.password ||
            registerData.password !== registerData.password_confirmation
          "
        >
          Enregistrer mes accès
        </MedButton>
      </form>

      <!-- ÉTAPE 5 : SÉLECTION DU CANAL DE NOTIFICATION (2FA) -->
      <form
        v-else-if="step === 5"
        @submit.prevent="handleChannel"
        class="d-flex flex-column gap-3 animate-step"
      >
        <!-- Grid de sélection de canal -->
        <div class="row g-2 my-1">
          <div class="col-6">
            <div
              @click="selectChannel('via email')"
              class="channel-card border rounded-xl p-3 d-flex flex-column align-items-center justify-content-center gap-2 cursor-pointer transition-all text-center"
              :class="
                registerData.channel === 'via email'
                  ? 'border-primary bg-primary-subtle text-primary fw-bold'
                  : 'border-light-subtle bg-white text-muted'
              "
            >
              <i class="pi pi-envelope fs-3"></i>
              <span class="fs-8 text-uppercase tracking-wider"
                >Adresse Email</span
              >
            </div>
          </div>
          <div class="col-6">
            <div
              @click="selectChannel('via whatsapp')"
              class="channel-card border rounded-xl p-3 d-flex flex-column align-items-center justify-content-center gap-2 cursor-pointer transition-all text-center"
              :class="
                registerData.channel === 'via whatsapp'
                  ? 'border-success bg-success-subtle text-success fw-bold'
                  : 'border-light-subtle bg-white text-muted'
              "
            >
              <i class="pi pi-whatsapp fs-3"></i>
              <span class="fs-8 text-uppercase tracking-wider">WhatsApp</span>
            </div>
          </div>
        </div>

        <!-- Inputs conditionnels basés sur la sélection -->
        <div
          v-if="registerData.channel === 'via email'"
          class="animate-step-sub"
        >
          <MedInput
            type="email"
            v-model="registerData.email"
            label="Adresse Email de correspondance"
            placeholder="Ex: citoyen@patient.bj"
            required
          />
        </div>

        <div
          v-if="registerData.channel === 'via whatsapp'"
          class="animate-step-sub"
        >
          <MedInput
            type="text"
            v-model="registerData.phone"
            label="Numéro de mobile lié à WhatsApp"
            placeholder="Ex: 01xxxxxxxx"
            required
          />
        </div>

        <MedButton
          type="submit"
          variant="primary"
          class="w-100 py-3 mt-2 rounded-xl shadow-sm fw-bold"
          :loading="isLoading"
          :disabled="
            !registerData.channel ||
            (registerData.channel === 'via email'
              ? !registerData.email
              : !registerData.phone)
          "
        >
          Confirmer mon point de contact
        </MedButton>
      </form>

      <!-- ÉTAPE 6 : SAISIE DE L'OTP FINAL DU CANAL CHOSI -->
      <form
        v-else-if="step === 6"
        @submit.prevent="handleActivate"
        class="d-flex flex-column gap-3 animate-step"
      >
        <div
          class="text-center p-3 bg-light rounded-xl border border-light-subtle mb-1"
        >
          <div
            class="step-icon-box rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
            :class="
              registerData.channel === 'via whatsapp'
                ? 'bg-success-subtle text-success'
                : 'bg-primary-subtle text-primary'
            "
          >
            <i
              :class="
                registerData.channel === 'via whatsapp'
                  ? 'pi pi-whatsapp'
                  : 'pi pi-envelope'
              "
              class="fs-4"
            ></i>
          </div>
          <p class="text-secondary small mb-0 px-2 lh-base">
            Saisissez le code d'activation de sécurité à usage unique transmis
            instantanément sur votre compte
            <strong class="text-dark">{{
              registerData.channel === "via whatsapp" ? "WhatsApp" : "Email"
            }}</strong
            >.
          </p>
        </div>

        <div class="d-flex justify-content-center my-2">
          <MedOtpInput v-model="registerData.otpCodeFinal" :length="6" />
        </div>

        <div class="d-flex flex-column gap-2">
          <MedButton
            type="submit"
            variant="primary"
            class="w-100 py-3 rounded-xl shadow-sm fw-bold"
            :loading="isLoading"
            :disabled="registerData.otpCodeFinal.length < 6"
          >
            Activer définitivement mon espace
          </MedButton>

          <MedButton
            type="button"
            variant="outline-secondary"
            class="w-100 py-2 rounded-xl text-muted border-0 bg-transparent btn-abort"
            @click="step = 5"
          >
            Modifier le canal de contact
          </MedButton>
        </div>
      </form>
    </div>

    <!-- ── FOOTER D'ORIENTATION DES LIENS SECONDAIRES ── -->
    <div
      class="mt-4 pt-4 border-top border-light d-flex flex-column gap-2 text-center text-lg-start"
    >
      <router-link
        to="/login"
        class="text-muted text-decoration-none hover-link fs-7"
      >
        Vous disposez déjà de vos accès ?
        <span class="text-primary fw-bold text-decoration-underline"
          >Identifiez-vous</span
        >
      </router-link>

      <p
        class="text-muted text-xs mb-0 font-monospace text-uppercase tracking-wider opacity-75 fs-8 pt-1"
      >
        Service BeninSanté - République du Bénin
      </p>
    </div>

    <!-- ── MODAL DE CONDITIONS ET CHARTE DE CONFIDENTIALITÉ MÉDICALE ── -->
    <MedModal
      v-model="showTermsModal"
      title="Félicitations & Engagement de Sécurité"
      size="md"
    >
      <div class="p-1">
        <!-- 1. TEXTE DE BIENVENUE ET SÉCURISATION -->
        <div class="text-center mb-4">
          <div
            class="shield-badge-icon rounded-circle bg-success-subtle text-success mb-3 d-inline-flex align-items-center justify-content-center"
          >
            <i class="pi pi-check-circle fs-1"></i>
          </div>
          <h3 class="fw-extrabold text-dark mb-2 h4 font-title">
            Bienvenue sur BéninSanté !
          </h3>
          <p class="text-muted small px-lg-3 mb-0 lh-base">
            Votre compte lié à votre identité républicaine a été créé avec
            succès. Avant d'accéder aux services cliniques, veuillez valider le
            cadre de confiance ci-dessous.
          </p>
        </div>

        <hr class="my-3 text-light-subtle" />

        <!-- 2. CONDITIONS EXPLICITES & CADRE LÉGAL -->
        <div
          class="mb-4 text-start bg-light p-3 rounded-xl border border-light-subtle"
        >
          <h4
            class="fs-8 text-primary text-uppercase fw-bold tracking-wider mb-3"
          >
            Charte de protection de vos données de santé
          </h4>

          <!-- Bloc 1 : Secret Médical -->
          <div class="d-flex gap-3 mb-3">
            <div class="text-primary mt-1">
              <i class="pi pi-lock fw-bold fs-5"></i>
            </div>
            <div>
              <h5 class="fs-7 fw-bold text-dark mb-1">
                Secret Médical & Chiffrement Absolu
              </h5>
              <p class="text-muted text-xs mb-0 lh-base">
                Vos diagnostics, allergies et dossiers médicaux sont chiffrés de
                bout en bout (AES-256). Seuls vous et les professionnels de
                santé que vous autorisez explicitement pouvez y accéder.
              </p>
            </div>
          </div>

          <!-- Bloc 2 : Souveraineté du patient -->
          <div class="d-flex gap-3 mb-3">
            <div class="text-success mt-1">
              <i class="pi pi-sliders-h fw-bold fs-5"></i>
            </div>
            <div>
              <h5 class="fs-7 fw-bold text-dark mb-1">
                Contrôle et Souveraineté du Patient
              </h5>
              <p class="text-muted text-xs mb-0 lh-base">
                Vous gardez le contrôle total de vos données. Chaque
                consultation de votre profil par un médecin requiert votre
                accord ou déclenche une notification d'audit immédiate.
              </p>
            </div>
          </div>

          <!-- Bloc 3 : Conformité APDP -->
          <div class="d-flex gap-3">
            <div class="text-info mt-1">
              <i class="pi pi-verified fw-bold fs-5"></i>
            </div>
            <div>
              <h5 class="fs-7 fw-bold text-dark mb-1">
                Conformité Légale (Cadre APDP)
              </h5>
              <p class="text-muted text-xs mb-0 lh-base">
                Ce traitement respecte scrupuleusement la législation de
                l'Autorité de Protection des Données Personnelles (APDP) du
                Bénin. Vous disposez d'un droit permanent de rectification et de
                retrait.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. BOUTON D'ACTION ET ENGAGEMENT -->
        <MedButton
          variant="primary"
          class="w-100 py-3 rounded-xl fw-bold shadow-sm"
          @click="acceptAndContinue"
        >
          J'accepte, accéder à mon espace santé
        </MedButton>
      </div>
    </MedModal>
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
.fs-7 {
  font-size: 0.825rem;
}
.fs-8 {
  font-size: 0.65rem;
}
.text-xs {
  font-size: 0.75rem;
}

/* Styles d'habillage mobiles et ajustements de positionnement haut */
.mobile-brand-header {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
}

@media (max-width: 991.98px) {
  .mobile-brand-header {
    margin-top: -1.75rem; /* Ajustement d'alignement parfait identique à Login.vue */
  }
  .text-layout-header {
    margin-top: 0.5rem;
  }
}

/* Éléments visuels des formulaires */
.step-icon-box {
  width: 3.5rem;
  height: 3.5rem;
}
.shield-badge-icon {
  width: 5rem;
  height: 5rem;
}
.channel-card {
  border-width: 2px !important;
}
.channel-card:hover {
  background-color: #f8fafc;
}
.btn-abort:hover {
  background-color: #f8fafc !important;
  color: var(--medical-gray-900, #1e293b) !important;
}
.hover-link:hover span {
  color: #1d4ed8 !important;
}

/* Animations de transition */
.animate-step {
  animation: step-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-step-sub {
  animation: step-fade-in 0.25s ease-out forwards;
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