<template>
    <slot/>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { api } from '@/api/clients/main';

let intervalId = null;

const callApi = async () => {
  try {
    const response = await api('/initialise');
    console.log(response.message)
  } catch (error) {
    console.error('Erreur API:', error);
  }
};

onMounted(() => {
  // Premier appel
  callApi();
  
  // Intervalle toutes les 30s
  intervalId = setInterval(callApi, 30000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>