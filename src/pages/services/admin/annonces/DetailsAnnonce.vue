<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AnnonceApi } from "@/api/endpoints/services/admin/annonces";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { encryptService } from "@/api/endpoints/encrypt";
// Importation des composants réutilisables du projet
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedEmptyState from "@/components/common/MedEmptyState.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { confirm } = useConfirm();

// --- États Réactifs ---
const annonce = ref(null);
const isLoading = ref(true);
const id = ref(null);

// Récupération de l'ID depuis les paramètres de l'URL
const annonceId = route.params.id;

// --- Chargement de l'annonce depuis l'API ---
const fetchAnnonceDetails = async () => {
  isLoading.value = true;
  id.value = await encryptService.decrypt(annonceId);
  try {
    const response = await AnnonceApi.getAnnonceById(id.value);
    annonce.value = response;
    console.log(annonce.value);
  } catch (error) {
    toast.error("Erreur lors de la récupération des détails de l'annonce.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (annonceId) {
    fetchAnnonceDetails();
  } else {
    toast.warning("Impossible d'afficher les informations de l'annonce");
    setTimeout(() => {
      router.push({ name: "admin-annonces-list" });
    });
  }
});

// --- Action d'archivage ---
const handleArchive = async () => {
  const accept = await confirm({
    text: "Voulez-vous vraiment archiver cette annonce ? Elle ne sera plus visible par les utilisateurs.",
    icon: "pi pi-box",
  });

  if (!accept.isConfirmed) {
    return;
  }
  try {
    await AnnonceApi.archiveAnnonce(id.value);
    toast.success("Annonce archivée avec succès.");
    router.push({ name: "admin-annonces-list" }); // Redirection vers la liste
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Impossible d'archiver l'annonce.");
  }
};

// --- Retour à la liste ---
const goBack = () => {
  router.push({ name: "admin-annonces-list" });
};

const goToEdit = async (id) => {
  const encryptedId = await encryptService.encrypt(id);
  router.push({
    name: "admin-annonce-edit",
    params: { id: encryptedId },
  });
}
</script>

<template>
  <div class="container-fluid p-2 font-body">
    <!-- 1. BARRE DE NAVIGATION SUPÉRIEURE (Top Bar) -->
<div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
  <MedButton variant="outline-secondary" size="sm" @click="goBack">
    <i class="pi pi-arrow-left me-md-1"></i> 
    <span class="d-none d-md-inline">Retour à la liste</span>
  </MedButton>

  <div v-if="annonce" class="d-flex gap-2">
    <MedButton
      variant="soft-primary"
      size="sm"
      @click="goToEdit(annonce.id)"
    >
      <i class="pi pi-pencil me-md-1"></i>
      <span class="d-none d-md-inline">Modifier</span>
    </MedButton>
    
    <MedButton variant="danger" size="sm" @click="handleArchive">
      <i class="pi pi-box me-md-1"></i>
      <span class="d-none d-md-inline">Archiver</span>
    </MedButton>
  </div>
