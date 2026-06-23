<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useUiStore } from "@/router/ui";
import { useToast } from "@/composables/useToast";

// Importation des composants réutilisables du projet
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedEmptyState from "@/components/common/MedEmptyState.vue";

const uiStore = useUiStore();
const toast = useToast();

// --- ÉTATS RÉACTIFS ---
const isSubmitting = ref(false);
const isLoadingHistory = ref(false);
const searchQuery = ref(""); // Recherche locale dans l'historique de droite

// Structure du formulaire contenant exclusivement tes 6 paramètres
const form = reactive({
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
  prix: null,
});

// Structure de gestion des erreurs pour les 5 champs obligatoires
const errors = reactive({
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
});

// Base de données locale temporaire pour simuler la liste compacte de droite
const medicamentsHistory = ref([
  { id: 1, code: "3400934947402", nom: "Doliprane", nom_generique: "Paracétamol", forme: "Comprimé", dosage: "500mg", prix: 1200 },
  { id: 2, code: "3400930165039", nom: "Amoxicilline Sandoz", nom_generique: "Amoxicilline", forme: "Gélule", dosage: "1g", prix: 3500 },
  { id: 3, code: "3400936231578", nom: "Spasfon", nom_generique: "Phloroglucinol", forme: "Comprimé Enrobé", dosage: "80mg", prix: 1800 },
  { id: 4, code: "3400932943239", nom: "Gaviscon", nom_generique: "Alginate de sodium", forme: "Suspension Buvable", dosage: "250ml", prix: null },
]);

// --- INITIALISATION ---
onMounted(() => {
  // Arrêt du loader global du dashboard
  uiStore.setDashLoading(false);
});

