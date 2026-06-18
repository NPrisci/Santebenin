import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isDashLoading = ref(false)
  const isMainLoading = ref(false)
  const isProLoading = ref(false)

  function setDashLoading(status) {
    isDashLoading.value = status
  }

  function setMainLoading(status) {
    isMainLoading.value = status
  }

  function setProLoading(status) {
    isProLoading.value = status
  }

  return {
    isDashLoading,
    isMainLoading,
    isProLoading,
    setDashLoading,
    setMainLoading,
    setProLoading
  }
})
