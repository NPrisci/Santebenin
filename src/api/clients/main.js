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
      const data = response._data
      if (data && data.success === false) {
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
         throw {
            status: 0,
            title: 'Erreur réseau',
            message: 'Impossible de se connecter au serveur.',
         }
      }

      const { status } = response
      const data = response._data || {}

      // GESTION DU 401 (Non authentifié)
      if (status === 401) {
         console.log('test login')
         // Optionnel : Vérifier si on est déjà sur la page login pour éviter une boucle
         const currentRoute = router.currentRoute.value.name;
         if (currentRoute !== 'login') {
            clearAuth();            
            showToast.warning('Session expirée. Redirection vers la connexion...');
            // Délai plus court ou immédiat selon préférence
            setTimeout(() => {
               router.push({ name: 'login' });
            }, 2000); 
         } else {
            // Si on est déjà sur login, on affiche juste le message d'erreur sans rediriger
            showToast.error(data.message || 'Session expirée.');
         }
      }

      // GESTION DU 403 (Accès interdit)
      if (status === 403) {
         showToast.warning('Vous n\'avez pas les autorisations nécessaires');
         // Attention : Ne pas rediriger vers 403 en boucle si on est déjà dessus
         const currentRoute = router.currentRoute.value.name;
         if (currentRoute !== '403') {
            setTimeout(() => router.push({ name: '403' }), 1500);
         }
      }

      // GESTION DES ERREURS 500+
      if (status >= 500) {
         const token = data.rule || data.trace_id || `BS-ERR-${status}-${Date.now()}`;
         triggerServerError(token);
      }

      // Construction du message d'erreur à remonter à l'appelant
      const errors = {
         401: { title: 'Non authentifié', message: data.message || 'Session expirée.' },
         403: { title: 'Accès interdit', message: data.message || 'Droits insuffisants.' },
         404: { title: 'Introuvable', message: data.message || 'Ressource inexistante.' },
         422: { title: 'Validation', message: data.message || 'Données invalides.' },
         429: { title: 'Trop de requêtes', message: data.message || 'Veuillez patienter.' },
      };

      const defaultError = { title: 'Erreur', message: data.message || 'Erreur inattendue.' };

      throw errors[status] || defaultError;
   }
})
