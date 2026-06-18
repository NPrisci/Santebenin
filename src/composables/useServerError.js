import { ref } from 'vue'

// État global partagé : un seul objet pour tout le projet
const hasServerError = ref(false)
const errorToken = ref('')

export function useServerError() {

  /**
   * Déclenche l'affichage de la page d'erreur 500.
   * À appeler depuis les intercepteurs Axios ou les blocs catch.
   * @param {string} token - Code d'erreur technique (ex: "BS-ERR-500-API-992A")
   */
  const triggerServerError = (token = '') => {
    errorToken.value = token || `BS-ERR-500-${Date.now()}`
    hasServerError.value = true
  }

  /**
   * Efface l'état d'erreur (utile pour le bouton "Réessayer").
   */
  const clearServerError = () => {
    hasServerError.value = false
    errorToken.value = ''
  }

  return {
    hasServerError,
    errorToken,
    triggerServerError,
    clearServerError
  }
}
