<template>
  <span>{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  target: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  trigger: {
    type: Boolean,
    default: true
  },
  delay: {
    type: Number,
    default: 0
  }
})

const displayValue = ref(0)
let animationId = null
let startTime = null
let timeoutId = null

function animateCounter(timestamp) {
  if (!startTime) startTime = timestamp
  const progress = Math.min((timestamp - startTime) / props.duration, 1)
  
  // Easing function pour une animation plus naturelle
  const easeOutQuart = 1 - Math.pow(1 - progress, 4)
  const currentValue = Math.floor(easeOutQuart * props.target)
  
  displayValue.value = currentValue
  
  if (progress < 1) {
    animationId = requestAnimationFrame(animateCounter)
  } else {
    displayValue.value = props.target
  }
}

function startAnimation() {
  // Annuler l'animation précédente
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  startTime = null
  displayValue.value = 0
  
  if (props.delay > 0) {
    timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animateCounter)
    }, props.delay)
  } else {
    animationId = requestAnimationFrame(animateCounter)
  }
}

onMounted(() => {
  if (props.trigger) {
    startAnimation()
  }
})

// Redémarrer l'animation quand la target change ou que trigger est activé
watch(() => [props.target, props.trigger], () => {
  if (props.trigger) {
    startAnimation()
  }
}, { deep: true })

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>