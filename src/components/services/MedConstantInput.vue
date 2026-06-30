<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  // Type de constante médicale
  constantType: {
    type: String,
    enum: ["weight", "blood-pressure", "temperature", "heart-rate", "spo2", "pain", "custom"],
    required: true,
  },

  // Valeur
  modelValue: {
    type: [Number, Object],
    default: null,
  },

  // Configuration
  mode: {
    type: String,
    enum: ["auto", "stepper", "slider", "pills"],
    default: "auto",
  },

  unit: {
    type: String,
    default: null,
  },

  label: {
    type: String,
    default: "",
  },

  // Historique
  lastValue: {
    type: Number,
    default: null,
  },

  // Affichage
  showContext: {
    type: Boolean,
    default: true,
  },

  showHistory: {
    type: Boolean,
    default: true,
  },

  showConfirm: {
    type: Boolean,
    default: true,
  },

  // Options personnalisées
  min: {
    type: Number,
    default: null,
  },

  max: {
    type: Number,
    default: null,
  },

  step: {
    type: Number,
    default: null,
  },

  normalMin: {
    type: Number,
    default: null,
  },

  normalMax: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "change", "unit-change", "anomaly"]);

// Configurations prédéfinies
const constantConfigs = {
  weight: {
    label: "Poids",
    unit: "kg",
    altUnit: "lb",
    min: 30,
    max: 200,
    step: 0.5,
    normalMin: 65,
    normalMax: 85,
    warningMin: 50,
    warningMax: 120,
    mode: "stepper",
    icon: "⚖️",
    format: (v) => v.toFixed(1),
  },
  "blood-pressure": {
    label: "Tension",
    unit: "mmHg",
    min: { sys: 60, dia: 40 },
    max: { sys: 250, dia: 150 },
    step: 1,
    normalMin: { sys: 90, dia: 60 },
    normalMax: { sys: 140, dia: 90 },
    warningMin: { sys: 140, dia: 90 },
    warningMax: { sys: 180, dia: 120 },
    mode: "slider",
    icon: "💓",
    dual: true,
    format: (sys, dia) => `${sys}/${dia}`,
  },
  temperature: {
    label: "Température",
    unit: "°C",
    altUnit: "°F",
    min: 35,
    max: 41,
    step: 0.1,
    normalMin: 36.5,
    normalMax: 37.5,
    warningMin: 37.5,
    warningMax: 38.5,
    mode: "pills",
    icon: "🌡️",
    pills: [36.5, 37, 37.2, 37.5, 38, 38.5, 39],
    format: (v) => v.toFixed(1),
  },
  "heart-rate": {
    label: "Fréquence Cardiaque",
    unit: "bpm",
    min: 40,
    max: 200,
    step: 1,
    normalMin: 60,
    normalMax: 100,
    warningMin: 100,
    warningMax: 120,
    mode: "stepper",
    icon: "❤️",
    format: (v) => Math.round(v),
  },
  spo2: {
    label: "Saturation O₂",
    unit: "%",
    min: 70,
    max: 100,
    step: 1,
    normalMin: 95,
    normalMax: 100,
    warningMin: 90,
    warningMax: 95,
    mode: "slider",
    icon: "💨",
    format: (v) => Math.round(v),
  },
  pain: {
    label: "Douleur",
    unit: "/10",
    min: 0,
    max: 10,
    step: 1,
    normalMin: 0,
    normalMax: 3,
    warningMin: 3,
    warningMax: 7,
    mode: "pills",
    icon: "😣",
    pills: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    format: (v) => Math.round(v),
  },
  glycemie: {
    label: "Glycémie",
    unit: "g/L",
    altUnit: "mmol/L",
    min: 0.2,
    max: 4,
    step: 0.05,
    normalMin: 0.7,
    normalMax: 1.1,
    warningMin: 1.1,
    warningMax: 1.8,
    mode: "stepper",
    icon: "🩸",
    format: (v) => v.toFixed(2),
    conversion: {
      toMmolL: (gL) => gL * 5.555,
      toGL: (mmolL) => mmolL / 5.555,
    },
  },
};

// État local
const currentUnit = ref(props.unit);
const internalValue = ref(props.modelValue);
const showUnitDropdown = ref(false);

