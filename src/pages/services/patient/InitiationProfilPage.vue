<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";

// Importation de vos composants atomiques validés
import MedAvatar from "@/components/common/MedAvatar.vue";
import MedModal from "@/components/common/MedModal.vue";
import MedToggle from "@/components/common/MedToggle.vue";
import MedAutoComplete from "@/components/common/MedAutoComplete.vue";
import MedButton from "@/components/common/MedButton.vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";

// Injection du service d'initialisation et des utilitaires
import ProfilInitialisation from "@/api/endpoints/services/patient/initialisation";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const toast = useToast();

// États de contrôle du flux
const isModalOpen = ref(true);
const isLoading = ref(true);
const isSaving = ref(false);
const step = ref(1);

// Données utilisateur et référentiels serveurs
const user = ref(null);
const refData = reactive({
  groupeSanguin: [],
  allergies: [],
  antecedants: [],
  niveauSeverite: [],
});

// Modèle de données réactif pour le formulaire final
const formData = reactive({
  groupeSanguin: "Inconnu",
  allergies: [], // Structure : { id, nom, type, severite }
  antecedants: [], // Structure : { maladie, nom, est_familiale, lien_parente }
});

// Variables de travail pour les sélections en cours d'ajout
const selectedAllergyItem = ref(null);
const allergySearchQuery = ref("");

const selectedAntecedentItem = ref(null);
const antecedentSearchQuery = ref("");
const tempAntecedentMeta = reactive({
  est_familiale: false,
  lien_parente: "",
});

/* ── CYCLE DE VIE : CHARGEMENT ET DOUBLE VALIDATION DE SÉCURITÉ ── */
onMounted(async () => {
  try {
    // 1. Vérification si le profil est déjà initialisé
    const alreadyChecked = await ProfilInitialisation.check();
    if (alreadyChecked) {
      toast.info("Votre passeport de santé est déjà configuré.");
      closeAndRedirect();
      return;
    }

    // 2. Chargement simultané des données civiles et des tables de référence médicales
    const [userData, medicalLookups] = await Promise.all([
      ProfilInitialisation.userData(),
      ProfilInitialisation.init(),
    ]);

    console.log(userData);

    user.value = userData;
    refData.groupeSanguin = medicalLookups.groupeSanguin || [];
    refData.allergies = medicalLookups.allergies || [];
    refData.antecedants = medicalLookups.antecedants || [];
    refData.niveauSeverite = medicalLookups.niveauSeverite || [
      "Faible",
      "Modéré",
      "Critique",
    ];

    isLoading.value = false;
  } catch (error) {
    console.error(error);
    toast.error(
      "Erreur critique lors de la récupération des protocoles de santé."
    );
    isLoading.value = false;
  }
});

/* ── MOTEURS DE RECHERCHE LOCAL (Fuzzy Search) POUR MEDAUTOCOMPLETE ── */
const filteredAllergiesCategories = computed(() => {
  const query = allergySearchQuery.value.toLowerCase().trim();
  if (!query) return [];

  // Filtrage et mapping obligatoire pour MedAutoComplete (champ 'title')
  const matches = refData.allergies
    .filter((item) => item.nom.toLowerCase().includes(query))
    .map((item) => ({
      id: item.id,
      title: item.nom,
      type: item.type,
    }));

  return matches.length > 0
    ? [{ id: "all", title: "Allergies trouvées", items: matches }]
    : [];
});

const filteredAntecedentsCategories = computed(() => {
  const query = antecedentSearchQuery.value.toLowerCase().trim();
  if (!query) return [];

  const matches = refData.antecedants
    .filter((item) => item.nom.toLowerCase().includes(query))
    .map((item) => ({
      id: item.id,
      title: item.nom,
    }));

  return matches.length > 0
    ? [{ id: "all", title: "Pathologies trouvées", items: matches }]
    : [];
});

