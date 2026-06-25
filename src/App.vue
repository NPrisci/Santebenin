<script setup>
import { useServerError } from "@/composables/useServerError";
import MedInternalError from "@/components/main/MedInternalError.vue";
import MedApiLoading from "./components/services/MedApiLoading.vue";

const { hasServerError, errorToken, clearServerError } = useServerError();
</script>

<template>
  <!-- Superposition globale d'erreur 500 (priorité absolue) -->
  <Transition name="error-fade">
    <MedApiLoading>
      <MedInternalError
        v-if="hasServerError"
        :errorToken="errorToken"
        @retry="clearServerError"
        style="position: fixed; inset: 0; z-index: 99998; background: #fff"
      />
    </MedApiLoading>
  </Transition>

  <router-view v-if="!hasServerError" />
</template>

<style>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.3s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
}
</style>
