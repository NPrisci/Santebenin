<script setup>
import { ref, computed, onMounted } from "vue";
import MedModal from "@/components/common/MedModal.vue";
import MedConstantInput from "../MedConstantInput.vue";
import MedToggle from "@/components/common/MedToggle.vue";
import MedButton from "@/components/common/MedButton.vue";
import { PatientOverviewService } from "@/api/endpoints/services/patient/overview";

// Contrôle d'ouverture (v-model)
const isOpen = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  // Dernier relevé disponible pour afficher l'historique contextuel (lastValue)
  lastRecord: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(["success"]);

// --- ÉTATS TECHNIQUES ET SÉCURITÉ ---
const isDisclaimerAccepted = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

// Formatage de la date du jour en français clinique
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
});

// --- STRUCTURE DU FORMULAIRE LOCAL ---
// Initialisé pour correspondre aux attentes des modelValue de MedConstantInput
const form = ref({
  poids: null,
  temperature: null,
  glycemie: null,
  pouls: null,
  // Le type 'blood-pressure' utilise un objet couplé
  tension: {
    systolique: null,
    diastolique: null,
  },
});

// Pré-remplissage des valeurs initiales si un historique existe
onMounted(() => {
  if (props.lastRecord) {
    form.value.poids = props.lastRecord.poids || null;
    form.value.temperature = props.lastRecord.temperature || null;
    form.value.glycemie = props.lastRecord.glycemie || null;
    form.value.pouls = props.lastRecord.pouls || null;

    // Extraction des données de tension depuis la chaîne brute (ex: "120/80")
    if (props.lastRecord.tension_arterielle) {
      const parts = props.lastRecord.tension_arterielle.split("/");
      if (parts.length === 2) {
        form.value.tension.systolique = parseInt(parts[0], 10);
        form.value.tension.diastolique = parseInt(parts[1], 10);
      }
    }
  }
});

// --- SOUCHETTE ET INTERCEPT API ---
const handleSubmit = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  // Ré-assemblage au format plat attendu par PatientOverviewService.constantes()
  const payload = {
    poids: form.value.poids,
    tension_systolique: form.value.tension?.systolique,
    tension_diastolique: form.value.tension?.diastolique,
    glycemie: form.value.glycemie,
    temperature: form.value.temperature,
    pouls: form.value.pouls,
  };

  try {
    // Appel du service issu de overview.js
    const response = await PatientOverviewService.constantes(payload);

    if (response) {
      emit("success");
      isOpen.value = false; // Ferme le modal automatiquement
    } else {
      errorMessage.value = "Une erreur est survenue lors de la validation de vos constantes.";
    }
  } catch (error) {
    console.error("Erreur soumission constantes :", error);
    errorMessage.value = "Impossible de communiquer avec le serveur de santé. Veuillez réessayer.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <MedModal
    v-model="isOpen"
    title="Enregistrer mes constantes vitales"
    size="lg"
    :centered="true"
    :staticBackdrop="true"
    headerBg="bg-primary text-white"
  >
    <template #header-suffix>
      <div class="text-white-50 small ms-2 ps-2 border-start border-white-20 font-monospace">
        {{ formattedDate }}
      </div>
    </template>

    <div v-if="!isDisclaimerAccepted" class="p-2">
      <div
        class="alert alert-info border-info-subtle shadow-sm mb-4 d-flex align-items-start gap-3"
      >
        <i class="pi pi-info-circle fs-4 text-info mt-1"></i>
        <div>
          <h5 class="alert-heading fs-6 fw-bold">Note d'information importante</h5>
          <p class="text-sm mb-0">
            Les données que vous saisissez dans cet espace le sont
            <strong>uniquement à titre informatif</strong>. Elles permettent de construire votre
            historique d'évolution pour faciliter le suivi clinique et pourront être consultées et
            exploitées par les professionnels de santé lors de vos rendez-vous. Pour en savoir plus,
            vous pouvez consulter
            <a href="#" class="text-secondary"> notre politique de confidentialité </a>.
          </p>
        </div>
      </div>

      <div class="card bg-light border-0 p-3 mb-3">
        <div class="card bg-light border-0 p-3 mb-3">
          <MedToggle
            v-model="isDisclaimerAccepted"
            label="Je comprends et j'accepte."
            variant="primary"
            size="normal"
          />
        </div>
      </div>
    </div>

    <div v-else class="p-1">
      <div v-if="errorMessage" class="alert alert-danger text-sm mb-4 py-2 border-danger-subtle">
        <i class="pi pi-exclamation-triangle me-2"></i>{{ errorMessage }}
      </div>

      <div class="row g-4">
        <div class="col-12 col-md-6">
          <MedConstantInput
            constantType="weight"
            mode="stepper"
            label="Mon Poids"
            unit="kg"
            :min="30"
            :max="250"
            :step="0.1"
            v-model="form.poids"
            :lastValue="props.lastRecord?.poids"
            :show-confirm=false
          />
        </div>

        <div class="col-12 col-md-6">
          <MedConstantInput
            constantType="temperature"
            mode="stepper"
            label="Température corporelle"
            unit="°C"
            :min="34"
            :max="43"
            :step="0.1"
            v-model="form.temperature"
            :lastValue="props.lastRecord?.temperature"
            :show-confirm=false
          />
        </div>

        <div class="col-12">
          <div class="p-3 border rounded bg-white-bg">
            <MedConstantInput
              constantType="blood-pressure"
              mode="slider"
              label="Tension Artérielle"
              v-model="form.tension"
              :show-confirm=false
            />
          </div>
        </div>

        <div class="col-12 col-md-6">
          <MedConstantInput
            constantType="glycemie"
            v-model="form.glycemie"
            :lastValue="props.lastRecord?.glycemie"
            :show-confirm=false
          />
        </div>

        <div class="col-12 col-md-6">
          <MedConstantInput
            constantType="heart-rate"
            label="Pouls (Fréquence cardiaque)"
            unit="bpm"
            :min="40"
            :max="200"
            :step="1"
            v-model="form.pouls"
            :lastValue="props.lastRecord?.pouls"
            :show-confirm=false
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="d-flex justify-content-end gap-2 w-100">
        <MedButton
          variant="secondary"
          :disabled="isSubmitting"
          @click="isOpen = false"
        >
          Annuler
        </MedButton>

        <MedButton
          v-if="isDisclaimerAccepted"
          variant="primary"
          icon="pi pi-check"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Sauvegarder
        </MedButton>
      </div>
    </template>
  </MedModal>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.selection-none {
  user-select: none;
}
</style>
