import { api } from "@/api/clients/main";
import listeMedicaments from '@/assets/json/medicamens.json'

const MedicamentsService = {
  all: async (page = 1, perPage = 15) => {
    const response = await api(`/medicaments?page=${page}&per_page=${perPage}`);

    const data = {
      items: response.items,
      pagination: response.pagination,
    };

    return data;
  },

  getMedicament: async (id) => {
    const response = await api(`/medicaments/${id}`);
    return response.data;
  },

  store: async (data) => {
    if (!CheckApiData.storeMedicament(data)) {
      throw new Error("Données invalides");
    }

    return await api(`/medicaments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (data) => {
    if (!CheckApiData.updateMedicament(data)) {
      return { error: "Données invalides" };
    }

    return await api(`/medicaments/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return await api(`/medicaments/${id}`, {
      method: "DELETE",
    });
  },

  formes: async () => {
    const response = await api(`/medicaments/forms`);
    return response;
  },

  medicaments: async (query = '') => {
    const response = listeMedicaments.medicaments
      .filter(
        (med) =>
          med.nom_commercial.toLowerCase().includes(query) || med.nom_generique_dci.toLowerCase().includes(query),
      )
      .slice(0, 10);

   return response
  },
};

const CheckApiData = {
  storeMedicament: (data) => {
    if (!data.nom || !data.code || !data.nom_generique || !data.forme || !data.dosage) {
      return false;
    }

    return true;
  },

  updateMedicament: (data) => {
    if (!data.id || !data.nom || !data.code || !data.nom_generique || !data.forme || !data.dosage) {
      return false;
    }

    return true;
  },
};

export default MedicamentsService;
