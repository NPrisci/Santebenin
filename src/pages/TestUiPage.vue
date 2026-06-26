<template>
  <div class="d-flex bg-light">
    <MedConstantInput constantType="weight" v-model="weight" unit="kg" @change="saveWeight" />
    <MedConstantInput
      constantType="blood-pressure"
      :value="{ systolic: 120, diastolic: 80 }"
      mode="slider"
      @change="saveTension"
    />
    <MedConstantInput
      constantType="blood-pressure"
      :value="{ systolic: 120, diastolic: 80 }"
      mode="slider"
      @change="saveTension"
    />
    <MedConstantInput constantType="temperature" mode="pills" @change="saveTemp" />
  </div>
</template>
<script setup>
import MedConstantInput from "@/components/services/MedConstantInput.vue";
</script>
