<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  // Types MIME acceptés (ex: 'image/*', 'application/pdf', '.docx')
  accept: {
    type: String,
    default: '*/*'
  },
  // Taille maximale autorisée en Mo
  maxSize: {
    type: Number,
    default: 10
  },
  helpText: {
    type: String,
    default: 'Formats acceptés : PDF, PNG, JPEG (Max. 10 Mo)'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['file-selected', 'file-removed', 'error'])

const fileInputRef = ref(null)
const isDragging = ref(false)
const currentFile = ref(null)
const internalError = ref('')

// Computed pour fusionner les erreurs parentes et internes
const activeError = computed(() => props.error || internalError.value)

// Détecter l'icône Font Awesome appropriée selon le type de fichier
const fileIconClass = computed(() => {
  if (!currentFile.value) return 'fas fa-file'
  const type = currentFile.value.type
  if (type.startsWith('image/')) return 'fas fa-file-image text-success'
  if (type === 'application/pdf') return 'fas fa-file-pdf text-danger'
  if (type.includes('word') || type.includes('officedocument')) return 'fas fa-file-word text-primary'
  return 'fas fa-file-medical text-secondary'
})

// Convertir la taille du fichier en format lisible
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Octet'
  const k = 1024
  const sizes = ['Octets', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Déclencher le clic sur le input invisible
const triggerFileInput = () => {
  if (!props.disabled && !currentFile.value) {
    fileInputRef.value.click()
  }
}

// Validation stricte du fichier
const validateAndProcessFile = (file) => {
  internalError.value = ''
  
  if (!file) return

  // 1. Validation de la taille
  const maxSizeInBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    internalError.value = `Le fichier dépasse la taille maximale autorisée de ${props.maxSize} Mo.`
    emit('error', internalError.value)
    return
  }

  // 2. Validation sommaire du type MIME (si l'attribut accept n'est pas global)
  if (props.accept !== '*/*') {
    // eslint-disable-next-line no-unused-vars
    const baseMimeType = props.accept.replace('*', '').toLowerCase()
    const cleanAcceptArray = props.accept.split(',').map(t => t.trim().toLowerCase())
    
    const isAccepted = cleanAcceptArray.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''))
      }
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type)
      }
      return file.type === type
    })

    if (!isAccepted) {
      internalError.value = 'Ce format de fichier n\'est pas autorisé dans ce dossier clinique.'
      emit('error', internalError.value)
      return
    }
  }

  // Si valide, assignation et émission du binaire pur
  currentFile.value = file
  emit('file-selected', file)
}

// Gestionnaires d'événements pour le Drag & Drop
const onDragOver = (e) => {
  if (props.disabled || currentFile.value) return
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e) => {
  if (props.disabled || currentFile.value) return
  e.preventDefault()
  isDragging.value = false
  
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    validateAndProcessFile(e.dataTransfer.files[0])
  }
}

const onFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    validateAndProcessFile(e.target.files[0])
  }
}

// Réinitialiser la zone
const removeFile = () => {
  currentFile.value = null
  internalError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('file-removed')
}
</script>

<template>
  <div class="med-upload-container w-100">
    <label v-if="label" class="form-label fw-bold text-dark mb-2">
      {{ label }}
    </label>

    <input
      ref="fileInputRef"
      type="file"
      class="d-none"
      :accept="accept"
      :disabled="disabled"
      @change="onFileChange"
    />

    <div
      v-if="!currentFile"
      class="med-dropzone d-flex flex-column align-items-center justify-content-center text-center p-4 transition-base"
      :class="{
        'is-dragging': isDragging,
        'is-invalid': !!activeError,
        'is-disabled': disabled
      }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="triggerFileInput"
    >
      <div class="med-dropzone-icon mb-3 rounded-circle d-flex align-items-center justify-content-center">
        <i class="fas fa-cloud-upload-alt fs-3 text-primary transition-fast"></i>
      </div>
      
      <p class="mb-1 fw-semibold text-dark drop-title">
        Glissez-déposez le document ici, ou <span class="text-primary text-decoration-underline browse-text">parcourez</span>
      </p>
      <p class="text-muted small mb-0 font-sans">
        {{ helpText }}
      </p>
    </div>

    <div v-else class="med-preview-card border rounded-lg p-3 d-flex align-items-center justify-content-between bg-white shadow-sm animate-fade-in">
      <div class="d-flex align-items-center gap-3 overflow-hidden me-2">
        <div class="med-file-avatar rounded d-flex align-items-center justify-content-center bg-light flex-shrink-0">
          <i :class="[fileIconClass, 'fs-4']"></i>
        </div>
        
        <div class="d-flex flex-column text-start overflow-hidden">
          <span class="fw-semibold text-dark text-truncate file-name" :title="currentFile.name">
            {{ currentFile.name }}
          </span>
          <span class="text-muted small font-monospace mt-0.5">
            {{ formatFileSize(currentFile.size) }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-outline-danger btn-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 transition-fast"
        title="Supprimer ce document"
        @click="removeFile"
      >
        <i class="fas fa-trash-alt small"></i>
      </button>
    </div>

    <div v-if="activeError" class="invalid-feedback d-block mt-2 font-sans">
      <i class="fas fa-exclamation-triangle me-1"></i> {{ activeError }}
    </div>
  </div>
</template>

<style scoped>
.med-upload-container {
  font-family: var(--body-family);
}

/* Style de la zone de Drop */
.med-dropzone {
  border: 2px dashed var(--medical-gray-300);
  border-radius: var(--radius-lg);
  background-color: var(--medical-gray-50);
  cursor: pointer;
  min-height: 160px;
}

.med-dropzone:hover:not(.is-disabled) {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
}

.med-dropzone:hover:not(.is-disabled) .med-dropzone-icon i {
  transform: translateY(-3px);
}

/* État d'activation pendant le survol du fichier (Dragover) */
.med-dropzone.is-dragging {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
  transform: scale(0.99);
}

/* États spécifiques */
.med-dropzone.is-invalid {
  border-color: var(--medical-accent-danger);
  background-color: #fff5f5;
}

.med-dropzone.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--medical-gray-100);
}

.med-dropzone-icon {
  width: 56px;
  height: 56px;
  background-color: var(--medical-white);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.browse-text {
  cursor: pointer;
}

/* Style du panneau de prévisualisation */
.med-preview-card {
  border-color: var(--medical-gray-200) !important;
  transition: border-color var(--transition-base);
}

.med-preview-card:hover {
  border-color: var(--medical-gray-300) !important;
}

.med-file-avatar {
  width: 48px;
  height: 48px;
}

.file-name {
  max-width: 280px;
  font-size: 0.95rem;
}

/* Bouton icône circulaire */
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-color: var(--medical-gray-200);
  color: var(--medical-gray-500);
}

.btn-icon:hover {
  background-color: #fef2f2;
  border-color: var(--medical-accent-danger);
  color: var(--medical-accent-danger);
}

/* Petite animation d'apparition */
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>