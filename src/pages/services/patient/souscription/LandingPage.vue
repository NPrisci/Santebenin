<template>
  <div class="container-fluid page-subscription-landing position-relative overflow-hidden">

    <!-- Bouton Retour Global au Dashboard Patient -->
    <div class="mb-2">
      <button @click="$router.push({ name: 'patient-space' })"
        class="btn btn-link p-0 text-muted decoration-none d-inline-flex align-items-center gap-2 text-sm">
        <i class="pi pi-arrow-left text-xs"></i> Retour à l'accueil
      </button>
    </div>

    <!-- En-tête de la page -->
    <div class="mb-2">
      <h4 class="fw-bold text-dark mb-1">Devenir Acteur de Santé</h4>
      <p class="text-xs text-muted mb-0">Sélectionnez le profil qui correspond à votre activité pour soumettre vos
        pièces justificatives.</p>
    </div>

    <!-- CONTENEUR PRINCIPAL RESPONSIVE -->
    <div class="subscription-container" :class="{ 'mobile-detail-active': isMobileDetailOpen }">
      <div class="row g-4 h-100 flex-nowrap m-0 m-md-n2">

        <!-- ========================================================= -->
        <!-- PANNEAU GAUCHE : LISTE DES DEMANDES DISPONIBLES           -->
        <!-- ========================================================= -->
        <div class="col-12 col-md-5 col-lg-4 panel-left px-2">
          <div class="d-flex flex-column gap-3">
            <div v-for="option in filteredOptions" :key="option.id" @click="selectDomain(option.id)"
              class="card border border-2 cursor-pointer p-3 transition-base rounded-lg shadow-xs"
              :class="selectedDomainId === option.id ? 'border-primary bg-primary-subtle-light' : 'border-light bg-white'">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <div class="badge rounded-circle p-2.5 fs-5 d-inline-flex align-items-center justify-content-center"
                    :class="selectedDomainId === option.id ? 'bg-primary text-white' : 'bg-light text-secondary'">
                    <i :class="option.icon"></i>
                  </div>
                  <div>
                    <h6 class="mb-0 text-sm fw-bold"
                      :class="selectedDomainId === option.id ? 'text-primary' : 'text-dark'">
                      {{ option.title }}
                    </h6>
                    <p class="text-xxs text-muted mb-0 mt-0.5">{{ option.subtitle }}</p>
                  </div>
                </div>
                <!-- Flèche visible uniquement sur Mobile pour indiquer l'action de glissement -->
                <i class="pi pi-chevron-right text-muted text-xs d-md-none"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- PANNEAU DROIT : DÉTAILS ET PIÈCES À FOURNIR                -->
        <!-- ========================================================= -->
        <div class="col-12 col-md-7 col-lg-8 panel-right px-2">
          <!-- Bouton de retour spécifique au Mobile (fait reglisser vers la liste) -->
          <button @click="isMobileDetailOpen = false"
            class="btn btn-link p-0 text-primary decoration-none d-md-none mb-3 fw-semibold d-inline-flex align-items-center gap-2 text-sm">
            <i class="pi pi-arrow-left text-xs"></i> Voir les autres profils
          </button>

          <div v-if="currentDomain"
            class="card border-0 shadow-sm p-4 bg-white rounded-lg h-100 d-flex flex-column justify-content-between">
            <div>
              <!-- En-tête domaine -->
              <div class="d-flex align-items-center gap-2 mb-3">
                <span
                  class="badge bg-primary-subtle text-primary text-xxs px-2 py-1 rounded-sm uppercase tracking-wider fw-bold">
                  Dossier d'inscription
                </span>
              </div>

              <h5 class="fw-bold text-dark mb-2">{{ currentDomain.title }}</h5>
              <p class="text-xs text-muted lh-base mb-4">{{ currentDomain.description }}</p>

              <!-- Liste des documents nécessaires -->
              <div class="bg-light p-3 rounded-lg border border-light-subtle mb-4">
                <h6 class="text-xs fw-bold text-secondary text-uppercase tracking-wider mb-3">
                  <i class="pi pi-folder-open me-1"></i> Pièces justificatives requises
                </h6>
                <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
                  <li v-for="(doc, idx) in currentDomain.requiredDocs" :key="idx"
                    class="d-flex align-items-start gap-2 text-xs text-dark lh-base p-2">
                    <i class="pi pi-check-circle text-success mt-0.5 fs-6 flex-shrink-0"></i>
                    <div>
                      <strong class="d-block text-dark-emphasis mb-0.5">{{ doc.name }}</strong>
                      <span class="text-muted text-xxs d-block">{{ doc.info }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Action principale -->
            <div class="col-12 d-flex justify-content-md-end align-items-center">
              <button @click="startSubscription(currentDomain.id)"
                class="btn btn-primary text-white fw-bold text-xs px-4 py-2.5 rounded shadow-sm d-inline-flex align-items-center gap-2 transition-base">
                Commencer ma demande <i class="pi pi-arrow-right text-xxs"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
  import { isMedecin } from '@/api/clients/auth';
  import { onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const medecin = ref(false);
  const selectedDomainId = ref('medecin');
  const isMobileDetailOpen = ref(false);

  // Configuration exhaustive des types de demandes
  const subscriptionOptions = ref([
    {
      id: 'medecin',
      title: 'Devenir Médecin',
      subtitle: 'Praticien, spécialiste ou généraliste',
      icon: 'pi pi-user-plus',
      description: 'Rejoignez le réseau médical de Benin Sante pour digitaliser vos consultations, suivre le carnet de santé de vos patients et collaborer avec vos confrères.',
      requiredDocs: [
        { name: "Numéro d'Ordre National", info: "Votre identifiant unique inscrit au tableau de l'Ordre National des Médecins du Bénin." },
        { name: "Attestation d'inscription à l'Ordre", info: "Un justificatif ou attestation d'inscription de l'année en cours à l'Ordre National des Médecins du Bénin" },
        { name: "Pièce d'identité du Responsable Légal", info: "CNIB, Passeport ou carte d'identité biométrique en cours de validité." }
      ]
    },
    {
      id: 'pharmacie',
      title: 'Inscrire ma Pharmacie',
      subtitle: 'Officine ou établissement pharmaceutique',
      icon: 'pi pi-map-marker',
      description: 'Enregistrez votre officine pour gérer la dispensation des ordonnances électroniques, actualiser vos stocks de médicaments et fluidifier le parcours patient.',
      requiredDocs: [
        { name: "Arrêté ministériel d'autorisation", info: "Arrêté Ministériel d'autorisation d'ouverture et d'exploitation" },
        { name: "Numéro d'ordre national", info: "Votre identifiant unique inscrit au tableau de l'Ordre National des Pharmaciens du Bénin." },
        { name: "Attestation d'inscription à l'Ordre", info: "Attestation d'inscription du pharmacien titulaire à l'Ordre National des Pharmaciens du Bénin" },
        { name: "Pièce d'identité du Responsable Légal", info: "CNIB, Passeport ou carte d'identité biométrique en cours de validité." }
      ]
    },
    {
      id: 'structure',
      title: 'Inscrire ma Structure',
      subtitle: 'Clinique, hôpital ou centre de santé',
      icon: 'pi pi-building',
      description: 'Assurez la gestion globale de votre établissement de santé, supervisez vos équipes de praticiens et centralisez le suivi des admissions.',
      requiredDocs: [
        { name: "Arrêté d'Ouverture ou Décret de mise en service", info: "L'Arrêté Ministériel d'Ouverture et d'Exploitation ou le Décret de mise en service officiel." },
        { name: "Numéro de l'Arrêté ou du Décret", info: "La référence ou le numéro d'enregistrement officiel de l'acte d'autorisation." },
        { name: "Pièce d'identité du Responsable Légal", info: "CNIB, Passeport ou carte d'identité biométrique en cours de validité." }
      ]
    }
  ]);

  // Filtrage intelligent : Exclut le domaine médecin si l'utilisateur l'est déjà
  const filteredOptions = computed(() => {
    if (medecin.value) {
      return subscriptionOptions.value.filter(option => option.id !== 'medecin');
    }
    return subscriptionOptions.value;
  });

  // Récupération de l'objet sélectionné en cours
  const currentDomain = computed(() => {
    return subscriptionOptions.value.find(option => option.id === selectedDomainId.value);
  });

  // Gestion adaptative de la sélection de domaine
  const selectDomain = (id) => {
    selectedDomainId.value = id;
    isMobileDetailOpen.value = true; // Déclenche le glissement sur Mobile
  };

  // Traitement au clic du bouton final "Commencer"
  const startSubscription = (id) => {
    router.push({ name: `patient-subscription-${id}-form` });
  };

  onMounted(() => {
    medecin.value = isMedecin();
    // Si l'utilisateur est déjà médecin, on bascule par défaut le curseur sur la pharmacie
    if (medecin.value) {
      selectedDomainId.value = 'pharmacie';
    }
  });
</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }

  .bg-primary-subtle-light {
    background-color: var(--medical-primary-bg, #f0f9ff) !important;
  }

  .rounded-lg {
    border-radius: 0.5rem !important;
  }

  .text-xxs {
    font-size: 0.72rem !important;
  }

  .text-xs {
    font-size: 0.85rem !important;
  }

  .text-sm {
    font-size: 0.95rem !important;
  }

  .shadow-xs {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  }

  .p-2.5 {
    padding: 0.65rem !important;
  }

  .transition-base {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ========================================================= */
  /* ANIMATION ET AGENCEMENT DOUBLE PANNEAU (CSS SLIDE RESPONSIVE) */
  /* ========================================================= */
  .subscription-container {
    width: 100%;
    overflow: hidden;
  }

  /* Comportement Spécifique Mobile / Petite tablette */
  @media (max-width: 767.98px) {
    .subscription-container .row {
      width: 200%;
      /* Le conteneur fait deux fois la largeur de l'écran */
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .panel-left,
    .panel-right {
      width: 50% !important;
      /* Chaque panneau prend exactement un plein écran mobile */
      flex: 0 0 50% !important;
    }

    /* Classe activée dynamiquement lors du clic pour faire glisser */
    .subscription-container.mobile-detail-active .row {
      transform: translateX(-50%);
      /* Glissement vers la gauche pour montrer le panneau droit */
    }
  }

  /* Fix d'égalisation de hauteur pour le layout Desktop */
  @media (min-width: 768px) {

    .subscription-container,
    .subscription-container .row {
      overflow: visible;
    }
  }

</style>