/* ── LOGIQUE INTERNE DE GESTION DES RECHERCHES ET SÉLECTIONS ── */
watch(selectedAllergyItem, (newSelection) => {
  if (newSelection && newSelection.id) {
    // Éviter les doublons
    const exists = formData.allergies.some((a) => a.id === newSelection.id);
    if (!exists) {
      formData.allergies.push({
        id: newSelection.id,
        nom: newSelection.title,
        type: newSelection.type,
        severite: refData.niveauSeverite[0] || "Faible", // Sévérité par défaut
      });
      toast.success(`Allergie "${newSelection.title}" ajoutée au passeport.`);
    } else {
      toast.warning("Cet allergène est déjà listé dans votre dossier.");
    }
    // Reset immédiat du champ de recherche
    selectedAllergyItem.value = null;
    allergySearchQuery.value = "";
  }
});

// Traitement des antécédents avec configuration des métadonnées
const selectAntecedentForSetup = (item) => {
  if (formData.antecedants.some((a) => a.maladie === item.id)) {
    toast.warning("Cet antécédent médical a déjà été déclaré.");
    selectedAntecedentItem.value = null;
    antecedentSearchQuery.value = "";
    return;
  }
  // Enclenche l'affichage de la mini-configuration d'antécédent
  tempAntecedentMeta.est_familiale = false;
  tempAntecedentMeta.lien_parente = "";
};

const confirmAntecedentAddition = () => {
  if (!selectedAntecedentItem.value) return;

  formData.antecedants.push({
    maladie: selectedAntecedentItem.value.id,
    nom: selectedAntecedentItem.value.title,
    est_familiale: tempAntecedentMeta.est_familiale,
    lien_parente: tempAntecedentMeta.est_familiale
      ? tempAntecedentMeta.lien_parente
      : "",
  });

  toast.success(
    `Pathologie "${selectedAntecedentItem.value.title}" greffée à vos antécédents.`
  );
  selectedAntecedentItem.value = null;
  antecedentSearchQuery.value = "";
};

/* ── ACTIONS SUPPRESSIONS EN DIRECT ── */
const removeAllergy = (index) => {
  formData.allergies.splice(index, 1);
};

const removeAntecedent = (index) => {
  formData.antecedants.splice(index, 1);
};

