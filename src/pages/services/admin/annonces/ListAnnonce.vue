<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AnnonceApi } from "@/api/endpoints/services/admin/annonces";
import { useUiStore } from "@/router/ui";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { encryptService } from "@/api/endpoints/encrypt";

// Importation des composants réutilisables du projet
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedInput from "@/components/common/MedInput.vue";
import MedEmptyState from "@/components/common/MedEmptyState.vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";

const uiStore = useUiStore();
const router = useRouter();
const toast = useToast();
const { confirm } = useConfirm();

// --- États réactifs ---
const isLoading = ref(true);
const rawActiveAnnonces = ref([]);
const rawArchivedAnnonces = ref([]);
const pagination = ref({
  total: 0,
  count: 0,
  per_page: 15,
  current_page: 1,
  total_pages: 1
});

const currentTab = ref("actives");
const searchQuery = ref("");

// --- Chargement des données ---
const loadAnnonces = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await AnnonceApi.getAllAnnonces(page, pagination.value.per_page);
    console.log(response);
    rawActiveAnnonces.value = response?.activeAnnonces || [];
    rawArchivedAnnonces.value = response?.archivedAnnonces || [];
    if (response?.pagination) {
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.warning("Impossible de récupérer les annonces.");
    console.error(error);
  } finally {
    isLoading.value = false;
    uiStore.setDashLoading(false); // Arrêt du loader global du dashboard
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    loadAnnonces(page);
  }
};

onMounted(() => {
  loadAnnonces();
});

// --- Action d'archivage / suppression ---
const handleToggleArchive = async (annonceId, isCurrentlyActive) => {
  const actionText = isCurrentlyActive ? "archiver" : "désarchiver";
  const actionVerb = isCurrentlyActive ? "Archiver" : "Désarchiver";

  const request = await confirm({
    type: "warning",
    text: `Voulez-vous vraiment ${actionText} cette annonce ?`,
    confirmButtonText: actionVerb,
    showCancelButton: true,
  });

  if (!request.isConfirmed) {
    return;
  }
  try {
    if (isCurrentlyActive) {
      await AnnonceApi.archiveAnnonce(annonceId);
      toast.success("Annonce archivée avec succès.");
    }
    await loadAnnonces(pagination.value.current_page);
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    toast.error(`Erreur lors de l'action.`);
  }
};

// Naviguer vers la page de création
const goToCreate = () => {
  router.push({ name: "admin-annonces-nouvelle" });
};

const goToDetail = async (id) => {
  const encryptedId = await encryptService.localEncrypt(id);
  router.push({
    name: "admin-annonce-details",
    params: { id: encryptedId },
  });
};

// --- Logique des filtres calculés ---

// Filtrage principal combinant l'onglet sélectionné et la recherche textuelle
const filteredAnnonces = computed(() => {
  let lists;

  // 1. Filtrage par onglet (Status)
  if (currentTab.value === "actives") {
    lists = rawActiveAnnonces.value;
  } else if (currentTab.value === "archived") {
    lists = rawArchivedAnnonces.value;
  } else {
    lists = [...rawActiveAnnonces.value, ...rawArchivedAnnonces.value];
  }

  // 2. Filtrage subsidiaire par recherche textuelle
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    lists = lists.filter(
      (ann) =>
        ann.titre?.toLowerCase().includes(q) ||
        ann.description?.toLowerCase().includes(q)
    );
  }

  return lists ?? [];
});
</script>

