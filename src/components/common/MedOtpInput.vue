<script setup>
import { ref, watch } from 'vue'

const model = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  length: {
    type: Number,
    default: 6
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Tableau local contenant chaque chiffre individuellement
const digits = ref(new Array(props.length).fill(''))

// Références vers les éléments DOM pour piloter le focus
const inputRefs = ref([])

// Synchronisation : Du tableau local (digits) vers le v-model global
watch(digits, (newDigits) => {
  const combined = newDigits.join('')
  if (model.value !== combined) {
    model.value = combined
  }
}, { deep: true })

// Synchronisation : Du v-model global vers le tableau local (si modifié de l'extérieur)
watch(() => model.value, (newModelValue) => {
  if (!newModelValue) {
    digits.value = new Array(props.length).fill('')
    return
  }
  
  for (let i = 0; i < props.length; i++) {
    digits.value[i] = newModelValue[i] || ''
  }
}, { immediate: true })

// Gestion de la saisie d'un caractère
const handleInput = (index, event) => {
  const value = event.target.value
  
  // On ne garde que le dernier caractère saisi (utile si écrasement)
  const lastChar = value.substring(value.length - 1)
  
  // Validation numérique stricte
  if (!/^\d+$/.test(lastChar) && lastChar !== '') {
    digits.value[index] = ''
    return
  }

  digits.value[index] = lastChar

  // Focus automatique sur le champ suivant
  if (lastChar !== '' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
    // Petit confort : sélectionne le texte existant s'il y en a un
    setTimeout(() => inputRefs.value[index + 1]?.select(), 0)
  }
}

// Gestion des touches spéciales (Backspace / Flèches)
const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace') {
    if (digits.value[index] === '' && index > 0) {
      // Si la case actuelle est déjà vide, on recule et on vide la précédente
      digits.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
    } else {
      // Sinon on vide juste la case actuelle
      digits.value[index] = ''
    }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

// Gestion globale du copier-coller
const handlePaste = (event) => {
  event.preventDefault()
  if (props.disabled) return

  const pastedData = event.clipboardData.getData('text').trim()
  // On extrait uniquement les chiffres correspondants à la longueur voulue
  const numericData = pastedData.replace(/\D/g, '').substring(0, props.length)

  if (numericData.length > 0) {
    const dataArray = numericData.split('')
    for (let i = 0; i < props.length; i++) {
      digits.value[i] = dataArray[i] || ''
    }
    
    // Focus sur le dernier champ rempli ou le tout dernier
    const focusIndex = Math.min(numericData.length, props.length - 1)
    inputRefs.value[focusIndex]?.focus()
  }
}
</script>

<template>
  <div class="mb-3 med-otp-container">
    <label v-if="label" class="form-label d-block text-center fw-semibold text-secondary small mb-3">
      {{ label }}
    </label>

    <div class="otp-inputs-row dir-ltr" @paste="handlePaste">
      <input
        v-for="(_, index) in length"
        :key="index"
        ref="inputRefs"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        class="med-otp-input text-center fw-bold"
        :class="{ 'is-invalid': !!error }"
        :disabled="disabled"
        v-model="digits[index]"
        @input="handleInput(index, $event)"
        @keydown="handleKeyDown(index, $event)"
        @focus="$event.target.select()"
      />
    </div>

    <div v-if="error" class="invalid-feedback d-block text-center mt-2 small font-medium">
      <i class="fas fa-exclamation-triangle me-1"></i> {{ error }}
    </div>

    <div v-if="helpText && !error" class="form-text text-center text-muted mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<style scoped>
/* Conteneur des cases : flex-wrap pour ne jamais déborder sur mobile */
.otp-inputs-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(4px, 1.5vw, 8px);
  width: 100%;
}

/* Cases OTP : taille fluide avec clamp pour s'adapter aux petits écrans */
.med-otp-input {
  /* Taille fluide : min 32px, idéal 10% viewport, max 48px */
  width: clamp(32px, 9vw, 48px);
  height: clamp(38px, 10vw, 56px);
  padding: 0;
  border-radius: 10px;
  border: 2px solid var(--bs-border-color);
  background-color: var(--bs-body-bg);
  font-size: clamp(0.85rem, 2.5vw, 1.4rem);
  transition: all 0.2s ease-in-out;
  outline: none;
}

/* Accentuation visuelle lors de la mise au focus d'une case */
.med-otp-input:focus {
  border-color: rgba(var(--bs-primary-rgb), 0.8);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.15);
  transform: translateY(-2px);
}

/* Rendu en cas d'erreur */
.med-otp-input.is-invalid {
  border-color: var(--bs-danger);
}
.med-otp-input.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-danger-rgb), 0.15);
}

/* Navigation clavier toujours LTR */
.dir-ltr {
  direction: ltr;
}
</style>