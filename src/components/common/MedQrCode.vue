<script setup>
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 140, // Taille idéale pour l'en-tête ou un widget de profil
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Maintained to preserve your existing template error state conditions
const qrError = ref(false);
</script>

<template>
  <div 
    class="med-qr-wrapper d-flex align-items-center justify-content-center bg-white border rounded shadow-sm overflow-hidden"
    :style="{ width: size + 24 + 'px', height: size + 24 + 'px' }"
  >
    <div v-if="loading" class="text-center med-qr-pulse">
      <i class="pi pi-spinner pi-spin text-primary fs-4 mb-2"></i>
      <div class="text-xxs text-muted tracking-wider text-uppercase">Génération...</div>
    </div>

    <div v-else-if="qrError || !value" class="text-center px-2 text-wrap">
      <i class="pi pi-exclamation-triangle text-warning mb-1" style="font-size: 1.4rem;"></i>
      <div class="text-xxs text-muted fw-medium lh-sm">Code indisponible</div>
    </div>

    <div 
      v-show="!loading && !qrError && value" 
      class="d-flex align-items-center justify-content-center position-relative"
    >
      <!-- Declarative QR Code Component Replacing the Native Canvas Ref -->
      <qrcode-vue
        :value="props.value"
        :size="props.size"
        level="M"
        render-as="canvas"
        background="#ffffff"
        foreground="#0369a1"
        class="img-fluid d-block"
      />
      
      <span class="position-absolute bottom-0 start-50 translate-middle-x bg-dark text-white rounded-pill px-2 py-0-5 text-xxs opacity-75 select-none d-none d-sm-inline">
        Scanner Urgence
      </span>
    </div>
  </div>
</template>

<style scoped>
.med-qr-wrapper {
  padding: 12px;
  border-color: var(--medical-gray-200, #dee2e6) !important;
  transition: border-color var(--transition-fast, 0.15s) ease-in-out;
}

.med-qr-wrapper:hover {
  border-color: var(--medical-primary-light, #38bdf8) !important;
}

/* Animation douce de pulsation pendant le chargement initial */
.med-qr-pulse {
  animation: qrPulse 1.5s infinite ease-in-out;
}

@keyframes qrPulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.text-xxs {
  font-size: 0.65rem !important;
  letter-spacing: 0.03em;
}

.py-0-5 {
  padding-top: 0.15rem !important;
  padding-bottom: 0.15rem !important;
}
</style>