<template>
  <div class="container-fluid px-4 py-2 font-body">
    <div
      class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4"
    >
      <div>
        <h2 class="h3 mb-1 fw-bold text-dark font-title">
          Gestion des annonces
        </h2>
        <p class="text-muted small mb-0">
          Consultez, recherchez et archivez les communiqués de la plateforme.
        </p>
      </div>
      <MedButton variant="primary" class="shadow-sm" @click="goToCreate">
        <i class="pi pi-plus me-1"></i> Créer une annonce
      </MedButton>
    </div>

    <div class="row g-3 align-items-center mb-4">
      <div class="col-md-6 col-lg-5">
        <div class="btn-group w-100 bg-light p-1 rounded-lg border shadow-sm">
          <button
            type="button"
            class="btn btn-sm rounded-md transition-fast py-2"
            :class="[
              currentTab === 'all'
                ? 'btn-white shadow-sm fw-bold text-primary'
                : 'btn-light border-0 text-muted',
            ]"
            @click="currentTab = 'all'"
          >
            Toutes
          </button>
          <button
            type="button"
            class="btn btn-sm rounded-md transition-fast py-2"
            :class="[
              currentTab === 'actives'
                ? 'btn-white shadow-sm fw-bold text-primary'
                : 'btn-light border-0 text-muted',
            ]"
            @click="currentTab = 'actives'"
          >
            Actives
            <span
              class="badge bg-primary-light text-primary ms-1 px-2 rounded-pill"
            >
              {{ rawActiveAnnonces.length }}
            </span>
          </button>
          <button
            type="button"
            class="btn btn-sm rounded-md transition-fast py-2"
            :class="[
              currentTab === 'archived'
                ? 'btn-white shadow-sm fw-bold text-primary'
                : 'btn-light border-0 text-muted',
            ]"
            @click="currentTab = 'archived'"
          >
            Archives
            <span
              class="badge bg-secondary-light text-secondary ms-1 px-2 rounded-pill"
            >
              {{ rawArchivedAnnonces.length }}
            </span>
          </button>
        </div>
      </div>

      <div class="col-md-6 col-lg-7">
        <MedInput
          v-model="searchQuery"
          placeholder="Rechercher une annonce par son titre..."
          icon-left="pi pi-search"
          :disabled="isLoading"
          class="mb-0"
        />
      </div>
    </div>

    <!-- ── Squelettes de chargement ─────────────────────────────── -->
    <div v-if="isLoading" class="row g-4" aria-busy="true" aria-label="Chargement des annonces">
      <div
        v-for="n in 4"
        :key="n"
        class="col-md-6 col-xl-3"
      >
        <div class="card h-100 border shadow-sm overflow-hidden">
          <!-- Image de couverture -->
          <MedSkeleton type="rect" height="180px" animation="wave" />

          <div class="card-body p-3 d-flex flex-column gap-3">
            <!-- Titre -->
            <MedSkeleton type="text" :lines="1" width="75%" animation="wave" />
            <!-- Sous-titre / catégorie -->
            <MedSkeleton type="text" :lines="1" width="45%" animation="wave" />

            <!-- Description (2 lignes) -->
            <MedSkeleton type="text" :lines="2" animation="wave" />

            <!-- Meta (date + jours restants) -->
            <div class="d-flex gap-3 mt-auto">
              <MedSkeleton type="text" :lines="1" width="30%" animation="wave" />
              <MedSkeleton type="text" :lines="1" width="30%" animation="wave" />
            </div>

            <!-- Boutons d'action -->
            <div class="d-flex gap-2 pt-2 border-top">
              <MedSkeleton type="rect" height="34px" width="100%" animation="wave" />
              <MedSkeleton type="rect" height="34px" width="44px" animation="wave" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredAnnonces.length === 0" class="py-4">
      <MedEmptyState
        icon="pi pi-folder-open"
        title="Aucune annonce trouvée"
        :description="
          searchQuery
            ? 'Aucun résultat ne correspond à votre recherche.'
            : 'Il n\'y a aucune annonce répertoriée dans cette catégorie pour le moment.'
        "
        action-label="Créer une annonce maintenant"
        action-icon="pi pi-plus"
        bordered
        @action-click="goToCreate"
      />
    </div>

    <div v-else class="row g-4">
      <div
        v-for="annonce in filteredAnnonces"
        :key="annonce.id"
        class="col-md-6 col-xl-3"
      >
        <MedCard
          :title="annonce.titre"
          :subtitle="`Catégorie : ${annonce.categorie}`"
          shadow="sm"
          hover-lift
          body-class="p-0 flex-grow-1 d-flex flex-column"
          class="h-100 shadow-medical"
        >
          <div
            class="position-relative overflow-hidden bg-light border-bottom"
            style="height: 180px"
          >
            <img
              :src="
                annonce.image ||
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500'
              "
              alt="Couverture"
              class="w-100 h-100 object-fit-cover"
            />
            <span
              class="position-absolute top-3 right-3 badge rounded-pill px-3 py-1-5 text-sm font-semibold shadow-sm"
              :class="[
                currentTab === 'archived' ||
                !rawActiveAnnonces.find((a) => a.id === annonce.id)
                  ? 'bg-danger-light text-danger'
                  : 'bg-success-light text-success',
              ]"
              style="top: 12px; right: 12px"
            >
              {{
                currentTab === "archived" ||
                !rawActiveAnnonces.find((a) => a.id === annonce.id)
                  ? "Archivée"
                  : "Active"
              }}
            </span>
          </div>

          <div
            class="p-3 flex-grow-1 d-flex flex-column justify-content-between"
          >
            <div>
              <p class="text-muted text-truncate-2 small mb-3">
                {{ annonce.description }}
              </p>

              <div
                class="d-flex align-items-center gap-3 text-muted extra-small mb-3 font-monospace"
              >
                <span
                  v-if="annonce.joursRestants"
                  class="d-flex align-items-center gap-1"
                >
                  <i class="pi pi-clock"></i> Reste
                  {{ annonce.joursRestants }} j
                </span>
                <span class="d-flex align-items-center gap-1">
                  <i class="pi pi-calendar"></i>
                  {{ annonce.createdAt || "Récemment" }}
                </span>
              </div>
            </div>

            <div class="d-flex gap-2 pt-2 border-top">
              <MedButton
                variant="outline-primary"
                size="sm"
                class="flex-grow-1"
                @click="goToDetail(annonce.id)"
              >
                <i class="pi pi-eye me-1"></i> Consulter
              </MedButton>

              <MedButton
                :variant="
                  currentTab === 'archived' ||
                  !rawActiveAnnonces.find((a) => a.id === annonce.id)
                    ? 'success'
                    : 'danger'
                "
                size="sm"
                class="px-3"
                @click="
                  handleToggleArchive(
                    annonce.id,
                    !!rawActiveAnnonces.find((a) => a.id === annonce.id)
                  )
                "
              >
                <i
                  class="pi"
                  :class="[
                    rawActiveAnnonces.find((a) => a.id === annonce.id)
                      ? 'pi-box'
                      : 'pi-refresh',
                  ]"
                ></i>
              </MedButton>
            </div>
          </div>
        </MedCard>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && pagination.total_pages > 1" class="d-flex justify-content-between align-items-center mt-5 mb-3">
      <span class="text-muted small">
        Affichage de {{ (pagination.current_page - 1) * pagination.per_page + 1 }} à
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} sur {{ pagination.total }} annonces
      </span>
      <nav aria-label="Navigation des pages">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
            <button class="page-link" @click="changePage(pagination.current_page - 1)" aria-label="Précédent">
              <i class="pi pi-angle-left"></i>
            </button>
          </li>
          
          <!-- Un composant de pagination simple (gère jusqu'à 7-10 pages de façon lisible, sinon vous pouvez complexifier) -->
          <li
            v-for="page in pagination.total_pages"
            :key="page"
            class="page-item"
            :class="{ active: pagination.current_page === page }"
          >
            <!-- Afficher la page seulement si on est dans une plage proche (par ex +- 2) ou si c'est la 1ère/dernière page -->
            <button
              v-if="
                page === 1 || 
                page === pagination.total_pages || 
                Math.abs(page - pagination.current_page) <= 2
              "
              class="page-link" 
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <span
              v-else-if="
                page === 2 && pagination.current_page > 4 ||
                page === pagination.total_pages - 1 && pagination.current_page < pagination.total_pages - 3
              "
              class="page-link disabled"
            >
              ...
            </span>
          </li>

          <li class="page-item" :class="{ disabled: pagination.current_page === pagination.total_pages }">
            <button class="page-link" @click="changePage(pagination.current_page + 1)" aria-label="Suivant">
              <i class="pi pi-angle-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

  </div>
</template>

<style scoped>
/* Classe utilitaire pour forcer l'ajustement CSS des images de couverture */
.object-fit-cover {
  object-fit: cover !important;
}

/* Style spécifique pour créer des boutons d'onglets de type switch Apple/Tailwind */
.btn-white {
  background-color: var(--medical-white) !important;
  color: var(--medical-primary) !important;
  border: 1px solid var(--medical-gray-200) !important;
}

/* Couleurs douces pour badges de statut conformes aux variables main.css */
.bg-success-light {
  background-color: var(--medical-secondary-bg) !important;
}
.bg-danger-light {
  background-color: #fef2f2 !important;
}
</style>