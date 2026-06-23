import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import DashLayout from '@/layouts/DashLayout.vue'
import ProfessionalLayout from '@/layouts/ProfessionalLayout.vue'

export const routes = [
  // 🌍 1. ZONE PUBLIQUE VITRINE (Zéro attente, instantané)
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/public/HomePage.vue'),
      },
    ],
  },

  // 🧪 2. ZONE TEST UI
  {
    path: '/testui',
    name: 'test-ui',
    component: () => import('@/pages/TestUiPage.vue'),
  },

  // 🔑 3. ZONE AUTHENTIFICATION
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
      },
    ],
  },

  // 4. Zone de redirection
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/auth/ServicePage.vue'),
  },

  // 5. Zone Dashboard du patient
  {
    path: '/p/initialise',
    name: 'patient-init',
    meta: { requiresAuth: true },
    component: () => import('@/pages/services/patient/InitiationProfilPage.vue'),
  },
  {
    path: '/p',
    name: 'patient-service',
    component: MainLayout,
    meta: { requiresAuth: true, waitForData: true, zone: 'main' },
    children: [
      {
        path: 'espace',
        name: 'patient-space',
        component: () => import('@/pages/services/patient/OverviewPage.vue'),
      }
    ]
  },

  {
    path: '/a',
    name: 'admin-service',
    component: DashLayout,
    meta: { requiresAuth: true, zone: 'admin' },
    children: [
      {
        path: 'overview',
        name: 'admin-overview',
        component: () => import('@/pages/services/admin/OverviewPage.vue'),
        meta: { waitForData: true}
      },
      {
        path: 'annonces/nouvel',
        name: 'admin-annonces-nouvelle',
        component: () => import('@/pages/services/admin/annonces/NouvelAnnonce.vue'),
        meta: { waitForData: false}
      },
      {
        path: 'annonces',
        name: 'admin-annonces-list',
        component: () => import('@/pages/services/admin/annonces/ListAnnonce.vue'),
        meta: { waitForData: true}
      },
      {
        path: 'annonces/:id',
        name: 'admin-annonce-details',
        component: () => import('@/pages/services/admin/annonces/DetailsAnnonce.vue'),
        meta: { waitForData: false}
      },
      {
        path: 'annonces/modifier/:id',
        name: 'admin-annonce-edit',
        component: () => import('@/pages/services/admin/annonces/EditAnnonce.vue'),
        meta: { waitForData: false}
      },
      {
        path: 'medicaments/nouvel',
        name: 'admin-medicaments-nouvel',
        component: () => import('@/pages/services/admin/medicaments/NouvelMedicament.vue'),
        meta: { waitForData: false}
      },
      {
        path: 'medicaments/:id',
        name: 'admin-medicaments-details',
        component: () => import('@/pages/services/admin/medicaments/DetailMedicament.vue'),
        meta: { waitForData: false}
      },
      {
        path: 'medicaments/modifier/:id',
        name: 'admin-medicaments-edit',
        component: () => import('@/pages/services/admin/medicaments/EditMedicament.vue'),
        meta: { waitForData: false}
      },
    ]
  },

  // 🚨 3. ZONE ERREUR 404 (Route de secours)
  {
    path: '/:pathMatch(.*)*', // Capture toutes les routes non trouvées
    name: 'not-found',
    component: () => import('@/pages/errors/NotFoundPage.vue')
  }
]
