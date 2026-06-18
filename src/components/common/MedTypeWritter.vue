<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 50, // Vitesse de frappe en ms par caractère
  },
  delay: {
    type: Number,
    default: 200, // Délai initial avant le démarrage (ms)
  },
  // Permet de surcharger la couleur du curseur si besoin (ex: variants de main.css)
  cursorVariant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['finished'])

const displayedText = ref('')
let timeoutId = null

const startTyping = () => {
  // Réinitialisation de l'état et nettoyage des processus asynchrones en cours
  displayedText.value = ''
  if (timeoutId) clearTimeout(timeoutId)

  let index = 0

  const type = () => {
    if (index < props.text.length) {
      displayedText.value += props.text.charAt(index)
      index++
      timeoutId = setTimeout(type, props.speed)
    } else {
      // Émission d'un événement de fin pour orchestrer des actions complexes
      emit('finished')
    }
  }

  // Déclenchement séquentiel après le délai de garde initial
  timeoutId = setTimeout(type, props.delay)
}

// Surveillance de la réactivité de la propriété textuelle
watch(
  () => props.text,
  () => {
    startTyping()
  },
  { immediate: true }
)

// Sécurité pour empêcher les fuites de mémoire mémoire lors des changements de routes
onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="d-inline-flex align-items-center flex-wrap user-select-none med-typewriter-container">
    <span class="med-typewriter-text distribution-smooth">
      {{ displayedText }}
    </span>

    <span
      :class="[
        'd-inline-block ms-1.5 rounded-pill align-middle med-typewriter-cursor',
        cursorVariant === 'primary' ? 'bg-medical-primary' : `bg-${cursorVariant}`
      ]"
    ></span>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');
.med-typewriter-container {
  font-family: 'Courier Prime', monospace;
}

.med-typewriter-text {
  letter-spacing: 0.025em;
  color: var(--medical-gray-800);
}

/* Génération du curseur dynamique */
.med-typewriter-cursor {
  width: 3px;
  height: 1.1em;
  animation: med-soft-blink 0.9s ease-in-out infinite;
}

/* Mapping explicite si la classe bg-medical-primary n'est pas compilée globalement */
.bg-medical-primary {
  background-color: var(--medical-primary) !important;
}

/* Animation douce du curseur conforme à vos exigences visuelles */
@keyframes med-soft-blink {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0;
    transform: scaleY(0.85);
  }
}

/* Optimisation des performances du moteur de rendu du navigateur */
.distribution-smooth {
  will-change: content;
}
</style>