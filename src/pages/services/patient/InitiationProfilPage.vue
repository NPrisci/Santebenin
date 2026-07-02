<script setup>
  import { ref, reactive, onMounted, computed, watch } from "vue";
  import { useRouter } from "vue-router";

  // Importation de vos composants atomiques validés et de MedChip
  import MedAvatar from "@/components/common/MedAvatar.vue";
  import MedModal from "@/components/common/MedModal.vue";
  import MedToggle from "@/components/common/MedToggle.vue";
  import MedAutoComplete from "@/components/common/MedAutoComplete.vue";
  import MedButton from "@/components/common/MedButton.vue";
  import MedSkeleton from "@/components/common/MedSkeleton.vue";
  import MedChip from "@/components/common/MedChip.vue";

  // Injection du service d'initialisation et des utilitaires
  import ProfilInitialisation from "@/api/endpoints/services/patient/initialisation";
  import { useToast } from "@/composables/useToast";

  const router = useRouter();
  const toast = useToast();

  // États de contrôle du flux (5 étapes)
  const isModalOpen = ref(true);
  const isLoading = ref(true);
  const isSaving = ref(false);
  const step = ref(1);

  // Données utilisateur et référentiels serveurs
  const user = ref(null);
  const refData = reactive({
    groupesSanguins: [],
    maladiesDisponibles: [],
    medicamentsDisponibles: [],
  });

  // Modèle de données réactif unifié conforme à la nouvelle API
  const formData = reactive({
    groupeSanguin: "Inconnu",
    antecedents: [], // Contient des éléments typés : 'maladie', 'allergie', 'medicament'
  });

  // Variables de travail temporaires par étape
  const allergySearchQuery = ref("");
  const selectedAllergyItem = ref(null);
  const customAllergyInput = ref("");

  const customMaladieInput = ref("");

  const customAutreInput = ref("");

  const suggestionsAllergiesCommunes = [
    "Poussière",
    "Pollen",
    "Poils de chat",
    "Poils de chien",
    "Acariens",
    "Latex",
    "Arachides",
    "Fruits de mer",
    "Moisissures",
    "Venin de guêpe"
  ];

  /* ── CYCLE DE VIE : CHARGEMENT & INITIALISATION ── */
  onMounted(async () => {
    try {
      const alreadyChecked = await ProfilInitialisation.check();
      if (alreadyChecked) {
        toast.info("Votre passeport de santé est déjà configuré.");
        closeAndRedirect();
        return;
      }

      const [userData, medicalLookups] = await Promise.all([
        ProfilInitialisation.userData(),
        ProfilInitialisation.init(),
      ]);

      user.value = userData;
      // Assurer que l'option "Inconnu" est disponible ou gérer celle par défaut
      refData.groupesSanguins = medicalLookups.groupesSanguins || [];
      if (!refData.groupesSanguins.includes("Inconnu")) {
        refData.groupesSanguins.unshift("Inconnu");
      }
      refData.maladiesDisponibles = medicalLookups.maladiesDisponibles || [];
      refData.medicamentsDisponibles = medicalLookups.medicamentsDisponibles || [];

      isLoading.value = false;
    } catch (error) {
      console.error(error);
      toast.error("Erreur critique lors de la récupération des référentiels médicaux.");
      isLoading.value = false;
    }
  });

  /* ── COMPUTES DE FILTRAGE DES RÉSULTATS (ÉTAPE 2) ── */
  const filteredAllergiesCategories = computed(() => {
    const query = allergySearchQuery.value.toLowerCase().trim();
    if (!query) return [];

    const matches = refData.medicamentsDisponibles
      .filter((item) => item.nom.toLowerCase().includes(query) || (item.nom_generique && item.nom_generique.toLowerCase().includes(query)))
      .map((item) => ({
        id: item.id,
        title: item.nom,
        type: "medicament",
      }));

    return matches.length > 0
      ? [{ id: "meds", title: "Médicaments / Molécules suggérés", items: matches }]
      : [];
  });

  // 2. Filtrage réactif selon la saisie de l'utilisateur
  const filteredAllergySuggestions = computed(() => {
    const query = customAllergyInput.value.toLowerCase().trim();
    if (!query) return []; // Rien si le champ est vide

    return suggestionsAllergiesCommunes.filter(item =>
      item.toLowerCase().includes(query) &&
      item.toLowerCase() !== query // Évite de suggérer ce qui est déjà exactement écrit
    );
  });

  // 3. Action lors du clic sur une suggestion
  const selectAllergySuggestion = (suggestion) => {
    customAllergyInput.value = suggestion; // Remplit le champ
    addCustomAllergy(); // Exécute directement l'ajout au passeport
  };

  /* ── COMPUTES DE SEPARATION VISUELLE POUR LE PASSEPORT À GAUCHE ── */
  const displayAllergies = computed(() =>
    formData.antecedents.filter(a => a.type === 'allergie' || a.type === 'medicament')
  );
  const displayMaladies = computed(() =>
    formData.antecedents.filter(a => a.type === 'maladie' && !a.isAutreSection)
  );
  const displayAutres = computed(() =>
    formData.antecedents.filter(a => a.isAutreSection)
  );

  /* ── GESTION ÉTAPE 2 : ALLERGIES ── */
  // Écoute la sélection d'un médicament dans l'auto-complétion
  watch(selectedAllergyItem, (newSelection) => {
    if (newSelection && newSelection.id) {
      const exists = formData.antecedents.some((a) => a.medicament_id === newSelection.id);
      if (!exists) {
        formData.antecedents.push({
          designation: newSelection.title,
          type: "medicament",
          medicament_id: newSelection.id,
          date_debut: null,
          notes: "Allergie médicamenteuse déclarée",
        });
      } else {
        toast.warning("Cet allergène est déjà enregistré.");
      }
      selectedAllergyItem.value = null;
      allergySearchQuery.value = "";
    }
  });

  const addCustomAllergy = () => {
    const value = customAllergyInput.value.trim();
    if (!value) return;

    const exists = formData.antecedents.some((a) => a.designation.toLowerCase() === value.toLowerCase());
    if (!exists) {
      formData.antecedents.push({
        designation: value,
        type: "allergie",
        date_debut: null,
        notes: "Saisie libre",
      });
      customAllergyInput.value = "";
    } else {
      toast.warning("Cet allergène est déjà listé.");
    }
  };

  /* ── GESTION ÉTAPE 3 : MALADIES (MEDCHIPS & SÉLECTION DIRECTE) ── */
  const toggleMaladieChip = (maladie) => {
    const index = formData.antecedents.findIndex((a) => a.maladie_id === maladie.id);
    if (index > -1) {
      formData.antecedents.splice(index, 1);
    } else {
      formData.antecedents.push({
        designation: maladie.nom,
        type: "maladie",
        maladie_id: maladie.id,
        date_debut: new Date().toISOString().substr(0, 10),
        notes: "",
        isAutreSection: false
      });
    }
  };

  const addCustomMaladie = () => {
    const value = customMaladieInput.value.trim();
    if (!value) return;

    const exists = formData.antecedents.some((a) => a.designation.toLowerCase() === value.toLowerCase());
    if (!exists) {
      formData.antecedents.push({
        designation: value,
        type: "maladie",
        date_debut: new Date().toISOString().substr(0, 10),
        notes: "Pathologie hors liste de référence",
        isAutreSection: false
      });
      customMaladieInput.value = "";
      toast.success(`Antécédent "${value}" ajouté.`);
    } else {
      toast.warning("Cette pathologie est déjà déclarée.");
    }
  };

  /* ── GESTION ÉTAPE 4 : AUTRES INFORMATIONS ── */
  const addCustomAutre = () => {
    const value = customAutreInput.value.trim();
    if (!value) return;

    formData.antecedents.push({
      designation: value,
      type: "maladie", // Soumission standardisé au format requis
      date_debut: null,
      notes: "Autre information / Intervention",
      isAutreSection: true // Flag local pour l'affichage visuel uniquement
    });
    customAutreInput.value = "";
    toast.success("Information complémentaire enregistrée.");
  };

  /* ── REMOVE GLOBAL DES ANTECEDENTS ── */
  const removeAntecedentItem = (item) => {
    const index = formData.antecedents.indexOf(item);
    if (index > -1) formData.antecedents.splice(index, 1);
  };

  /* ── SOUMISSION FINALE (ÉTAPE 5) ── */
  const submitForm = async () => {
    isSaving.value = true;
    try {
      // Nettoyage et re-mapping strict des clés pour matcher les attentes de ProfilInitialisation.save
      const mappedPayload = {
        groupeSanguin: formData.groupeSanguin,
        antecedents: formData.antecedents.map((ant) => ({
          designation: ant.designation,
          type: ant.type,
          dateDebut: ant.date_debut,
          notes: ant.notes,
          maladieId: ant.maladie_id,
          medicamentId: ant.medicament_id
        })),
      };

      await ProfilInitialisation.save(mappedPayload);
      toast.success("Votre Passeport de Sécurité Clinique a été signé et scellé.");
      closeAndRedirect();
    } catch (error) {
      console.error(error);
      toast.error("Échec de la signature numérique du passeport d'urgence.");
    } finally {
      isSaving.value = false;
    }
  };

  const closeAndRedirect = () => {
    isModalOpen.value = false;
    router.push("/p/espace");
  };
