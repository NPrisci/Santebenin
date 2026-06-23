<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import MedicamentsService from "@/api/endpoints/services/admin/medicaments";
import { encryptService } from '@/api/endpoints/encrypt'
import router from "@/router";
import { isEmpty } from "@/api/clients/help";

// Importation des composants réutilisables du projet
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedInput from "@/components/common/MedInput.vue";
import MedSelect from "@/components/common/MedSelect.vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";

const toast = useToast();

// --- ÉTATS RÉACTIFS ---
const newId = ref(null);
const isLoadingData = ref(true);
const isSubmitting = ref(false);
const showPrixOfficiel = ref(false); // Commutateur pour le prix réglementé

// Liste des options de formes galéniques chargées depuis l'API
const listeFormes = ref([]);

// Structure du formulaire
const form = reactive({
  id: "",
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
  prix: null, // Correspond au prix_officiel attendu ou muté
});

// Structure de gestion des erreurs (5 champs obligatoires selon CheckApiData)
const errors = reactive({
  code: "",
  nom: "",
  nom_generique: "",
  forme: "",
  dosage: "",
});

// Données brutes de l'API pour les métadonnées de la colonne de droite
const originalMedicament = ref(null);

// --- CHARGEMENT DES DONNÉES INITIALES ---
const fetchFormesGaleniques = async () => {
  try {
    const data = await MedicamentsService.formes();
    if (data && Array.isArray(data.forms)) {
      // Transformation au format attendu par MedSelect { label, value }
      listeFormes.value = data.forms.map(f => ({
        label: f.label,
        value: f.code
      }));
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des formes:", error);
  }
};

const loadMedicamentDetails = async (id) => {
  isLoadingData.value = true;
  try {
    const response = await MedicamentsService.getMedicament(id);
    if (isEmpty(response)) {
      toast.warning("Impossible de récupérer les détails du médicament");
      goBack();
      return;
    }
    
    // Unification du déballage data
    const item = response.data || response;
    originalMedicament.value = item;

    // Remplissage du formulaire réactif
    form.id = item.id;
    form.code = item.code;
    form.nom = item.nom;
    form.nom_generique = item.nom_generique;
    if (item.forme) {
      const formeCorrespondante = listeFormes.value.find(
        f => f.label.toLowerCase().trim() === item.forme.toLowerCase().trim()
      );
      
      // Si on trouve une correspondance, on affecte son code (value), sinon on garde la valeur brute
      form.forme = formeCorrespondante ? formeCorrespondante.value : item.forme;
    } else {
      form.forme = "";
    }
    form.dosage = item.dosage;
    form.prix = item.prix_officiel || item.prix;

    // Activer le bloc prix si un prix officiel existe
    if (item.a_un_prix_officiel || item.prix_officiel) {
      showPrixOfficiel.value = true;
    }

  } catch (error) {
    console.error(error);
    toast.error("Erreur lors du chargement de la fiche médicament");
  } finally {
    isLoadingData.value = false;
  }
};

onMounted(async () => {
  const idUrl = router.currentRoute.value.params.id;
  newId.value = await encryptService.decrypt(idUrl);
  
  // Charger les référentiels et les données en parallèle
  await Promise.all([
    fetchFormesGaleniques(),
    loadMedicamentDetails(newId.value)
  ]);
});

// --- VALIDATION DU FORMULAIRE ---
const validateForm = () => {
  let isValid = true;
  
  // Réinitialisation des erreurs
  errors.code = "";
  errors.nom = "";
  errors.nom_generique = "";
  errors.forme = "";
  errors.dosage = "";

  if (!form.code) {
    errors.code = "Le code CIP/EAN est requis.";
    isValid = false;
  }
  if (!form.nom) {
    errors.nom = "Le nom commercial ou désignation est requis.";
    isValid = false;
  }
  if (!form.nom_generique) {
    errors.nom_generique = "Le nom générique (DCI) est requis.";
    isValid = false;
  }
  if (!form.forme) {
    errors.forme = "Veuillez sélectionner une forme galénique.";
    isValid = false;
  }
  if (!form.dosage) {
    errors.dosage = "Le dosage est requis (ex: 500 mg).";
    isValid = false;
  }

  return isValid;
};

// --- SOUMISSION DES DONNÉES ---
const handleSubmit = async () => {
  if (!validateForm()) {
    toast.warning("Veuillez corriger les erreurs dans le formulaire avant de soumettre.");
    return;
  }

  isSubmitting.value = true;

  // Préparation de l'objet payload selon la nomenclature de CheckApiData.updateMedicament
  const payload = {
    id: form.id,
    code: form.code,
    nom: form.nom,
    nom_generique: form.nom_generique,
    forme: form.forme,
    dosage: form.dosage,
    prix: showPrixOfficiel.value ? Number(form.prix) : null,
    a_un_prix_officiel: showPrixOfficiel.value,
  };

  try {
    const response = await MedicamentsService.update(payload);
    
    if (response && response.error) {
      toast.error(response.error || "Données invalides détectées par l'API.");
      return;
    }

    toast.success("La fiche du médicament a été mise à jour avec succès.");
    goBack();
  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push({ 
    name: "admin-medicaments-details", 
    params: { id: router.currentRoute.value.params.id } 
  });
};
</script>

<template>
  <div class="container-fluid p-2 font-body">
    
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 border-bottom pb-3 mb-4">
      <div class="d-flex align-items-center gap-3 text-truncate flex-grow-1 min-w-0">
        <button 
          class="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" 
          style="width: 38px; height: 38px;" 
          @click="goBack" 
          :disabled="isSubmitting"
          title="Retour aux détails"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
        
        <div v-if="!isLoadingData && originalMedicament" class="min-w-0">
          <h2 class="h3 mb-1 fw-bold text-dark font-title text-truncate">
            Modifier la fiche : <span class="text-primary">{{ originalMedicament.nom }}</span>
          </h2>
          <p class="text-muted small mb-0 text-truncate">
            ID unique système : <span class="font-monospace text-secondary">{{ form.id }}</span>
          </p>
        </div>
        <div v-else class="w-100" style="min-width: 250px;">
          <MedSkeleton height="24px" width="50%" class="mb-1" />
          <MedSkeleton height="14px" width="30%" />
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 flex-shrink-0 w-100 w-md-auto justify-content-end">
        <MedButton 
          variant="outline-secondary" 
          size="sm"
          :disabled="isSubmitting || isLoadingData"
          @click="goBack"
        >
          Annuler
        </MedButton>
        <MedButton 
          variant="primary" 
          icon="pi pi-check"
          size="sm"
          :loading="isSubmitting"
          :disabled="isLoadingData"
          @click="handleSubmit"
        >
          Enregistrer
        </MedButton>
      </div>
    </div>

    <div class="row g-4 align-items-start">
      
      <template v-if="isLoadingData">
        <div class="col-lg-8">
          <MedSkeleton height="250px" class="rounded border mb-3" />
          <MedSkeleton height="280px" class="rounded border" />
        </div>
        <div class="col-lg-4">
          <MedSkeleton height="350px" class="rounded border" />
        </div>
      </template>

      <template v-else>
        <div class="col-lg-8">
          <div class="d-flex flex-column gap-4">
            
            <MedCard title="Identification Générale" icon="pi pi-tag" shadow="md" class="border shadow-sm">
              <div class="row g-3">
                
                <div class="col-md-6">
                  <MedInput
                    v-model="form.code"
                    label="Code CIP / EAN du produit *"
                    placeholder="Ex: 6500000000034"
                    icon-left="pi pi-barcode"
                    :error="errors.code"
                    disabled
                    help-text="L'identifiant CIP/EAN structurel ne peut pas être modifié."
                  />
                </div>

                <div class="col-md-6">
                  <MedInput
                    v-model="form.nom"
                    label="Désignation Commerciale *"
                    placeholder="Ex: Doliprane, Générique..."
                    icon-left="pi pi-info"
                    :error="errors.nom"
                  />
                </div>

                <div class="col-12">
                  <MedInput
                    v-model="form.nom_generique"
                    label="Nom Générique / Molécule (DCI) *"
                    placeholder="Ex: Paracétamol + Codeine"
                    icon-left="fas fa-flask"
                    :error="errors.nom_generique"
                  />
                </div>

              </div>
            </MedCard>

            <MedCard title="Spécifications & Tarification" icon="pi pi-sliders-h" shadow="md" class="border shadow-sm">
              <div class="row g-3">
                
                <div class="col-md-6">
                  <MedSelect
                    v-model="form.forme"
                    label="Forme Galénique *"
                    :options="listeFormes"
                    placeholder="Choisir la forme..."
                    :error="errors.forme"
                  />
                </div>

                <div class="col-md-6">
                  <MedInput
                    v-model="form.dosage"
                    label="Dosage Unitaire *"
                    placeholder="Ex: 500 mg / 30 mg"
                    icon-left="pi pi-compass"
                    :error="errors.dosage"
                  />
                </div>

                <div class="col-12 pt-2">
                  <div class="p-3 rounded border bg-light">
                    <div class="form-check form-switch d-flex align-items-center gap-3 p-0 ms-0">
                      <input 
                        class="form-check-input custom-switch-medical cursor-pointer m-0" 
                        type="checkbox" 
                        id="switchPrixOfficiel" 
                        v-model="showPrixOfficiel"
                        style="width: 2.5em; height: 1.25em;"
                      >
                      <label class="form-check-label cursor-pointer select-none" for="switchPrixOfficiel">
                        <span class="d-block fw-bold text-sm text-dark">Ce médicament est soumis à un prix officiel réglementé</span>
                        <span class="text-muted extra-small d-block">Cochez cette option si le Ministère de la Santé du Bénin fixe un tarif de vente obligatoire pour cette référence.</span>
                      </label>
                    </div>

                    <div v-if="showPrixOfficiel" class="mt-3 pt-3 border-top animate-fade-in">
                      <div class="row">
                        <div class="col-md-6">
                          <MedInput
                            v-model="form.prix"
                            type="number"
                            label="Montant du prix officiel (FCFA) *"
                            placeholder="Ex: 1500"
                            icon-left="pi pi-money-bill"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </MedCard>

          </div>
        </div>

        <div class="col-lg-4">
          <div class="d-flex flex-column gap-3 sticky-md-top" style="top: 20px; z-index: 10;">
            
            <MedCard title="Impact sur le Réseau" icon="pi pi-exclamation-circle" header-bg="bg-light-subtle" class="border shadow-sm">
              <div class="text-center py-2">
                <div class="h1 text-primary font-monospace fw-bold mb-1">
                  {{ originalMedicament?.nombre_total_pharmacies ?? 0 }}
                </div>
                <span class="text-muted extra-small text-uppercase fw-semibold tracking-wider d-block mb-3">Officines rattachées au Bénin</span>
                
                <p class="text-secondary text-sm text-start border-top pt-2 mb-0">
                  <i class="pi pi-info-circle text-info me-1"></i>
                  Toute modification sur la désignation, le dosage ou la forme sera répercutée **instantanément** sur les inventaires de ces officines partenaires.
                </p>
              </div>
            </MedCard>

            <div class="card p-3 border rounded shadow-xs bg-white text-secondary small">
              <h5 class="text-dark fw-bold text-xs text-uppercase tracking-wide border-bottom pb-2 mb-2">💡 Rappel de saisie</h5>
              <ul class="ps-3 mb-0 d-flex flex-column gap-1 extra-small">
                <li><b>DCI :</b> Saisir la dénomination internationale en français (ex: <i>Paracétamol</i> et non <i>Paracetamol</i>).</li>
                <li><b>Dosage :</b> Préciser systématiquement les unités de mesure associées (<i>mg, g, ml, UI/ml</i>).</li>
                <li><b>Forme :</b> Utiliser de préférence les formes normalisées fournies par le sélecteur.</li>
              </ul>
            </div>

          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
/* Alignement esthétique personnalisé pour le switch */
.custom-switch-medical:checked {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.extra-small {
  font-size: 0.75rem !important;
}
.text-xs {
  font-size: 0.82rem !important;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.select-none {
  user-select: none;
}
</style>