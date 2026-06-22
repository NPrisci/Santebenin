<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import MedModal from './MedModal.vue'

const props = defineProps({
  // Accepte maintenant un objet File brut OU une chaîne de caractères (URL)
  file: {
    type: [Object, String],
    required: true,
    validator: (val) => typeof val === 'string' || val instanceof File
  },
  label: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '180px'
  }
})

const emit = defineEmits(['remove'])

const isModalOpen = ref(false)
const displayUrl = ref('')
const isBlobUrl = ref(false) // Permet de savoir si on doit révoquer l'URL plus tard

// Helper pour extraire l'extension si le prop est une chaîne (URL)
const getExtensionFromUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  try {
    // Nettoyage des paramètres de requête (ex: ?token=...)
    const path = url.split('?')[0]
    return path.substring(path.lastIndexOf('.')).toLowerCase()
  } catch (e) {
    return ''
  }
}

// Détection des types adaptée aux deux formats (File ou URL)
const isImage = computed(() => {
  if (props.file instanceof File) return props.file.type.startsWith('image/')
  const ext = getExtensionFromUrl(props.file)
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
})

const isVideo = computed(() => {
  if (props.file instanceof File) return props.file.type.startsWith('video/')
  const ext = getExtensionFromUrl(props.file)
  return ['.mp4', '.webm', '.ogg', '.mov'].includes(ext)
})

const isPdf = computed(() => {
  if (props.file instanceof File) return props.file.type === 'application/pdf'
  const ext = getExtensionFromUrl(props.file)
  return ext === '.pdf'
})

// Type MIME pour la balise <video>
const videoType = computed(() => {
  if (props.file instanceof File) return props.file.type
  const ext = getExtensionFromUrl(props.file)
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.webm') return 'video/webm'
  if (ext === '.ogg') return 'video/ogg'
  return ''
})

// Gestion des métadonnées (Nom et Taille)
const fileDetails = computed(() => {
  if (!props.file) return { name: '', size: '' }
  
  if (props.file instanceof File) {
    const sizeInMb = (props.file.size / (1024 * 1024)).toFixed(2)
    return {
      name: props.file.name,
      size: `${sizeInMb} Mo`
    }
  } else {
    // Si c'est une URL, on extrait le nom du fichier à la fin du chemin
    try {
      const urlParts = props.file.split('?')[0].split('/')
      const name = urlParts[urlParts.length - 1] || 'Fichier distant'
      return { name, size: 'Distant' }
    } catch (e) {
      return { name: 'Fichier distant', size: 'Distant' }
    }
  }
})

// Nettoyage de la mémoire vive (uniquement si un Blob URL a été créé)
const revokeCurrentUrl = () => {
  if (displayUrl.value && isBlobUrl.value) {
    URL.revokeObjectURL(displayUrl.value)
  }
  displayUrl.value = ''
  isBlobUrl.value = false
}

