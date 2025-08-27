<template>
  <div class="map-page glass fade-in">
    <div
      v-if="showToast"
      class="toast-success toast-responsive"
      :class="{ 'toast-error': isError }"
    >
      {{ toastMsg }}
    </div>
    <h2 class="neon-text title-responsive">Carte des utilisateurs</h2>
    <div class="map-container">
      <l-map
        v-if="mapCenter"
        :zoom="13"
        :center="mapCenter"
        class="map-responsive"
        style="width: 100%; border-radius: 1rem; overflow: hidden"
      >
        <l-tile-layer :url="MAP_CONFIG.TILE_URL" :attribution="MAP_CONFIG.ATTRIBUTION" />
        <l-marker v-if="myPosition" :lat-lng="myPosition">
          <l-popup>Ma position</l-popup>
        </l-marker>
        <l-marker v-for="user in users" :key="user._id" :lat-lng="[user.lat, user.long]">
          <l-popup>{{ user.pseudo }}</l-popup>
        </l-marker>
      </l-map>
      <div v-else class="neon-text text-responsive">Chargement de la carte...</div>
    </div>
    <div class="btn-group flex-responsive gap-responsive mt-6">
      <button class="btn-glass" @click="updateMyPosition">Rafraîchir ma position</button>
      <button class="btn-glass" @click="refreshUsers">Rafraîchir utilisateurs</button>
    </div>

    <div class="user-table-container mt-8">
      <h3 class="neon-text title-responsive">Liste des utilisateurs</h3>
      <div class="table-responsive">
        <table class="user-table">
          <thead>
            <tr>
              <th>Pseudo</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.pseudo }}</td>
              <td>{{ user.lat }}</td>
              <td>{{ user.long }}</td>
              <td>
                <button class="btn-glass btn-danger" @click="deleteUser(user._id)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useToast } from '../composables/useToast'
import { MAP_CONFIG, REFRESH_INTERVAL } from '../config/constants'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const userStore = useUserStore()
const { toastMsg, showToast, showSuccessToast, showErrorToast } = useToast()

const myPosition = ref(null)
const mapCenter = ref(null)
const isError = ref(false)
let intervalId = null

// Computed pour les utilisateurs avec coordonnées valides
const users = computed(() => userStore.users.filter((u) => u.lat && u.long))

async function initializeMap() {
  try {
    const position = await userStore.getCurrentPosition()
    myPosition.value = [position.lat, position.long]
    mapCenter.value = myPosition.value
  } catch {
    myPosition.value = null
    // Position par défaut (ex: Paris)
    mapCenter.value = MAP_CONFIG.DEFAULT_CENTER
  }
}

async function updateMyPosition() {
  if (!userStore.userId) {
    showErrorToast('Vous devez être connecté pour mettre à jour votre position')
    isError.value = true
    return
  }

  try {
    const position = await userStore.getCurrentPosition()
    myPosition.value = [position.lat, position.long]
    mapCenter.value = myPosition.value

    await userStore.updateUserPosition(position)
    showSuccessToast('Position mise à jour avec succès')
    refreshUsers()
    isError.value = false
  } catch (error) {
    showErrorToast('Erreur lors de la mise à jour: ' + error.message)
    isError.value = true
  }
}

async function refreshUsers() {
  try {
    await userStore.fetchUsers()
    showSuccessToast('Liste des utilisateurs rafraîchie')
    isError.value = false
  } catch (error) {
    showErrorToast('Erreur lors du chargement: ' + error.message)
    isError.value = true
  }
}

async function refreshUsersSilently() {
  try {
    await userStore.fetchUsers()
    isError.value = false
  } catch {
    isError.value = true
  }
}

async function deleteUser(id) {
  try {
    await userStore.deleteUser(id)
    showSuccessToast('Utilisateur supprimé')
    isError.value = false
  } catch (error) {
    showErrorToast('Erreur lors de la suppression: ' + error.message)
    isError.value = true
  }
}

onMounted(async () => {
  await initializeMap()
  await refreshUsersSilently() // Premier chargement silencieux
  // Actualisation automatique toutes les 10 secondes
  intervalId = setInterval(refreshUsersSilently, REFRESH_INTERVAL)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.toast-success {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #00ffe7;
  color: #222;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px #00ffe799;
  font-weight: bold;
  z-index: 9999;
  animation: toast-in 0.4s cubic-bezier(0.4, 2, 0.6, 1) both;
}

.toast-responsive {
  position: fixed;
  top: 2rem;
  right: 2rem;
}

@media (max-width: 640px) {
  .toast-responsive {
    left: 0.5rem;
    right: 0.5rem;
    top: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

.toast-error {
  background: #ff3b3b;
  color: #fff;
  box-shadow: 0 2px 16px #ff3b3b99;
}

@keyframes toast-in {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Map responsive styles */
.map-responsive {
  height: 350px;
}

@media (max-width: 640px) {
  .map-responsive {
    height: 250px !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .map-responsive {
    height: 300px !important;
  }
}

@media (min-width: 1025px) {
  .map-responsive {
    height: 400px !important;
  }
}

/* Button group responsive */
.btn-group {
  margin-top: 1.5rem;
}

@media (max-width: 640px) {
  .btn-group .btn-glass {
    margin-bottom: 0.5rem;
  }
}

/* Tableau utilisateurs stylisé */
.user-table-container {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .user-table-container {
    padding: 0.5rem;
    margin-top: 1rem;
  }
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.user-table th,
.user-table td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #444;
  text-align: left;
}

@media (max-width: 640px) {
  .user-table th,
  .user-table td {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

.user-table th {
  color: #00ffe7;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.2);
}

.user-table tr:last-child td {
  border-bottom: none;
}

.btn-danger {
  background: #ff3b3b;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .btn-danger {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}

.btn-danger:hover {
  background: #d32f2f;
}

.map-page {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
}

@media (max-width: 640px) {
  .map-page {
    margin: 1rem auto;
    padding: 1rem;
    max-width: 100%;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .map-page {
    max-width: 90%;
    padding: 1.5rem;
  }
}

.map-container {
  margin: 2rem 0;
}

@media (max-width: 640px) {
  .map-container {
    margin: 1rem 0;
  }
}
</style>
