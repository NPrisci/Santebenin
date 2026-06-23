<script setup>
import MedicamentsService from "@/api/endpoints/services/admin/medicaments";
import { encryptService } from "@/api/endpoints/encrypt";
import router from "@/router";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { ref, onMounted, computed } from "vue";
import { isEmpty } from "@/api/clients/help";

// Importation des composants UI de votre charte graphique
import MedCard from "@/components/common/MedCard.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedEmptyState from "@/components/common/MedEmptyState.vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";

const newId = ref();
const toast = useToast();
const information = ref(null);
const isLoading = ref(true);
const { confirm } = useConfirm();

// Normalisation sécurisée des données de l'API (gère le déballage de l'objet ou de sa clé data)
const medData = computed(() => {
  if (!information.value) return null;
  return information.value.data || information.value;
});

// Règle de gestion : Archivage autorisé uniquement si aucune pharmacie n'utilise le produit
const canArchive = computed(() => {
  const total = medData.value?.nombre_total_pharmacies ?? 0;
  return total === 0;
});

const informations = async (id) => {
  isLoading.value = true;
  try {
    const response = await MedicamentsService.getMedicament(id);
    if (isEmpty(response)) {
      toast.warning("Aucune information trouvée");
      return;
    }
    information.value = response;
  } catch (error) {
    console.error(error);
    toast.warning("Une erreur est survenue lors de la récupération des informations");
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const id = router.currentRoute.value.params.id;
  newId.value = await encryptService.decrypt(id);
  informations(newId.value);
});

// --- ACTIONS ET REDIRECTIONS ---

/**
 * 1. Redirection vers la fiche détaillée de la pharmacie après chiffrement de son ID
 */
const goToPharmacy = async (pharmacyId) => {
  try {
    const encryptedPharmacyId = await encryptService.encrypt(pharmacyId);
    toast.info("Redirection vers la fiche de l'officine...");
    router.push({
      name: "admin-pharmacies-details",
      params: { id: encryptedPharmacyId },
    });
  } catch (error) {
    console.error("Erreur lors de la redirection pharmacie:", error);
    toast.error("Impossible de charger la redirection de cette pharmacie.");
  }
};

/**
 * Redirection vers le formulaire d'édition du médicament courant
 */