// Config active
const config = computed(() => {
  return constantConfigs[props.constantType] || constantConfigs.custom;
});

// Mode effectif
const effectiveMode = computed(() => {
  if (props.mode !== "auto") return props.mode;
  return config.value.mode || "stepper";
});

// Unité active
const activeUnit = computed(() => currentUnit.value || config.value.unit);

// Contexte médical
const medicalContext = computed(() => {
  const val = Array.isArray(internalValue.value) ? internalValue.value[0] : internalValue.value;
  if (!val && val !== 0) return null;

  const nMin = props.normalMin !== null ? props.normalMin : config.value.normalMin;
  const nMax = props.normalMax !== null ? props.normalMax : config.value.normalMax;
  const wMin = config.value.warningMin;
  const wMax = config.value.warningMax;

  let status;
  let message;

  if (val < wMin || val > wMax) {
    status = "danger";
    message = "⚠️ Valeur critique - Consulter";
  } else if (val < nMin || val > nMax) {
    status = "warning";
    message = "⚠️ Valeur anormale";
  } else {
    status = "normal";
    message = "✓ Normal";
  }

  return { status, message };
});

// Delta vs dernier enregistrement
const delta = computed(() => {
  if (props.lastValue === null || internalValue.value === null) return null;
  const val = Array.isArray(internalValue.value) ? internalValue.value[0] : internalValue.value;
  const diff = val - props.lastValue;
  const symbol = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
  return { value: Math.abs(diff).toFixed(1), symbol };
});

// Pills
const pills = computed(() => config.value.pills || []);

// Stepper: Incrémenter
const increment = () => {
  let newVal = (internalValue.value || 0) + (props.step || config.value.step || 1);
  const max = props.max !== null ? props.max : config.value.max;
  if (max !== undefined) newVal = Math.min(newVal, max);
  updateValue(newVal);
};

// Stepper: Décrémenter
const decrement = () => {
  let newVal = (internalValue.value || 0) - (props.step || config.value.step || 1);
  const min = props.min !== null ? props.min : config.value.min;
  if (min !== undefined) newVal = Math.max(newVal, min);
  updateValue(newVal);
};

const clampValue = (value) => {
  const min = props.min !== null ? props.min : config.value.min;
  const max = props.max !== null ? props.max : config.value.max;

  if (typeof value !== "number" || isNaN(value)) {
    return value;
  }

  if (min !== undefined && max !== undefined) {
    return Math.min(Math.max(value, min), max);
  }

  if (min !== undefined) {
    return Math.max(value, min);
  }

  if (max !== undefined) {
    return Math.min(value, max);
  }

  return value;
};

// Slider: Changer
const handleSliderChange = (e) => {
  updateValue(parseFloat(e.target.value));
};

// Dual Slider (tension)
const handleSystolicChange = (e) => {
  const val = { ...internalValue.value };
  val.systolique = parseInt(e.target.value);
  updateValue(val);
};

const handleDiastolicChange = (e) => {
  const val = { ...internalValue.value };
  val.diastolique = parseInt(e.target.value);
  updateValue(val);
};

// Pills: Sélectionner
const selectPill = (value) => {
  updateValue(value);
};

// Input direct
const handleDirectInput = (e) => {
  const val = parseFloat(e.target.value);
  if (!isNaN(val)) updateValue(val);
};

// Changement unité
const changeUnit = (newUnit) => {
  if (newUnit === activeUnit.value) return;

  let converted = internalValue.value;

  // Conversions
  if (props.constantType === "weight") {
    if (activeUnit.value === "kg" && newUnit === "lb") {
      converted = internalValue.value * 2.20462;
    } else if (activeUnit.value === "lb" && newUnit === "kg") {
      converted = internalValue.value / 2.20462;
    }
  } else if (props.constantType === "temperature") {
    if (activeUnit.value === "°C" && newUnit === "°F") {
      converted = (internalValue.value * 9) / 5 + 32;
    } else if (activeUnit.value === "°F" && newUnit === "°C") {
      converted = ((internalValue.value - 32) * 5) / 9;
    }
  }

  currentUnit.value = newUnit;
  updateValue(converted);
  emit("unit-change", newUnit);
};

