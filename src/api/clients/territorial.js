import beninData from '@/assets/json/decoupage_territorial_benin.json'

export const Territoire = {
   /**
    * Récupère la liste brute de tous les départements (avec leurs villes imbriquées).
    * Retourne directement le tableau JSON source.
    * Chaque élément : { id_dep, lib_dep, villes: [...] }
    */
   getDepartements() {
      return beninData
   },

   /**
    * Récupère la liste de toutes les villes du Bénin à plat,
    * avec le nom et l'identifiant de leur département d'appartenance.
    * Retourne : [{ id, nom, departement, idDepartement }]
    */
   getVilles() {
      const villes = []

      beninData.forEach((dep) => {
         if (!dep.villes) return

         dep.villes.forEach((ville) => {
            villes.push({
               id: ville.id_ville,
               nom: ville.lib_ville,
               departement: dep.lib_dep,
               idDepartement: dep.id_dep,
            })
         })
      })

      return villes
   },

   /**
    * Filtre et récupère uniquement les villes d'un département spécifique (par son nom).
    * @param {string} nomDepartement - Ex: "ALIBORI" (insensible à la casse)
    * Retourne les objets villes bruts : [{ id_ville, lib_ville }]
    */
   getVillesParDepartement(nomDepartement) {
      if (!nomDepartement) return []

      const query = nomDepartement.trim().toLowerCase()
      const dep = beninData.find((d) => d.lib_dep.toLowerCase() === query)

      return dep ? dep.villes : []
   },

   /**
    * Recherche globale d'une ville par son nom (recherche partielle, insensible à la casse).
    * @param {string} requete - Le texte saisi par l'utilisateur (Ex: "Coto")
    * Retourne : [{ id, nom, departement, idDepartement }]
    */
   rechercherVille(requete) {
      if (!requete) return this.getVilles()

      const query = requete.trim().toLowerCase()
      return this.getVilles().filter((ville) =>
         ville.nom.toLowerCase().includes(query),
      )
   },
}