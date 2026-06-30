import { api } from "@/api/clients/main";

const ProfilInitialisation = {
   async userData() {
      const response = await api('/user/baseinfos')
      return response.data
   },

   async check() {
      const response = await api('/profil/check')
      return response.checking
   },

   // 1. Adaptation au nouveau format de retour (listes de choix)
   async init() {
      const response = await api('/profil/init')
      return {
         groupesSanguins: response.groups || [],
         maladiesDisponibles: response.maladies || [],
         medicamentsDisponibles: response.medicaments || []
      }
   },

   // 2. Formatage des données selon le payload attendu par la nouvelle API Laravel
   async save(data) {
      const response = await api('/profil/save', {
         method: 'POST',
         body: {
            groupe: data.groupeSanguin,
            antecedents: data.antecedents.map(antecedent => {
               const formattedAntecedent = {
                  designation: antecedent.designation,
                  type: antecedent.type,
                  date_debut: antecedent.dateDebut || null,
                  notes: antecedent.notes || null
               }

               // Ajout conditionnel des UUIDs si présents
               if (antecedent.type === 'maladie' && antecedent.maladieId) {
                  formattedAntecedent.maladie_id = antecedent.maladieId
               }
               
               if (antecedent.type === 'medicament' && antecedent.medicamentId) {
                  formattedAntecedent.medicament_id = antecedent.medicamentId
               }

               return formattedAntecedent
            })
         }
      })
      return response
   }
}

export default ProfilInitialisation