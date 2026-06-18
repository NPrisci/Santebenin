<template>
   <div>
      <small>{{ id }}</small>
   </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { encryptService } from "@/api/endpoints/encrypt";
import { useRoute } from "vue-router";

const route = useRoute();
const id = ref(null);
onMounted(async () => {
   const encryptedId = route.params.id;
   id.value = await encryptService.localDecrypt(encryptedId);
})
</script>