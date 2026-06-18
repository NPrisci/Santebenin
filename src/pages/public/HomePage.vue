<template>
   <div class="container-fluid align-items-center h-100">
      <h1>Bienvenue sur BeninSanté</h1>
      <button class="btn btn-secondary" @click="test">Test toast</button>
      <button class="btn btn-success" @click="login">Test login</button>
   </div>
</template>

<script setup>
import { useToast } from "@/composables/useToast";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

const test = () => {
   toast.success('Success message')
}

const login = () => {
   router.push({ name: 'login' })
}
</script>