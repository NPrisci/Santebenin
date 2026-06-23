export const menuConfig = [
   {
      name: 'Mon espace',
      icon: 'fas fa-id-card',
      path: '/p/espace',
      roles: ['MEDECIN', 'PHARMACIEN', 'RESPONSABLE'],
   },
   {
      name: 'Mon carnet de santé',
      icon: 'fas fa-notes-medical',
      path: '/patient/health-record',
      roles: ['MEDECIN', 'PHARMACIEN', 'RESPONSABLE'],
   },
   {
      name: 'Mes documents',
      icon: 'fas fa-folder-open',
      path: '/patient/documents',
      roles: ['MEDECIN', 'PHARMACIEN', 'RESPONSABLE'],
   },
   {
      name: 'Pharmacie',
      icon: 'fas fa-clinic-medical',
      path: '/patient/pharmacy',
      roles: ['MEDECIN', 'PHARMACIEN', 'RESPONSABLE'],
   },
   {
      name: 'Paramètres',
      icon: 'fas fa-cog',
      path: '/patient/settings',
      roles: ['MEDECIN', 'PHARMACIEN', 'RESPONSABLE'],
   }
]

// menuItems.js
export const menuItems = [
   {
      name: 'Mon espace',
      icon: 'fas fa-id-card',
      path: '/p/espace'
   },
   {
      name: 'Mon carnet de santé',
      icon: 'fas fa-notes-medical',
      path: '/patient/health-record'
   },
   {
      name: 'Mes documents',
      icon: 'fas fa-folder-open',
      path: '/patient/documents'
   },
   {
      name: 'Pharmacie',
      icon: 'fas fa-clinic-medical',
      path: '/patient/pharmacy'
   },
   {
      name: 'Paramètres',
      icon: 'fas fa-cog',
      path: '/patient/settings'
   }
]

export const adminItems = [
   {
      id: 'section-general',
      title: 'Général',
      items: [
         {
            id: 'overview',
            label: 'Vue d\'ensemble',
            icon: 'fas fa-th-large',
            route: '/a/overview',
         },
      ],
   },
   {
      id: 'section-medical',
      title: 'Activité Médicale',
      items: [
         {
            id: 'patients',
            label: 'Patients',
            icon: 'fas fa-users',
            children: [
               { id: 'patients-list', label: 'Liste des dossiers', route: '/a/patients' },
               { id: 'patients-admission', label: 'Admissions & Urgences', route: '/a/patients/admission' },
            ],
         },
         {
            id: 'consultations',
            label: 'Consultations',
            icon: 'fas fa-calendar-alt',
            children: [
               { id: 'agenda', label: 'Mon Agenda', route: '/a/agenda' },
               { id: 'history', label: 'Historique des visites', route: '/a/history' },
            ],
         },
      ],
   },
   {
      id: 'section-logistics',
      title: 'Logistique',
      items: [
         {
            id: 'pharmacy',
            label: 'Pharmacie & Stock',
            icon: 'fas fa-pills',
            route: '/a/pharmacy',
         },
      ],
   },
   {
      id: 'section-annonces',
      title: 'Annonces',
      items: [
         {
            id: 'annonces',
            label: 'Nouvelle annonces',
            icon: 'fas fa-bullhorn',
            route: '/a/annonces/nouvel',
         },
         {
            id: 'annonces-list',
            label: 'Liste des annonces',
            icon: 'fas fa-bullhorn',
            route: '/a/annonces',
         }
      ],
   },
   {
      id: 'section-medicaments',
      title: 'Medcament',
      items: [
         {
            id: 'medicaments',
            label: 'Nouveau médicament',
            icon: 'fas fa-capsules',
            route: '/a/medicaments/nouvel',
         },
         {
            id: 'medicaments-list',
            label: 'Catalogue des médicaments',
            icon: 'fas fa-pills',
            route: '/a/medicaments',
         }
      ],
   },
   {
      id: 'section-admin',
      title: 'Administration',
      items: [
         {
            id: 'users-management',
            label: 'Utilisateurs & Droits',
            icon: 'fas fa-user-plus',
            route: '/a/users',
         },
         {
            id: 'audit-logs',
            label: 'Rapports & Audits',
            icon: 'fas fa-chart-bar',
            route: '/a/audits',
         },
      ],
   },
   {
      id: 'section-config',
      title: 'Configuration',
      items: [
         {
            id: 'settings',
            label: 'Paramètres',
            icon: 'fas fa-cog',
            route: '/a/settings',
         },
      ],
   },
]