watch(
  () => props.file,
  (newFile) => {
    revokeCurrentUrl()
    if (newFile) {
      if (newFile instanceof File) {
        displayUrl.value = URL.createObjectURL(newFile)
        isBlobUrl.value = true
      } else {
        // C'est déjà une chaîne URL
        displayUrl.value = newFile
        isBlobUrl.value = false
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  revokeCurrentUrl()
})

const openPreview = () => {
  isModalOpen.value = true
}

const closePreview = () => {
  isModalOpen.value = false
}

const handleRemove = () => {
  revokeCurrentUrl()
  emit('remove')
}
</script>

<template>
  <div class="med-media-preview w-100">
    <label v-if="label" class="form-label fw-bold text-dark mb-2">{{ label }}</label>
    
    <div 
      class="med-preview-frame position-relative overflow-hidden border rounded-lg bg-light d-flex align-items-center justify-content-center"
      :style="{ height: height }"
    >
      <img v-if="isImage && displayUrl" :src="displayUrl" alt="Aperçu clinique" class="w-100 h-100 object-fit-cover" />

      <div v-else-if="isVideo" class="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-video-skeleton px-3">
        <div class="video-icon-wrapper rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mb-2">
          <i class="fas fa-play text-primary ms-1"></i>
        </div>
        <span class="extra-small fw-semibold text-truncate w-100 text-center">{{ fileDetails.name }}</span>
      </div>

      <div v-else-if="isPdf" class="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-pdf-skeleton p-3">
        <i class="fas fa-file-pdf text-danger fs-1 mb-2"></i>
        <span class="small fw-bold text-dark text-truncate w-100 text-center px-2">{{ fileDetails.name }}</span>
        <span class="extra-small text-muted mt-0.5 font-monospace">{{ fileDetails.size }}</span>
      </div>

      <div class="med-preview-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-3 transition-base">
        <button type="button" class="btn btn-light rounded-circle btn-action shadow d-flex align-items-center justify-content-center" title="Consulter en plein écran" @click="openPreview">
          <i class="fas fa-eye text-dark"></i>
        </button>
        <button type="button" class="btn btn-danger rounded-circle btn-action shadow d-flex align-items-center justify-content-center" title="Retirer ce document" @click="handleRemove">
          <i class="fas fa-trash-alt text-white"></i>
        </button>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-2 px-1 extra-small text-muted font-sans">
      <span class="text-truncate fw-medium me-3 text-dark" :title="fileDetails.name">{{ fileDetails.name }}</span>
      <span class="font-monospace flex-shrink-0">{{ fileDetails.size }}</span>
    </div>

    <MedModal
      v-model="isModalOpen"
      :title="`Visualisation : ${fileDetails.name}`"
      size="xl"
    >
      <div class="med-modal-media-wrapper p-3 bg-dark-deep d-flex align-items-center justify-content-center w-100 overflow-auto rounded">
        
        <img 
          v-if="isImage" 
          :src="displayUrl" 
          alt="Consultation hd" 
          class="img-fluid rounded shadow-sm max-modal-content"
        />

        <video 
          v-else-if="isVideo" 
          controls 
          autoplay
          class="w-100 rounded shadow-sm max-modal-content"
          style="background-color: #000;"
        >
          <source :src="displayUrl" :type="videoType" />
          Votre navigateur ne prend pas en charge la lecture de ce clip vidéo.
        </video>

        <iframe 
          v-else-if="isPdf" 
          :src="displayUrl" 
          class="w-100 border-0 rounded bg-white" 
          style="height: 75vh; min-width: 100%;"
        ></iframe>
      </div>

      <template #footer>
        <span class="me-auto align-self-center font-monospace text-muted extra-small">
          Volume du flux : {{ fileDetails.size }}
        </span>
        <button type="button" class="btn btn-secondary btn-sm px-4" @click="closePreview">
          Fermer l'aperçu
        </button>
      </template>
    </MedModal>
  </div>
</template>

<style scoped>
/* Les styles restent inchangés */
.med-media-preview {
  font-family: var(--body-family);
}
.med-preview-frame {
  border-color: var(--medical-gray-200) !important;
  transition: all var(--transition-base);
}
.bg-video-skeleton { background-color: var(--medical-gray-100); }
.video-icon-wrapper { width: 44px; height: 44px; }
.bg-pdf-skeleton { background-color: #fef2f2; }
.med-preview-overlay {
  background-color: rgba(15, 23, 42, 0.45);
  opacity: 0;
  pointer-events: none;
}
.med-preview-frame:hover .med-preview-overlay {
  opacity: 1;
  pointer-events: auto;
}
.btn-action {
  width: 40px;
  height: 40px;
  padding: 0;
  transition: transform var(--transition-fast) ease;
}
.btn-action:hover { transform: scale(1.1); }
.extra-small { font-size: 0.75rem; }
.bg-dark-deep {
  background-color: #0f172a !important;
}
.max-modal-content {
  max-height: 75vh;
  width: auto;
  object-fit: contain;
}
</style>