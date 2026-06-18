<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <MedRichEditor
            v-model="content"
            placeholder="Votre texte ici..."
            min-width="480px"
            min-height="400px"
            :max-length="2000"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <MedTextArea
            v-model="content" 
            placeholder="Le texte formaté apparaîtra ici (HTML)..."
            :max-length="1000"
            rows="8"
            border-color="#059669"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUiStore } from "@/router/ui"; 
import MedRichEditor from "@/components/common/MedRichEditor.vue"
import MedTextArea from "@/components/common/MedTextArea.vue"

const uiStore = useUiStore();

// Une seule variable réactive pour les deux composants !
const content = ref('')
onMounted(() => {
  setTimeout(() => {
    uiStore.setDashLoading(false);
  }, 3000);
})
</script>