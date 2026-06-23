<script setup>
import { ref } from "vue";
import MedAutocomplete from "@/components/common/MedAutoComplete.vue";
import MedicamentsService from "@/api/endpoints/services/admin/medicaments";

// Liaison bidirectionnelle avec le composant parent (émet le médicament sélectionné)
const model = defineModel({
  type: Object,
  default: null,
});

defineProps({
  label: {
    type: String,
    default: "Rechercher un médicament",
  },
  placeholder: {
    type: String,
    default: "Ex: Paracétamol ou Dafalgan...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  helpText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["select", "clear"]);

const categories = ref([]);
const isLoading = ref(false);

/**
 * Gère la recherche à chaque saisie de l'utilisateur (débouncée à 300ms par le composant de base)
 */
const handleSearchChange = async (query) => {
  const cleanQuery = query?.trim().toLowerCase();

  if (!cleanQuery || cleanQuery.length < 2) {
    categories.value = [];
    return;
  }

  isLoading.value = true;

  try {
    // Appel au service de recherche
    const rawMedicaments = await MedicamentsService.medicaments(cleanQuery);

    if (!rawMedicaments || rawMedicaments.length === 0) {
      categories.value = [];
      return;
    }

    // Transformation et regroupement par Forme Galénique
    categories.value = groupMedicamentsByForm(rawMedicaments);
  } catch (error) {
    console.error("Erreur lors de la récupération des médicaments :", error);
    categories.value = [];
  } finally {
    isLoading.value = false;
  }
};

/**
 * Formate et regroupe les médicaments pour correspondre à la structure attendue par MedAutocomplete
 */
const groupMedicamentsByForm = (medicamentsList) => {
  const groups = {};

  medicamentsList.forEach((med) => {
    const formLabel = med.forme_galenique || "Autre";

    if (!groups[formLabel]) {
      groups[formLabel] = [];
    }

    // Le composant de base exige les propriétés 'title' et 'subtitle'
    groups[formLabel].push({
      id: med.id,
      title: med.nom_commercial,
      subtitle: `${med.nom_generique_dci} • ${med.dosage} ${med.cip_ean ? "(EAN: " + med.cip_ean + ")" : ""}`,
      // Sauvegarde des données d'origine si besoin au moment de la sélection
      raw: med,
    });
  });

  // Transformation du dictionnaire en tableau de catégories
  return Object.keys(groups).map((form, index) => ({
    id: `cat-${index}-${form.toLowerCase().replace(/\s+/g, "-")}`,
    label: form,
    items: groups[form],
  }));
};

const handleSelect = (selection) => {
  emit("select", selection.item);
};

const handleClear = () => {
  categories.value = [];
  emit("clear");
};
</script>

<template>
  <div class="med-auto-medicaments-container w-100">
    <MedAutocomplete
      v-model="model"
      :categories="categories"
      :label="label"
      :placeholder="placeholder"
      :loading="isLoading"
      :disabled="disabled"
      :error="error"
      :help-text="helpText"
      icon="fas fa-pills"
      @search-change="handleSearchChange"
      @select="handleSelect"
      @clear="handleClear"
    />
  </div>
</template>

<style scoped>
/* Alignement sur la charte graphique globale de l'application */
.med-auto-medicaments-container {
  --medical-primary: var(--bs-primary, #0d6efd);
}
</style>
