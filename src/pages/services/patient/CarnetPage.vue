<template>
  <div class="container-fluid py-4 page-patient-carnet">

    <div class="fade-in">
      <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg position-relative overflow-hidden">

        <div v-if="isLoading" class="row align-items-center g-3">
          <div class="col-12 col-md-8 d-flex align-items-center gap-3">
            <MedSkeleton type="circle" size="85px" />
            <div class="flex-grow-1">
              <MedSkeleton type="text" width="35%" class="mb-2" />
              <MedSkeleton type="text" width="60%" class="mb-2" />
              <MedSkeleton type="text" width="45%" />
            </div>
          </div>
          <div class="col-12 col-md-4 d-flex justify-content-md-end">
            <MedSkeleton type="rect" width="120px" height="45px" class="rounded" />
          </div>
        </div>

        <div v-else class="row align-items-center g-3">
          <div class="col-12 col-md-6 d-flex align-items-center gap-3">
            <div class="position-relative">
              <img :src="profile?.photo || '/assets/images/default-avatar.png'"
                class="rounded-circle border border-2 border-white shadow-sm object-fit-cover"
                style="width: 85px; height: 85px" alt="Avatar Patient" />
            </div>
            <div>
              <span class="badge bg-primary-subtle text-primary mb-1 rounded-pill text-xs px-2 py-1 fw-semibold">
                Dossier Patient Actif
              </span>
              <h4 class="mb-1 text-dark fw-bold tracking-tight text-title">
                {{ profile?.prenom }} {{ profile?.nom }}
              </h4>
              <p class="text-xs text-muted mb-0 font-monospace">
                NPI : <span class="fw-semibold text-secondary">{{ profile?.npi || "Non renseigné" }}</span>
              </p>
              <p class="text-xs text-muted mb-0">
                {{ profile?.age }} ans &middot; {{ profile?.sexe }} &middot; Né(e) le {{ profile?.naissance }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-6 d-flex flex-column justify-content-center">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div
                class="badge bg-success text-white rounded-circle fs-4 d-flex align-items-center justify-content-center shadow-sm font-monospace"
                style="width: 52px; height: 52px; min-width: 52px">
                {{ profile?.groupe_sanguin || "?" }}
              </div>
              <div class="text-start">
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold">Groupe Sanguin</div>
              </div>
            </div>
            <div class="text-xs text-muted text-md-end">
              <div><i class="pi pi-phone text-xxs me-1"></i>{{ profile?.phone || 'Non renseigné' }}</div>
              <div><i class="pi pi-envelope text-xxs me-1"></i>{{ profile?.contact_email || 'Non renseigné' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">

        <div class="col-12 col-lg-8">

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="mb-3">
              <h5 class="mb-1 text-dark fw-bold text-title text-md">
                <i class="pi pi-heart-fill text-danger me-2"></i>Derniers indicateurs de santé
              </h5>
              <p class="text-xs text-muted mb-0">Vos constantes vitales issues des derniers bilans.</p>
            </div>

            <div v-if="isLoading" class="row g-2">
              <div class="col-6 col-md-3" v-for="i in 4" :key="i">
                <div class="border rounded p-3 text-center bg-white border-light-subtle">
                  <MedSkeleton type="text" width="45%" class="mx-auto mb-2" />
                  <MedSkeleton type="rect" height="28px" width="70%" class="mx-auto" />
                </div>
              </div>
            </div>

            <div v-else class="row g-3">
              <div class="col-6 col-md-3" v-for="(ind, key) in indications" :key="key">
                <div class="border rounded p-2 text-center h-100 bg-white shadow-xs transition-base"
                  :class="ind.classe_couleur">
                  <div class="d-flex justify-content-center mb-2">
                    <i :class="[ind.icone_pi ? ind.icone_pi : ind.icone_fa, 'fs-4 text-primary opacity-75']"></i>
                  </div>
                  <div class="text-muted text-xxs text-uppercase fw-semibold mb-1">{{ ind.titre }}</div>
                  <div class="mb-1">
                    {{ ind.valeur_complete }}
                  </div>
                  <span class="badge text-xxs bg-white text-dark border px-2 py-0-5 rounded-pill fw-medium">
                    {{ ind.statut_label }}
                  </span>
                  <div v-if="ind.date" class="text-xxs text-muted mt-2">
                    Mise à jour : {{ ind.date }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="mb-3">
              <h5 class="mb-1 text-dark fw-bold text-title text-md">
                <i class="pi pi-capsule text-primary me-2"></i>Traitements Pharmacologiques Actifs
              </h5>
              <p class="text-xs text-muted mb-0">Médications en cours et posologies prescrites.</p>
            </div>

            <div v-if="isLoading" class="d-flex flex-column gap-2">
              <MedSkeleton type="rect" height="65px" v-for="i in 2" :key="i" class="rounded" />
            </div>

            <div v-else-if="traitements && traitements.length">
              <div class="list-group list-group-flush mb-3">
                <div v-for="trait in traitements" :key="trait.id" class="list-group-item px-0 py-3 border-light-subtle">
                  <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                    <div>
                      <h6 class="fw-bold text-dark text-sm mb-1">{{ trait.titre }}</h6>
                      <p class="text-xs text-muted mb-1">
                        <strong>Posologie :</strong> {{ trait.posologie }}
                      </p>
                      <p class="text-xs text-secondary mb-0">
                        <i class="pi pi-info-circle text-xxs me-1 text-info"></i>{{ trait.instructions }}
                      </p>
                    </div>
                    <span
                      class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle text-xxs px-2 py-1 rounded-sm">
                      <i class="pi pi-clock me-1"></i>{{ trait.restants }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="border-top pt-3 d-flex justify-content-end">
                <button @click="handleConsultAllTreatments"
                  class="btn btn-link text-primary text-xs p-0 decoration-none fw-semibold d-flex align-items-center gap-1">
                  Consulter la liste complète <i class="pi pi-arrow-right text-xxs"></i>
                </button>
              </div>
            </div>

            <div v-else>
              <MedEmptyState icon="pi pi-exclamation-circle" size="sm" title="Aucun traitement"
                description="Aucune médication active n'est enregistrée dans votre carnet pour le moment. Vous êtes en parfaite santé !"
                :bordered="true" />
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 rounded-lg mb-4">
            <div class="mb-3">
              <h5 class="mb-1 text-dark fw-bold text-title text-md">
                <i class="pi pi-history text-primary me-2"></i>Parcours Chronologique & Événements
              </h5>
              <p class="text-xs text-muted mb-0">Historique complet de vos interactions médicales. Cliquez sur un
                événement pour ouvrir les détails.</p>
            </div>

            <div v-if="isLoading">
              <MedSkeleton type="rect" height="75px" v-for="i in 3" :key="i" class="rounded mb-2" />
            </div>

            <div v-else-if="timelineData && timelineData.length">
              <MedTimeline :events="timelineData">
                <template #content="{ item: event }">
                  <div class="p-2 cursor-pointer font-sans" @click="handleOpenEventModal(event)">

                    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                      <span
                        class="badge bg-primary-subtle text-primary text-xxs px-2 py-1 rounded-pill fw-semibold text-uppercase">
                        {{ event.type || 'Consultation' }}
                      </span>
                      <span class="text-xxs font-monospace text-muted fw-medium">
                        {{ event.date ?? '--' }}
                      </span>
                    </div>

                    <h6 class="text-sm fw-bold text-dark mb-1">
                      {{ event.responsable?.nom || 'Médecin non spécifié' }}
                    </h6>

                    <div class="text-xxs text-muted mb-2 d-flex align-items-center gap-1">
                      <i class="pi pi-building text-secondary text-xxs"></i>
                      <span>{{ event.structure }}</span>
                    </div>

                    <p class="text-xs text-secondary mb-0 lh-base fst-italic text-truncate-2">
                      {{ event.resume }}
                    </p>

                    <div class="text-end text-xxs text-primary mt-2 fw-semibold">
                      <i class="pi pi-search text-xxs me-1"></i>Voir le résumé complet
                    </div>

                  </div>
                </template>
              </MedTimeline>

              <div class="border-top pt-3 mt-3 d-flex justify-content-end">
                <button @click="handleViewFullTimeline"
                  class="btn btn-link text-primary text-xs p-0 decoration-none fw-semibold d-flex align-items-center gap-1">
                  Voir mon parcours complet <i class="pi pi-arrow-right text-xxs"></i>
                </button>
              </div>
            </div>
            <div v-else>
              <MedEmptyState icon="pi pi-calendar-minus" size="sm" title="Fil chronologique vide"
                description="Aucun événement n'est présent dans votre historique de santé." :bordered="true" />
            </div>
          </div>

        </div>

        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">
              <i class="pi pi-exclamation-triangle text-danger me-2"></i>Antécédents & Facteurs de Risque
            </h5>

            <div v-if="isLoading" class="d-flex flex-column gap-2">
              <MedSkeleton type="rect" height="40px" v-for="i in 3" :key="i" class="rounded" />
            </div>

            <div
              v-else-if="antecedents.allergies.length || antecedents.maladies.length || antecedents.medicaments.length">

              <!-- Section Allergies -->
              <div v-if="antecedents.allergies.length" class="mb-3">
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold mb-2">Allergies</div>
                <div v-for="all in antecedents.allergies" :key="all.id"
                  class="p-2 rounded bg-danger-subtle text-danger-emphasis border border-danger-subtle mb-1 text-xs">
                  <i class="pi pi-ban me-1 text-xxs"></i> {{ all.note }}
                </div>
              </div>

              <!-- Section Maladies Chroniques -->
              <div v-if="antecedents.maladies.length" class="mb-3">
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold mb-2">Affections Chroniques</div>
                <div v-for="mal in antecedents.maladies" :key="mal.id"
                  class="p-2 rounded bg-warning-subtle text-warning-emphasis border border-warning-subtle mb-1 text-xs">
                  <i class="pi pi-heart me-1 text-xxs"></i> {{ mal.note }}
                </div>
              </div>

              <!-- Section Médicaments à risque -->
              <div v-if="antecedents.medicaments.length">
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold mb-2">Vigilance Médicamenteuse
                </div>
                <div v-for="med in antecedents.medicaments" :key="med.id"
                  class="p-2 rounded bg-info-subtle text-info-emphasis border border-info-subtle mb-1 text-xs">
                  <i class="pi pi-info-circle me-1 text-xxs"></i> {{ med.note }}
                </div>
              </div>

            </div>

            <div v-else>
              <div class="p-3 bg-light rounded text-center text-xs text-muted">
                Aucun antécédent médical à risque déclaré.
              </div>
            </div>
          </div>
          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">
              <i class="pi pi-calendar text-primary me-2"></i>Prochains Rendez-vous
            </h5>

            <div v-if="isLoading" class="d-flex flex-column gap-3">
              <div class="d-flex gap-3" v-for="i in 2" :key="i">
                <MedSkeleton type="rect" width="52px" height="54px" class="rounded" />
                <div class="flex-grow-1">
                  <MedSkeleton type="text" width="60%" class="mb-2" />
                  <MedSkeleton type="text" width="80%" />
                </div>
              </div>
            </div>

            <div v-else-if="appointments && appointments.length" class="med-appointment-timeline ps-2">
              <div v-for="rdv in appointments" :key="rdv.id"
                class="d-flex gap-3 mb-3 position-relative med-timeline-item cursor-pointer rdv-interactive-card"
                @click="handleRedirectToAppointment(rdv.redirect_id)">

                <div class="bg-light rounded text-center d-flex flex-column justify-content-center border shadow-xs"
                  style="width: 52px; height: 54px; min-width: 52px">
                  <span class="fs-5 fw-bold font-monospace text-dark lh-1">
                    {{ rdv.date_affichage?.split(' ')[0] || rdv.date_affichage }}
                  </span>
                  <span class="text-xxs text-uppercase text-muted fw-semibold" style="font-size: 0.6rem !important">
                    {{ rdv.date_affichage?.split(' ')[1] || 'RDV' }}
                  </span>
                </div>

                <div class="flex-grow-1 border-bottom pb-2">
                  <div class="d-flex align-items-center justify-content-between mb-0-5">
                    <h6 class="text-xs fw-bold text-dark mb-0">{{ rdv.medecin?.nom }}</h6>
                    <span class="badge text-xxs font-monospace" :class="rdv.classe_couleur">
                      {{ rdv.heure_affichage }}
                    </span>
                  </div>
                  <p class="text-xxs text-primary fw-medium mb-0">{{ rdv.medecin?.specialite }}</p>
                  <p class="text-xxs text-muted mb-1">
                    <i class="pi pi-building text-xxs me-1"></i>{{ rdv.structure?.nom }}
                  </p>
                  <div class="d-flex justify-content-between align-items-center flex-wrap gap-1 mt-1">
                    <span class="badge rounded-sm text-xxs" :class="rdv.classe_couleur">{{ rdv.statut_label }}</span>
                    <span class="text-xxs text-primary fst-italic click-helper-text">
                      Voir plus
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div v-else>
              <MedEmptyState icon="pi pi-calendar" size="sm" title="Aucun rendez-vous"
                description="Vous n'avez aucun rendez-vous planifié à venir." :bordered="false" />
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">
              <i class="pi pi-sparkles text-primary me-2"></i>Espace Conseils & Prévention
            </h5>

            <div v-if="isLoading">
              <MedSkeleton type="rect" height="130px" class="rounded mb-2" />
            </div>

            <div v-else-if="preventionArticles && preventionArticles.length">
              <div v-for="(article, idx) in preventionArticles" :key="idx"
                class="card border-light shadow-xs bg-white mb-3 rounded overflow-hidden hover-shadow transition-base">

                <img v-if="article.image" :src="article.image" class="img-fluid w-100 object-fit-cover"
                  style="max-height: 130px;" alt="Bannière prévention" />

                <div class="p-3">
                  <span class="badge bg-info-subtle text-info text-xxs mb-2 border border-info-subtle rounded-sm">
                    {{ article.type || 'Prévention' }}
                  </span>
                  <p class="text-xs text-dark lh-base mb-3 text-truncate-3">
                    {{ article.contenu }}
                  </p>

                  <div v-if="article.redirect_id" class="text-start border-top pt-2">
                    <button @click="handleRedirectToAnnonce(article.redirect_id)"
                      class="btn btn-link text-primary text-xs p-0 decoration-none fw-semibold">
                      Lire l'article au complet <i class="pi pi-arrow-right ms-1 text-xxs"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div v-else class="card border-0 bg-primary-bg p-4 rounded-lg text-center">
              <div class="text-primary fs-3 mb-2">
                <i class="pi pi-shield opacity-75"></i>
              </div>
              <h6 class="fw-bold text-primary-dark text-base mb-1">Restez vigilant</h6>
              <p class="text-xs text-dark opacity-75 mb-0 lh-base">
                Aucun guide spécifique ou article de sensibilisation n'est actuellement ciblé pour votre profil.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <MedModal v-model="isModalOpen" title="Fiche Détail de l'Événement" size="md" centered>
      <div v-if="selectedEvent" class="p-1">

        <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
          <img :src="selectedEvent.responsable?.photo || '/assets/images/default-avatar.png'"
            class="rounded-circle border border-2 border-light shadow-xs object-fit-cover"
            style="width: 52px; height: 52px;" alt="Praticien" />
          <div>
            <h6 class="fw-bold text-dark mb-0">{{ selectedEvent.responsable?.nom }}</h6>
            <span class="badge bg-primary-subtle text-primary text-xxs py-0-5 px-2 rounded-pill mt-0-5">
              {{ selectedEvent.type }}
            </span>
            <p class="text-xxs font-monospace text-muted mb-0 mt-1">
              <i class="pi pi-clock me-1"></i>{{ selectedEvent.date }}
            </p>
          </div>
        </div>

        <div class="mb-3">
          <div class="text-xxs text-muted fw-bold text-uppercase mb-1 tracking-wider">Établissement / Structure</div>
          <div class="text-sm text-dark fw-medium">
            <i class="pi pi-building text-xs me-1 text-secondary"></i>{{ selectedEvent.structure }}
          </div>
        </div>

        <div>
          <div class="text-xxs text-muted fw-bold text-uppercase mb-1 tracking-wider">Résumé & Conclusions</div>
          <div
            class="p-3 bg-light rounded text-xs text-dark lh-relaxed whitespace-pre-wrap border border-light-subtle shadow-xs font-sans">
            {{ selectedEvent.resume || 'Aucune observation textuelle détaillée n\'est rattachée à cet enregistrement.'
            }}
          </div>
        </div>

      </div>
    </MedModal>

  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { CarnetService } from "@/api/endpoints/services/patient/carnet";
  import MedTimeline from "@/components/services/MedTimeline.vue";
  import MedModal from "@/components/common/MedModal.vue";
  import MedEmptyState from "@/components/common/MedEmptyState.vue";
  import MedSkeleton from "@/components/common/MedSkeleton.vue";
  import { useUiStore } from "@/router/ui";
  import { useToast } from "@/composables/useToast";
  import router from "@/router";

  // --- ÉTATS REACTIFS ---
  const ui = useUiStore();
  const isLoading = ref(true);
  const toast = useToast();

  const profile = ref(null);
  const indications = ref({});
  const appointments = ref([]);
  const preventionArticles = ref([]);
  const timelineData = ref([]);
  const traitements = ref([]);
  const antecedents = ref({ allergies: [], maladies: [], medicaments: [], environnement: [], autres: [] }); // <-- AJOUT

  // Éléments de la Modale d'historique (Exigence 5)
  const isModalOpen = ref(false);
  const selectedEvent = ref(null);


  // --- ACQUISITION DES DONNÉES VIA CARNETSERVICE ---
  const fetchCarnetDashboard = async () => {
    isLoading.value = true;

    try {
      const [profilRes, indicationsRes, alertesRes, timelineRes, traitementsRes] = await Promise.all([
        CarnetService.profil(),
        CarnetService.indications(),
        CarnetService.alertes(),
        CarnetService.timeline(),
        CarnetService.traitements()
      ]);

      if (profilRes) profile.value = profilRes;
      if (indicationsRes) indications.value = indicationsRes;

      if (alertesRes) {
        appointments.value = alertesRes.rendez_vous || [];
        preventionArticles.value = alertesRes.prevention || [];
        antecedents.value = alertesRes.antecedents || { allergies: [], maladies: [], medicaments: [], environnement: [], autres: [] };
      }

      if (timelineRes) timelineData.value = timelineRes;
      if (traitementsRes) traitements.value = traitementsRes;

    } catch (error) {
      console.error("Échec du chargement du carnet de santé :", error);
      toast.warning(error.message)
    } finally {
      isLoading.value = false;
    }
  };

  // --- FONCTIONS DE REDIRECTION CENTRALISÉES (Exigence 7) ---

  // Redirection vers le détail d'un rendez-vous (Exigence 3)
  const handleRedirectToAppointment = (redirectId) => {
    if (!redirectId) return;
    router.push({
      name: "patient-rendezvous-details",
      params: { id: redirectId }
    });
  };

  // Redirection vers le détail d'une annonce / article de prévention (Exigence 4)
  const handleRedirectToAnnonce = (redirectId) => {
    if (!redirectId) return;
    router.push({
      name: "patient-annonce-details",
      params: { id: redirectId }
    });
  };

  // Redirection vers la liste complète des médicaments (Exigence 6)
  const handleConsultAllTreatments = () => {
    router.push({
      name: "patient-traitements-liste"
    });
  };

  // Redirection vers le parcours chronologique complet <-- AJOUT
  const handleViewFullTimeline = () => {
    router.push({
      name: "patient-timeline-complete"
    });
  };

  // --- GESTIONNAIRES INTERACTIFS LOCALISÉS ---
  const handleOpenEventModal = (event) => {
    selectedEvent.value = event;
    isModalOpen.value = true;
  };

  // Cycle de vie initialisation
  onMounted(() => {
    fetchCarnetDashboard();
  });
</script>

<style scoped>
  .page-patient-carnet {
    background-color: var(--medical-gray-50, #f8fafc);
    min-height: 100vh;
  }

  /* Cartes interactives des rendez-vous */
  .rdv-interactive-card {
    transition: background-color 0.2s ease, transform 0.2s ease;
    border-radius: 8px;
    padding: 8px;
  }

  .rdv-interactive-card:hover {
    background-color: #f1f5f9;
    transform: translateX(3px);
  }

  /* Affichage fluide du helper au survol */
  .click-helper-text {
    font-size: 0.68rem !important;
    color: var(--medical-primary, #0284c7) !important;
    opacity: 0.75;
    transition: opacity 0.2s ease;
  }

  .rdv-interactive-card:hover .click-helper-text {
    opacity: 1;
    font-weight: 600;
  }

  /* Animations de survol pour la timeline et articles */
  .hover-shadow {
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .hover-shadow:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  }

  /* Ligne chronologique pour l'affichage latéral des RDV */
  .med-appointment-timeline {
    border-left: 2px dashed var(--medical-gray-200, #e2e8f0);
  }

  .med-timeline-item::before {
    content: "";
    position: absolute;
    left: -13px;
    top: 23px;
    width: 8px;
    height: 8px;
    background-color: var(--medical-primary, #0284c7);
    border-radius: 50%;
  }

  /* Utilitaires de contraintes & Arrière-plans */
  .bg-primary-bg {
    background-color: var(--medical-primary-bg, #f0f9ff) !important;
  }

  .text-primary-dark {
    color: var(--medical-primary-dark, #0369a1) !important;
  }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: justify;
  }

  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }

  /* Micro typographie */
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

  .shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  }

  .rounded-lg {
    border-radius: 0.5rem !important;
  }

  .fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }


  @keyframes slideIn {
    from {
      transform: translateX(110%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
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

  :deep(.med-timeline__marker-wrap::before) {
    width: 5px;
  }
</style>