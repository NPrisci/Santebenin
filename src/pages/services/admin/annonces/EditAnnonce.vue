<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MedRichEditor from "@/components/common/MedRichEditor.vue";
import MedTextArea from "@/components/common/MedTextArea.vue";
import MedInput from "@/components/common/MedInput.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedFileUpload from "@/components/common/MedFileUpload.vue";
import MedMediaPreview from "@/components/common/MedMediaPreview.vue";
import MedChip from "@/components/common/MedChip.vue";
import MedToggle from "@/components/common/MedToggle.vue";
import MedDateField from "@/components/common/MedDateField.vue";
import MedProgressBar from "@/components/common/MedProgressBar.vue";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { AnnonceApi } from "@/api/endpoints/services/admin/annonces";
import { encryptService } from "@/api/endpoints/encrypt";

// Définir les constantes de manipulation
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { confirm } = useConfirm();

// --- États Réactifs ---
const isPublishing = ref(false);
const isLoading = ref(true);
const uploadProgress = ref(0); // Pourcentage de la barre de progression
const id = ref(null);

const annonceIdParams = route.params.id;

const form = reactive({
  id: "",
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

// --- Configuration des Catégories ---
const BASE_CATEGORY_OPTIONS = [
  { label: "Alerte Sanitaire", value: "alerte", icon: "pi pi-exclamation-triangle" },
  { label: "Information Générale", value: "info", icon: "pi pi-info-circle" },
  { label: "Protocole", value: "protocole", icon: "pi pi-shield" },
  { label: "Événement", value: "evenement", icon: "pi pi-calendar" },
];

const dynamicCategories = ref([]);

const categoryOptions = computed(() => {
  return [...BASE_CATEGORY_OPTIONS, ...dynamicCategories.value];
});

const showCustomCategory = ref(false);
const customInput = ref("");

// --- Chargement de l'annonce ---
const fetchAnnonceDetails = async () => {
  isLoading.value = true;
  id.value = await encryptService.localDecrypt(annonceIdParams);
  try {
    const response = await AnnonceApi.getAnnonceById(id.value);
    
    form.id = response.id;
    form.titre = response.titre || "";
    form.description = response.description || "";
    form.content = response.content || "";
    form.isVisible = true; // Par défaut car getAnnonceById ne retourne pas est_active
    form.image = response.image || null;
    form.video = response.video || null;
    form.dateExpiration = response.expire || "";
    
    // Gérer la catégorie
    const existingCat = BASE_CATEGORY_OPTIONS.find(
      (c) => c.label === response.categorie || c.value === response.categorie
    );
    if (existingCat) {
      form.categorie = existingCat.value;
    } else if (response.categorie) {
      // Catégorie personnalisée
      const customValue = `custom_${response.categorie.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      dynamicCategories.value.push({
        label: response.categorie,
        value: customValue,
        icon: "pi pi-plus-circle", 
      });
      form.categorie = customValue;
    }

  } catch (error) {
    toast.error("Erreur lors de la récupération des détails de l'annonce.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (annonceIdParams) {
    fetchAnnonceDetails();
  } else {
    toast.warning("Impossible d'afficher les informations de l'annonce");
    router.push({ name: "admin-annonces-list" });
  }
});

const goBack = () => {
  router.push({ name: "admin-annonce-details", params: { id: annonceIdParams } });
};

// --- Sélection d'une catégorie ---
const selectCategory = (value) => {
  if (value === "custom") {
    showCustomCategory.value = true;
  } else {
    form.categorie = value;
    form.categorieCustom = "";
    showCustomCategory.value = false;
  }
};

const handleAddCustomCategory = () => {
  const cleanValue = customInput.value.trim();

  if (!cleanValue) {
    errors.categorieCustom = "Le nom de la catégorie ne peut pas être vide.";
    return;
  }

  const customValue = `custom_${cleanValue.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  const exists = categoryOptions.value.some((cat) => cat.value === customValue);
  if (exists) {
    errors.categorieCustom = "Cette catégorie existe déjà.";
    return;
  }

  errors.categorieCustom = "";

  dynamicCategories.value.push({
    label: cleanValue,
    value: customValue,
    icon: "pi pi-plus-circle",
  });

  form.categorie = customValue;
  form.categorieCustom = cleanValue;

  customInput.value = "";
  showCustomCategory.value = false;
};

// --- Validation et Soumission ---
const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!form.titre.trim()) {
    errors.titre = "Le titre est obligatoire.";
    isValid = false;
  }
  if (!form.description.trim()) {
    errors.description = "La description courte est obligatoire.";
    isValid = false;
  }
  // En modification, si form.image est présent (string url ou file), c'est bon
  if (!form.image) {
    errors.image = "L'image de couverture est requise.";
    isValid = false;
  }

  return isValid;
};

const handleUpdateAnnonce = async () => {
  if (!validateForm()) {
    toast.warning("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }

  if (!form.categorie) {
    toast.warning("Veuillez sélectionner une catégorie pour permettre une recherche rapide.");
    return;
  }

  const result = await confirm({
    title: "Enregistrer les modifications",
    text: "Voulez-vous modifier cette annonce ?",
    type: "question",
    confirmButtonText: "Enregistrer",
    confirmButtonClass: "btn btn-primary px-4",
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
    const response = await AnnonceApi.updateAnnonce({ ...form });

    if (response && response.error) {
      clearInterval(progressSimulation);
      toast.error(response.error || "Une erreur est survenue lors de la validation API.");
    } else {
      uploadProgress.value = 100;
      clearInterval(progressSimulation);

      toast.success("L'annonce a été modifiée avec succès !");

      setTimeout(() => {
        router.push({ name: "admin-annonce-details", params: { id: annonceIdParams } });
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
</script>

<template>
  <div v-if="isLoading" class="p-4 d-flex justify-content-center">
      <div class="col-lg-8">
        <div class="med-skeleton-hero mb-4 rounded-lg"></div>
        <div class="med-skeleton-line short mb-3"></div>
        <div class="med-skeleton-line mb-2"></div>
        <div class="med-skeleton-line mb-2"></div>
        <div class="med-skeleton-line medium"></div>
      </div>
      <div class="col-lg-4">
        <div class="med-skeleton-hero h-150 mb-3 rounded-lg"></div>
      </div>
  </div>

  <div v-else class="container-fluid px-0 font-body">
    <!-- Barre du haut -->
    <div class="row align-items-center mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3">
          <div class="d-flex align-items-center gap-3">
            <MedButton variant="outline-secondary" size="sm" @click="goBack">
              <i class="pi pi-arrow-left"></i>
            </MedButton>
            <h4 class="mb-0 fw-semibold text-dark">Modifier l'annonce</h4>
          </div>

          <div class="btn-group">
            <MedButton
              variant="primary"
              class="shadow-sm"
              :loading="isPublishing"
              :disabled="isLoading"
              @click="handleUpdateAnnonce"
            >
              <i class="pi pi-save"></i>
              <span class="d-none d-md-inline ms-2">Enregistrer</span>
            </MedButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de progression -->
    <Transition name="fade-slide">
      <div v-if="isPublishing" class="row mb-4">
        <div class="col-12">
          <div class="card p-3 shadow-medical border-0">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="small fw-semibold text-primary d-flex align-items-center gap-2">
                <i class="pi pi-spin pi-spinner"></i> Sauvegarde des modifications en cours...
              </span>
              <span class="font-monospace small text-muted">{{ uploadProgress }}%</span>
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

    <div class="row g-4">
      <!-- Colonne Principale -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <div class="row g-4">
              <div class="col-12">
                <MedInput
                  label="Titre de l'annonce"
                  placeholder="Titre de l'annonce..."
                  v-model="form.titre"
                  :max-length="100"
                  :error="errors.titre"
                />
              </div>

              <div class="col-12">
                <MedTextArea
                  label="Description de l'annonce"
                  placeholder="Rédigez un résumé percutant..."
                  v-model="form.description"
                  :max-length="250"
                  rows="3"
                  :error="errors.description"
                  resize="none"
                />
              </div>

              <div class="col-12 overflow-hidden">
                <label for="contenu" class="form-label mb-2 fw-medium">
                  Contenu de l'annonce
                </label>
                <div class="border rounded-lg bg-light" style="min-height: 400px;">
                  <MedRichEditor
                    id="contenu"
                    v-model="form.content"
                    height="600px"
                    min-width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne Latérale -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary-subtle text-primary fw-bold py-3">
            <i class="pi pi-cog me-2"></i> Paramètres de l'annonce
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
              <div class="col-12">
                <div
                  class="p-3 border rounded-lg transition-base"
                  :class="[form.isVisible ? 'border-primary bg-primary-subtle' : 'bg-light']"
                >
                  <div class="d-flex align-items-center justify-content-between gap-3">
                    <div class="d-flex flex-column">
                      <span class="form-label mb-1 text-dark d-flex align-items-center gap-2">
                        <i class="pi" :class="[form.isVisible ? 'pi-eye text-primary' : 'pi-eye-slash text-muted']"></i>
                        Visibilité
                      </span>
                      <p class="small mb-0 transition-fast" :class="[form.isVisible ? 'text-primary' : 'text-muted']">
                        {{ form.isVisible ? "L'annonce est visible." : "L'annonce est masquée." }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <MedToggle
                        v-model="form.isVisible"
                        :disabled="isPublishing || isLoading"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label class="form-label d-flex align-items-center gap-2 mb-2">
                  <i class="pi pi-tag text-muted"></i> Catégorie
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
                  <div v-if="showCustomCategory" class="mt-3 p-3 border rounded bg-light">
                    <div class="input-group">
                      <MedInput
                        v-model="customInput"
                        placeholder="Précisez la catégorie..."
                        :error="errors.categorieCustom"
                        class="flex-grow-1 mb-0"
                        @keydown.enter.prevent="handleAddCustomCategory"
                      />
                      <MedButton
                        variant="success"
                        class="btn-sm"
                        style="height: 45px"
                        :disabled="isPublishing || isLoading"
                        @click="handleAddCustomCategory"
                      >
                        <i class="pi pi-check"></i>
                      </MedButton>
                    </div>
                  </div>
                </Transition>
              </div>

              <div class="col-12">
                <label class="form-label d-flex align-items-center gap-2 mb-2">
                  <i class="pi pi-image text-muted"></i> Image de couverture
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
                      help-text="Formats: PNG, JPEG, WEBP (Max. 5 Mo)"
                      :error="errors.image"
                      :disabled="isPublishing || isLoading"
                      @file-selected="form.image = $event"
                      @error="errors.image = $event"
                    />
                  </div>
                </Transition>
              </div>

              <div class="col-12">
                <label class="form-label d-flex align-items-center gap-2 mb-2">
                  <i class="pi pi-video text-muted"></i> Vidéo (Optionnelle)
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
                      help-text="Format: MP4 (Max. 15 Mo)"
                      :error="errors.video"
                      :disabled="isPublishing || isLoading"
                      @file-selected="form.video = $event"
                    />
                  </div>
                </Transition>
              </div>

              <div class="col-12">
                <MedDateField
                  v-model="form.dateExpiration"
                  label="Date d'expiration"
                  placeholder="Date de fin (Optionnel)"
                  help-text="Laissez vide pour aucune limite."
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
