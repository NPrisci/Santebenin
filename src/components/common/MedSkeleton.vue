<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Type de skeleton : 'text', 'circle', 'rect'
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'circle', 'rect'].includes(value)
  },
  // Nombre de lignes (uniquement pour le type 'text')
  lines: {
    type: [Number, String],
    default: 1
  },
  // Type d'animation : 'glow' (pulsation), 'wave' (balayage), 'none'
  animation: {
    type: String,
    default: 'glow',
    validator: (value) => ['glow', 'wave', 'none'].includes(value)
  },
  // Largeur personnalisée (ex: '100%', '200px', 'col-6')
  width: {
    type: String,
    default: ''
  },
  // Hauteur personnalisée (ex: '40px', '150px')
  height: {
    type: String,
    default: ''
  },
  // Taille prédéfinie pour le type 'circle' (avatar) : 'sm', 'md', 'lg', 'xl'
  size: {
    type: String,
    default: 'md'
  },
  // Variante de couleur Bootstrap (ex: 'secondary', 'light', 'dark')
  variant: {
    type: String,
    default: 'secondary'
  }
})

// Détermination de la classe d'animation globale
const animationClass = computed(() => {
  if (props.animation === 'none') return ''
  return `placeholder-${props.animation}`
})

// Classes de base pour les éléments placeholder
const basePlaceholderClasses = computed(() => [
  'placeholder',
  `bg-${props.variant}`,
  props.type === 'text' ? 'rounded' : ''
])

// Styles personnalisés appliqués dynamiquement
const customStyles = computed(() => {
  const styles = {}
  
  if (props.type === 'rect' || props.type === 'circle') {
    if (props.width) styles.width = props.width
    if (props.height) styles.height = props.height
  }
  
  return styles
})

// Fonction utilitaire pour donner un aspect naturel aux paragraphes multi-lignes
const getLineWidth = (index) => {
  if (props.width) return props.width // Si une largeur stricte est imposée
  if (props.lines === 1) return '100%'
  
  // Aléatoire contrôlé pour simuler la fin d'un paragraphe
  const widths = ['100%', '95%', '85%', '90%', '70%', '50%']
  if (index === props.lines - 1) return widths[4] // Dernière ligne plus courte
  return widths[index % 4]
}
</script>

<template>
  <div :class="animationClass" class="d-inline-block w-100" role="status" aria-live="polite">
    
    <template v-if="type === 'text'">
      <span
        v-for="(_, index) in Number(lines)"
        :key="index"
        :class="[...basePlaceholderClasses, 'd-block mb-2']"
        :style="{ width: getLineWidth(index), height: height || '1em' }"
      ></span>
    </template>

    <div
      v-else-if="type === 'circle'"
      :class="[...basePlaceholderClasses, 'rounded-circle', `med-skeleton-avatar-${size}`]"
      :style="customStyles"
    ></div>

    <div
      v-else-if="type === 'rect'"
      :class="[...basePlaceholderClasses, 'w-100 rounded']"
      :style="[{ height: height || '150px' }, customStyles]"
    ></div>

  </div>
</template>

<style scoped>
/* Tailles d'avatars prédéfinies pour pallier les manques de Bootstrap */
.med-skeleton-avatar-sm {
  width: 32px;
  height: 32px;
}
.med-skeleton-avatar-md {
  width: 48px;
  height: 48px;
}
.med-skeleton-avatar-lg {
  width: 64px;
  height: 64px;
}
.med-skeleton-avatar-xl {
  width: 96px;
  height: 96px;
}

/* Opacité adoucie pour coller aux standards UI modernes */
.placeholder {
  opacity: 0.15;
}

/* Ajustement de la vitesse de l'animation Wave de Bootstrap pour plus de douceur */
.placeholder-wave {
  mask-image: linear-gradient(130deg, #000 55%, rgba(0, 0, 0, 0.4) 75%, #000 85%);
  mask-size: 200% 100%;
}
</style>