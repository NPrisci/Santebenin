<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import MedRichEditor from "@/components/common/MedRichEditor.vue";
import MedTextArea from "@/components/common/MedTextArea.vue";
import MedInput from "@/components/common/MedInput.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedFileUpload from "@/components/common/MedFileUpload.vue";
import MedMediaPreview from "@/components/common/MedMediaPreview.vue";
import MedChip from "@/components/common/MedChip.vue";
import MedToggle from "@/components/common/MedToggle.vue";
import MedDateField from "@/components/common/MedDateField.vue";
import MedProgressBar from "@/components/common/MedProgressBar.vue"; // 👈 Ajout de la barre de progression
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { useRouter } from "vue-router";
import { AnnonceApi } from "@/api/endpoints/services/admin/annonces";

// Définir les constantes de manipulation
const toast = useToast();
const { confirm } = useConfirm();
const router = useRouter();

// --- États Réactifs ---
const isPublishing = ref(false);
const isLoading = ref(false);
const uploadProgress = ref(0); // 👈 Pourcentage de la barre de progression
let autoSaveInterval = null; // Stockage de l'ID du setInterval
const isSavingDraft = ref(false);

const form = reactive({
  titre: "",
  description: "",
  content: "",
  isVisible: true,
  categorie: "",
  categorieCustom: "",
  image: null,
  video: null,
  dateExpiration: "",
});

const errors = reactive({
  titre: "",
  description: "",
  categorie: "",
  image: "",
});

// --- Chargement et Sauvegarde de Brouillon (Auto-save) ---

// 1. Récupération automatique du brouillon au montage du composant
onMounted(() => {
  const savedDraft = AnnonceApi.getDraftAnnonce();
  if (
    savedDraft &&
    (savedDraft.titre || savedDraft.description || savedDraft.content)
  ) {
    Object.assign(form, savedDraft);
    toast.info("Votre brouillon sauvegardé a été restauré.");
  }

  // 2. Initialisation de la sauvegarde automatique toutes les 30 secondes
  autoSaveInterval = setInterval(() => {
    // Évite d'écraser si on est déjà en cours de publication
    if (!isPublishing.value && !isLoading.value) {
      AnnonceApi.saveDraftAnnonce(form);
      // Petite notification discrète en console ou toast optionnel
      console.log(
        "Brouillon sauvegardé automatiquement à " +
          new Date().toLocaleTimeString()
      );
    }
  }, 30000); // 30 secondes
});

// Nettoyage du timer à la destruction du composant pour éviter les fuites de mémoire
onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

// Déclencheur manuel pour le bouton "Enregistrer en brouillon"
const saveManualDraft = async () => {
  const result = await confirm({
    title: "Brouillon",
    html: "<p>Voulez-vous enregistrer l'annonce dans les brouillons ?</p> <br> <small class='text-warning fw-bold'>Le brouillon sera perdu si vous supprimez les données de votre navigateur. les médias ne seront pas enregistrés</small>",
    type: "warning",
    confirmButtonText: "Enregistrer",
    confirmButtonClass: "btn btn-success px-4",
  });
  if (!result.isConfirmed) return;
  try {
    AnnonceApi.saveDraftAnnonce(form);
    toast.success("Annonce enregistrée dans vos brouillons locaux !");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Erreur lors de la sauvegarde du brouillon.");
  }
};

// --- Validation et Soumission ---

const validateForm = () => {
  let isValid = true;
  // Réinitialisation des erreurs
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!form.titre.trim()) {
    errors.titre = "Le titre est obligatoire.";
    isValid = false;
  }
  if (!form.description.trim()) {
    errors.description = "La description courte est obligatoire.";
    isValid = false;
  }
  if (!form.image) {
    errors.image = "L'image de couverture est requise.";
    isValid = false;
  }

  return isValid;
};

// Action principale : Publication de l'annonce avec barre de progression
const handlePublishAnnonce = async () => {
  if (!validateForm()) {
    toast.warning("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }

  if (!form.categorie) {
    toast.warning(
      "Veuillez sélectionner une catégorie pour permettre une recherche rapide."
    );
    return;
  }

  const result = await confirm({
    title: "Publier l'annonce",
    text: "Voulez-vous publier cette annonce ?",
    type: "question",
    confirmButtonText: "Publier",
    confirmButtonClass: "btn btn-success px-4",
  });

  if (!result.isConfirmed) return;

  isPublishing.value = true;
  uploadProgress.value = 0;

  const progressSimulation = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 15;
    }
  }, 200);

  try {
    // Appel à l'API en envoyant l'objet réactif converti
    const response = await AnnonceApi.storeAnnonce({ ...form });

    if (response && response.error) {
      clearInterval(progressSimulation);
      toast.error(
        response.error || "Une erreur est survenue lors de la validation API."
      );
    } else {
      // Succès total
      uploadProgress.value = 100;
      clearInterval(progressSimulation);

      toast.success("L'annonce a été publiée avec succès !");

      // Nettoyer le brouillon du localStorage après une publication réussie
      localStorage.removeItem("beninsante_annonce_draft");

      // Redirection après succès vers la liste des annonces
      setTimeout(() => {
        router.push({ name: "all-annonces" }); // Remplace par ta vraie route cible si besoin
      }, 800);
    }
  } catch (err) {
    clearInterval(progressSimulation);
    toast.error("Échec de la communication avec le serveur.");
    console.error(err);
  } finally {
    setTimeout(() => {
      isPublishing.value = false;
      uploadProgress.value = 0;
    }, 1000);
  }
};
// --- Configuration des Catégories ---
// Options de base (statiques)
const BASE_CATEGORY_OPTIONS = [
  {
    label: "Alerte Sanitaire",
    value: "alerte",
    icon: "pi pi-exclamation-triangle",
  },
  { label: "Information Générale", value: "info", icon: "pi pi-info-circle" },
  { label: "Protocole", value: "protocole", icon: "pi pi-shield" },
  { label: "Événement", value: "evenement", icon: "pi pi-calendar" },
];

