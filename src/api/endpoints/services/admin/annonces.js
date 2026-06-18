import { apiUpload } from "@/api/clients/upload";
import { api } from "@/api/clients/main";

export const DRAFT_KEY = 'beninsante_annonce_draft';

export const AnnonceApi = {
   // creer une annonce
   storeAnnonce: async (data) => {
      if (!CheckApiData.storeAnnonce(data))
         return { error: "Données invalides" };
      return await apiUpload.post("/annonces", data);
   },
   // modifier une annonce
   updateAnnonce: async (data) => {
      if (!CheckApiData.updateAnnonce(data))
         return { error: "Données invalides" };
      return await apiUpload.patch(`/annonces/${data.id}`, data);
   },
   // supprimer une annonce
   deleteAnnonce: async (id) => {
      return await api(`/annonces/${id}`, {
         method: 'DELETE'
      });
   },
   //archiver une annonce
   archiveAnnonce: async (id) => {
      return await api(`/annonces/${id}/archive`, {
         method: 'PATCH'
      });
   },
   // recuperer toutes les annonces
   getAllAnnonces: async () => {
      const response = await api('/annonces/all');

      return CheckApiData.formatAllAnnonce(response.data);
   },
   // recuperer une annonce par son id
   getAnnonceById: async (id) => {
      const response = await api(`/annonces/${id}/admin`);
      return CheckApiData.formalAnnonce(response.data);
   },

   saveDraftAnnonce: (data) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
         titre: data.titre,
         description: data.description,
         contenu: data.contenu,
         categorie: data.categorie,
         categorieCustom: data.categorieCustom,
         isVisible: data.isVisible,
         dateExpiration: data.dateExpiration
      }));
   },

   getDraftAnnonce: () => {
      const draft = localStorage.getItem(DRAFT_KEY);
      const data = draft ? JSON.parse(draft) : null
      const form = {
         titre: '',
         description: '',
         content: '',
         categorie: '',
         categorieCustom: '',
         isVisible: true,
         dateExpiration: ''
      }
      if (!data) return form;
      if (data.titre) form.titre = data.titre;
      if (data.description) form.description = data.description;
      if (data.content) form.content = data.content;
      if (data.categorie) form.categorie = data.categorie;
      if (data.categorieCustom) form.categorieCustom = data.categorieCustom;
      if (data.dateExpiration) form.dateExpiration = data.dateExpiration;
      if (typeof data.isVisible === 'boolean') form.isVisible = data.isVisible;

      return form;
   },
}

const CheckApiData = {
   storeAnnonce: (data) => {
      if (!data.titre || !data.description || !data.image || !data.categorie) {
         return false;
      }

      if (data.image && !(data.image instanceof File)) {
         return false;
      }

      return true;
   },

   updateAnnonce: (data) => {
      if (!data.titre || !data.description || !data.image || !data.categorie) {
         return false;
      }

      if (data.image && !(data.image instanceof File)) {
         return false;
      }

      return true;
   },

   formalAnnonce: (data) => {
      const defaultCategories = [
         { label: "Alerte Sanitaire", value: "alerte" },
         { label: "Information Générale", value: "info" },
         { label: "Protocole", value: "protocole" },
         { label: "Événement", value: "evenement" },
      ]
      data.categorie = defaultCategories.find(cat => cat.value === data.categorie) || { label: data.categorie, value: data.categorie }
      return {
         id: data.id,
         titre: data.titre,
         description: data.description,
         content: data.content,
         categorie: data.categorie.label,
         image: data.image_couverture_url,
         video: data.video_url,
         expire: data.expire,
         joursRestants: data.jours_restants,
         createdAt: data.created_at
      };
   },

   formatAllAnnonce: (data) => {
      const archivedAnnonces = []
      const activeAnnonces = []

      data.forEach(annonce => {
         if (annonce.est_active) {
            activeAnnonces.push(annonce);
         }
         else {
            archivedAnnonces.push(annonce);
         }
      });

      const defaultCategories = [
         { label: "Alerte Sanitaire", value: "alerte" },
         { label: "Information Générale", value: "info" },
         { label: "Protocole", value: "protocole" },
         { label: "Événement", value: "evenement" },
      ]

      return {
         archivedAnnonces: archivedAnnonces.map(annonce => {

            if (annonce.categorie) {
               annonce.categorie = defaultCategories.find(cat => cat.value === annonce.categorie) || { label: annonce.categorie, value: annonce.categorie }
            }
            
            return {
               id: annonce.id,
               titre: annonce.titre,
               description: annonce.description,
               content: annonce.content,
               categorie: annonce.categorie.label,
               image: annonce.image_couverture_url,
               video: annonce.video_url,
               expire: annonce.expire,
               joursRestants: annonce.jours_restants,
               createdAt: annonce.created_at
            };
         }),
         activeAnnonces: activeAnnonces.map(annonce => {
            if (annonce.categorie) {
               annonce.categorie = defaultCategories.find(cat => cat.value === annonce.categorie) || { label: annonce.categorie, value: annonce.categorie }
            }
            return {
               id: annonce.id,
               titre: annonce.titre,
               description: annonce.description,
               content: annonce.content,
               categorie: annonce.categorie.label,
               image: annonce.image_couverture_url,
               video: annonce.video_url,
               expire: annonce.expire,
               joursRestants: annonce.jours_restants,
               createdAt: annonce.created_at
            };
         })
      }
   }
}