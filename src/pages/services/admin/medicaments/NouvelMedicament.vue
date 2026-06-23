<script setup>
import router from "@/router";
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import MedicamentsService from "@/api/endpoints/services/admin/medicaments";
import { encryptService } from "@/api/endpoints/encrypt";

// Importation des composants réutilisables du projet
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedEmptyState from "@/components/common/MedEmptyState.vue";
import MedInput from "@/components/common/MedInput.vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";
import MedSelect from "@/components/common/MedSelect.vue";
import MedAutoMedicamentsCompletion from "@/components/services/MedAutoMedicamentsCompletion.vue";

const toast = useToast();

// --- ÉTATS RÉACTIFS ---
const isSubmitting = ref(false);
const isLoadingData = ref(false); // Gère le chargement initial de la page
const searchQuery = ref(""); // Recherche locale dans l'historique de droite
const formeOptions = ref([]); // Options formatées pour le MedSelect

// Structure du formulaire
const form = reactive({
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
  prix: null,
});

// Structure de gestion des erreurs
const errors = reactive({
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
});

// Historique chargé dynamiquement depuis le catalogue national
const medicamentsHistory = ref([]);

// --- INITIALISATION DES DONNÉES ---
onMounted(async () => {
  isLoadingData.value = true;
  try {
    // 1. Récupération de l'historique et extraction des 10 derniers éléments
    const allMedicaments = await MedicamentsService.all();
    if (Array.isArray(allMedicaments.items)) {
      // Extraction des 10 derniers médicaments enregistrés
      medicamentsHistory.value = allMedicaments.items.slice(-10).reverse();
    }

    // 2. Récupération des formes galéniques depuis l'API
    const formesData = await MedicamentsService.formes();
    if (formesData && formesData.forms) {
      // Transformation du tableau de chaînes au format attendu par MedSelect { label, value }
      formeOptions.value = formesData.forms.map((f) => ({
        label: f.label,
        value: f.code,
      }));
    }
  } catch (error) {
    toast.error("Impossible de charger les données initiales du catalogue.");
    console.error("Erreur d'initialisation:", error);
  } finally {
    isLoadingData.value = false;
  }
});

// --- MÉTHODE CONSTANTE POUR LA REDIRECTION / CONSULTATION ---
const consultMedicament = async (id) => {
  const encryptedId = await encryptService.encrypt(id);
  router.push({ name: "admin-medicaments-details", params: { id: encryptedId } });
};

// --- GESTION DE L'AUTOCOMPLÉTION (PRÉ-REMPLISSAGE) ---
const handleAutocompleteSelect = (selectedItem) => {
  if (!selectedItem) return;

  // Extraction de la charge brute (le médicament d'origine retourné par le service)
  const data = selectedItem.raw || selectedItem;

  // Remplissage automatique des 5 champs requis
  form.code = data.cip_ean || data.code || "";
  form.nom = data.nom_commercial || data.nom || "";
  form.nom_generique = data.nom_generique_dci || data.nom_generique || "";
  form.forme = data.forme_galenique || data.forme || "";
  form.dosage = data.dosage || "";

  toast.info("Formulaire pré-rempli à partir du modèle sélectionné.");
};

// --- LOGIQUE DE VALIDATION & SOUMISSION ---
const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!form.code.trim()) {
    errors.code = "Le code d'identification unique est obligatoire.";
    isValid = false;
  }
  if (!form.nom.trim()) {
    errors.nom = "Le nom commercial est obligatoire.";
    isValid = false;
  }
  if (!form.nom_generique.trim()) {
    errors.nom_generique = "La DCI (Nom générique) est obligatoire.";
    isValid = false;
  }
  if (!form.forme.trim()) {
    errors.forme = "La forme galénique est obligatoire.";
    isValid = false;
  }
  if (!form.dosage.trim()) {
    errors.dosage = "Le dosage est obligatoire.";
    isValid = false;
  }

  return isValid;
};

