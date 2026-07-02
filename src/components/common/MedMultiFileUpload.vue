<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '*/*'
  },
  // Taille maximale autorisée PAR fichier (en Mo)
  maxSize: {
    type: Number,
    default: 10
  },
  // Nombre maximum de fichiers autorisés en simultané
  maxFiles: {
    type: Number,
    default: 5
  },
  helpText: {
    type: String,
    default: 'Formats acceptés : PDF, PNG, JPEG (Max. 5 fichiers / 10 Mo par fichier)'
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

const emit = defineEmits(['files-changed', 'error'])

const fileInputRef = ref(null)
const isDragging = ref(false)
const uploadedFiles = ref([]) // Tableau d'objets File bruts
const internalError = ref('')

const activeError = computed(() => props.error || internalError.value)

// Déterminer l'icône Font Awesome selon le type MIME du fichier
const getFileIcon = (file) => {
  const type = file.type
  if (type.startsWith('image/')) return 'fas fa-file-image text-success'
  if (type === 'application/pdf') return 'fas fa-file-pdf text-danger'
  if (type.includes('word') || type.includes('officedocument')) return 'fas fa-file-word text-primary'
  return 'fas fa-file-medical text-secondary'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Octet'
  const k = 1024
  const sizes = ['Octets', 'Ko', 'Mo']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const triggerFileInput = () => {
  if (!props.disabled && uploadedFiles.value.length < props.maxFiles) {
    fileInputRef.value.click()
  }
}

// Validation et traitement du lot de fichiers
const processFiles = (fileList) => {
  internalError.value = ''
  const filesArray = Array.from(fileList)
  
  if (filesArray.length === 0) return

  // 1. Vérification du plafond global de fichiers
  if (uploadedFiles.value.length + filesArray.length > props.maxFiles) {
    internalError.value = `Limite atteinte. Vous ne pouvez pas téléverser plus de ${props.maxFiles} fichiers simultanément.`
    emit('error', internalError.value)
    return
  }

  const validNewFiles = []

  for (const file of filesArray) {
    // 2. Éviter les doublons exacts (même nom et même taille)
    const isDuplicate = uploadedFiles.value.some(f => f.name === file.name && f.size === file.size)
    if (isDuplicate) continue

    // 3. Validation de taille individuelle
    if (file.size > props.maxSize * 1024 * 1024) {
      internalError.value = `Le fichier "${file.name}" dépasse la limite de ${props.maxSize} Mo.`
      emit('error', internalError.value)
      return
    }

    // 4. Validation du type MIME
    if (props.accept !== '*/*') {
      const cleanAcceptArray = props.accept.split(',').map(t => t.trim().toLowerCase())
      const isAccepted = cleanAcceptArray.some(type => {
        if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''))
        if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type)
        return file.type === type
      })

      if (!isAccepted) {
        internalError.value = `Le format de "${file.name}" n'est pas autorisé.`
        emit('error', internalError.value)
        return
      }
    }

    validNewFiles.push(file)
  }

  if (validNewFiles.length > 0) {
    uploadedFiles.value = [...uploadedFiles.value, ...validNewFiles]
    emit('files-changed', uploadedFiles.value)
  }
}

const onDragOver = (e) => {
  if (props.disabled || uploadedFiles.value.length >= props.maxFiles) return
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e) => {
  if (props.disabled || uploadedFiles.value.length >= props.maxFiles) return
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer.files) {
    processFiles(e.dataTransfer.files)
  }
}

const onFileChange = (e) => {
  if (e.target.files) {
    processFiles(e.target.files)
  }
}

// Suppression unitaire d'un fichier du panier
const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
  internalError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('files-changed', uploadedFiles.value)
}
</script>

<template>
  <div class="med-multi-upload w-100">
    <label v-if="label" class="form-label fw-bold text-dark mb-2">
      {{ label }} 
      <span class="text-muted fw-normal font-sans text-sm">({{ uploadedFiles.length }}/${{ maxFiles }})</span>
    </label>

    <input
      ref="fileInputRef"
      type="file"
      class="d-none"
      :accept="accept"
      :disabled="disabled"
      multiple
      @change="onFileChange"
    />

    <div
      v-if="uploadedFiles.length < maxFiles"
      class="med-dropzone d-flex flex-column align-items-center justify-content-center text-center p-4 transition-base mb-3"
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
      <div class="med-dropzone-icon mb-2 rounded-circle d-flex align-items-center justify-content-center">
        <i class="fas fa-folder-plus fs-4 text-primary transition-fast"></i>
      </div>
      
      <p class="mb-1 fw-semibold text-dark text-sm drop-title">
        Glissez vos documents ici, ou <span class="text-primary text-decoration-underline browse-text">parcourez</span>
      </p>
      <p class="text-muted small mb-0 font-sans extra-small">
        {{ helpText }}
      </p>
    </div>

    <div v-if="activeError" class="invalid-feedback d-block mt-1 mb-3 font-sans">
      <i class="fas fa-exclamation-triangle me-1"></i> {{ activeError }}
    </div>

    <div v-if="uploadedFiles.length > 0" class="med-file-list d-flex flex-column gap-2 animate-fade-in">
      <div 
        v-for="(file, idx) in uploadedFiles" 
        :key="file.name + '-' + file.size"
        class="med-file-item border rounded p-2 d-flex align-items-center justify-content-between bg-white shadow-xs"
      >
        <div class="d-flex align-items-center gap-3 overflow-hidden me-2">
          <div class="med-file-icon-box rounded d-flex align-items-center justify-content-center bg-light flex-shrink-0">
            <i :class="[getFileIcon(file), 'fs-5']"></i>
          </div>
          
          <div class="d-flex flex-column text-start overflow-hidden">
            <span class="fw-semibold text-dark text-truncate text-sm file-name" :title="file.name">
              {{ file.name }}
            </span>
            <span class="text-muted font-monospace extra-small mt-0.5">
              {{ formatFileSize(file.size) }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-outline-secondary btn-remove rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 transition-fast"
          @click.stop="removeFile(idx)"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-multi-upload {
  font-family: var(--body-family);
}

.med-dropzone {
  border: 2px dashed var(--medical-gray-300);
  border-radius: var(--radius-lg);
  background-color: var(--medical-gray-50);
  cursor: pointer;
  min-height: 130px;
}

.med-dropzone:hover:not(.is-disabled) {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
}

.med-dropzone.is-dragging {
  border-color: var(--medical-primary);
  background-color: var(--medical-primary-bg);
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
}

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
  width: 46px;
  height: 46px;
  background-color: var(--medical-white);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.extra-small {
  font-size: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
}

/* Éléments de la liste */
.med-file-item {
  border-color: var(--medical-gray-200) !important;
  transition: border-color var(--transition-fast);
}

.med-file-item:hover {
  border-color: var(--medical-gray-300) !important;
}

.med-file-icon-box {
  width: 38px;
  height: 38px;
}

.file-name {
  max-width: 320px;
}

.btn-remove {
  width: 28px;
  height: 28px;
  padding: 0;
  border-color: var(--medical-gray-200);
  color: var(--medical-gray-500);
  font-size: 0.75rem;
}

.btn-remove:hover {
  background-color: #fef2f2;
  border-color: var(--medical-accent-danger);
  color: var(--medical-accent-danger);
}

.animate-fade-in {
  animation: slideUp 0.2s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>