// --- LOGIQUE DE VALIDATION & SOUMISSION ---
const validateForm = () => {
  let isValid = true;
  // Réinitialisation des messages d'erreur
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
    toast.error("Veuillez remplir correctement les champs requis.");
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulation d'un délai d'appel API réseau
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Création du nouvel objet à pousser dans l'historique (Trié par empilement haut)
    const newMedicament = {
      id: Date.now(),
      code: form.code.trim(),
      nom: form.nom.trim(),
      nom_generique: form.nom_generique.trim(),
      forme: form.forme.trim(),
      dosage: form.dosage.trim(),
      prix: form.prix ? Number(form.prix) : null,
    };

    // Insertion immédiate tout en haut de la liste de droite
    medicamentsHistory.value.unshift(newMedicament);
    toast.success(`${newMedicament.nom} ajouté avec succès au catalogue national.`);

    // Réinitialisation complète du formulaire
    Object.keys(form).forEach((key) => {
      form[key] = key === "prix" ? null : "";
    });

  } catch (error) {
    toast.error("Une erreur est survenue lors de l'enregistrement.");
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
  <div class="container-fluid px-4 py-3 font-body">
    
    <div class="border-bottom pb-3 mb-4">
      <h2 class="h3 mb-1 fw-bold text-dark font-title">Catalogue National des Médicaments</h2>
      <p class="text-muted small mb-0">Enregistrez de nouvelles molécules ou parcourez les derniers référentiels de la plateforme.</p>
    </div>

    <div class="row g-4 align-items-start">
      
      <div class="col-lg-7">
        <MedCard 
          title="Ajouter un nouveau produit" 
          icon="pi pi-plus-circle" 
          shadow="sm"
          class="shadow-medical border-0"
        >
          <form @submit.prevent="handleAddMedicament" class="needs-validation">
            <div class="row g-3">
              
              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small">Code d'identification (CIP/EAN) *</label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0">
                    <i class="pi pi-barcode"></i>
                  </span>
                  <input
                    v-model="form.code"
                    type="text"
                    placeholder="Ex: 3400934947402"
                    class="form-control border-start-0"
                    :class="{ 'is-invalid': errors.code }"
                    :disabled="isSubmitting"
                  />
                </div>
                <div v-if="errors.code" class="invalid-feedback d-block mt-1 small font-medium">
                  {{ errors.code }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small">Nom commercial *</label>
                <input
                  v-model="form.nom"
                  type="text"
                  placeholder="Ex: Doliprane"
                  class="form-control"
                  :class="{ 'is-invalid': errors.nom }"
                  :disabled="isSubmitting"
                />
                <div v-if="errors.nom" class="invalid-feedback d-block mt-1 small font-medium">
                  {{ errors.nom }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small">Nom générique (DCI) *</label>
                <input
                  v-model="form.nom_generique"
                  type="text"
                  placeholder="Ex: Paracétamol"
                  class="form-control"
                  :class="{ 'is-invalid': errors.nom_generique }"
                  :disabled="isSubmitting"
                />
                <div v-if="errors.nom_generique" class="invalid-feedback d-block mt-1 small font-medium">
                  {{ errors.nom_generique }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small">Forme galénique *</label>
                <input
                  v-model="form.forme"
                  type="text"
                  placeholder="Ex: Comprimé, Sirop, Gélule"
                  class="form-control"
                  :class="{ 'is-invalid': errors.forme }"
                  :disabled="isSubmitting"
                />
                <div v-if="errors.forme" class="invalid-feedback d-block mt-1 small font-medium">
                  {{ errors.forme }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small">Dosage *</label>
                <input
                  v-model="form.dosage"
                  type="text"
                  placeholder="Ex: 500mg, 1g/10ml"
                  class="form-control"
                  :class="{ 'is-invalid': errors.dosage }"
                  :disabled="isSubmitting"
                />
                <div v-if="errors.dosage" class="invalid-feedback d-block mt-1 small font-medium">
                  {{ errors.dosage }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary small d-flex justify-content-between">
                  <span>Prix indicatif FCFA</span>
                  <span class="text-muted extra-small fw-normal italic">(Optionnel)</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="form.prix"
                    type="number"
                    min="0"
                    placeholder="Ex: 1200"
                    class="form-control border-end-0"
                    :disabled="isSubmitting"
                  />
                  <span class="input-group-text bg-light text-muted border-start-0 font-monospace text-xs">FCFA</span>
                </div>
              </div>

            </div>

            <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <MedButton 
                variant="outline-secondary" 
                :disabled="isSubmitting"
                @click="Object.keys(form).forEach(k => form[k] = '')"
              >
                Vider
              </MedButton>
              <MedButton 
                type="submit" 
                variant="primary" 
                :loading="isSubmitting"
              >
                Enregistrer au catalogue
              </MedButton>
            </div>
          </form>
        </MedCard>
      </div>

      <div class="col-lg-5">
        <MedCard 
          title="Derniers ajouts sur la plateforme" 
          icon="pi pi-history" 
          shadow="sm"
          header-bg="bg-light"
          body-class="p-3 d-flex flex-column gap-2"
          class="border shadow-sm"
        >
          <div class="mb-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white text-muted border-end-0"><i class="pi pi-filter"></i></span>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Filtrer l'historique récent..." 
                class="form-control border-start-0" 
              />
            </div>
          </div>

          <div v-if="filteredHistory.length === 0" class="py-3">
            <MedEmptyState
              icon="pi pi-search"
              title="Aucun médicament trouvé"
              description="Aucun produit récent ne correspond à vos critères de recherche."
              size="sm"
            />
          </div>

          <div v-else class="med-compact-list overflow-y-auto" style="max-height: 420px;">
            <TransitionGroup name="list-slide">
              <div 
                v-for="med in filteredHistory" 
                :key="med.id" 
                class="med-compact-item p-2-5 mb-2 border rounded transition-fast d-flex align-items-center justify-content-between bg-white shadow-xs"
              >
                <div class="text-truncate pe-2">
                  <div class="d-flex align-items-center gap-2 text-truncate">
                    <span class="text-dark text-sm">{{ med.nom }} {{ med.dosage }}</span>
                    <span class="badge bg-primary-light text-primary extra-small rounded-pill">{{ med.forme }}</span>
                  </div>
                  <div class="text-muted extra-small text-truncate mt-0-5">
                    <span class="fw-medium text-secondary">{{ med.nom_generique }}</span> &bull; CIP: <span class="font-monospace">{{ med.code }}</span>
                  </div>
                </div>

                <div class="text-end flex-shrink-0">
                  <span v-if="med.prix" class="badge bg-light text-dark font-monospace text-xs border fw-bold">
                    {{ med.prix }} F
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
/* Style des lignes compactes de l'historique */
.med-compact-item {
  border-color: var(--medical-gray-200) !important;
}
.med-compact-item:hover {
  border-color: var(--medical-primary-light) !important;
  background-color: var(--medical-primary-bg) !important;
  transform: translateX(2px);
}

/* Padding spécifique compact pour l'historique */
.p-2-5 {
  padding: 0.65rem 0.85rem !important;
}

/* Animation fluide à l'insertion dynamique d'un nouveau médicament */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.4s ease;
}
.list-slide-enter-from {
  opacity: 0;
  transform: translateY(-15px);
  background-color: var(--medical-secondary-bg) !important;
}
.list-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Personnalisation de l'input-group de focus lié à main.css */
.form-control:focus {
  border-color: rgba(2, 132, 199, 0.6) !important;
  box-shadow: 0 0 0 0.25rem rgba(2, 132, 199, 0.15) !important;
}
.input-group:focus-within .input-group-text {
  border-color: rgba(2, 132, 199, 0.6) !important;
}
</style>