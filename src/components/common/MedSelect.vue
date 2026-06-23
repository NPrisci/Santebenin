<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const model = defineModel({
  required: true,
});

const props = defineProps({
  options: {
    type: Array,
    required: true,
    // Chaque option doit avoir au moins une structure { label, value }
    validator: (value) =>
      value.every((opt) => "label" in opt && "value" in opt),
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Sélectionnez une option",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(false);
const selectRef = ref(null);

// Récupère l'option actuellement sélectionnée pour l'affichage du bloc principal
const currentSelection = computed(() => {
  return props.options.find((opt) => opt.value === model.value);
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (option) => {
  model.value = option.value;
  isOpen.value = false;
};

// Gestion de la fermeture lors d'un clic à l'extérieur du composant
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="mb-3 position-relative" ref="selectRef">
    <label v-if="label" class="form-label fw-medium text-secondary small mb-1">
      {{ label }}
    </label>

    <div
      @click="toggleDropdown"
      class="form-select custom-select-trigger d-flex align-items-center justify-content-between cursor-pointer py-2 px-3 bg-white"
      :class="{
        'is-invalid': !!error,
        'disabled-select bg-light text-muted': disabled,
        'focused-select': isOpen,
      }"
      role="combobox"
      :aria-expanded="isOpen"
    >
      <div class="d-flex align-items-center gap-2 text-truncate me-2">
        <template v-if="currentSelection">
          <i
            v-if="currentSelection.icon"
            :class="[currentSelection.icon, 'text-primary fs-5']"
          ></i>
          <div class="text-truncate">
            <span class="d-block fw-medium lh-sm">{{
              currentSelection.label
            }}</span>
          </div>
        </template>
        <template v-else>
          <span class="text-muted">{{ placeholder }}</span>
        </template>
      </div>

      <i
        class="bi bi-chevron-down chevron-icon text-muted"
        :class="{ rotated: isOpen }"
      ></i>
    </div>

    <div v-if="error" class="invalid-feedback d-block mt-1 small font-medium">
      <i class="bi bi-exclamation-circle-fill me-1"></i> {{ error }}
    </div>

    <Transition name="dropdown-slide">
      <div
        v-if="isOpen"
        class="dropdown-menu shadow-lg border w-100 show mt-1 overflow-auto custom-dropdown-menu"
      >
        <div
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="dropdown-item d-flex align-items-start gap-3 py-3 px-3 cursor-pointer transition-all"
          :class="{ 'active bg-light text-dark': model === option.value }"
        >
          <i
            v-if="option.icon"
            :class="[
              option.icon,
              model === option.value ? 'text-primary' : 'text-secondary',
              'fs-5 mt-1',
            ]"
          ></i>

          <div class="flex-grow-1 text-truncate">
            <span class="d-block fw-semibold text-truncate small-title">{{
              option.label
            }}</span>
            <small
              v-if="option.description"
              class="d-block text-muted text-wrap text-description"
            >
              {{ option.description }}
            </small>
          </div>

          <i
            v-if="model === option.value"
            class="bi bi-check2 text-primary fs-5 align-self-center ms-auto"
          ></i>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Style spécifique pour calquer le comportement du vrai form-select */
.custom-select-trigger {
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  min-height: 43px;
}

/* Simulation de l'état focus natif */
.focused-select {
  border-color: rgba(var(--bs-primary-rgb), 0.5);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.125);
}

.disabled-select {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.65;
}

/* Animation de rotation fluide de la flèche */
.chevron-icon {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
}
.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* Menu Dropdown conteneur */
.custom-dropdown-menu {
  max-height: 260px;
  z-index: 1050;
  border-radius: var(--bs-border-radius-lg);
}

.dropdown-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}
.dropdown-item:last-child {
  border-bottom: none;
}
.dropdown-item:hover {
  background-color: var(--bs-tertiary-bg);
}

.small-title {
  font-size: 0.925rem;
}
.text-description {
  font-size: 0.775rem;
  line-height: 1.2;
}

/* --- LOGIQUE DE TRANSITION FLUIDE (Slide + Fade) --- */
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-slide-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-slide-leave-active {
  transition: all 0.15s cubic-bezier(0.7, 0, 0.84, 0);
}
</style>