/* ── SOUMISSION FINALE ET TOKENS APDP / HDS ── */
const submitForm = async () => {
  isSaving.value = true;
  try {
    // Transformation stricte des données pour le contrat d'interface du service save()
    const mappedPayload = {
      groupeSanguin: formData.groupeSanguin,
      allergies: formData.allergies.map((a) => ({
        id: a.id,
        severite: a.severite,
      })),
      antecedants: formData.antecedants.map((ant) => ({
        maladie: ant.maladie,
        est_familiale: ant.est_familiale,
        lien_parente: ant.lien_parente,
      })),
    };

    const response = await ProfilInitialisation.save(mappedPayload);
    if (response) {
      toast.success(
        "Votre Passeport de Sécurité Clinique a été généré avec succès."
      );
      closeAndRedirect();
    }
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

// Helper pour associer un code couleur aux sévérités sur le passeport visuel
const getSeverityBadgeClass = (severity) => {
  const s = severity.toLowerCase();
  if (s.includes("critique") || s.includes("élevé"))
    return "bg-danger text-white";
  if (s.includes("modéré") || s.includes("moyen"))
    return "bg-warning text-dark";
  return "bg-info text-white";
};
</script>

<template>
  <MedModal
    v-model="isModalOpen"
    title="Création de votre Identité Clinique d'Urgence"
    size="xl"
    :staticBackdrop="true"
    headerBg="bg-dark text-white"
    :scrollable="true"
  >
    <div
      v-if="isLoading"
      class="row g-4"
    >
      <!-- Squelette du Passeport Gauche (40%) -->
      <div class="col-lg-5">
        <div
          class="p-4 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between"
        >
          <div>
            <div
              class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary-subtle"
            >
              <MedSkeleton shape="circle" width="44px" height="44px" />
              <div class="flex-grow-1">
                <MedSkeleton
                  shape="text"
                  width="65%"
                  height="16px"
                  class="mb-2"
                />
                <MedSkeleton shape="text" width="45%" height="12px" />
              </div>
            </div>

            <!-- Faux bloc Groupe Sanguin -->
            <MedSkeleton
              shape="rectangle"
              height="88px"
              class="rounded-3 my-4"
            />

            <!-- Fausses alertes badges -->
            <div class="mb-4">
              <MedSkeleton
                shape="text"
                width="35%"
                height="12px"
                class="mb-2"
              />
              <div class="d-flex gap-2">
                <MedSkeleton
                  shape="rectangle"
                  width="75px"
                  height="26px"
                  class="rounded-pill"
                />
                <MedSkeleton
                  shape="rectangle"
                  width="90px"
                  height="26px"
                  class="rounded-pill"
                />
              </div>
            </div>

            <!-- Fausses lignes d'antécédents -->
            <div>
              <MedSkeleton
                shape="text"
                width="50%"
                height="12px"
                class="mb-2"
              />
              <MedSkeleton
                shape="rectangle"
                height="38px"
                class="rounded mb-2"
              />
              <MedSkeleton shape="rectangle" height="38px" class="rounded" />
            </div>
          </div>

          <div
            class="d-flex justify-content-between border-top border-secondary-subtle pt-3"
          >
            <MedSkeleton shape="text" width="30%" height="12px" />
            <MedSkeleton shape="text" width="20%" height="12px" />
          </div>
        </div>
      </div>

      <!-- Squelette du Formulaire Droit (60%) -->
      <div
        class="col-lg-7 border-start-lg border-light-subtle px-3 px-lg-4 d-flex flex-column justify-content-between"
      >
        <div>
          <div class="mb-4">
            <MedSkeleton shape="text" width="45%" height="22px" class="mb-2" />
            <MedSkeleton shape="text" width="85%" height="14px" />
          </div>

          <!-- Grille de boutons de groupes sanguins en attente -->
          <div class="row g-3 mb-4">
            <div
              v-for="i in 8"
              :key="'sk-blood-' + i"
              class="col-6 col-sm-4 col-md-3"
            >
              <MedSkeleton shape="rectangle" height="68px" class="rounded-3" />
            </div>
          </div>
        </div>

        <!-- Faux boutons d'action inférieurs -->
        <div
          class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center"
        >
          <MedSkeleton
            shape="rectangle"
            width="90px"
            height="38px"
            class="rounded-xl"
          />
          <MedSkeleton
            shape="rectangle"
            width="120px"
            height="38px"
            class="rounded-xl"
          />
        </div>
      </div>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-5 d-flex flex-column justify-content-between">
        <div
          class="passport-card p-4 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
        >
          <div class="security-watermark position-absolute opacity-05">
            <i class="fas fa-shield-alt"></i>
          </div>

          <div>
            <div
              class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary-subtle"
            >
              <div
                class="passport-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm"
              >
                <MedAvatar
                  :src="user?.photo"
                  :name="`${user?.firstname} ${user?.lastname}`"
                  size="md"
                />
              </div>
              <div>
                <h6 class="fw-bold text-dark mb-0 font-title">
                  {{ user?.nom }}
                </h6>
                <span class="text-muted font-monospace fs-8"
                  >NPI : {{ user?.npi || "0000000000" }}</span
                >
              </div>
            </div>

            <div
              class="text-center my-4 p-3 rounded-3 group-display-box transition"
              :class="
                formData.groupeSanguin !== 'Inconnu'
                  ? 'bg-danger-subtle border border-danger-subtle'
                  : 'bg-white border text-muted'
              "
            >
              <span
                class="fs-8 text-uppercase tracking-wider d-block fw-bold mb-1"
                >Groupe Sanguin Confirmé</span
              >
              <h1
                class="fw-black mb-0 display-4"
                :class="
                  formData.groupeSanguin !== 'Inconnu'
                    ? 'text-danger'
                    : 'text-black-50'
                "
              >
                {{
                  formData.groupeSanguin === "Inconnu"
                    ? "?"
                    : formData.groupeSanguin
                }}
              </h1>
            </div>

            <div class="mb-3">
              <span
                class="fs-8 text-uppercase tracking-wider text-secondary fw-bold d-block mb-2"
                >Bouclier Allergique</span
              >
              <div
                v-if="formData.allergies.length > 0"
                class="d-flex flex-wrap gap-1.5 custom-badge-container"
              >
                <span
                  v-for="allergy in formData.allergies"
                  :key="allergy.id"
                  class="badge rounded-pill d-flex align-items-center gap-1.5 px-2.5 py-1.5 shadow-xs font-monospace fs-8 transition"
                  :class="getSeverityBadgeClass(allergy.severite)"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                  {{ allergy.nom }}
                </span>
              </div>
              <p v-else class="text-muted fs-7 italic px-1">
                Aucune contre-indication enregistrée à ce stade.
              </p>
            </div>

            <div>
              <span
                class="fs-8 text-uppercase tracking-wider text-secondary fw-bold d-block mb-2"
                >Facteurs de Risques & Hérédité</span
              >
              <div
                v-if="formData.antecedants.length > 0"
                class="d-flex flex-column gap-2"
              >
                <div
                  v-for="ant in formData.antecedants"
                  :key="ant.maladie"
                  class="fs-7 p-2 rounded bg-white border border-light-subtle d-flex align-items-center justify-content-between"
                >
                  <span class="text-dark fw-medium"
                    ><i class="fas fa-heartbeat text-primary me-2"></i
                    >{{ ant.nom }}</span
                  >
                  <span
                    v-if="ant.est_familiale"
                    class="badge bg-warning-subtle text-warning-dark border border-warning-subtle font-monospace fs-9"
                  >
                    <i class="fas fa-users me-1"></i>Familial ({{
                      ant.lien_parente || "Oui"
                    }})
                  </span>
                </div>
              </div>
              <p v-else class="text-muted fs-7 italic px-1">
                Aucun antécédent pathologique déclaré.
              </p>
            </div>
          </div>

          <div
            class="mt-4 pt-3 border-top border-secondary-subtle d-flex justify-content-between align-items-center text-secondary fs-8 font-monospace"
          >
            <span
              ><i class="fas fa-lock text-success me-1"></i> Chiffrement
              HDS</span
            >
            <span class="fw-bold text-uppercase">BéninSanté</span>
          </div>
        </div>
      </div>

      <div
        class="col-lg-7 border-start-lg border-light-subtle d-flex flex-column justify-content-between custom-scrollbar px-3 px-lg-4"
        style="overflow-y: auto"
      >
        <div v-if="step === 1" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">
              Étape 1 : Rhesus & Groupe Sanguin
            </h5>
            <p class="text-muted small">
              Sélectionnez votre groupe sanguin d'origine certifié par votre
              laboratoire.
            </p>
          </div>

          <div class="row g-3">
            <div
              v-for="group in refData.groupeSanguin"
              :key="group"
              class="col-6 col-sm-4 col-md-3"
            >
              <div
                @click="formData.groupeSanguin = group"
                class="blood-selector-card text-center p-3 rounded-3 border cursor-pointer transition select-none"
                :class="
                  formData.groupeSanguin === group
                    ? 'border-danger bg-danger-subtle text-danger fw-bold shadow-xs'
                    : 'border-light-subtle bg-white hover-light text-dark'
                "
              >
                <i class="fas fa-tint mb-1 fs-5"></i>
                <span class="d-block tracking-tight font-title fs-5">{{
                  group
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="step === 2" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">
              Étape 2 : Déclaration des Allergies
            </h5>
            <p class="text-muted small">
              Recherchez vos contre-indications alimentaires, environnementales
              ou médicamenteuses.
            </p>
          </div>

          <div class="mb-4">
            <MedAutoComplete
              v-model="selectedAllergyItem"
              :categories="filteredAllergiesCategories"
              placeholder="Rechercher un allergène (ex: Arachides, Pénicilline...)"
              label="Recherche d'allergie ou intolérance"
              @search-change="(q) => (allergySearchQuery = q)"
            />
          </div>

          <div class="added-items-list border rounded bg-light p-3">
            <h6
              class="fs-8 text-uppercase tracking-wider text-secondary fw-bold mb-3"
            >
              Allergènes déclarés ({{ formData.allergies.length }})
            </h6>
            <div
              v-if="formData.allergies.length > 0"
              class="d-flex flex-column gap-2"
            >
              <div
                v-for="(allergy, idx) in formData.allergies"
                :key="allergy.id"
                class="row g-2 align-items-center bg-white p-2 rounded border shadow-xs"
              >
                <div class="col-sm-5 text-dark fw-medium small text-truncate">
                  <i class="fas fa-shield-virus text-info me-2"></i
                  >{{ allergy.nom }}
                </div>
                <div class="col-sm-5">
                  <select
                    v-model="allergy.severite"
                    class="form-select form-select-sm border-light-subtle font-monospace fs-8"
                  >
                    <option
                      v-for="sev in refData.niveauSeverite"
                      :key="sev"
                      :value="sev"
                    >
                      Niveau : {{ sev }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-2 text-end">
                  <button
                    @click="removeAllergy(idx)"
                    class="btn btn-sm text-danger border-0 p-1 hover-light rounded-circle"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-muted fs-7 italic mb-0 text-center py-3">
              Aucune allergie ajoutée à la table d'urgence.
            </p>
          </div>
        </div>

        <div v-else-if="step === 3" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">
              Étape 3 : Antécédents Pathologiques
            </h5>
            <p class="text-muted small">
              Déclarez les maladies chroniques ou génétiques pour optimiser vos
              soins d'urgence.
            </p>
          </div>

          <div class="mb-3">
            <MedAutoComplete
              v-model="selectedAntecedentItem"
              :categories="filteredAntecedentsCategories"
              placeholder="Rechercher une pathologie (ex: Diabète, Hypertension...)"
              label="Recherche de maladie chronique"
              @search-change="(q) => (antecedentSearchQuery = q)"
              @select="selectAntecedentForSetup"
            />
          </div>

          <div
            v-if="selectedAntecedentItem"
            class="bg-primary-subtle border border-primary-subtle rounded p-3 mb-4 animate-step"
          >
            <h6 class="fw-bold text-primary mb-2 fs-7">
              <i class="fas fa-cog me-2"></i>Configuration clinique :
              {{ selectedAntecedentItem.title }}
            </h6>
            <div class="d-flex flex-column gap-3">
              <MedToggle
                v-model="tempAntecedentMeta.est_familiale"
                label="Cet antécédent est-il d'origine héréditaire / familiale ?"
                variant="primary"
                size="normal"
              />
              <div v-if="tempAntecedentMeta.est_familiale" class="animate-step">
                <label class="form-label text-dark fw-medium fs-8 mb-1"
                  >Lien de parenté (ex: Père, Mère, Grand-père...)</label
                >
                <input
                  v-model="tempAntecedentMeta.lien_parente"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Précisez le lien familial..."
                  required
                />
              </div>
              <div class="text-end">
                <button
                  @click="confirmAntecedentAddition"
                  class="btn btn-primary btn-sm px-3 font-title fw-bold rounded-2"
                >
                  Valider l'ajout
                </button>
              </div>
            </div>
          </div>

          <div class="added-items-list border rounded bg-light p-3">
            <h6
              class="fs-8 text-uppercase tracking-wider text-secondary fw-bold mb-3"
            >
              Antécédents enregistrés ({{ formData.antecedants.length }})
            </h6>
            <div
              v-if="formData.antecedants.length > 0"
              class="d-flex flex-column gap-2"
            >
              <div
                v-for="(ant, idx) in formData.antecedants"
                :key="ant.maladie"
                class="d-flex align-items-center justify-content-between bg-white p-2 rounded border shadow-xs"
              >
                <div class="text-dark fw-medium small">
                  <i class="fas fa-notes-medical text-primary me-2"></i
                  >{{ ant.nom }}
                  <span
                    v-if="ant.est_familiale"
                    class="text-muted fs-8 d-block ms-4"
                    >Héréditaire : Hérédité confirmée ({{
                      ant.lien_parente || "Oui"
                    }})</span
                  >
                </div>
                <button
                  @click="removeAntecedent(idx)"
                  class="btn btn-sm text-danger border-0 p-1 hover-light rounded-circle"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-muted fs-7 italic mb-0 text-center py-3">
              Aucun antécédent médical greffé pour le moment.
            </p>
          </div>
        </div>

        <div v-else-if="step === 4" class="animate-step">
          <div class="mb-4">
            <h5 class="fw-bold text-dark font-title mb-1">
              Étape 4 : Signature Clinique & Sécurisation
            </h5>
            <p class="text-muted small">
              Veuillez valider l'exactitude des informations portées sur votre
              carte d'urgence numérique.
            </p>
          </div>

          <div
            class="card border-success-subtle bg-success-subtle p-3 rounded-3 mb-4"
          >
            <div class="d-flex gap-3 text-success">
              <i class="fas fa-user-shield fs-4 mt-1"></i>
              <div>
                <h6 class="fw-bold mb-1 font-title">
                  Déclaration de conformité APDP & HDS
                </h6>
                <p class="fs-7 text-success-dark mb-0 lh-base">
                  En scellant ce passeport, vous attestez de la véracité de vos
                  déclarations de santé. Ces éléments cryptographiques exclusifs
                  seront mis à disposition exclusive du corps médical béninois
                  habilité en cas d'intervention critique ou d'urgence absolue.
                </p>
              </div>
            </div>
          </div>

          <ul
            class="list-group list-group-flush border rounded-3 bg-white font-monospace fs-8"
          >
            <li class="list-group-item d-flex justify-content-between">
              <span>Groupe Sanguin :</span>
              <strong class="text-danger">{{ formData.groupeSanguin }}</strong>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Contre-indications Allergies :</span>
              <strong class="text-dark"
                >{{ formData.allergies.length }} allergène(s)</strong
              >
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Antécédents recensés :</span>
              <strong class="text-dark"
                >{{ formData.antecedants.length }} pathologie(s)</strong
              >
            </li>
          </ul>
        </div>

        <div
          class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center"
        >
          <button
            v-if="step > 1"
            @click="step--"
            class="btn btn-outline-secondary px-3 font-title fw-bold rounded-xl text-muted"
            :disabled="isSaving"
          >
            Précédent
          </button>
          <div v-else></div>

          <MedButton
            @click="step === 4 ? submitForm() : step++"
            :loading="isSaving"
            size="md"
            class="px-4 py-2.5 font-title fw-bold shadow-sm rounded-xl"
            :variant="step === 4 ? 'success' : 'primary'"
          >
            {{ step === 4 ? "Sceller mon Passeport Santé" : "Suivant" }}
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
.modal-header-texte {
  color: white !important;
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

/* Styles spécifiques du Passeport d'Urgence (Gauche) */
.passport-card {
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.015),
    0 4px 15px rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.passport-avatar {
  width: 2.75rem;
  height: 2.75rem;
  background-color: var(--medical-primary) !important;
}
.security-watermark {
  bottom: -20px;
  right: -20px;
  font-size: 10rem;
  color: rgba(0, 0, 0, 0.02);
  pointer-events: none;
}
.group-display-box {
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.03);
}

/* Grille interactive de sélection de sang (Étape 1) */
.blood-selector-card:hover {
  transform: translateY(-2px);
  border-color: rgba(220, 53, 69, 0.4) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

/* Alignement responsif pour les bordures de colonnes */
@media (min-width: 992px) {
  .border-start-lg {
    border-left: 1px solid var(--bs-border-color) !important;
  }
}

/* Animations de transition fluides des étapes */
.animate-step {
  animation: step-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes step-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>