<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const model = defineModel({
  type: Object,
  default: null
})

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  },
  icon: {
    type: String,
    default: 'fas fa-search'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  allowAction: {
    type: Boolean,
    default: false
  },
  actionLabel: {
    type: String,
    default: 'Ajouter un nouvel élément'
  }
})

const emit = defineEmits(['search-change', 'select', 'clear', 'action-click'])

const containerRef = ref(null)
const menuRef = ref(null)
const searchQuery = ref('')
const isOpen = ref(false)
const focusedIndex = ref(-1)
let debounceTimeout = null

watch(model, (newVal) => {
  if (newVal) {
    searchQuery.value = newVal.title || ''
  } else if (!isOpen.value) {
    searchQuery.value = ''
  }
}, { immediate: true })

const flatItems = computed(() => {
  const items = []
  props.categories.forEach(category => {
    if (category.items && category.items.length) {
      category.items.forEach(item => {
        items.push({
          ...item,
          categoryUniqueId: category.id,
          categoryLabel: category.label
        })
      })
    }
  })
  return items
})

const hasResults = computed(() => flatItems.value.length > 0)

const onInput = (event) => {
  const value = event.target.value
  searchQuery.value = value
  isOpen.value = true
  focusedIndex.value = -1

  if (!value) {
    model.value = null
    emit('clear')
  }

  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('search-change', value)
  }, 300)
}

const selectItem = (item) => {
  model.value = item
  searchQuery.value = item.title
  isOpen.value = false
  focusedIndex.value = -1
  emit('select', { item, categoryId: item.categoryUniqueId, categoryLabel: item.categoryLabel })
}

const clearSearch = () => {
  model.value = null
  searchQuery.value = ''
  isOpen.value = false
  focusedIndex.value = -1
  emit('clear')
}

// --- LOGIQUE CLAVIER ---
const handleKeyDown = () => {
  if (props.loading || !isOpen.value) {
    if (!isOpen.value) isOpen.value = true
    return
  }
  if (focusedIndex.value < flatItems.value.length - 1) {
    focusedIndex.value++
    scrollIntoView()
  }
}

const handleKeyUp = () => {
  if (props.loading || focusedIndex.value > 0) {
    focusedIndex.value--
    scrollIntoView()
  }
}

const handleKeyEnter = () => {
  if (isOpen.value && !props.loading) {
    if (focusedIndex.value >= 0 && flatItems.value[focusedIndex.value]) {
      selectItem(flatItems.value[focusedIndex.value])
    } else if (!hasResults.value && props.allowAction && searchQuery.value) {
      handleActionClick()
    }
  }
}

const handleActionClick = () => {
  emit('action-click', searchQuery.value)
  isOpen.value = false
}

const scrollIntoView = () => {
  nextTick(() => {
    const menu = menuRef.value
    const activeItem = menu?.querySelector('.dropdown-item.active')
    if (menu && activeItem) {
      const menuRect = menu.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      if (itemRect.bottom > menuRect.bottom) {
        menu.scrollTop += (itemRect.bottom - menuRect.bottom)
      } else if (itemRect.top < menuRect.top) {
        menu.scrollTop -= (menuRect.top - itemRect.top)
      }
    }
  })
}

