<template>
  <div class="home-container glass fade-in">
    <h1 class="neon-text neon-flicker title-responsive">Bienvenue sur GeoLoc Cepegra</h1>
    <RegisterComponent />
  </div>
</template>

<script setup>
import RegisterComponent from '../components/RegisterComponent.vue'
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 2rem auto;
}

@media (max-width: 640px) {
  .home-container {
    margin: 1rem auto;
    max-width: 100%;
  }
}
</style>
