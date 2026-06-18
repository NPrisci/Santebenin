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

   async init() {
      const response = await api('/profil/init')
      return {
         groupeSanguin: response.groupe_sanguin,
         allergies: response.possible_allergies,
         antecedants: response.possible_maladies_chroniques,
         niveauSeverite: response.possible_severity
      }
   },

   async save(data) {
      const response = await api('/profil/save', {
         method: 'POST',
         body: {
            groupe_sanguin: data.groupeSanguin,
            allergies: data.allergies,
            antecedents: data.antecedants
         }
      })
      return response
   }
}

export default ProfilInitialisation