</script>

<template>
  <MedModal v-model="isModalOpen" title="Configuration de votre Passeport Clinique d'Urgence" size="xl"
    :staticBackdrop="true" headerBg="bg-dark text-white" :scrollable="true">
    <div v-if="isLoading" class="row g-4">
      <div class="col-lg-5">
        <MedSkeleton shape="rectangle" height="520px" class="rounded-3" />
      </div>
      <div class="col-lg-7">
        <MedSkeleton v-for="i in 5" :key="i" shape="text" class="mb-4" />
      </div>
    </div>

    <div v-else class="row g-4">

      <div class="col-lg-5 d-flex flex-column justify-content-between">
        <div
          class="passport-card p-4 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
          <div class="security-watermark position-absolute opacity-05">
            <i class="fas fa-shield-alt"></i>
          </div>

          <div>
            <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary-subtle">
              <div
                class="passport-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm">
                <MedAvatar :src="user?.photo" :name="`${user?.firstname} ${user?.lastname}`" size="md" />
              </div>
              <div>
                <h6 class="fw-bold text-dark mb-0 font-title">{{ user?.nom }} {{ user?.firstname }}</h6>
                <span class="text-muted font-monospace fs-8">NPI : {{ user?.npi || "0000000000" }}</span>
              </div>
            </div>

            <div class="text-center my-3 p-3 rounded-3 group-display-box transition"
              :class="formData.groupeSanguin !== 'Inconnu' ? 'bg-danger-subtle border border-danger-subtle' : 'bg-white border text-muted'">
              <span class="fs-8 text-uppercase tracking-wider d-block fw-bold mb-1">Groupe Sanguin</span>
              <h1 class="fw-black mb-0 display-4"
                :class="formData.groupeSanguin !== 'Inconnu' ? 'text-danger' : 'text-black-50'">
                {{ formData.groupeSanguin }}
              </h1>
            </div>

            <div class="mb-3">
              <span class="fs-8 text-uppercase tracking-wider text-secondary fw-bold d-block mb-1.5">Risques
                Allergiques</span>
              <div v-if="displayAllergies.length > 0" class="d-flex flex-wrap gap-1">
                <span v-for="allergy in displayAllergies" :key="allergy.designation"
                  class="badge bg-warning text-dark rounded-pill px-2.5 py-1.5 shadow-xs fs-8">
                  <i class="fas fa-exclamation-triangle me-1"></i>{{ allergy.designation }}
                </span>
              </div>
              <p v-else class="text-muted fs-8 italic px-1 mb-0">Aucun risque allergique déclaré.</p>
            </div>

            <div class="mb-3">
              <span class="fs-8 text-uppercase tracking-wider text-secondary fw-bold d-block mb-1.5">Pathologies &
                Hérédité</span>
              <div v-if="displayMaladies.length > 0" class="d-flex flex-column gap-1.5">
                <div v-for="ant in displayMaladies" :key="ant.designation"
                  class="fs-8 p-2 rounded bg-white border d-flex align-items-center justify-content-between">
                  <span class="text-dark fw-medium"><i class="fas fa-heartbeat text-danger me-2"></i>{{ ant.designation
                    }}</span>
                </div>
              </div>
              <p v-else class="text-muted fs-8 italic px-1 mb-0">Aucun antécédent pathologique déclaré.</p>
            </div>

            <div>
              <span class="fs-8 text-uppercase tracking-wider text-secondary fw-bold d-block mb-1.5">Autres Notes
                Cliniques</span>
              <div v-if="displayAutres.length > 0" class="d-flex flex-column gap-1">
                <div v-for="other in displayAutres" :key="other.designation"
                  class="fs-8 p-1.5 rounded bg-white border-start border-primary border-3 text-dark">
                  {{ other.designation }}
                </div>
              </div>
              <p v-else class="text-muted fs-8 italic px-1 mb-0">Aucune information complémentaire.</p>
            </div>
          </div>

          <div
            class="mt-4 pt-3 border-top border-secondary-subtle d-flex justify-content-between align-items-center text-secondary fs-8 font-monospace">
            <span><i class="fas fa-lock text-success me-1"></i> Sécurisé APDP / HDS</span>
            <span class="fw-bold text-uppercase">Bénin Sante</span>
          </div>
        </div>
      </div>

      <div class="col-lg-7 border-start-lg border-light-subtle d-flex flex-column justify-content-between px-3 px-lg-4"
        style="min-height: 520px;">

        <div v-if="step === 1" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">Étape 1 : Rhésus & Groupe Sanguin</h5>
            <p class="text-muted small">Sélectionnez votre groupe d'origine biologique ou laissez sur "Inconnu".</p>
          </div>
          <div class="row g-3">
            <div v-for="group in refData.groupesSanguins" :key="group" class="col-6 col-sm-4 col-md-3">
              <div @click="formData.groupeSanguin = group"
                class="blood-selector-card text-center p-3 rounded-3 border cursor-pointer transition select-none"
                :class="formData.groupeSanguin === group ? 'border-danger bg-danger-subtle text-danger fw-bold shadow-xs' : 'border-light-subtle bg-white hover-light text-dark'">
                <i class="fas fa-tint mb-1 fs-5"></i>
                <span class="d-block font-title">{{ group }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="step === 2" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">Étape 2 : Déclaration des Allergies</h5>
            <p class="text-muted small">Saisissez vos intolérances. Recherchez parmi les molécules médicamenteuses
              courantes ou ajoutez librement d'autres allergènes.</p>
          </div>

          <div class="mb-3">
            <MedAutoComplete v-model="selectedAllergyItem" :categories="filteredAllergiesCategories"
              placeholder="Rechercher un médicament (ex: Amoxicilline, Métformine...)"
              label="Assistance aux allergies médicamenteuses" @search-change="(q) => (allergySearchQuery = q)" />
          </div>

          <div class="position-relative mb-4">
            <!-- Groupe de saisie existant -->
            <div class="input-group shadow-sm rounded">
              <input v-model="customAllergyInput" type="text" class="form-control"
                placeholder="Autre allergie libre (ex: Arachides, Latex, Pollen...)" @keyup.enter="addCustomAllergy"
                autocomplete="off">
              <button class="btn btn-dark fw-bold px-3" type="button" @click="addCustomAllergy">
                Ajouter libre
              </button>
            </div>

            <!-- Liste flottante des propositions Bootstrap -->
            <ul v-if="filteredAllergySuggestions.length > 0" class="dropdown-menu show w-100 shadow position-absolute"
              style="top: 100%; z-index: 1050; max-height: 200px; overflow-y: auto;">
              <li v-for="suggestion in filteredAllergySuggestions" :key="suggestion">
                <button class="dropdown-item py-2 d-flex align-items-center gap-2" type="button"
                  @click="selectAllergySuggestion(suggestion)">
                  <i class="fas fa-font-awesome-flag text-muted fs-9"></i>
                  <span>{{ suggestion }}</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="added-items-list border rounded bg-light p-3">
            <h6 class="fs-8 text-uppercase tracking-wider text-secondary fw-bold mb-3">Allergies recensées ({{
              displayAllergies.length }})</h6>
            <div v-if="displayAllergies.length > 0" class="d-flex flex-column gap-2">
              <div v-for="item in displayAllergies" :key="item.designation"
                class="d-flex align-items-center justify-content-between bg-white p-2 rounded border shadow-xs">
                <span class="fs-7 text-dark fw-medium"><i class="fas fa-exclamation-circle text-warning me-2"></i>{{
                  item.designation }} <small class="text-muted">({{ item.type }})</small></span>
                <button @click="removeAntecedentItem(item)"
                  class="btn btn-sm text-danger border-0 p-1 hover-light rounded-circle"><i
                    class="fas fa-trash-alt"></i></button>
              </div>
            </div>
            <p v-else class="text-muted fs-7 italic mb-0 text-center py-3">Aucune allergie ajoutée.</p>
          </div>
        </div>

        <div v-else-if="step === 3" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">Étape 3 : Antécédents Pathologiques</h5>
            <p class="text-muted small">Sélectionnez vos maladies chroniques connues ou ajoutez-les manuellement si
              elles ne figurent pas dans la liste.</p>
          </div>

          <div class="mb-4">
            <label class="form-label text-secondary fw-bold fs-8 text-uppercase tracking-wider mb-2">Maladies
              fréquentes</label>
            <div class="d-flex flex-wrap gap-2 p-2 bg-white rounded border">
              <MedChip v-for="maladie in refData.maladiesDisponibles" :key="maladie.id" :label="maladie.nom"
                :value="maladie.id" icon="fas fa-plus"
                :active="formData.antecedents.some(a => a.maladie_id === maladie.id)"
                @click="toggleMaladieChip(maladie)" />
            </div>
          </div>

          <div class="input-group mb-4 shadow-sm rounded">
            <input v-model="customMaladieInput" type="text" class="form-control"
              placeholder="Ajouter une autre maladie non référencée..." @keyup.enter="addCustomMaladie">
            <button class="btn btn-primary fw-bold px-3" type="button" @click="addCustomMaladie">Ajouter libre</button>
          </div>

          <div class="added-items-list border rounded bg-light p-3">
            <h6 class="fs-8 text-uppercase tracking-wider text-secondary fw-bold mb-3">Pathologies déclarées ({{
              displayMaladies.length }})</h6>
            <div v-if="displayMaladies.length > 0" class="d-flex flex-column gap-2">
              <div v-for="item in displayMaladies" :key="item.designation"
                class="bg-white p-2 rounded border shadow-xs">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fs-7 text-dark fw-bold"><i class="fas fa-heartbeat text-danger me-2"></i>{{
                    item.designation }}</span>
                  <button @click="removeAntecedentItem(item)"
                    class="btn btn-sm text-danger border-0 p-1 hover-light rounded-circle"><i
                      class="fas fa-trash-alt"></i></button>
                </div>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="date" v-model="item.date_debut" class="form-control form-control-xs fs-8"
                      placeholder="Date de diagnostic">
                  </div>
                  <div class="col-6">
                    <input type="text" v-model="item.notes" class="form-control form-control-xs fs-8"
                      placeholder="Notes (ex: Antécédent familial, suivi)">
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-muted fs-7 italic mb-0 text-center py-3">Aucune pathologie sélectionnée.</p>
          </div>
        </div>

        <div v-else-if="step === 4" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">Étape 4 : Informations & Antécédents divers</h5>
            <p class="text-muted small">Ajoutez toutes les informations cliniques utiles (ex: Chirurgies majeures,
              hospitalisations, observations particulières).</p>
          </div>

          <div class="input-group mb-4 shadow-sm rounded">
            <input v-model="customAutreInput" type="text" class="form-control"
              placeholder="Ex: Appendicectomie en 2018, fracture fémur..." @keyup.enter="addCustomAutre">
            <button class="btn btn-dark fw-bold px-3" type="button" @click="addCustomAutre">Enregistrer</button>
          </div>

          <div class="added-items-list border rounded bg-light p-3">
            <h6 class="fs-8 text-uppercase tracking-wider text-secondary fw-bold mb-3">Autres éléments enregistrés ({{
              displayAutres.length }})</h6>
            <div v-if="displayAutres.length > 0" class="d-flex flex-column gap-2">
              <div v-for="item in displayAutres" :key="item.designation"
                class="d-flex align-items-center justify-content-between bg-white p-2 rounded border shadow-xs">
                <span class="fs-7 text-dark fw-medium"><i class="fas fa-file-medical text-primary me-2"></i>{{
                  item.designation }}</span>
                <button @click="removeAntecedentItem(item)"
                  class="btn btn-sm text-danger border-0 p-1 hover-light rounded-circle"><i
                    class="fas fa-trash-alt"></i></button>
              </div>
            </div>
            <p v-else class="text-muted fs-7 italic mb-0 text-center py-3">Aucune note additionnelle entrée.</p>
          </div>
        </div>

        <div v-else-if="step === 5" class="animate-step">
          <div class="mb-3">
            <h5 class="fw-bold text-dark font-title mb-1">Étape 5 : Signature Clinique & Scellage</h5>
            <p class="text-muted small">Veuillez effectuer une relecture complète des données de votre carte d'urgence
              avant la validation finale.</p>
          </div>

          <div class="card border-success-subtle bg-success-subtle p-3 rounded-3 mb-3">
            <div class="d-flex gap-2 text-success fs-8">
              <i class="fas fa-user-shield fs-4 mt-1"></i>
              <div>
                <h6 class="fw-bold mb-0.5 font-title">Déclaration de conformité numérique</h6>
                <p class="mb-0 lh-sm">Ces éléments cryptographiques exclusifs seront transmis de manière hautement
                  sécurisée pour structurer votre profil d'urgence médical.</p>
              </div>
            </div>
          </div>

          <div class="border rounded-3 bg-white p-3 shadow-xs custom-scrollbar"
            style="max-height: 320px; overflow-y: auto;">
            <div class="d-flex justify-content-between border-bottom pb-2 mb-2 fs-7">
              <span class="text-muted">Groupe Sanguin choisi :</span>
              <strong class="text-danger font-monospace">{{ formData.groupeSanguin }}</strong>
            </div>

            <div class="mb-2">
              <span class="d-block text-secondary fw-bold fs-9 text-uppercase mb-1">Allergies déclarées</span>
              <ul class="list-unstyled ps-2 mb-0 fs-8 text-dark" v-if="displayAllergies.length > 0">
                <li v-for="a in displayAllergies" :key="a.designation"><i
                    class="fas fa-circle text-warning fs-9 me-2"></i>{{ a.designation }}</li>
              </ul>
              <span v-else class="text-muted fs-8 italic ps-2">Aucune allergie</span>
            </div>

            <div class="mb-2">
              <span class="d-block text-secondary fw-bold fs-9 text-uppercase mb-1">Pathologies et Diagnostics</span>
              <ul class="list-unstyled ps-2 mb-0 fs-8 text-dark" v-if="displayMaladies.length > 0">
                <li v-for="m in displayMaladies" :key="m.designation">
                  <i class="fas fa-circle text-danger fs-9 me-2"></i>{{ m.designation }}
                  <small v-if="m.date_debut" class="text-muted font-monospace"> (Depuis le : {{ m.date_debut }})</small>
                </li>
              </ul>
              <span v-else class="text-muted fs-8 italic ps-2">Aucune maladie chronique</span>
            </div>

            <div>
              <span class="d-block text-secondary fw-bold fs-9 text-uppercase mb-1">Autres informations du
                dossier</span>
              <ul class="list-unstyled ps-2 mb-0 fs-8 text-dark" v-if="displayAutres.length > 0">
                <li v-for="o in displayAutres" :key="o.designation"><i
                    class="fas fa-circle text-primary fs-9 me-2"></i>{{ o.designation }}</li>
              </ul>
              <span v-else class="text-muted fs-8 italic ps-2">Aucun élément additionnel</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
          <button v-if="step > 1" @click="step--"
            class="btn btn-outline-secondary px-3 font-title fw-bold rounded-xl text-muted" :disabled="isSaving">
            Précédent
          </button>
          <div v-else></div>

          <MedButton @click="step === 5 ? submitForm() : step++" :loading="isSaving" size="md"
            class="px-4 py-2.5 font-title fw-bold shadow-sm rounded-xl" :variant="step === 5 ? 'success' : 'primary'">
            {{ step === 5 ? "Sceller mon Passeport Santé" : "Suivant" }}
          </MedButton>
        </div>

      </div>
    </div>
  </MedModal>
