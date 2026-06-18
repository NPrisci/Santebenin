<script setup>
import { useDashboard } from '@/composables/useLayout'

const props = defineProps({
  title: { type: String, default: 'BéninSanté' },
  notificationCount: { type: Number, default: 0 }
})

const { toggleRightPanel } = useDashboard()
</script>

<template>
  <header class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom shadow-sm fixed-top w-100 z-3">
    <div class="d-flex align-items-center gap-2">
      <div class="logo-icon-box rounded-3 bg-light d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
        <i class="pi pi-shield text-info"></i>
      </div>
    </div>

    <div class="text-center flex-grow-1 px-2 text-truncate">
      <span class="fw-bold font-title text-dark">{{ title }}</span>
    </div>

    <div class="d-flex align-items-center gap-3">
      <div class="position-relative">
        <i class="pi pi-bell text-secondary fs-5 mt-2"></i>
        <span v-if="notificationCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
          {{ notificationCount > 99 ? '99+' : notificationCount }}
        </span>
      </div>
      <button @click="toggleRightPanel" class="btn btn-sm border-0 bg-transparent p-0 text-secondary">
        <i class="pi pi-question-circle fs-5"></i>
      </button>
    </div>
  </header>
  <!-- Spacer to prevent content from hiding under fixed header -->
  <div class="d-block d-lg-none" style="height: 64px;"></div>
</template>

<style scoped>
.logo-icon-box {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