// Liste réactive pour stocker les catégories personnalisées ajoutées par l'utilisateur
const dynamicCategories = ref([]);

// Propriété calculée combinant les options de base et les options dynamiques ajoutées
const categoryOptions = computed(() => {
  return [...BASE_CATEGORY_OPTIONS, ...dynamicCategories.value];
});

const showCustomCategory = ref(false);
const customInput = ref(""); // Stocke la saisie temporaire avant validation

// Sélection d'une catégorie
const selectCategory = (value) => {
  if (value === "custom") {
    showCustomCategory.value = true;
  } else {
    form.categorie = value;
    form.categorieCustom = "";
    showCustomCategory.value = false;
  }
};

// Fonction de validation et d'ajout de la catégorie personnalisée
const handleAddCustomCategory = () => {
  const cleanValue = customInput.value.trim();

  // Validation simple : chaîne non vide
  if (!cleanValue) {
    errors.categorieCustom = "Le nom de la catégorie ne peut pas être vide.";
    return;
  }

  // Génération d'un identifiant unique de valeur (ex: custom_nom-categorie)
  const customValue = `custom_${cleanValue
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")}`;

  // Vérifier si cette catégorie n'existe pas déjà
  const exists = categoryOptions.value.some((cat) => cat.value === customValue);
  if (exists) {
    errors.categorieCustom = "Cette catégorie existe déjà.";
    return;
  }

  // Nettoyage de l'erreur éventuelle
  errors.categorieCustom = "";

  // Étape 1 : Ajouter la nouvelle catégorie à notre liste dynamique
  dynamicCategories.value.push({
    label: cleanValue,
    value: customValue,
    icon: "pi pi-plus-circle", // Une icône distinctive pour les options utilisateur
  });

  // Étape 2 : Mettre à jour les données du formulaire avec la valeur validée
  form.categorie = customValue;
  form.categorieCustom = cleanValue;

  // Étape 3 : Réinitialiser le champ de saisie temporaire et fermer le volet
  customInput.value = "";
  showCustomCategory.value = false;
};
</script>