</template>

<style scoped>
  .font-title {
    font-family: var(--title-family), sans-serif;
  }

  .fs-7 {
    font-size: 0.825rem;
  }

  .fs-8 {
    font-size: 0.75rem;
  }

  .fs-9 {
    font-size: 0.675rem;
  }

  .fw-black {
    font-weight: 900;
  }

  .rounded-xl {
    border-radius: 0.65rem;
  }

  .form-control-xs {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }

  /* Styles du Passeport d'Urgence (Gauche) */
  .passport-card {
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.015), 0 4px 15px rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.08) !important;
  }

  .passport-avatar {
    width: 2.75rem;
    height: 2.75rem;
  }

  .security-watermark {
    bottom: -20px;
    right: -20px;
    font-size: 10rem;
    color: rgba(0, 0, 0, 0.02);
    pointer-events: none;
  }

  .group-display-box {
    box-shadow: 0 4px 10px rgba(220, 53, 69, 0.02);
  }

  /* Séléctions interactives de sang */
  .blood-selector-card:hover {
    transform: translateY(-2px);
    border-color: rgba(220, 53, 69, 0.4) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 992px) {
    .border-start-lg {
      border-left: 1px solid var(--bs-border-color) !important;
    }
  }

  .animate-step {
    animation: step-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes step-fade-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--bs-gray-300);
    border-radius: 4px;
  }
</style>