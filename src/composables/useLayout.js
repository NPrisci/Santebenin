import { ref, computed, onMounted, onUnmounted } from 'vue'
import router from '@/router'
import AuthService from '@/api/endpoints/auth/login'
import ProfilInitialisation from '@/api/endpoints/services/patient/initialisation'
import { clearAuth, getUsedRole } from '@/api/clients/auth'
import { useToast } from './useToast'

const isRightPanelOpen = ref(false)
const isSidebarExpanded = ref(true)   // Desktop
const isMobileSidebarOpen = ref(false) // Mobile drawer
const userRole = ref(getUsedRole())

const toast = useToast()
const userFullName = ref('Utilisateur')
const userPhoto = ref('')
const currentDate = ref('')


export function useLayout() {
   // Message de bienvenue dynamique selon l'heure
   const welcomeMessage = computed(() => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Bon début de journée !'
      if (hour < 18) return 'Bonne après-midi !'
      return 'Bonne soirée !'
   })

   // Liste des notifications
   const notifications = ref([
      {
         id: 1,
         title: 'Nouveau résultat disponible',
         message: "Vos résultats d'analyse sont prêts",
         time: 'Il y a 5 minutes',
         icon: 'pi pi-file-pdf',
         bgColor: 'bg-blue-100',
         iconColor: 'text-blue-600',
      },
      {
         id: 2,
         title: 'Rendez-vous confirmé',
         message: 'Votre rendez-vous du 15 juin est confirmé',
         time: 'Il y a 2 heures',
         icon: 'pi pi-calendar',
         bgColor: 'bg-green-100',
         iconColor: 'text-green-600',
      },
      {
         id: 3,
         title: 'Rappel médicament',
         message: "N'oubliez pas de prendre votre traitement",
         time: 'Il y a 3 heures',
         icon: 'pi pi-clock',
         bgColor: 'bg-orange-100',
         iconColor: 'text-orange-600',
      },
   ])

   const logout = () => {
      AuthService.logout().then(() => {
         clearAuth()
         toast.success('Déconnexion réussie')
         setTimeout(() => {
            router.push('/login')
         }, 2000)
      })
   }

   const updateDate = () => {
      const options = {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      }
      currentDate.value = new Date().toLocaleDateString('fr-FR', options)
   }

   const getUserData = async () => {
      const response = await ProfilInitialisation.userData()

      return { nom: response?.nom, photo: response?.photo }
   }

   // Cycle de vie lié au layout
   onMounted(async () => {
      updateDate()
      const userData = await getUserData()
      userFullName.value = userData.nom || 'Utilisateur'
      userPhoto.value = userData.photo || ''
   })

   return {
      userFullName,
      userPhoto,
      currentDate,
      welcomeMessage,
      logout,
      notifications,
   }
}

export function useDashboard() {

   const toggleRightPanel = () => {
      isRightPanelOpen.value = !isRightPanelOpen.value
   }

   // Desktop : Bascule mode réduit / étendu
   const toggleSidebar = () => {
      isSidebarExpanded.value = !isSidebarExpanded.value
   }

   // Mobile : Ouvre / ferme le tiroir overlay
   const toggleMobileSidebar = () => {
      isMobileSidebarOpen.value = !isMobileSidebarOpen.value
   }

   const closeMobileSidebar = () => {
      isMobileSidebarOpen.value = false
   }

   const changeRole = (newRole) => {
      userRole.value = newRole
   }

   const userData = async () => {
      const response = await ProfilInitialisation.userData()
      return response.data
   }

   return {
      isRightPanelOpen,
      isSidebarExpanded,
      isMobileSidebarOpen,
      userRole,
      toggleRightPanel,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar, 
      changeRole,
      userData
   }
}