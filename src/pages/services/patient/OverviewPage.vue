<script setup>
import { ref, computed, onMounted } from "vue";
import { PatientOverviewService } from "@/api/endpoints/services/patient/overview";
import MedQrCode from "@/components/common/MedQrCode.vue";
import { useUiStore } from "@/router/ui";

// --- ÉTATS DES DONNÉES (Provenant d'overview.js) ---
const informations = ref(null);
const medicalInfos = ref(null);
const annonces = ref({ conseil: "", mainAnnonce: null, autresAnnonces: [] });
const vitalSigns = ref({ historique: [], graphiques: {}, date: null });
const appointments = ref([]);
const trusts = ref({ tutores: [], protegees: [] });

// --- ÉTATS TECHNIQUES ---
const ui = useUiStore();
const isLoading = ref(true);
const qrToken = ref("");
const isQrLoading = ref(false);
const activeGraphTab = ref("poids"); // 'poids' ou 'tension'

// --- INDEX DE NAVIGATION CHRONOLOGIQUE DES CONSTANTES ---
// L'index 0 correspond au relevé le plus récent (trié par l'API)
const activeHistoryIndex = ref(0);

// --- CHARGEMENT INITIAL DES DONNÉES DE LA PAGE ---
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // Exécution parallèle des requêtes pour une performance maximale
    const [infoRes, medRes, annRes, vitalRes, appRes, trustRes] = await Promise.all([
      PatientOverviewService.informations(),
      PatientOverviewService.medicalInfos(),
      PatientOverviewService.annoncesData(),
      PatientOverviewService.vitalSignData(),
      PatientOverviewService.appointmentsData(),
      PatientOverviewService.trustsData(),
    ]);

    if (infoRes) informations.value = infoRes;
    if (medRes) medicalInfos.value = medRes;
    if (annRes) annonces.value = annRes;
    if (vitalRes) vitalSigns.value = vitalRes;
    if (appRes) appointments.value = appRes;
    if (trustRes) trusts.value = trustRes;

    // Génération automatique du QR Code au chargement de la page
    await handleRefreshQr();
  } catch (error) {
    console.error("Erreur globale lors de la récupération du dashboard :", error);
  } finally {
    isLoading.value = false;
    ui.setMainLoading(false);
  }
};

// --- GESTION DU QR CODE D'URGENCE ---
const handleRefreshQr = async () => {
  isQrLoading.value = true;
  try {
    const response = await PatientOverviewService.gettoken();
    if (response && response.data) {
      qrToken.value = response.data; // Affectation du token au composant MedQrCode
    }
  } catch (error) {
    console.warn("Impossible de régénérer le token d'urgence");
  } finally {
    isQrLoading.value = false;
  }
};

// --- CALCULATEURS DYNAMIQUES POUR LA NAVIGATION TEMPORELLE ---
// Détermine si un historique existe pour la navigation
const hasHistory = computed(() => vitalSigns.value?.historique?.length > 0);

// Relevé actif actuellement sélectionné par l'utilisateur
const activeRecord = computed(() => {
  if (!hasHistory.value) return null;
  return vitalSigns.value.historique[activeHistoryIndex.value];
});

// Fonctions de changement de date (Suivant / Précédent)
const nextRecord = () => {
  if (activeHistoryIndex.value > 0) activeHistoryIndex.value--;
};
const prevRecord = () => {
  if (activeHistoryIndex.value < vitalSigns.value.historique.length - 1) {
    activeHistoryIndex.value++;
  }
};

