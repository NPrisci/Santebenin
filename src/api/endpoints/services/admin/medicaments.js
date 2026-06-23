import { api } from "@/api/clients/main";

const MedicamentsService = {
   all: async (page = 1, perPage = 15) => {
      const response = await api(`/medicaments?page=${page}&per_page=${perPage}`);

      const data = {
         'items': response.data.items,
         'pagination': response.data.pagination
      }

      return data
   },

   store: async (data) => {
      if (!CheckApiData.storeMedicament(data)) {
         return { error: "Données invalides" };
      }

      return await api(`/medicaments`, {
         method: "POST",
         body: JSON.stringify(data),
      })
   },

   update: async (data) => {
      if (!CheckApiData.updateMedicament(data)) {
         return { error: "Données invalides" };
      }

      return await api(`/medicaments/${data.id}`, {
         method: "PATCH",
         body: JSON.stringify(data),
      })
   },

   delete: async (id) => {
      return await api(`/medicaments/${id}`, {
         method: "DELETE",
      })
   }
}

const CheckApiData = {
   storeMedicament: (data) => {
      if (!data.nom || !data.code || !data.nom_generique || !data.forme || data.dosage) {
         return false;
      }

      return true;
   },

   updateMedicament: (data) => {
      if (!data.id || !data.nom || !data.code || !data.nom_generique || !data.forme || data.dosage) {
         return false;
      }

      return true;
   },
}
