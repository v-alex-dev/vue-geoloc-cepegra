<script setup>
import { RouterView, RouterLink } from 'vue-router'
import InstallPwaButton from '@/components/InstallPwaButton.vue'
</script>

<template>
  <InstallPwaButton />
  <nav class="main-nav">
    <RouterLink to="/">Accueil</RouterLink>
    <RouterLink to="/map">Carte</RouterLink>
  </nav>
  <main class="container-responsive">
    <RouterView />
  </main>
</template>

<style scoped>
.main-nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .main-nav {
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
    padding: 0 1rem;
  }

  .main-nav a {
    text-align: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: var(--color-glass);
    border: 1px solid var(--color-border);
  }
}

main {
  min-height: 60vh;
}
</style>
