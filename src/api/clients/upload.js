import axios from 'axios'
import { useToast } from '@/composables/useToast'
import router from '@/router'

const { showToast } = useToast()
/**
 * Instance secondaire dédiée aux transferts de fichiers lourds
 */
export const apiUpload = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL,
   headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'client': 'web'
   }
})

// On injecte le token au cas où l'upload demande d'être connecté
apiUpload.interceptors.request.use((config) => {
   const token = localStorage.getItem('auth_token')
   if (token) {
      config.headers.Authorization = `Bearer ${token}`
   }
   return config
})

// gestion des erreurs
apiUpload.interceptors.response.use(
   // En cas de succès (2xx), on laisse passer la réponse
   (response) => response,

   // En cas d'erreur (4xx, 5xx, etc.)
   async (error) => {
      const status = error.response?.status
      const message = error.response?.data?.message || "Une erreur est survenue"

      // CAS 1 : Token invalide ou expiré (401)
      if (status === 401) {
         showToast('Vous n\'avez pas les autorisations nécessaires', 'warning')
         // On retire le token pour forcer la déconnexion
         localStorage.removeItem("auth_token")
         setTimeout(() => {
            router.push({ name: 'login' })
         }, 3500)

      }

      // CAS 2 : Erreur de validation (422) ou autre 4xx
      if (status === 422) {
         showToast(message, 'warning')
         console.error("Erreur de validation :", message)
      }

      // CAS 3 : Erreur serveur (5xx)
      if (status >= 500) {
         showToast(message, 'error')
         console.error("Erreur serveur :", message)
      }

      // On propage l'erreur pour que le composant puisse réagir
      return Promise.reject(error)
   }
)