const getHighlightedSegments = (text, query) => {
  if (!query) return [{ text, match: false }]
  const cleanQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const regex = new RegExp(`(${cleanQuery})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part => ({
    text: part,
    match: part.toLowerCase() === query.toLowerCase()
  }))
}

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false
    focusedIndex.value = -1
    if (model.value) {
      searchQuery.value = model.value.title
    } else {
      searchQuery.value = ''
    }
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(debounceTimeout)
})
</script>

<template>
  <div ref="containerRef" class="position-relative w-100 med-autocomplete">
    <label v-if="label" class="form-label">
      {{ label }}
    </label>

    <div class="input-group">
      <span class="input-group-text bg-light border-end-0 text-muted transition-base">
        <i :class="icon"></i>
      </span>

      <input
        type="text"
        class="form-control border-start-0"
        :class="{ 'is-invalid': !!error }"
        :placeholder="placeholder"
        :value="searchQuery"
        :disabled="disabled"
        autocomplete="off"
        @input="onInput"
        @focus="isOpen = true"
        @keydown.down.prevent="handleKeyDown"
        @keydown.up.prevent="handleKeyUp"
        @keydown.enter.prevent="handleKeyEnter"
        @keydown.esc="isOpen = false"
      />

      <button
        v-if="searchQuery && !disabled"
        class="btn btn-outline-secondary border-start-0 text-muted px-3 d-flex align-items-center bg-transparent"
        type="button"
        @click="clearSearch"
      >
        <i class="fas fa-times small"></i>
      </button>
    </div>

    <div v-if="error" class="invalid-feedback d-block">
      <i class="fas fa-exclamation-circle me-1"></i> {{ error }}
    </div>
    <div v-else-if="helpText" class="form-text mt-1">{{ helpText }}</div>

    <ul
      v-if="isOpen && (hasResults || searchQuery || loading)"
      ref="menuRef"
      class="dropdown-menu show w-100 shadow-lg border overflow-y-auto mt-1"
      style="max-height: 360px; z-index: 1060; position: absolute; top: 100%; left: 0;"
    >
      
      <template v-if="loading">
        <div class="med-skeleton-wrapper p-3">
          <div class="skeleton-header mb-3"></div>
          <div class="d-flex flex-column gap-3 mb-4">
            <div v-for="i in 2" :key="'sk-p-' + i" class="d-flex flex-column gap-1 px-2">
              <div class="skeleton-line title w-50"></div>
              <div class="skeleton-line subtitle w-75"></div>
            </div>
          </div>
          
          <div class="skeleton-header mb-3"></div>
          <div class="d-flex flex-column gap-3">
            <div class="d-flex flex-column gap-1 px-2">
              <div class="skeleton-line title w-40"></div>
              <div class="skeleton-line subtitle w-60"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="hasResults">
        <div v-for="category in categories" :key="category.id">
          <li v-if="category.items && category.items.length" class="dropdown-header text-uppercase fw-bold small bg-light py-2 px-3 sticky-top">
            {{ category.label }}
          </li>

          <li v-for="item in category.items" :key="item.id">
            <button
              type="button"
              class="dropdown-item py-2 px-3 d-flex flex-column text-start"
              :class="{ 'active': flatItems.findIndex(f => f.id === item.id && f.categoryUniqueId === category.id) === focusedIndex }"
              @click="selectItem({ ...item, title: item.title, categoryUniqueId: category.id, categoryLabel: category.label })"
            >
              <slot name="option" :item="item" :query="searchQuery">
                <span class="fw-semibold item-title">
                  <template v-for="(segment, sIdx) in getHighlightedSegments(item.title, searchQuery)" :key="sIdx">
                    <mark v-if="segment.match" class="p-0 bg-warning-subtle text-dark fw-bold">{{ segment.text }}</mark>
                    <span v-else>{{ segment.text }}</span>
                  </template>
                </span>
                <small class="text-muted item-subtitle small mt-0.5" :class="{ 'text-white-50': flatItems.findIndex(f => f.id === item.id && f.categoryUniqueId === category.id) === focusedIndex }">
                  {{ item.subtitle }}
                </small>
              </slot>
            </button>
          </li>
        </div>
      </template>

      <template v-else-if="searchQuery">
        <li class="dropdown-item-text text-center py-4 text-muted small d-flex flex-row align-items-center justify-content-center">
          <i class="fas fa-search me-2 fs-3"></i> <span class="text-center">Aucun dossier ou spécialité trouvé pour "{{ searchQuery }}"</span>
        </li>
        <li v-if="allowAction" class="px-3 pb-2">
          <button type="button" class="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2" @click="handleActionClick">
            <i class="fas fa-plus-circle"></i> {{ actionLabel }}
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.med-autocomplete {
  font-family: var(--body-family);
}

/* Dropdown */
.dropdown-menu {
  border-radius: var(--radius-lg);
  border-color: var(--medical-gray-200);
  padding: 0.25rem 0;
}

.dropdown-header {
  color: var(--medical-gray-500) !important;
  letter-spacing: 0.05em;
  font-family: var(--title-family);
  top: -1px;
}

.dropdown-item {
  border-radius: var(--radius-sm);
  margin: 0 0.25rem;
  width: calc(100% - 0.5rem);
  transition: all var(--transition-fast);
}

.dropdown-item:not(.active):hover {
  background-color: var(--medical-gray-100);
  color: var(--medical-gray-900);
}

.dropdown-item.active {
  background-color: var(--medical-primary) !important;
  color: var(--medical-white) !important;
}

.dropdown-item.active mark {
  background-color: rgba(255, 255, 255, 0.3) !important;
  color: var(--medical-white) !important;
}

/* ==========================================================================
   CSS SKELETON LOADER (Intégré aux normes de main.css)
   ========================================================================== */
.med-skeleton-wrapper {
  animation: med-pulse 1.4s infinite ease-in-out;
  pointer-events: none; /* Désactiver l'interaction pendant le chargement */
}

.skeleton-header {
  height: 14px;
  width: 35%;
  background-color: var(--medical-gray-200);
  border-radius: var(--radius-sm);
}

.skeleton-line {
  background-color: var(--medical-gray-100);
  border-radius: var(--radius-sm);
}

.skeleton-line.title {
  height: 16px;
  background-color: var(--medical-gray-200);
}

.skeleton-line.subtitle {
  height: 12px;
  background-color: var(--medical-gray-100);
}

@keyframes med-pulse {
  0%, 100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
</style>