const handleEdit = async () => {
  try {
    const encryptedMedId = await encryptService.encrypt(medData.value.id);
    router.push({
      name: "admin-medicaments-edit",
      params: { id: encryptedMedId },
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Erreur lors de la préparation de la modification.");
  }
};

/**
 * 2. Logique d'archivage sécurisée avec blocage préventif
 */
const handleArchive = async () => {
  if (!canArchive.value) {
    await confirm({
      title: "Archivage",
      text: "Ce médicament ne peut pas être archivé car il est actuellement référencé dans le stock d'une ou plusieurs pharmacies.",
      type: "error",
      confirmButtonText: "Archivage",
      confirmButtonClass: "btn btn-danger px-4",
      iconHtml: "pi pi-box",
    });
    return;
  }

  const accept = await confirm({
    title: "Archivage",
    text: "Voulez-vous vraiment archiver ce médicament ? Il sera définitivement retiré du système.",
    type: "warning",
    confirmButtonText: "Archiver",
    confirmButtonClass: "btn btn-danger px-4",
  });

  if (!accept.isConfirmed) {
    return;
  }

  // Si autorisé, exécution de la requête d'archivage
  try {
    const response = await MedicamentsService.delete(medData.value.id);
    if (response.success) {
      toast.success(`${medData.value.nom} a été archivé avec succès.`);
      router.push({ name: "admin-medicaments-liste" });
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Une erreur est survenue durant la procédure d'archivage.");
  }
};

const goBack = () => {
  router.push({ name: "admin-medicaments-liste" });
};
</script>

<template>
  <div class="container-fluid p-2 font-body">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 border-bottom pb-3 mb-4"
    >
      <div class="d-flex align-items-start gap-3 text-truncate flex-grow-1 min-w-0">
        <button
          class="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
          style="width: 38px; height: 38px"
          @click="goBack"
          title="Retourner à la liste"
        >
          <i class="pi pi-arrow-left"></i>
        </button>

        <div v-if="!isLoading && medData" class="min-w-0 w-100">
          <h2 class="h3 mb-1 fw-bold text-dark font-title text-truncate">
            {{ medData.nom }} <span class="text-muted fw-normal fs-5">({{ medData.dosage }})</span>
          </h2>
          <p class="text-muted small mb-0 text-truncate">
            <i class="fas fa-flask me-1"></i> DCI :
            <span class="fw-medium text-secondary">{{ medData.nom_generique }}</span>
          </p>
        </div>
        <div v-else class="w-100" style="min-width: 250px">
          <MedSkeleton height="24px" width="60%" class="mb-1" />
          <MedSkeleton height="14px" width="40%" />
        </div>
      </div>

      <div
        v-if="!isLoading && medData"
        class="d-flex align-items-center gap-2 flex-shrink-0 w-100 w-md-auto justify-content-end"
      >
        <MedButton variant="outline-secondary" icon="pi pi-pencil" size="sm" @click="handleEdit">
          Éditer la fiche
        </MedButton>

        <div
          class="d-inline-block"
          :title="
            !canArchive
              ? 'Archivage impossible : Des pharmacies possèdent ce produit'
              : 'Archiver ce produit'
          "
        >
          <MedButton
            variant="danger"
            icon="pi pi-box"
            size="sm"
            :disabled="!canArchive"
            @click="handleArchive"
          >
            Archiver
          </MedButton>
        </div>
      </div>
    </div>

    <div class="row g-4 align-items-start">
      <template v-if="isLoading">
        <div class="col-lg-5">
          <MedSkeleton height="320px" class="rounded border" />
        </div>
        <div class="col-lg-7">
          <MedSkeleton height="450px" class="rounded border" />
        </div>
      </template>

      <template v-else-if="medData">
        <div class="col-lg-5">
          <MedCard
            title="Fiche technique & Identification"
            icon="pi pi-info-circle"
            shadow="md"
            class="border shadow-sm"
          >
            <div class="d-flex flex-column gap-3">
              <div class="p-3 bg-light rounded border text-center">
                <span
                  class="extra-small text-muted text-uppercase d-block mb-1 fw-semibold tracking-wider"
                  >Code CIP / EAN</span
                >
                <span class="font-monospace text-dark fw-bold h4 tracking-wide">{{
                  medData.code
                }}</span>
              </div>

              <div class="row g-2">
                <div class="col-sm-6">
                  <div class="p-3 border rounded bg-white shadow-xs">
                    <span
                      class="text-muted extra-small d-block fw-medium text-uppercase mb-1"
                      style="font-size: 0.7rem; letter-spacing: 0.03em"
                      >Forme Galénique</span
                    >
                    <span
                      class="badge bg-primary-light text-primary text-xs rounded text-uppercase px-2 py-1"
                    >
                      <i class="fas fa-pills me-1"></i> {{ medData.forme }}
                    </span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="p-3 border rounded bg-white shadow-xs">
                    <span
                      class="text-muted extra-small d-block fw-medium text-uppercase mb-1"
                      style="font-size: 0.7rem; letter-spacing: 0.03em"
                      >Dosage Unitaire</span
                    >
                    <span class="text-dark fw-bold d-block text-sm" style="margin-top: 2px">{{
                      medData.dosage
                    }}</span>
                  </div>
                </div>
              </div>

              <div
                class="p-3 rounded border"
                :class="
                  medData.a_un_prix_officiel
                    ? 'bg-success-subtle border-success'
                    : 'bg-warning-subtle border-warning'
                "
              >
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i
                    :class="
                      medData.a_un_prix_officiel
                        ? 'pi pi-check-circle text-success'
                        : 'pi pi-exclamation-triangle text-warning'
                    "
                  ></i>
                  <span class="fw-semibold text-xs text-dark">Réglementation des prix</span>
                </div>
                <div
                  v-if="medData.a_un_prix_officiel && medData.prix_officiel"
                  class="h3 font-monospace fw-bold text-success mb-0"
                >
                  {{ medData.prix_officiel }} <span class="fs-6 fw-normal">FCFA</span>
                </div>
                <div v-else class="text-secondary small italic mb-0">
                  Aucun prix indicatif officiel n'est enregistré par le Ministère pour cette
                  référence.
                </div>
              </div>

              <div class="pt-2 border-top extra-small text-muted d-flex justify-content-between">
                <span
                  >Créé le: <b>{{ medData.created_at }}</b></span
                >
                <span
                  >Mise à jour: <b>{{ medData.last_update }}</b></span
                >
              </div>
            </div>
          </MedCard>
        </div>

        <div class="col-lg-7">
          <MedCard
            :title="`Disponibilité Officines (${medData.nombre_total_pharmacies})`"
            icon="pi pi-building"
            shadow="md"
            class="border shadow-sm"
          >
            <div
              v-if="medData.nombre_total_pharmacies > 0"
              class="alert alert-info py-2 px-3 small border-0 mb-3 d-flex align-items-center gap-2"
            >
              <i class="pi pi-lock-open text-info"></i>
              <span
                >Ce produit est actif. Le bouton d'archivage restera verrouillé tant qu'une officine
                le détient.</span
              >
            </div>

            <div
              v-if="medData.pharmacies && medData.pharmacies.length > 0"
              class="med-pharmacies-list overflow-y-auto"
              style="max-height: 400px"
            >
              <div
                v-for="pharma in medData.pharmacies"
                :key="pharma.pharmacie_id"
                class="pharmacie-item-clickable p-3 mb-2 border rounded transition-fast d-flex align-items-center justify-content-between bg-white"
                role="button"
                @click="goToPharmacy(pharma.pharmacie_id)"
              >
                <div class="d-flex align-items-center gap-3 text-truncate flex-grow-1 pe-2">
                  <div
                    class="pharma-icon bg-light text-secondary rounded px-2-5 py-2 d-flex align-items-center justify-content-center"
                  >
                    <i class="pi pi-building font-semibold text-md"></i>
                  </div>
                  <div class="text-truncate">
                    <span class="text-dark fw-bold d-block text-sm text-truncate mb-0-5">{{
                      pharma.nom
                    }}</span>
                    <span class="text-muted extra-small d-block font-monospace">
                      <i class="pi pi-phone me-1 text-xs"></i>
                      {{ pharma.telephone || "Non renseigné" }}
                    </span>
                  </div>
                </div>

                <div class="d-flex flex-column align-items-end flex-shrink-0 text-end gap-1 ms-2">
                  <span
                    class="badge rounded-pill text-xs px-2 py-0-5"
                    :class="
                      pharma.quantite_en_stock <= 5
                        ? 'bg-danger-subtle text-danger'
                        : 'bg-success-subtle text-success'
                    "
                  >
                    {{ pharma.quantite_en_stock }} en stock
                  </span>
                  <span class="text-dark font-monospace text-xs fw-bold">
                    {{ pharma.prix_applique ? pharma.prix_applique + " F" : "Prix libre" }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="py-4">
              <MedEmptyState
                icon="pi pi-search-plus"
                title="Aucune officine rattachée"
                description="Ce produit médical n'est actuellement cartographié dans aucune pharmacie du réseau national."
                size="md"
              />
            </div>
          </MedCard>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Style des lignes pharmacies cliquables (Élimine le besoin de scroll horizontal) */
.pharmacie-item-clickable {
  border-color: var(--bs-border-color) !important;
  cursor: pointer;
  user-select: none;
}

.pharmacie-item-clickable:hover {
  border-color: var(--bs-primary) !important;
  background-color: rgba(var(--bs-primary-rgb), 0.03) !important;
  transform: translateX(4px);
  box-shadow: var(--bs-box-shadow-sm) !important;
}

.pharma-icon {
  min-width: 38px;
  min-height: 38px;
}

.extra-small {
  font-size: 0.75rem !important;
}
.text-xs {
  font-size: 0.82rem !important;
}
.mb-0-5 {
  margin-bottom: 0.15rem !important;
}
.px-2-5 {
  padding-left: 0.65rem !important;
  padding-right: 0.65rem !important;
}
.bg-primary-light {
  background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
}
.tracking-wide {
  letter-spacing: 0.06em;
}
.transition-fast {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