// Mise à jour valeur
const updateValue = (newVal) => {
  const clampedVal = clampValue(newVal);
  internalValue.value = clampedVal;
  emit("update:modelValue", clampedVal);

  // Détection anomalies
  if (medicalContext.value?.status !== "normal") {
    emit("anomaly", {
      type: props.constantType,
      value: clampedVal,
      status: medicalContext.value.status,
    });
  }
};

// Confirmer
const confirmValue = () => {
  emit("change", internalValue.value);
};

// Watcher
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = clampValue(newVal);
  },
  { immediate: true },
);

// Format affichage
const formatValue = computed(() => {
  if (config.value.dual && internalValue.value) {
    return `${internalValue.value.systolique}/${internalValue.value.diastolique}`;
  }
  if (internalValue.value || internalValue.value === 0) {
    return config.value.format(internalValue.value);
  }
  return "";
});
</script>

<template>
  <div class="med-constant-input">
    <!-- Header -->
    <div class="constant-header">
      <label class="constant-label">
        <span class="icon">{{ config.icon }}</span>
        <span>{{ label || config.label }}</span>
      </label>

      <div class="unit-selector" v-if="config.altUnit">
        <button class="unit-btn" @click="showUnitDropdown = !showUnitDropdown">
          {{ activeUnit }}
        </button>
        <div v-if="showUnitDropdown" class="unit-dropdown">
          <button
            v-for="u in [config.unit, config.altUnit]"
            :key="u"
            :class="{ active: activeUnit === u }"
            @click="
              changeUnit(u);
              showUnitDropdown = false;
            "
          >
            {{ u }}
          </button>
        </div>
      </div>
    </div>

    <!-- Historique -->
    <div v-if="showHistory && lastValue !== null && delta" class="history-info">
      <span>Dernière: {{ lastValue }} {{ activeUnit }}</span>
      <span class="delta">{{ delta.symbol }} {{ delta.value }} {{ activeUnit }}</span>
    </div>

    <!-- MODE STEPPER -->
    <div v-if="effectiveMode === 'stepper'" class="mode-stepper">
      <div class="stepper-display">
        <button class="stepper-btn minus" @click="decrement">−</button>
        <div class="stepper-value">
          <input
            type="number"
            :value="internalValue"
            @input="handleDirectInput"
            class="value-input"
          />
          <span class="unit-label">{{ activeUnit }}</span>
        </div>
        <button class="stepper-btn plus" @click="increment">+</button>
      </div>
    </div>

    <!-- MODE SLIDER (Simple) -->
    <div v-else-if="effectiveMode === 'slider' && !config.dual" class="mode-slider">
      <div class="slider-display">
        <input
          type="range"
          :min="props.min !== null ? props.min : config.min"
          :max="props.max !== null ? props.max : config.max"
          :step="props.step || config.step"
          :value="internalValue || 0"
          @input="handleSliderChange"
          class="slider-input"
        />
        <div class="slider-value">{{ formatValue }} {{ activeUnit }}</div>
      </div>
    </div>

    <!-- MODE SLIDER (Dual - Tension) -->
    <div v-else-if="effectiveMode === 'slider' && config.dual" class="mode-slider-dual">
      <div class="dual-slider">
        <div class="slider-group">
          <label>Systolique</label>
          <input
            type="range"
            :min="config.min.sys"
            :max="config.max.sys"
            :step="config.step"
            :value="internalValue?.systolic || 0"
            @input="handleSystolicChange"
            class="slider-input"
          />
          <span class="value-display">{{ internalValue?.systolic }} mmHg</span>
        </div>
        <div class="slider-group">
          <label>Diastolique</label>
          <input
            type="range"
            :min="config.min.dia"
            :max="config.max.dia"
            :step="config.step"
            :value="internalValue?.diastolic || 0"
            @input="handleDiastolicChange"
            class="slider-input"
          />
          <span class="value-display">{{ internalValue?.diastolic }} mmHg</span>
        </div>
      </div>
    </div>

    <!-- MODE PILLS -->
    <div v-else-if="effectiveMode === 'pills'" class="mode-pills">
      <div class="pills-container">
        <button
          v-for="pill in pills"
          :key="pill"
          :class="['pill', { active: internalValue === pill }]"
          @click="selectPill(pill)"
        >
          {{ pill }}
        </button>
      </div>
      <div class="pills-custom">
        <input
          type="number"
          placeholder="Autre valeur"
          @input="handleDirectInput"
          class="custom-input"
        />
      </div>
    </div>

    <!-- Bouton Confirmer -->
    <button v-if="showConfirm" class="confirm-btn" @click="confirmValue">Enregistrer</button>
  </div>
