<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables, ChartDataLabels);

const props = defineProps({
  // Configuration du graphique
  type: {
    type: String,
    enum: ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter'],
    default: 'line'
  },
  
  // Données
  data: {
    type: Object,
    required: true,
    // Structure: { labels: [], datasets: [{ label: '', data: [], ... }] }
  },
  
  // Options Chart.js
  options: {
    type: Object,
    default: () => ({})
  },
  
  // Apparence
  title: {
    type: String,
    default: ''
  },
  
  subtitle: {
    type: String,
    default: ''
  },
  
  theme: {
    type: String,
    enum: ['light', 'dark', 'medical'],
    default: 'medical'
  },
  
  // Hauteur du graphique
  height: {
    type: [String, Number],
    default: 300
  },
  
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  // Responsive
  maintainAspectRatio: {
    type: Boolean,
    default: true
  },
  
  // Animation
  animationDuration: {
    type: Number,
    default: 750
  },
  
  // Affichage des données
  showLegend: {
    type: Boolean,
    default: true
  },
  
  showTooltip: {
    type: Boolean,
    default: true
  },
  
  showDataLabels: {
    type: Boolean,
    default: false
  },
  
  // Couleurs personnalisées
  colors: {
    type: Array,
    default: () => [
      '#0284c7', // medical-primary
      '#06b6d4', // cyan
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#ef4444', // red
      '#6366f1'  // indigo
    ]
  },
  
  // Exportation
  exportable: {
    type: Boolean,
    default: true
  },
  
  // Fullscreen
  fullscreenable: {
    type: Boolean,
    default: false
  },
  
  // Réactivité
  responsive: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['chart-click', 'chart-ready']);

// Références
const canvasRef = ref(null);
const chartInstance = ref(null);
const isFullscreen = ref(false);
const containerRef = ref(null);

// Thèmes
const themeConfig = {
  light: {
    text: '#000000',
    grid: '#e5e7eb',
    bg: '#ffffff'
  },
  dark: {
    text: '#ffffff',
    grid: '#374151',
    bg: '#1f2937'
  },
  medical: {
    text: 'var(--medical-gray-700)',
    grid: 'var(--medical-gray-200)',
    bg: 'var(--medical-gray-50)'
  }
};

// Computed pour les options fusionnées
const mergedOptions = computed(() => {
  const baseOptions = {
    responsive: props.responsive,
    maintainAspectRatio: props.maintainAspectRatio,
    animation: {
      duration: props.animationDuration
    },
    plugins: {
      legend: {
        display: props.showLegend,
        position: 'top',
        labels: {
          color: themeConfig[props.theme].text,
          font: {
            family: "var(--body-family, 'Inter', sans-serif)",
            size: 12,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: props.showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      datalabels: {
        display: props.showDataLabels,
        color: themeConfig[props.theme].text,
        font: {
          weight: 'bold',
          size: 11
        },
        formatter: function(value) {
          return value.toFixed(0);
        },
        anchor: 'center',
        align: 'center'
      }
    },
    scales: buildScales()
  };

  // Fusionner avec les options personnalisées
  return deepMerge(baseOptions, props.options);
});

// Construire les échelles en fonction du type
function buildScales() {
  if (['pie', 'doughnut', 'polarArea', 'radar'].includes(props.type)) {
    return {};
  }

  return {
    x: {
      display: true,
      grid: {
        display: true,
        color: themeConfig[props.theme].grid,
        drawBorder: false,
        drawTicks: false
      },
      ticks: {
        color: themeConfig[props.theme].text,
        font: {
          size: 12
        }
      }
    },
    y: {
      display: true,
      grid: {
        display: true,
        color: themeConfig[props.theme].grid,
        drawBorder: false
      },
      ticks: {
        color: themeConfig[props.theme].text,
        font: {
          size: 12
        },
        callback: function(value) {
          return new Intl.NumberFormat('fr-FR').format(value);
        }
      }
    }
  };
}

// Fonction de fusion profonde
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Préparer les données avec couleurs
const chartData = computed(() => {
  const dataCopy = JSON.parse(JSON.stringify(props.data));
  
  dataCopy.datasets = dataCopy.datasets.map((dataset, index) => {
    const color = props.colors[index % props.colors.length];
    
    return {
      ...dataset,
      // Couleurs de base
      borderColor: dataset.borderColor || color,
      backgroundColor: dataset.backgroundColor || (
        ['pie', 'doughnut', 'polarArea'].includes(props.type)
          ? props.colors
          : color + '33' // Transparence pour les autres
      ),
      borderWidth: dataset.borderWidth || 2,
      tension: dataset.tension !== undefined ? dataset.tension : 0.4,
      fill: dataset.fill !== undefined ? dataset.fill : (props.type === 'line'),
      pointRadius: dataset.pointRadius || 4,
      pointHoverRadius: dataset.pointHoverRadius || 6,
      pointBackgroundColor: dataset.pointBackgroundColor || color,
      pointBorderColor: dataset.pointBorderColor || '#fff',
      pointBorderWidth: dataset.pointBorderWidth || 2
    };
  });

  return dataCopy;
});

// Initialiser/Mettre à jour le graphique
const initChart = async () => {
  await nextTick();

  if (!canvasRef.value) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = canvasRef.value.getContext('2d');

  chartInstance.value = new ChartJS(ctx, {
    type: props.type,
    data: chartData.value,
    options: mergedOptions.value
  });

  emit('chart-ready', chartInstance.value);
};

// Exporter le graphique
const exportChart = (format = 'png') => {
  if (!chartInstance.value) return;

  const link = document.createElement('a');
  link.href = chartInstance.value.toBase64Image();
  link.download = `chart-${Date.now()}.${format}`;
  link.click();
};

// Fullscreen
const toggleFullscreen = () => {
  if (!containerRef.value) return;

  if (!isFullscreen.value) {
    if (containerRef.value.requestFullscreen) {
      containerRef.value.requestFullscreen();
      isFullscreen.value = true;
    }
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }
};

// Mettre à jour quand les données changent
watch(() => props.data, () => {
  if (chartInstance.value) {
    chartInstance.value.data = chartData.value;
    chartInstance.value.options = mergedOptions.value;
    chartInstance.value.update('active');
  }
}, { deep: true });

// Mettre à jour quand le type change
watch(() => props.type, () => {
  initChart();
}, { deep: true });

// Mettre à jour quand le thème change
watch(() => props.theme, () => {
  if (chartInstance.value) {
    chartInstance.value.options = mergedOptions.value;
    chartInstance.value.update();
  }
});

// Initialiser au montage
onMounted(() => {
  initChart();
});

// Exposer les méthodes
defineExpose({
  chartInstance,
  exportChart,
  updateData: (newData) => {
    if (chartInstance.value) {
      chartInstance.value.data = newData;
      chartInstance.value.update();
    }
  },
  updateOptions: (newOptions) => {
    if (chartInstance.value) {
      chartInstance.value.options = deepMerge(mergedOptions.value, newOptions);
      chartInstance.value.update();
    }
  },
  redraw: () => {
    initChart();
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="med-graph-wrapper"
    :class="[
      `theme-${theme}`,
      { 'is-fullscreen': isFullscreen }
    ]"
  >
    <!-- Header avec titre et actions -->
    <div class="med-graph-header">
      <div class="med-graph-title-section">
        <h3 v-if="title" class="med-graph-title">{{ title }}</h3>
        <p v-if="subtitle" class="med-graph-subtitle">{{ subtitle }}</p>
      </div>

      <div class="med-graph-actions">
        <button
          v-if="exportable"
          type="button"
          class="med-graph-btn"
          @click="exportChart('png')"
          title="Télécharger le graphique"
        >
          <i class="pi pi-download"></i>
        </button>

        <button
          v-if="fullscreenable"
          type="button"
          class="med-graph-btn"
          @click="toggleFullscreen"
          :title="isFullscreen ? 'Quitter fullscreen' : 'Fullscreen'"
        >
          <i :class="isFullscreen ? 'pi pi-times' : 'pi pi-window-maximize'"></i>
        </button>
      </div>
    </div>

    <!-- Conteneur du graphique -->
    <div class="med-graph-container">
      <div class="med-graph-canvas-wrapper">
        <canvas ref="canvasRef" :height="height"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-graph-wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--medical-gray-50);
  border: 1px solid var(--medical-gray-200);
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all var(--transition-fast, 0.15s) ease-in-out;
}

.med-graph-wrapper:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.med-graph-wrapper.theme-light {
  background-color: #ffffff;
  border-color: #e5e7eb;
}

.med-graph-wrapper.theme-dark {
  background-color: #1f2937;
  border-color: #374151;
}

.med-graph-wrapper.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  border-radius: 0;
  z-index: 9999;
  padding: 2rem;
}

/* En-tête */
.med-graph-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.med-graph-title-section {
  flex: 1;
}

.med-graph-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--medical-gray-900);
  margin: 0 0 0.25rem 0;
}

.theme-dark .med-graph-title,
.theme-light .med-graph-title {
  color: inherit;
}

.med-graph-subtitle {
  font-size: 0.875rem;
  color: var(--medical-gray-500);
  margin: 0;
}

.theme-dark .med-graph-subtitle {
  color: #9ca3af;
}

.theme-light .med-graph-subtitle {
  color: #6b7280;
}

/* Actions */
.med-graph-actions {
  display: flex;
  gap: 0.5rem;
}

.med-graph-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--medical-gray-300);
  background-color: white;
  color: var(--medical-gray-600);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s) ease-in-out;
  font-size: 1rem;
}

.med-graph-btn:hover {
  background-color: var(--medical-primary, #0284c7);
  border-color: var(--medical-primary, #0284c7);
  color: white;
}

.med-graph-btn:active {
  transform: scale(0.95);
}

.theme-dark .med-graph-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.theme-dark .med-graph-btn:hover {
  background-color: var(--medical-primary, #0284c7);
  border-color: var(--medical-primary, #0284c7);
  color: white;
}

/* Conteneur graphique */
.med-graph-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.med-graph-canvas-wrapper {
  position: relative;
  width: 100%;
  max-height: 100%;
}

.med-graph-wrapper.is-fullscreen .med-graph-canvas-wrapper {
  max-height: calc(100vh - 100px);
}

/* Responsive */
@media (max-width: 768px) {
  .med-graph-wrapper {
    padding: 1rem;
  }

  .med-graph-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .med-graph-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .med-graph-title {
    font-size: 1rem;
  }

  .med-graph-wrapper.is-fullscreen {
    padding: 1rem;
  }
}

/* Animation d'entrée */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.med-graph-wrapper {
  animation: fadeIn 0.3s ease-in-out;
}
</style>