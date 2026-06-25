<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
import MedDataTable from "@/components/main/MedDataTable.vue";
import MedicamentsService from "@/api/endpoints/services/admin/medicaments";
import { useUiStore } from "@/router/ui";
import { encryptService } from "@/api/endpoints/encrypt";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";

// --- ÉTATS ---
const medicaments = ref([]);
const pagination = ref(null);
const isLoading = ref(false);
const currentSearch = ref("");
const toast = useToast();
const uiStore = useUiStore();
const { confirm } = useConfirm();

// --- CONFIGURATION DES COLONNES (SECTION ACTIONS RETIRÉE) ---
const colonnesMedicaments = [
  {
    key: "code",
    label: "Code CIP / EAN",
    width: "140px",
    cellClass: "font-monospace text-xs text-muted",
  },
  {
    key: "nom",
    label: "Désignation Commerciale",
    cellClass: "fw-medium",
  },
  {
    key: "nom_generique",
    label: "DCI (Générique)",
  },
  {
    key: "forme",
    label: "Forme & Dosage",
  },
  {
    key: "prix_officiel",
    label: "Prix Officiel (FCFA)",
    cellClass: "font-monospace fw-semibold",
  },
];

// --- CHARGEMENT DES DONNÉES ---
const fetchMedicaments = async (page = 1) => {
  isLoading.value = true;
  try {
    // Note : Si votre API supporte le filtrage par mot-clé,
    // vous pourrez lui passer `currentSearch.value` en paramètre.
    const response = await MedicamentsService.all(page);
    medicaments.value = response.items;
    pagination.value = response.pagination;
  } catch (error) {
    toast.warning(error.message || "Impossible de récupérer la liste des médicaments");
    console.error("Erreur lors de la récupération des médicaments :", error);
  } finally {
    isLoading.value = false;
    uiStore.setDashLoading(false);
  }
};

// --- GESTION DE LA RECHERCHE INTÉGRÉE ---
const handleSearchInput = (query) => {
  currentSearch.value = query;
  // Déclenche une réactualisation à la première page si recherche serveur active
  fetchMedicaments(1);
};

// --- ACTIONS INTERACTIVES ---
const handleRowClick = async (medicament) => {
  const désignation = medicament.nom || "ce médicament";
  const conf = await confirm({
    title: "Redirection",
    text: `Voulez-vous consulter les informations détaillées de : ${désignation} ?`,
    type: "info",
    confirmButtonText: "Oui",
    confirmButtonClass: "btn btn-info px-4",
  });

  if (conf.isConfirmed) {
    // Sécurisation de l'ID via le service de chiffrement de l'application
    const encryptedId = await encryptService.encrypt(medicament.id || medicament);
    router.push({ name: "admin-medicaments-details", params: { id: encryptedId } });
  }
};

const handleAdd = () => {
  router.push({ name: "admin-medicaments-nouvel" });
};

// --- INITIALISATION ---
onMounted(() => {
  fetchMedicaments();
});
</script>

<template>
  <div class="container-fluid py-4">
    <!-- EN-TÊTE DE LA PAGE -->
    <div
      class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4"
    >
      <div>
        <h1 class="h4 fw-bold text-dark mb-1">Répertoire des Médicaments</h1>
        <p class="text-muted small mb-0">
          Gérez le catalogue officiel des produits, les dosages et la tarification réglementée.
        </p>
      </div>
      <div>
        <button
          class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-xs px-3 py-2 text-sm fw-medium"
          @click="handleAdd"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Nouveau médicament</span>
        </button>
      </div>
    </div>

    <!-- TABLEAU RÉUTILISABLE OPTIMISÉ -->
    <MedDataTable
      :columns="colonnesMedicaments"
      :items="medicaments"
      :loading="isLoading"
      :pagination="pagination"
      :selectable="false"
      :searchable="true"
      @page-change="fetchMedicaments"
      @row-click="handleRowClick"
      @search-input="handleSearchInput"
    >
      <!-- SLOT : Code CIP -->
      <template #item(code)="{ value }">
        <span>{{ value || "—" }}</span>
      </template>

      <!-- SLOT : Forme galénique et Dosage -->
      <template #item(forme)="{ item }">
        <div class="d-flex align-items-center flex-wrap gap-1">
          <span
            class="badge bg-body-secondary text-dark-emphasis border text-uppercase px-2 py-1 text-xs font-monospace"
          >
            {{ item.forme || "N/A" }}
          </span>
          <span class="text-muted text-sm">{{ item.dosage }}</span>
        </div>
      </template>

      <!-- SLOT : Tarification réglementée en FCFA -->
      <template #item(prix_officiel)="{ value }">
        <span v-if="!value || Number(value) === 0" class="text-muted fst-italic text-sm">
          Aucun prix fixé
        </span>

        <span v-else class="text-primary fw-bold">
          {{ Number(value).toLocaleString("fr-FR") }}
          <span class="text-xs text-muted fw-normal">FCFA</span>
        </span>
      </template>
    </MedDataTable>
  </div>
</template>

<style scoped>
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.text-xs {
  font-size: 0.78rem !important;
}

.text-sm {
  font-size: 0.88rem !important;
}
</style>
