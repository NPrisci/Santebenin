import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUiStore } from './ui'
import { getAuthToken, isAdmin } from '@/api/clients/auth'
import { useToast } from '@/composables/useToast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

const toast = useToast()

// 🎛️ Navigation Guard
router.beforeEach(async (to, from) => {
  const uiStore = useUiStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !getAuthToken()) {
    toast.error('Vous devez être connecté pour accéder à cette page')

    // 2. On attend sagement 1 seconde que le toast s'affiche
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 3. On retourne la redirection DIRECTEMENT au routeur
    return { name: 'login' }
  }

  if (!isAdmin()) {
    toast.error('Vous ne disposez pas de droits suffisants pour accéder à cette page')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { name: 'login' }
  }

  // 1. On vérifie si l'une des routes de la lignée demande à attendre des données
  const needsData = to.matched.some((record) => record.meta.waitForData)

  // 2. On récupère la zone (définie sur le parent ou l'enfant)
  const currentZone = to.matched.find((record) => record.meta.zone)?.meta.zone

  if (needsData && currentZone === 'admin') {
    uiStore.setDashLoading(true)
  }

  if (needsData && currentZone === 'main') {
    uiStore.setMainLoading(true)
  }

  if (needsData && currentZone === 'professional') {
    uiStore.setProLoading(true)
  }

  // 4. Si on arrive ici, tout est OK, on autorise explicitement la navigation
  return true
})

export default router