</template>

<style scoped>
.med-constant-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border: 1px solid var(--medical-gray-200);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Header */
.constant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.constant-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--medical-gray-900);
  font-size: 0.95rem;
}

.icon {
  font-size: 1.25rem;
}

/* Unit Selector */
.unit-selector {
  position: relative;
}

.unit-btn {
  padding: 0.35rem 0.75rem;
  background-color: var(--medical-gray-100);
  border: 1px solid var(--medical-gray-300);
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--medical-gray-700);
  transition: all 0.15s ease;
}

.unit-btn:hover {
  background-color: var(--medical-gray-200);
}

.unit-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid var(--medical-gray-300);
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.unit-dropdown button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.15s;
}

.unit-dropdown button:hover {
  background-color: var(--medical-gray-100);
}

.unit-dropdown button.active {
  background-color: var(--medical-primary-bg);
  color: var(--medical-primary);
  font-weight: 600;
}

/* History */
.history-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--medical-gray-600);
  padding: 0.5rem;
  background-color: var(--medical-gray-50);
  border-radius: 0.375rem;
}

.delta {
  font-weight: 600;
  color: var(--medical-gray-700);
}

/* STEPPER MODE */
.mode-stepper {
  display: flex;
  justify-content: center;
}

.stepper-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--medical-gray-50);
  padding: 1rem;
  border-radius: 0.5rem;
}

.stepper-btn {
  width: 44px;
  height: 44px;
  border: 2px solid var(--medical-primary);
  background-color: white;
  color: var(--medical-primary);
  border-radius: 0.375rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn:hover {
  background-color: var(--medical-primary);
  color: white;
}

.stepper-btn:active {
  transform: scale(0.95);
}

.stepper-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.value-input {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  width: 120px;
  border: none;
  background: transparent;
  color: var(--medical-primary);
}

.value-input:focus {
  outline: none;
}

.unit-label {
  font-size: 0.9rem;
  color: var(--medical-gray-600);
  font-weight: 500;
}

/* SLIDER MODE */
.mode-slider {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slider-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    #ef4444 0%,
    #f59e0b 25%,
    #eab308 50%,
    #10b981 75%,
    #10b981 100%
  );
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--medical-primary);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--medical-primary);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-value {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--medical-primary);
}

/* SLIDER DUAL */
.mode-slider-dual {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dual-slider {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--medical-gray-700);
}

.value-display {
  text-align: center;
  font-weight: 600;
  color: var(--medical-primary);
}

/* PILLS MODE */
.mode-pills {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pills-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 0.5rem;
}

.pill {
  padding: 0.5rem;
  border: 2px solid var(--medical-gray-300);
  background-color: white;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--medical-gray-700);
}

.pill:hover {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
}

.pill.active {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary);
  color: white;
}

.pills-custom {
  display: flex;
}

.custom-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--medical-gray-300);
  border-radius: 0.375rem;
  font-size: 0.9rem;
}

.custom-input:focus {
  outline: none;
  border-color: var(--medical-primary);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

/* Medical Context */
.medical-context {
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.context-empty {
  background-color: var(--medical-gray-100);
  color: var(--medical-gray-600);
}

.context-normal {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.context-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.context-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.context-message {
  display: block;
}

/* Confirm Button */
.confirm-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--medical-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s;
}

.confirm-btn:hover {
  background-color: #0284c7;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.confirm-btn:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 480px) {
  .med-constant-input {
    padding: 1rem;
  }

  .stepper-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .value-input {
    font-size: 1.5rem;
    width: 100px;
  }

  .pills-container {
    grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
  }

  .pill {
    padding: 0.4rem;
    font-size: 0.85rem;
  }
}
</style>