<template>
  <div class="row align-items-center">
    <div class="col-12">
      <div
        class="d-flex justify-content-between align-items-center border-bottom pb-3"
      >
        <h4 class="mb-0 fw-semibold text-dark">Publier une nouvelle annonce</h4>

        <div class="btn-group">
          <MedButton
            variant="soft-primary"
            class="shadow-sm"
            :loading="isSavingDraft"
            :disabled="isPublishing || isLoading"
            @click="saveManualDraft"
          >
            <i class="pi pi-save"></i>
            <span class="d-none d-md-inline ms-2"
              >Enregistrer en brouillon</span
            >
          </MedButton>
          <MedButton
            variant="primary"
            class="shadow-sm"
            :loading="isPublishing"
            :disabled="isSavingDraft || isLoading"
            @click="handlePublishAnnonce"
          >
            <i class="pi pi-send"></i>
            <span class="d-none d-md-inline ms-2">Publier</span>
          </MedButton>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade-slide">
    <div v-if="isPublishing" class="row mb-4">
      <div class="col-12">
        <div class="card p-3 shadow-medical border-0">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span
              class="small fw-semibold text-primary d-flex align-items-center gap-2"
            >
              <i class="pi pi-spin pi-spinner"></i> Envoi des fichiers et
              création de l'annonce en cours...
            </span>
            <span class="font-monospace small text-muted"
              >{{ uploadProgress }}%</span
            >
          </div>
          <MedProgressBar
            :value="uploadProgress"
            variant="primary"
            height="10px"
            animated
            striped
          />
        </div>
      </div>
    </div>
  </Transition>

  <div class="row">
    <!--Conteneur principale avec le input titre, description et le conteneur de redaction-->
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="col-12">
            <MedInput
              label="Titre de l'annonce"
              placeholder="Titre de l'annonce..."
              v-model="form.titre"
              :max-length="50"
              :error="errors.titre"
            />
          </div>

          <div class="col-12">
            <MedTextArea
              label="Description de l'annonce"
              placeholder="Rédigez un résumé percutant..."
              v-model="form.description"
              :max-length="120"
              rows="2"
              :error="errors.description"
              resize="none"
            />
          </div>

          <div class="col-12 overflow-hidden">
            <label for="contenu" class="form-label mb-1">
              Contenu de l'annonce
            </label>
            <MedRichEditor
              id="contenu"
              v-model="form.content"
              min-height="500px"
              min-width="100%"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card">
        <div class="card-header bg-success-subtle">
          <h5 class="card-title">Paramètres de l'annonce</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div
                class="p-3 border rounded-lg bg-light transition-base"
                :class="{
                  'border-primary bg-primary-light-subtle': form.isVisible,
                }"
              >
                <div
                  class="d-flex align-items-center justify-content-between gap-3"
                >
                  <div class="d-flex flex-column">
                    <span
                      class="form-label mb-1 text-dark d-flex align-items-center gap-2"
                    >
                      <i
                        class="pi text-spacing-md"
                        :class="[
                          form.isVisible
                            ? 'pi-eye text-primary'
                            : 'pi-eye-slash text-muted',
                        ]"
                      ></i>
                      Visibilité de l'annonce
                    </span>

                    <p
                      class="small mb-0 transition-fast"
                      :class="[
                        form.isVisible
                          ? 'text-primary fw-medium'
                          : 'text-muted',
                      ]"
                    >
                      {{
                        form.isVisible
                          ? "L'annonce sera immédiatement visible sur la plateforme."
                          : "L'annonce restera masquée aux utilisateurs."
                      }}
                    </p>
                  </div>

                  <div class="flex-shrink-0">
                    <MedToggle
                      v-model="form.isVisible"
                      :disabled="isPublishing || isLoading"
                      class="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-12 mt-4">
              <label class="form-label d-flex align-items-center gap-2 mb-2">
                <i class="pi pi-tag"></i>
                Catégorie de l'annonce
              </label>

              <div class="d-flex flex-wrap gap-2">
                <MedChip
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  :label="cat.label"
                  :value="cat.value"
                  :icon="cat.icon"
                  :active="form.categorie === cat.value"
                  :disabled="isPublishing || isLoading"
                  @click="selectCategory(cat.value)"
                />

                <MedChip
                  label="Autre..."
                  value="custom"
                  icon="pi pi-plus"
                  :active="showCustomCategory"
                  :disabled="isPublishing || isLoading"
                  @click="selectCategory('custom')"
                />
              </div>

              <Transition name="fade-slide">
                <div
                  v-if="showCustomCategory"
                  class="mt-3 p-2 border border-light rounded bg-light"
                >
                  <div class="row align-items-end">
                    <div class="input-group">
                      <MedInput
                        v-model="customInput"
                        placeholder="Précisez la catégorie..."
                        :error="errors.categorieCustom"
                        @keydown.enter.prevent="handleAddCustomCategory"
                        class="flex-grow-1"
                      />
                      <MedButton
                        variant="success"
                        class="shadow-sm btn-sm"
                        style="height: 46px"
                        :disabled="isPublishing || isLoading"
                        @click="handleAddCustomCategory"
                      >
                        <i class="pi pi-check"></i>
                      </MedButton>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="col-12 mt-4">
              <label class="form-label d-flex align-items-center gap-2 mb-2">
                <i class="pi pi-image"></i>
                Image de couverture
              </label>

              <Transition name="fade-slide" mode="out-in">
                <div v-if="form.image" key="preview" class="position-relative">
                  <MedMediaPreview
                    :file="form.image"
                    height="220px"
                    @remove="form.image = null"
                  />
                </div>

                <div v-else key="upload">
                  <MedFileUpload
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    :max-size="5"
                    help-text="Formats acceptés : PNG, JPEG, WEBP (Max. 5 Mo)"
                    :error="errors.image"
                    :disabled="isPublishing || isLoading"
                    @file-selected="form.image = $event"
                    @error="errors.image = $event"
                  />
                </div>
              </Transition>
            </div>
            <div class="col-12 mt-4">
              <label class="form-label d-flex align-items-center gap-2 mb-2">
                <i class="pi pi-video"></i>
                Video explicative (Optionnelle)
              </label>

              <Transition name="fade-slide" mode="out-in">
                <div v-if="form.video" key="preview" class="position-relative">
                  <MedMediaPreview
                    :file="form.video"
                    height="220px"
                    @remove="form.video = null"
                  />
                </div>

                <div v-else key="upload">
                  <MedFileUpload
                    accept="video/mp4"
                    :max-size="15"
                    help-text="Formats acceptés : mp4 (Max. 15 Mo)"
                    :error="errors.video"
                    :disabled="isPublishing || isLoading"
                    @file-selected="form.video = $event"
                  />
                </div>
              </Transition>
            </div>

            <div class="col-md-12 mt-4">
              <MedDateField
                v-model="form.dateExpiration"
                label="Date d'expiration de la publication"
                placeholder="Sélectionnez une date (Optionnel)"
                help-text="Laissez vide si l'annonce n'a pas de limite de validité dans le temps."
                :error="errors.dateExpiration"
                :disabled="isPublishing || isLoading"
                :calendar-attrs="{ minDate: new Date() }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>