// Détermination des couleurs de statut Bootstrap pour les widgets
const getBadgeStatusClass = (status) => {
  if (status === "normal") return "bg-success-subtle text-success border-success-subtle";
  if (status === "warning") return "bg-warning-subtle text-warning border-warning-subtle";
  if (status === "danger") return "bg-danger-subtle text-danger border-danger-subtle";
  return "bg-light text-muted";
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="container-fluid py-4 page-patient-overview">
    <div
      v-if="isLoading"
      class="d-flex flex-column align-items-center justify-content-center my-5 py-5"
    >
      <i class="pi pi-spinner pi-spin text-primary fs-1 mb-3"></i>
      <p class="text-muted fw-medium">Chargement de votre espace santé global...</p>
    </div>

    <div v-else class="fade-in">
      <div
        class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg position-relative overflow-hidden"
      >
        <div class="row align-items-center g-3">
          <div class="col-12 col-md-5 d-flex align-items-center gap-3">
            <div class="position-relative">
              <img
                :src="informations?.photo || '/assets/images/default-avatar.png'"
                class="rounded-circle border border-2 border-white shadow-sm object-fit-cover"
                style="width: 85px; height: 85px"
                alt="Avatar"
              />
            </div>
            <div>
              <span
                class="badge bg-primary-subtle text-primary mb-1 rounded-pill text-xs px-2 py-1 fw-semibold"
                >Espace Patient</span
              >
              <h4 class="mb-1 text-dark fw-bold tracking-tight text-title">
                {{ informations?.nom }}
              </h4>
              <p class="text-xs text-muted mb-0 font-monospace">
                NPI :
                <span class="fw-semibold text-secondary">{{
                  informations?.npi || "Non renseigné"
                }}</span>
              </p>
              <p class="text-xs text-muted mb-0">
                {{ informations?.age }} ans &middot; {{ informations?.telephone }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4 border-start-md px-md-4">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div
                class="badge bg-danger text-white rounded-circle fs-5 d-flex align-items-center justify-content-center"
                style="width: 36px; height: 36px"
              >
                {{ medicalInfos?.group_sanguin || "?" }}
              </div>
              <div>
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold">
                  Groupe Sanguin
                </div>
                <div class="text-xs text-dark fw-medium">Information vitale d'urgence</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-xxs text-muted fw-bold text-uppercase mb-1">
                Allergies déclarées :
              </div>
              <div class="d-flex flex-wrap gap-1" v-if="medicalInfos?.allergies?.length">
                <span
                  v-for="(all, idx) in medicalInfos.allergies"
                  :key="idx"
                  class="badge text-xxs bg-danger-subtle text-danger border border-danger-subtle rounded-sm"
                >
                  {{ all.libelle }} ({{ all.severite }})
                </span>
              </div>
              <span v-else class="text-xs text-muted fst-italic">Aucune allergie connue</span>
            </div>
          </div>

          <div
            class="col-12 col-md-3 d-flex flex-column align-items-center justify-content-md-end text-center"
          >
            <MedQrCode :value="qrToken" :loading="isQrLoading"/>
            <button
              @click="handleRefreshQr"
              class="btn btn-link text-xs text-primary mt-2 p-0 decoration-none d-flex align-items-center gap-1"
              :disabled="isQrLoading"
            >
              <i class="pi pi-refresh" :class="{ 'pi-spin': isQrLoading }"></i> Régénérer le code
            </button>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div
            v-if="annonces?.conseil"
            class="card border-0 bg-primary-bg p-3 mb-4 rounded d-flex flex-row align-items-start gap-3"
          >
            <div class="text-primary fs-4 mt-1">
              <i class="pi pi-sparkles"></i>
            </div>
            <div>
              <h6 class="text-sm fw-bold text-primary-dark mb-1">Conseil Prévention du jour</h6>
              <p class="text-xs text-dark lh-base mb-0">{{ annonces.conseil }}</p>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h5 class="mb-0 text-dark fw-bold text-title text-md">Suivi de vos constantes</h5>
                <p class="text-xs text-muted mb-0">
                  Parcourez vos différents enregistrements chronologiques
                </p>
              </div>

              <div
                v-if="hasHistory"
                class="d-flex align-items-center gap-2 border rounded p-1 bg-light"
              >
                <button
                  @click="prevRecord"
                  class="btn btn-sm btn-light border-0"
                  :disabled="activeHistoryIndex >= vitalSigns.historique.length - 1"
                  title="Enregistrement plus ancien"
                >
                  <i class="pi pi-chevron-left text-xs"></i>
                </button>
                <span class="text-xs px-2 font-monospace fw-bold text-secondary">
                  {{ activeRecord?.date }}
                  <span
                    class="badge bg-secondary ms-1 text-xxs py-0-5"
                    style="font-family: var(--body-family)"
                  >
                    {{ activeRecord?.source === "medecin" ? "Médical" : "Patient" }}
                  </span>
                </span>
                <button
                  @click="nextRecord"
                  class="btn btn-sm btn-light border-0"
                  :disabled="activeHistoryIndex === 0"
                  title="Enregistrement plus récent"
                >
                  <i class="pi pi-chevron-right text-xs"></i>
                </button>
              </div>
            </div>

            <div class="row g-2" v-if="activeRecord">
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                <div
                  class="border rounded p-3 text-center h-100 bg-white transition-base border-light-subtle"
                >
                  <div class="text-muted text-xxs text-uppercase fw-medium mb-1">Poids</div>
                  <div class="fs-4 fw-bold font-monospace text-dark mb-1">
                    {{ activeRecord.poids || "—"
                    }}<span class="text-xs text-muted fw-normal ms-1">kg</span>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                <div
                  class="border rounded p-3 text-center h-100 bg-white transition-base"
                  :class="getBadgeStatusClass(activeRecord.statuts?.tension_systolique)"
                >
                  <div class="text-xxs text-uppercase fw-medium mb-1">Tension</div>
                  <div class="fs-4 fw-bold font-monospace mb-1">
                    {{ activeRecord.tension_arterielle || "—"
                    }}<span class="text-xs text-muted fw-normal ms-1">mmHg</span>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                <div
                  class="border rounded p-3 text-center h-100 bg-white transition-base"
                  :class="getBadgeStatusClass(activeRecord.statuts?.glycemie)"
                >
                  <div class="text-xxs text-uppercase fw-medium mb-1">Glycémie</div>
                  <div class="fs-4 fw-bold font-monospace mb-1">
                    {{ activeRecord.glycemie || "—"
                    }}<span class="text-xs text-muted fw-normal ms-1">g/L</span>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                <div
                  class="border rounded p-3 text-center h-100 bg-white transition-base"
                  :class="getBadgeStatusClass(activeRecord.statuts?.temperature)"
                >
                  <div class="text-xxs text-uppercase fw-medium mb-1">Température</div>
                  <div class="fs-4 fw-bold font-monospace mb-1">
                    {{ activeRecord.temperature || "—"
                    }}<span class="text-xs text-muted fw-normal ms-1">°C</span>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                <div
                  class="border rounded p-3 text-center h-100 bg-white transition-base"
                  :class="getBadgeStatusClass(activeRecord.statuts?.pouls)"
                >
                  <div class="text-xxs text-uppercase fw-medium mb-1">Pouls</div>
                  <div class="fs-4 fw-bold font-monospace mb-1">
                    {{ activeRecord.pouls || "—"
                    }}<span class="text-xs text-muted fw-normal ms-1">bpm</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 border border-dashed rounded bg-light-subtle">
              <p class="text-xs text-muted mb-0">
                Aucun enregistrement disponible de vos constantes.
              </p>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
              <h5 class="mb-0 text-dark fw-bold text-title text-md">Analyses & Évolutions</h5>
              <div class="btn-group border rounded p-0-5 bg-light" role="group">
                <button
                  type="button"
                  class="btn btn-sm px-3 rounded-sm border-0 transition-fast"
                  :class="
                    activeGraphTab === 'poids'
                      ? 'bg-white shadow-xs text-primary fw-bold'
                      : 'text-muted'
                  "
                  @click="activeGraphTab = 'poids'"
                >
                  Poids
                </button>
                <button
                  type="button"
                  class="btn btn-sm px-3 rounded-sm border-0 transition-fast"
                  :class="
                    activeGraphTab === 'tension'
                      ? 'bg-white shadow-xs text-primary fw-bold'
                      : 'text-muted'
                  "
                  @click="activeGraphTab = 'tension'"
                >
                  Tension Artérielle
                </button>
              </div>
            </div>

            <div class="w-100">
              <MedGraph
                :type="activeGraphTab"
                :data="vitalSigns?.graphiques ? vitalSigns.graphiques[activeGraphTab] : []"
                :height="260"
              />
            </div>
          </div>

          <div class="mb-2">
            <h5 class="text-dark fw-bold text-title text-md mb-3">
              Informations de Prévention & Santé
            </h5>

            <div
              v-if="annonces?.mainAnnonce"
              class="card border-0 shadow-sm bg-white overflow-hidden mb-3 rounded-lg"
            >
              <div class="row g-0">
                <div class="col-md-4 bg-light" style="min-height: 160px">
                  <img
                    :src="annonces.mainAnnonce.imageUrl"
                    class="img-fluid w-100 h-100 object-fit-cover"
                    alt="Couverture"
                  />
                </div>
                <div class="col-md-8 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span
                      class="badge bg-danger-subtle text-danger text-xxs mb-2 border border-danger-subtle rounded-sm"
                    >
                      {{ annonces.mainAnnonce.categorie }}
                    </span>
                    <h6 class="fw-bold text-dark text-base mb-2">
                      {{ annonces.mainAnnonce.title }}
                    </h6>
                    <p class="text-xs text-muted text-truncate-3 lh-relaxed">
                      {{ annonces.mainAnnonce.description }}
                    </p>
                  </div>
                  <button
                    class="btn btn-link text-primary text-xs text-start p-0 decoration-none fw-medium mt-2"
                  >
                    Lire l'article complet <i class="pi pi-arrow-right ms-1 text-xxs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="row g-3" v-if="annonces?.autresAnnonces?.length">
              <div
                class="col-12 col-md-6"
                v-for="annonce in annonces.autresAnnonces"
                :key="annonce.id"
              >
                <div
                  class="card border-light shadow-xs bg-white h-100 p-3 rounded d-flex flex-column justify-content-between"
                >
                  <div>
                    <span
                      class="text-xxs fw-bold text-secondary text-uppercase tracking-wider mb-1 d-block"
                    >
                      {{ annonce.categorie }}
                    </span>
                    <h6 class="text-sm fw-bold text-dark text-truncate-2 mb-2">
                      {{ annonce.title }}
                    </h6>
                    <p class="text-xs text-muted text-truncate-2 mb-0 lh-base">
                      {{ annonce.content }}
                    </p>
                  </div>
                  <div class="border-top mt-3 pt-2 text-start">
                    <span class="text-primary text-xs cursor-pointer fw-medium">Consulter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card border-0 bg-secondary-bg p-4 mb-4 rounded-lg shadow-sm text-center">
            <div
              class="badge bg-secondary text-white rounded-circle fs-4 mb-2 d-inline-flex align-items-center justify-content-center"
              style="width: 44px; height: 44px"
            >
              <i class="pi pi-heart"></i>
            </div>
            <h6 class="fw-bold text-secondary-dark text-base mb-1">Prenez soin de vous</h6>
            <p class="text-xs text-muted mb-3 px-2 lh-base">
              Renseignez vos constantes du jour pour alimenter votre courbe d'analyse de santé.
            </p>
            <button class="btn btn-secondary w-100 text-xs py-2 fw-semibold rounded shadow-xs">
              <i class="pi pi-plus me-1 text-xxs"></i> Enregistrer mes constantes
            </button>
          </div>

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">Prochains Rendez-vous</h5>

            <div class="med-appointment-timeline ps-2" v-if="appointments?.length">
              <div
                class="d-flex gap-3 mb-3 position-relative med-timeline-item"
                v-for="rdv in appointments"
                :key="rdv.id"
              >
                <div
                  class="bg-light rounded text-center d-flex flex-column justify-content-center border"
                  style="width: 50px; height: 52px; min-width: 50px"
                >
                  <span class="fs-5 fw-bold font-monospace text-dark lh-1">{{ rdv.date }}</span>
                  <span
                    class="text-xxs text-uppercase text-muted fw-semibold"
                    style="font-size: 0.6rem !important"
                    >{{ rdv.month }}</span
                  >
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center justify-content-between mb-0-5">
                    <h6 class="text-xs fw-bold text-dark mb-0">{{ rdv.doctorName }}</h6>
                    <span class="text-xxs badge bg-light text-secondary font-monospace border">{{
                      rdv.time
                    }}</span>
                  </div>
                  <p class="text-xxs text-muted mb-0 fw-medium">{{ rdv.speciality }}</p>
                  <p class="text-xxs text-muted mb-0">
                    <i class="pi pi-building text-xxs me-1"></i>{{ rdv.establishment }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 border border-dashed rounded bg-light-subtle">
              <i class="pi pi-calendar text-muted fs-4 mb-2 d-block"></i>
              <p class="text-xs text-muted mb-0">Aucun rendez-vous planifié</p>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">Réseau de Confiance</h5>

            <div class="mb-3">
              <div class="text-xxs fw-bold text-muted text-uppercase mb-2">
                Mes Tuteurs (Veillent sur moi)
              </div>
              <div class="d-flex flex-column gap-2" v-if="trusts?.tutores?.length">
                <div
                  v-for="tuteur in trusts.tutores"
                  :key="tuteur.id"
                  class="d-flex align-items-center justify-content-between p-2 border border-light rounded bg-light-subtle"
                >
                  <div class="d-flex align-items-center gap-2">
                    <img
                      :src="tuteur.photo_url || '/assets/images/default-avatar.png'"
                      class="rounded-circle border"
                      style="width: 28px; height: 28px; object-fit: cover"
                    />
                    <div>
                      <div class="text-xs fw-semibold text-dark">{{ tuteur.nom }}</div>
                      <div class="text-xxs text-muted lh-1">{{ tuteur.relation }}</div>
                    </div>
                  </div>
                  <span
                    class="badge text-xxs"
                    :class="
                      tuteur.status === 'valide'
                        ? 'bg-success-subtle text-success'
                        : 'bg-warning-subtle text-warning'
                    "
                  >
                    {{ tuteur.status === "valide" ? "Actif" : "En attente" }}
                  </span>
                </div>
              </div>
              <div v-else class="text-xxs text-muted fst-italic ps-1">Aucun tuteur rattaché</div>
            </div>

            <div>
              <div class="text-xxs fw-bold text-muted text-uppercase mb-2">
                Mes Protégés (Sous ma garde)
              </div>
              <div class="d-flex flex-column gap-2" v-if="trusts?.protegees?.length">
                <div
                  v-for="p in trusts.protegees"
                  :key="p.id"
                  class="d-flex align-items-center justify-content-between p-2 border border-light rounded bg-light-subtle"
                >
                  <div class="d-flex align-items-center gap-2">
                    <img
                      :src="p.photo_url || '/assets/images/default-avatar.png'"
                      class="rounded-circle border"
                      style="width: 28px; height: 28px; object-fit: cover"
                    />
                    <div>
                      <div class="text-xs fw-semibold text-dark">{{ p.nom }}</div>
                      <div class="text-xxs text-muted lh-1">{{ p.relation }}</div>
                    </div>
                  </div>
                  <span class="badge text-xxs bg-success-subtle text-success">Protégé</span>
                </div>
              </div>
              <div v-else class="text-xxs text-muted fst-italic ps-1">Aucun protégé rattaché</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Alignements & Bordures thématiques */
.border-start-md {
  @media (min-width: 768px) {
    border-left: 1px solid var(--medical-gray-200, #dee2e6) !important;
  }
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Timeline épurée pour les RDV */
.med-appointment-timeline {
  border-left: 2px dashed var(--medical-gray-200, #e2e8f0);
}
.med-timeline-item::before {
  content: "";
  position: absolute;
  left: -13px;
  top: 20px;
  width: 8px;
  height: 8px;
  background-color: var(--medical-primary, #0284c7);
  border-radius: 50%;
}

.bg-primary-bg {
  background-color: var(--medical-primary-bg, #f0f9ff) !important;
}
.bg-secondary-bg {
  background-color: var(--medical-secondary-bg, #f0fdfa) !important;
}
.text-primary-dark {
  color: var(--medical-primary-dark, #0369a1) !important;
}
.text-secondary-dark {
  color: var(--medical-secondary-dark, #0f766e) !important;
}

/* Micro utilitaires typographiques */
.text-xxs {
  font-size: 0.72rem !important;
}
.text-xs {
  font-size: 0.82rem !important;
}
.text-sm {
  font-size: 0.9rem !important;
}
.text-base {
  font-size: 1rem !important;
}
.text-md {
  font-size: 1.15rem !important;
}
.py-0-5 {
  padding-top: 0.15rem !important;
  padding-bottom: 0.15rem !important;
}
.p-0-5 {
  padding: 0.2rem !important;
}

.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
