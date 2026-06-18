<template>
  <div>
    <!--On garde un composant vide-->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { isOnlyPatient, isAdmin } from '@/api/clients/auth'
import { useRouter } from 'vue-router'
import ProfilInitialisation from '@/api/endpoints/services/patient/initialisation'
import { useUiStore } from '@/router/ui'

const uiStore = useUiStore()
const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  try {
    isLoading.value = true
    if (isOnlyPatient()) {
      const isInit = await ProfilInitialisation.check()
      if (!isInit) {
        router.push('/p/initialise')
        return
      }
      router.push('/p/espace')
      return
    }

    if (isAdmin()) {
      router.push('/a/overview')
      return
    }
  } catch (error) {
    console.error(error)
    uiStore.setMainLoading(false)
  } finally {
    isLoading.value = false
    uiStore.setMainLoading(false)
  }
})
</script>