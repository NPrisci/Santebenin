<template>
  <div class="test-container">
    <!-- En-tête -->
    <div class="test-header mb-5">
      <h1 class="h2 mb-3">📊 MedGraph - Test Complet</h1>
      <p class="text-muted">Composant graphique avancé basé sur Chart.js</p>
    </div>

    <!-- Contrôles globaux -->
    <div class="controls-section mb-5 p-4 bg-light rounded">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Thème</label>
          <select v-model="selectedTheme" class="form-select">
            <option value="medical">Médical (défaut)</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Afficher légende</label>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="showLegend"
              v-model="showLegend"
            />
            <label class="form-check-label" for="showLegend">
              Afficher la légende
            </label>
          </div>
        </div>
        <div class="col-md-4">
          <label class="form-label">Afficher tooltips</label>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="showTooltip"
              v-model="showTooltip"
            />
            <label class="form-check-label" for="showTooltip">
              Afficher les infobulles
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="graphs-grid">
      <!-- 1. Graphique en Ligne (Line Chart) -->
      <div class="graph-section">
        <MedGraph
          type="line"
          title="📈 Évolution des Patients"
          subtitle="Nombre de patients par mois"
          :data="lineChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
          @chart-ready="onChartReady"
        />
      </div>

      <!-- 2. Graphique en Barres (Bar Chart) -->
      <div class="graph-section">
        <MedGraph
          type="bar"
          title="📊 Consultations par Spécialité"
          subtitle="Nombre de consultations"
          :data="barChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 3. Graphique Circulaire (Pie Chart) -->
      <div class="graph-section">
        <MedGraph
          type="pie"
          title="🥧 Distribution des Diagnostics"
          subtitle="Répartition en pourcentage"
          :data="pieChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          :show-data-labels="true"
          height="300"
          exportable
        />
      </div>

      <!-- 4. Graphique Anneau (Doughnut Chart) -->
      <div class="graph-section">
        <MedGraph
          type="doughnut"
          title="🍩 Statut des Patients"
          subtitle="Actif, Inactif, En attente"
          :data="doughnutChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 5. Graphique Radar -->
      <div class="graph-section">
        <MedGraph
          type="radar"
          title="🎯 Évaluation des Symptômes"
          subtitle="Intensité des symptômes (1-10)"
          :data="radarChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 6. Graphique Polaire -->
      <div class="graph-section">
        <MedGraph
          type="polarArea"
          title="⭐ Zones d'Activité"
          subtitle="Distribution par zone"
          :data="polarChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 7. Graphique Multi-séries -->
      <div class="graph-section">
        <MedGraph
          type="bar"
          title="🏥 Comparaison Hôpitaux"
          subtitle="Performance par centre"
          :data="multiSeriesData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 8. Graphique avec Données Décroissantes -->
      <div class="graph-section">
        <MedGraph
          type="line"
          title="💊 Taux de Récupération"
          subtitle="Évolution du rétablissement (%)"
          :data="recoveryRateData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          :options="customLineOptions"
          height="300"
          exportable
        />
      </div>

      <!-- 9. Graphique en Barres Horizontales -->
      <div class="graph-section">
        <MedGraph
          type="bar"
          title="⏱️ Temps Moyen de Consultation"
          subtitle="Par département (minutes)"
          :data="horizontalBarData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          :options="horizontalOptions"
          height="350"
          exportable
        />
      </div>

      <!-- 10. Graphique Scatter -->
      <div class="graph-section">
        <MedGraph
          type="scatter"
          title="📍 Corrélation Âge/Tension"
          subtitle="Relation entre l'âge et la tension artérielle"
          :data="scatterChartData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          height="300"
          exportable
        />
      </div>

      <!-- 11. Graphique en Barres Stacked -->
      <div class="graph-section">
        <MedGraph
          type="bar"
          title="📦 Répartition des Cas Empilés"
          subtitle="Légère, Modérée, Grave"
          :data="stackedBarData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          :options="stackedOptions"
          height="300"
          exportable
        />
      </div>

      <!-- 12. Graphique en Ligne Lisse -->
      <div class="graph-section">
        <MedGraph
          type="line"
          title="🌡️ Suivi de la Température"
          subtitle="Évolution quotidienne (°C)"
          :data="temperatureData"
          :theme="selectedTheme"
          :show-legend="showLegend"
          :show-tooltip="showTooltip"
          :options="smoothLineOptions"
          height="300"
          exportable
        />
      </div>
    </div>

    <!-- Section Interactive -->
    <div class="mt-5 p-4 bg-light rounded">
      <h3 class="mb-4">🎮 Test Interactif</h3>
      
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label class="form-label">Ajouter une valeur (janvier)</label>
          <div class="input-group">
            <input
              v-model.number="newJanuaryValue"
              type="number"
              class="form-control"
              placeholder="Entrée une valeur"
            />
            <button class="btn btn-primary" @click="addValueToChart">
              Ajouter
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Format d'export</label>
          <div class="btn-group w-100">
            <button class="btn btn-outline-secondary" @click="exportLineChart('png')">
              <i class="pi pi-file-pdf"></i> PNG
            </button>
            <button class="btn btn-outline-secondary" @click="exportLineChart('jpg')">
              <i class="pi pi-file-image"></i> JPG
            </button>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-4">
          <button class="btn btn-success w-100" @click="randomizeData">
            <i class="pi pi-refresh"></i> Données Aléatoires
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-info w-100" @click="toggleAnimation">
            <i class="pi pi-play"></i> {{ animationEnabled ? 'Arrêter' : 'Démarrer' }} Animation
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-warning w-100" @click="resetCharts">
            <i class="pi pi-replay"></i> Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-5 row">
      <div class="col-md-3">
        <div class="stat-card">
          <h5>Total Patients</h5>
          <p class="stat-value">{{ totalPatients }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h5>Consultations</h5>
          <p class="stat-value">{{ totalConsultations }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h5>Taux Récupération</h5>
          <p class="stat-value">{{ recoveryRate }}%</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h5>Centres Actifs</h5>
          <p class="stat-value">{{ activeHospitals }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import MedGraph from '@/components/common/MedGraph.vue';

// État global
const selectedTheme = ref('medical');
const showLegend = ref(true);
const showTooltip = ref(true);
const animationEnabled = ref(true);
const newJanuaryValue = ref(null);
const lineChartRef = ref(null);

// ==================== DONNÉES DES GRAPHIQUES ====================

// 1. Line Chart - Évolution des patients
const lineChartData = reactive({
  labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
  datasets: [
    {
      label: 'Nouveaux Patients',
      data: [45, 52, 48, 61, 73, 88, 92],
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Patients Actifs',
      data: [120, 135, 142, 155, 168, 175, 182],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
});

// 2. Bar Chart - Consultations par spécialité
const barChartData = reactive({
  labels: ['Cardiologie', 'Pneumologie', 'Neurologie', 'Gastro', 'Dermatologie', 'Orthopédie'],
  datasets: [
    {
      label: 'Consultations 2024',
      data: [125, 98, 110, 87, 95, 112],
      backgroundColor: [
        '#0284c7',
        '#06b6d4',
        '#8b5cf6',
        '#ec4899',
        '#f59e0b',
        '#10b981'
      ]
    }
  ]
});

// 3. Pie Chart - Distribution des diagnostics
const pieChartData = reactive({
  labels: ['Hypertension', 'Diabète', 'Asthme', 'Obésité', 'Autres'],
  datasets: [
    {
      label: 'Diagnostics',
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#eab308',
        '#8b5cf6',
        '#6366f1'
      ],
      borderColor: '#fff',
      borderWidth: 2
    }
  ]
});

// 4. Doughnut Chart - Statut des patients
const doughnutChartData = reactive({
  labels: ['Actif', 'Inactif', 'En attente', 'Récupéré'],
  datasets: [
    {
      label: 'Patients',
      data: [250, 80, 45, 120],
      backgroundColor: [
        '#10b981',
        '#ef4444',
        '#f59e0b',
        '#06b6d4'
      ],
      borderColor: '#fff',
      borderWidth: 3
    }
  ]
});

// 5. Radar Chart - Évaluation des symptômes
const radarChartData = reactive({
  labels: ['Fièvre', 'Toux', 'Fatigue', 'Mal de tête', 'Perte de goût', 'Dyspnée'],
  datasets: [
    {
      label: 'Intensité Patient 1',
      data: [8, 7, 6, 5, 4, 3],
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.2)',
      borderWidth: 2
    },
    {
      label: 'Intensité Patient 2',
      data: [5, 6, 7, 6, 5, 4],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderWidth: 2
    }
  ]
});

// 6. Polar Area Chart
const polarChartData = reactive({
  labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
  datasets: [
    {
      label: 'Activité',
      data: [65, 59, 90, 81, 56],
      backgroundColor: [
        'rgba(2, 132, 199, 0.5)',
        'rgba(6, 182, 212, 0.5)',
        'rgba(139, 92, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)',
        'rgba(245, 158, 11, 0.5)'
      ]
    }
  ]
});

// 7. Multi-series Bar Chart
const multiSeriesData = reactive({
  labels: ['Centre A', 'Centre B', 'Centre C', 'Centre D', 'Centre E'],
  datasets: [
    {
      label: 'Patients Traités',
      data: [120, 145, 98, 135, 160],
      backgroundColor: '#0284c7'
    },
    {
      label: 'Patients Guéris',
      data: [95, 110, 75, 105, 130],
      backgroundColor: '#10b981'
    },
    {
      label: 'Patients Perdus',
      data: [15, 20, 18, 22, 19],
      backgroundColor: '#ef4444'
    }
  ]
});

// 8. Recovery Rate Line Chart
const recoveryRateData = reactive({
  labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine 5', 'Semaine 6'],
  datasets: [
    {
      label: 'Taux de Récupération (%)',
      data: [12, 28, 45, 62, 78, 88],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#10b981'
    }
  ]
});

// 9. Horizontal Bar Chart
const horizontalBarData = reactive({
  labels: ['Cardiologie', 'Pneumologie', 'Neurologie', 'Gastroentérologie', 'Dermatologie'],
  datasets: [
    {
      label: 'Minutes',
      data: [45, 38, 52, 41, 35],
      backgroundColor: '#0284c7'
    }
  ]
});

// 10. Scatter Chart
const scatterChartData = reactive({
  labels: ['Corrélation'],
  datasets: [
    {
      label: 'Patients',
      data: [
        { x: 25, y: 120 },
        { x: 30, y: 125 },
        { x: 35, y: 130 },
        { x: 40, y: 140 },
        { x: 45, y: 145 },
        { x: 50, y: 150 },
        { x: 55, y: 155 },
        { x: 60, y: 160 },
        { x: 65, y: 170 },
        { x: 70, y: 180 }
      ],
      backgroundColor: 'rgba(2, 132, 199, 0.6)',
      borderColor: '#0284c7',
      borderWidth: 2,
      pointRadius: 6
    }
  ]
});

// 11. Stacked Bar Chart
const stackedBarData = reactive({
  labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Légère',
      data: [30, 35, 28, 40, 45, 38],
      backgroundColor: '#fbbf24'
    },
    {
      label: 'Modérée',
      data: [15, 20, 25, 18, 22, 28],
      backgroundColor: '#f59e0b'
    },
    {
      label: 'Grave',
      data: [5, 8, 10, 7, 9, 11],
      backgroundColor: '#ef4444'
    }
  ]
});

// 12. Temperature Line Chart
const temperatureData = reactive({
  labels: ['Jour 1', 'Jour 2', 'Jour 3', 'Jour 4', 'Jour 5', 'Jour 6', 'Jour 7'],
  datasets: [
    {
      label: 'Température',
      data: [37.2, 37.8, 38.5, 38.1, 37.5, 37.0, 36.8],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3
    }
  ]
});

// ==================== OPTIONS PERSONNALISÉES ====================

const customLineOptions = {
  plugins: {
    filler: {
      propagate: true
    }
  }
};

const horizontalOptions = {
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true
    }
  }
};

