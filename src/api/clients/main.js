import { ofetch } from 'ofetch'
import router from '@/router'
import { useToast } from '@/composables/useToast'
import { useServerError } from '@/composables/useServerError'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CALL_API_TIMEOUT = Number(import.meta.env.VITE_CALL_API_TIMEOUT) || 30000
const showToast = useToast()
const { triggerServerError } = useServerError()

/**
 * Instance principale pour les requêtes JSON
 */
export const api = ofetch.create({
   baseURL: API_BASE_URL,
   timeout: CALL_API_TIMEOUT,
   headers: {
      'Accept': 'application/json',
      'client': 'web'
   },

   /**
    * INTERCEPTEUR DE REQUÊTE
    */
   onRequest({ options }) {
      const token = localStorage.getItem('auth_token')
      if (token) {
         options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
         }
      }
   },

   /**
    * INTERCEPTEUR DE RÉPONSE (Succès)
    */
   onResponse({ response }) {
      const data = response._data
      if (data && data.success === false) {
         showToast.error(data.message || 'Opération échouée')
         throw {
            status: response.status,
            title: 'Échec',
            message: data.message || 'Opération échouée',
         }
      }
   },

   /**
    * INTERCEPTEUR D'ERREUR (Statuts HTTP)
    */
   onResponseError({ response }) {
      if (!response) {
         showToast.error('Impossible de se connecter au serveur.')
         throw {
            status: 0,
            title: 'Erreur réseau',
            message: 'Impossible de se connecter au serveur.',
         }
      }

      const { status } = response
      const data = response._data || {}

      if (status === 401) {
         showToast.warning('Vous n\'avez pas les autorisations nécessaires')
         setTimeout(() => {
            router.push({ name: 'login' })
         }, 3500)
      }
      if (status === 403) {
         showToast.warning('Vous n\'avez pas les autorisations nécessaires')
         setTimeout(() => {
            router.push({ name: '403' })
         }, 3500)
      }
      if (status >= 500) {
         const token = data.rule || data.trace_id || `BS-ERR-${status}-${Date.now()}`
         triggerServerError(token)
      }

      const errors = {
         401: { title: 'Non authentifié', message: data.message || 'Session expirée.' },
         403: { title: 'Accès interdit', message: data.message || 'Droits insuffisants.' },
         404: { title: 'Introuvable', message: data.message || 'Ressource inexistante.' },
         422: { title: 'Validation', message: data.message || 'Données invalides.' },
         429: { title: 'Trop de requêtes', message: data.message || 'Veuillez patienter.' },
      }

      const defaultError = { title: 'Erreur', message: data.message || 'Erreur inattendue.' }

      // Avec ofetch, on utilise "throw" au lieu de "Promise.reject"
      throw errors[status] || defaultError
   }
})