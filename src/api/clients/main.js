import { ofetch } from 'ofetch'
import router from '@/router'
import { useToast } from '@/composables/useToast'
import { useServerError } from '@/composables/useServerError'
import { clearAuth } from './auth'

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
      if (!response) {
         throw {
            status: 0,
            title: 'Erreur réseau',
            message: 'Impossible de se connecter au serveur.',
         }
      }

      const { status } = response
      const data = response._data || {}

      if (status === 401) {
         clearAuth();
         showToast.warning('Vous n\'avez pas les autorisations nécessaires')
         setTimeout(() => {
            router.push({ name: 'login' })
         }, 2000)
      }
      if (status === 403) {
         showToast.warning('Vous n\'avez pas les autorisations nécessaires')
         setTimeout(() => {
            router.push({ name: '403' })
         }, 1000)
      }
      if (status >= 500) {
         const token = data.rule || data.trace_id || `BS-ERR-${status}-${Date.now()}`
         triggerServerError(token)
      }

      if (status === 404) {
         throw { title: 'Introuvable', message: data.message || 'Ressource inexistante.' }
      }

      if (status === 422) {
         throw { title: 'Validation', message: data.message || 'Données invalides.' }
      }

      if (status === 429) {
         throw { title: 'Trop de requêtes', message: data.message || 'Veuillez patienter.' }
      }

      if (data && data.success === false) {
         throw {
            status: response.status,
            title: 'Échec',
            message: data.message || 'Opération échouée',
         }
      }

      return data;
   },
})