const smoothLineOptions = {
  tension: 0.1,
  fill: false
};

const stackedOptions = {
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
};

// ==================== COMPUTED ====================

const totalPatients = computed(() => 495);
const totalConsultations = computed(() => 627);
const recoveryRate = computed(() => 88);
const activeHospitals = computed(() => 5);

// ==================== MÉTHODES ====================

const onChartReady = (chart) => {
  lineChartRef.value = chart;
};

const addValueToChart = () => {
  if (newJanuaryValue.value !== null) {
    const newData = [...lineChartData.datasets[0].data];
    newData[0] = newJanuaryValue.value;
    lineChartData.datasets[0].data = newData;
    newJanuaryValue.value = null;
  }
};

const exportLineChart = (format) => {
  if (lineChartRef.value) {
    const link = document.createElement('a');
    link.href = lineChartRef.value.toBase64Image();
    link.download = `chart-patients.${format}`;
    link.click();
  }
};

const randomizeData = () => {
  lineChartData.datasets[0].data = lineChartData.datasets[0].data.map(
    () => Math.floor(Math.random() * 100) + 20
  );
  lineChartData.datasets[1].data = lineChartData.datasets[1].data.map(
    () => Math.floor(Math.random() * 200) + 50
  );
};

const toggleAnimation = () => {
  animationEnabled.value = !animationEnabled.value;
};

const resetCharts = () => {
  location.reload();
};
</script>

<style scoped>
.test-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.test-header {
  text-align: center;
  border-bottom: 2px solid var(--medical-gray-200);
  padding-bottom: 1.5rem;
}

.test-header h1 {
  color: var(--medical-gray-900);
  font-weight: 700;
}

.test-header p {
  font-size: 1rem;
}

.controls-section {
  background-color: var(--medical-gray-50);
  border: 1px solid var(--medical-gray-200);
}

.controls-section .form-label {
  font-weight: 600;
  color: var(--medical-gray-700);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.graphs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.graph-section {
  background-color: white;
  border: 1px solid var(--medical-gray-200);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.graph-section:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-card {
  background-color: white;
  border: 1px solid var(--medical-gray-200);
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.stat-card h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--medical-gray-600);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--medical-primary, #0284c7);
  margin: 0;
}

.btn-group {
  display: flex;
  gap: 0;
}

.btn-group .btn {
  flex: 1;
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-radius: 0.375rem 0 0 0.375rem;
}

.btn-group .btn:last-child {
  border-radius: 0 0.375rem 0.375rem 0;
}

@media (max-width: 768px) {
  .graphs-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .test-header h1 {
    font-size: 1.5rem;
  }
}
</style>