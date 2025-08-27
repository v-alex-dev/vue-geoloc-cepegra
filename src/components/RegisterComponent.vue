<template>
  <div class="register-container glass fade-in">
    <h2 class="neon-text title-responsive">Inscription</h2>
    <form @submit.prevent="register" class="form-responsive">
      <input v-model="pseudo" type="text" placeholder="Pseudo" required class="input-glass" />
      <button type="submit" class="btn-glass">S'inscrire</button>
      <p v-if="error" class="error neon-text text-responsive">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const pseudo = ref('')
const error = ref('')
const userStore = useUserStore()
const router = useRouter()

async function register() {
  if (!pseudo.value) return (error.value = 'Pseudo requis.')
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    const lat = position.coords.latitude
    const long = position.coords.longitude

    const userData = await userStore.register({ pseudo: pseudo.value, lat, long })

    // Vérification que l'utilisateur a bien été créé avec un ID
    if (!userData._id) {
      throw new Error('Utilisateur créé mais sans ID')
    }

    // Redirige vers la carte si succès
    router.push('/map')
  } catch (err) {
    error.value = err.message || "Erreur d'inscription ou de géolocalisation."
  }
}
</script>

<style scoped>
@import '../style.css';

.register-container {
  max-width: 400px;
  margin: 2rem auto;
}

.form-responsive {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 640px) {
  .register-container {
    margin: 1rem auto;
    max-width: 100%;
  }

  .form-responsive {
    gap: 0.75rem;
  }
}

.error {
  margin-top: 1rem;
}
</style>