const handleAddMedicament = async () => {
  if (!validateForm()) {
    toast.warning("Veuillez remplir correctement les champs requis.");
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      code: form.code.trim(),
      nom: form.nom.trim(),
      nom_generique: form.nom_generique.trim(),
      forme: form.forme.trim(),
      dosage: form.dosage.trim(),
      prix: form.prix ? Number(form.prix) : null,
    };

    const response = await MedicamentsService.store(payload);
    const createdMedicament = response?.data || response || payload;

    const newMedicament = {
      id: createdMedicament.id || Date.now(),
      code: createdMedicament.code,
      nom: createdMedicament.nom,
      nom_generique: createdMedicament.nom_generique,
      forme: createdMedicament.forme,
      dosage: createdMedicament.dosage,
      prix: createdMedicament.prix_officiel ?? createdMedicament.prix ?? null,
    };

    medicamentsHistory.value.unshift(newMedicament);
    if (medicamentsHistory.value.length > 10) {
      medicamentsHistory.value.pop();
    }

    toast.success(`${newMedicament.nom} ajouté avec succès au catalogue.`);

    Object.keys(form).forEach((key) => {
      form[key] = key === "prix" ? null : "";
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.warning("Une erreur est survenue lors de l'enregistrement.");
  } finally {
    isSubmitting.value = false;
  }
};

// --- FILTRAGE DE LA LISTE COMPACTE (DROITE) ---
const filteredHistory = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return medicamentsHistory.value;

  return medicamentsHistory.value.filter((med) => {
    return (
      med.nom.toLowerCase().includes(query) ||
      med.nom_generique.toLowerCase().includes(query) ||
      med.code.includes(query)
    );
  });
});
</script>

