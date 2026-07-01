<template>
  <div class="test-page">
    <header class="test-page__header">
      <h1>Démo — MedTimeline</h1>
      <p class="text-muted">
        Page de test pour valider les deux layouts, les slots personnalisés
        et le comportement responsive du composant.
      </p>
    </header>

    <!-- Sélecteur de layout -->
    <div class="test-page__controls">
      <span class="small">Layout :</span>
      <button
        class="btn"
        :class="layout === 'left' ? 'btn-primary' : 'btn-secondary'"
        @click="layout = 'left'"
      >
        left
      </button>
      <button
        class="btn"
        :class="layout === 'alternate' ? 'btn-primary' : 'btn-secondary'"
        @click="layout = 'alternate'"
      >
        alternate
      </button>
      <label class="test-page__toggle">
        <input type="checkbox" v-model="useCustomSlots" />
        Utiliser les slots personnalisés (marker + content)
      </label>
    </div>

    <!-- 1. Usage standard, sans slots -->
    <section class="test-page__section">
      <h3>1. Parcours patient — usage standard (props only)</h3>
      <MedTimeline :events="patientEvents" :layout="layout" />
    </section>

    <!-- 2. Usage avec slots personnalisés -->
    <section class="test-page__section">
      <h3>2. Historique dossier — avec slots personnalisés</h3>
      <MedTimeline
        v-if="useCustomSlots"
        :events="dossierEvents"
        :layout="layout"
      >
        <template #marker="{ item }">
          <div class="custom-marker" :class="`custom-marker--${item.type || 'default'}`">
            {{ item.title.charAt(0) }}
          </div>
        </template>

        <template #content="{ item }">
          <div class="custom-content">
            <div class="custom-content__top">
              <strong>{{ item.title }}</strong>
              <span class="custom-content__date">{{ item.date }}</span>
            </div>
            <span v-if="item.subtitle" class="custom-content__subtitle">
              {{ item.subtitle }}
            </span>
            <ul v-if="item.tags && item.tags.length" class="custom-content__tags">
              <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </template>
      </MedTimeline>

      <MedTimeline v-else :events="dossierEvents" :layout="layout" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MedTimeline from '@/components/services/MedTimeline.vue'

const layout = ref('left')
const useCustomSlots = ref(true)

// Jeu de données 1 : usage standard, structure minimale respectée
const patientEvents = ref([
  {
    id: 1,
    title: 'Prise de rendez-vous',
    subtitle: 'Portail patient',
    date: '02 Juin 2026 — 09:12',
    description: "Le patient a pris rendez-vous en ligne pour une consultation générale.",
    type: 'info',
    icon: 'pi pi-calendar-plus'
  },
  {
    id: 2,
    title: 'Consultation',
    subtitle: 'Dr. Dossou — Hôpital Saint Luc',
    date: '05 Juin 2026 — 14:30',
    description: "Consultation générale, examen clinique standard, aucune anomalie détectée.",
    type: 'default',
    icon: 'pi pi-user'
  },
  {
    id: 3,
    title: 'Analyses de laboratoire',
    subtitle: 'Laboratoire Central',
    date: '06 Juin 2026 — 08:00',
    description: "Prélèvement sanguin dans le cadre du bilan prescrit par le médecin traitant.",
    type: 'warning',
    icon: 'pi pi-experiment'
  },
  {
    id: 4,
    title: 'Résultats disponibles',
    subtitle: 'Notification automatique',
    date: '07 Juin 2026 — 17:45',
    description: "Résultats d'analyses conformes, aucun suivi supplémentaire requis.",
    type: 'success',
    icon: 'pi pi-check-circle'
  },
  {
    id: 5,
    title: 'Alerte allergie médicamenteuse',
    subtitle: 'Dossier patient',
    date: '10 Juin 2026 — 11:05',
    description: "Réaction allergique signalée suite à la prise d'un traitement. Dossier mis à jour.",
    type: 'danger',
    icon: 'pi pi-exclamation-triangle'
  }
])

// Jeu de données 2 : utilisé avec les slots personnalisés (tags)
const dossierEvents = ref([
  {
    id: 'd1',
    title: 'Admission',
    subtitle: 'Service Urgences',
    date: '12 Juin 2026',
    type: 'info',
    tags: ['Urgences', 'Triage niveau 2']
  },
  {
    id: 'd2',
    title: 'Diagnostic',
    subtitle: 'Dr. Adjovi',
    date: '12 Juin 2026',
    type: 'default',
    tags: ['Radiologie', 'Consultation spécialisée']
  },
  {
    id: 'd3',
    title: 'Intervention',
    subtitle: 'Bloc opératoire 2',
    date: '13 Juin 2026',
    type: 'success',
    tags: ['Chirurgie', 'Anesthésie générale']
  },
  {
    id: 'd4',
    title: 'Sortie',
    subtitle: 'Service Chirurgie',
    date: '16 Juin 2026',
    type: 'default',
    tags: ['Ordonnance de sortie']
  }
])
</script>

<style scoped>
.test-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.test-page__header {
  margin-bottom: 1.5rem;
}

.test-page__controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 0.75rem 1rem;
  background-color: var(--medical-gray-50);
  border: 1px solid var(--medical-gray-200);
  border-radius: var(--radius-md);
}

.test-page__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--medical-gray-700);
  margin-left: auto;
}

.test-page__section {
  margin-bottom: 3rem;
}

.test-page__section h3 {
  margin-bottom: 1.25rem;
}

/* ---------- Styles pour l'exemple de slots personnalisés ---------- */
.custom-marker {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--title-family);
  font-weight: 700;
  color: var(--medical-white);
  background-color: var(--medical-primary);
  box-shadow: var(--shadow-sm);
}

.custom-marker--success { background-color: var(--medical-accent-success); }
.custom-marker--danger  { background-color: var(--medical-accent-danger); }
.custom-marker--warning { background-color: var(--medical-accent-warning); }
.custom-marker--info    { background-color: var(--medical-accent-info); }

.custom-content {
  background-color: var(--medical-white);
  border: 1px solid var(--medical-gray-200);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-sm);
}

.custom-content__top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}

.custom-content__date {
  font-size: 0.8rem;
  color: var(--medical-gray-500);
}

.custom-content__subtitle {
  display: block;
  font-size: 0.85rem;
  color: var(--medical-gray-500);
  margin-top: 0.15rem;
}

.custom-content__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.6rem 0 0;
  padding: 0;
}

.custom-content__tags li {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.55rem;
}
</style>