</div>

    <!-- ÉTAT DE CHARGEMENT (SKELETON LOADER) -->
    <div v-if="isLoading" class="row g-4">
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

    <!-- ÉTAT VIDE / INTROUVABLE (MedEmptyState) -->
    <div v-else-if="!annonce" class="py-5">
      <MedEmptyState
        icon="pi pi-exclamation-circle"
        title="Annonce introuvable"
        description="Le communiqué que vous essayez de consulter n'existe pas ou a été définitivement supprimé du système."
        action-label="Retourner à la liste"
        action-icon="pi pi-arrow-left"
        bordered
        @action-click="goBack"
      />
    </div>

    <!-- STRUCTURE PRINCIPALE DE L'ARTICLE -->
    <div v-else class="row g-4">
      <!-- COLONNE PRINCIPALE : CORPS DE L'ARTICLE (col-lg-8) -->
      <div class="col-lg-8">
        <!-- 2. ZONE HÉRO (Image de couverture principale) -->
        <div
          v-if="annonce.image"
          class="annonce-hero-cover position-relative mb-4 rounded-lg overflow-hidden shadow-sm"
        >
          <img
            :src="annonce.image"
            :alt="annonce.titre"
            class="w-100 h-100 object-fit-cover"
          />
          <!-- Badge de Catégorie Flottant -->
          <span
            class="position-absolute bottom-3 left-3 bg-primary text-white font-semibold px-3 py-1-5 rounded-md shadow"
            style="bottom: 16px; left: 16px"
          >
            <i class="pi pi-tag small me-1"></i> {{ annonce.categorie }}
          </span>
        </div>

        <!-- 3. TITRE ET MÉTADONNÉES -->
        <h1 class="font-title fw-bold text-dark h2 mb-3">
          {{ annonce.titre }}
        </h1>

        <div
          class="d-flex flex-wrap align-items-center gap-3 text-muted small mb-4 pb-3 border-bottom font-monospace"
        >
          <span class="d-flex align-items-center gap-1">
            <i class="pi pi-calendar"></i> Publié le : {{ annonce.createdAt }}
          </span>
          <span
            v-if="annonce.joursRestants"
            class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2"
          >
            <i class="pi pi-clock small"></i> Reste
            {{ annonce.joursRestants }} jours
          </span>
          <span
            v-else
            class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2"
          >
            <i class="pi pi-infinity small"></i> Validité permanente
          </span>
        </div>

        <!-- chapeau / Résumé de l'annonce -->
        <p class="lead text-secondary fw-medium mb-4 fs-5 style-chapeau">
          {{ annonce.description }}
        </p>

        <!-- Contenu enrichi injecté via v-html -->
        <div
          class="article-rich-content text-dark lh-lg font-body"
          v-html="annonce.content"
        ></div>
      </div>

      <!-- COLONNE LATÉRALE : MÉDIAS SECONDAIRES & INFOS (col-lg-4) -->
      <div class="col-lg-4">
        <!-- Lecteur de Vidéo Explicative (si présente) -->
        <div v-if="annonce.video" class="mb-4">
          <label
            class="form-label font-title fw-bold text-secondary small mb-2 d-flex align-items-center gap-2"
          >
            <i class="pi pi-video text-primary"></i> Vidéo explicative rattachée
          </label>
          <div
            class="ratio ratio-16x9 rounded-lg overflow-hidden border shadow-sm bg-black"
          >
            <video
              controls
              preload="metadata"
              :src="annonce.video"
              class="w-100 h-100"
            >
              Votre navigateur ne supporte pas la lecture de vidéos HTML5.
            </video>
          </div>
        </div>

        <!-- Carte latérale récapitulative (MedCard) -->
        <MedCard
          title="Résumé clinique"
          icon="pi pi-info-circle"
          shadow="sm"
          header-bg="bg-light"
        >
          <ul class="list-unstyled mb-0 small d-flex flex-column gap-3">
            <li
              class="d-flex justify-content-between align-items-start border-bottom pb-2"
            >
              <span class="text-muted">Identifiant unique :</span>
              <span
                class="font-monospace text-end text-truncate ms-2"
                style="max-width: 160px"
                :title="annonce.id"
              >
                {{ annonce.id }}
              </span>
            </li>
            <li class="d-flex justify-content-between pb-1">
              <span class="text-muted">Type de portée :</span>
              <span class="fw-bold text-primary">Plateforme Générale</span>
            </li>
            <li class="d-flex justify-content-between pb-1">
              <span class="text-muted">Fin de validité :</span>
              <span class="text-dark">{{
                annonce.expire || "Non définie"
              }}</span>
            </li>
          </ul>
        </MedCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover !important;
}

/* Style de la zone de couverture héro */
.annonce-hero-cover {
  height: 380px;
  background-color: var(--bs-gray-100);
}

/* Personnalisation du chapeau de l'article */
.style-chapeau {
  border-left: 4px solid var(--medical-primary, #0d6efd);
  padding-left: 1rem;
}

/* Permet d'habiller proprement le HTML injecté par v-html depuis le RichEditor */
.article-rich-content :deep(p) {
  margin-bottom: 1.25rem;
  text-align: justify;
}
.article-rich-content :deep(strong) {
  color: var(--bs-dark);
  font-weight: 700;
}

/* Styles pour le Skeleton Loader */
.med-skeleton-hero {
  height: 300px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
.med-skeleton-hero.h-150 {
  height: 180px;
}

.med-skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 0.25rem;
}
.med-skeleton-line.short {
  width: 40%;
  height: 1.25rem;
}
.med-skeleton-line.medium {
  width: 70%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>