<template>
  <div class="container-fluid p-2 font-body mb-3">
    <div class="border-bottom pb-3 mb-4">
      <h2 class="h3 mb-1 fw-bold text-dark font-title">Catalogue de Médicaments</h2>
      <p class="text-muted small mb-0">
        Enregistrez de nouvelles molécules ou parcourez les derniers référentiels.
      </p>
    </div>

    <div class="row g-4 align-items-start">
      <!-- PANNEAU DE GAUCHE : FORMULAIRE PRINCIPAL -->
      <div class="col-lg-6">
        <MedCard
          title="Ajouter un nouveau produit"
          icon="pi pi-plus-circle"
          shadow="sm"
          class="shadow-medical border-0"
        >
          <form @submit.prevent="handleAddMedicament" class="needs-validation">
            <div class="row g-3">
              <!-- Module d'autocomplétion supérieur pour la recherche de modèles existants -->
              <div class="col-12 mb-2">
                <MedAutoMedicamentsCompletion
                  label="Rechercher une base de modèle existant (Optionnel)"
                  placeholder="Saisissez un nom commercial ou une DCI pour pré-remplir..."
                  @select="handleAutocompleteSelect"
                />
              </div>

              <div class="col-md-6">
                <MedInput
                  v-model="form.nom"
                  label="Nom commercial *"
                  placeholder="Ex: Doliprane"
                  :error="errors.nom"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small mb-1"
                  >Code d'identification (CIP/EAN) *</label
                >
                <MedInput
                  v-model="form.code"
                  placeholder="Ex: 3400934947402"
                  :disabled="isSubmitting"
                  :icon-left="'pi pi-barcode'"
                  type="text"
                  :error="errors.code"
                />
              </div>

              <div class="col-md-6">
                <MedInput
                  v-model="form.nom_generique"
                  label="Nom générique (DCI) *"
                  placeholder="Ex: Paracétamol"
                  :error="errors.nom_generique"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Remplacement de l'input texte par MedSelect branché sur l'API -->
              <div class="col-md-6">
                <MedSelect
                  v-model="form.forme"
                  label="Forme galénique *"
                  placeholder="Sélectionnez la forme"
                  :options="formeOptions"
                  :error="errors.forme"
                  :disabled="isSubmitting || isLoadingData"
                />
              </div>

              <div class="col-md-6">
                <MedInput
                  v-model="form.dosage"
                  label="Dosage *"
                  placeholder="Ex: 500mg, 1g/10ml"
                  :error="errors.dosage"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="col-md-6">
                <MedInput
                  v-model="form.prix"
                  label="Prix indicatif FCFA"
                  placeholder="Ex: 1200"
                  type="number"
                  min="0"
                  addon-right="FCFA"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <MedButton
                variant="outline-secondary"
                :disabled="isSubmitting"
                @click="Object.keys(form).forEach((k) => (form[k] = k === 'prix' ? null : ''))"
              >
                Vider
              </MedButton>
              <MedButton type="submit" variant="primary" :loading="isSubmitting">
                Enregistrer au catalogue
              </MedButton>
            </div>
          </form>
        </MedCard>
      </div>

      <!-- PANNEAU DE DROITE : DERNIERS AJOUTS HISTORIQUE -->
      <div class="col-lg-6">
        <MedCard
          title="Derniers ajouts du catalogue"
          icon="pi pi-history"
          shadow="md"
          header-bg="bg-light"
          body-class="p-3 d-flex flex-column gap-2"
          class="border shadow-sm"
        >
          <div class="mb-2">
            <MedInput
              v-model="searchQuery"
              placeholder="Filtrer l'historique récent..."
              icon-left="pi pi-filter"
              size="sm"
            />
          </div>

          <div v-if="isLoadingData" class="d-flex flex-column gap-2 py-2">
            <MedSkeleton v-for="i in 4" :key="i" height="60px" class="rounded border" />
          </div>

          <div v-else-if="filteredHistory.length === 0" class="py-3">
            <MedEmptyState
              icon="pi pi-search"
              title="Aucun médicament trouvé"
              description="Aucun produit récent ne correspond à vos critères de recherche."
              size="sm"
            />
          </div>

          <div v-else class="med-compact-list overflow-y-auto overflow-x-hidden" style="max-height: 460px">
            <TransitionGroup name="list-slide">
              <div
                v-for="med in filteredHistory"
                :key="med.id"
                class="med-compact-item p-2-5 mb-2 border rounded transition-fast d-flex align-items-center justify-content-between bg-white shadow-xs cursor-pointer"
                role="button"
                title="Cliquer pour consulter le détail"
                @click="consultMedicament(med.id)"
              >
                <div class="d-flex align-items-center gap-3 text-truncate flex-grow-1 pe-2">
                  <div
                    class="med-icon-wrapper bg-primary-subtle text-primary rounded px-2-5 py-2 d-flex align-items-center justify-content-center flex-shrink-0"
                  >
                    <i class="text-md fas fa-pills"></i>
                  </div>

                  <div class="text-truncate">
                    <div class="d-flex align-items-center gap-2 text-truncate">
                      <span class="text-dark fw-semibold text-sm"
                        >{{ med.nom }} {{ med.dosage }}</span
                      >
                      <span
                        class="badge bg-primary-light text-primary extra-small rounded-pill text-uppercase"
                      >
                        {{ med.forme }}
                      </span>
                    </div>
                    <div class="text-muted extra-small text-truncate mt-0-5">
                      <span class="fw-medium text-secondary">{{ med.nom_generique }}</span> &bull;
                      Code: <span class="font-monospace text-dark">{{ med.code }}</span>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center flex-shrink-0 ms-2">
                  <span
                    v-if="med.prix || med.prix_officiel"
                    class="badge bg-light text-dark font-monospace text-xs border fw-bold"
                  >
                    {{ med.prix || med.prix_officiel }} F
                  </span>
                  <span v-else class="text-muted extra-small italic">N/D</span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </MedCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Alignement sur le design médical compact */
.med-compact-item {
  border-color: var(--medical-gray-200) !important;
}
.med-compact-item:hover {
  border-color: var(--medical-primary-light) !important;
  background-color: var(--medical-primary-bg) !important;
  transform: translateX(3px);
}

.med-icon-wrapper {
  min-width: 36px;
  min-height: 36px;
}

.px-2-5 {
  padding-left: 0.65rem !important;
  padding-right: 0.65rem !important;
}
.p-2-5 {
  padding: 0.55rem 0.75rem !important;
}

/* Bouton oeil interactif au survol */
.hover-btn-consult:hover {
  background-color: var(--bs-primary-key-transparent, rgba(13, 110, 253, 0.1)) !important;
  border-radius: var(--bs-border-radius-sm);
}

/* Animations de glissement et d'apparition */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.35s ease;
}
.list-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.list-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.form-control:focus {
  border-color: rgba(2, 132, 199, 0.6) !important;
  box-shadow: 0 0 0 0.25rem rgba(2, 132, 199, 0.15) !important;
}
</style>
