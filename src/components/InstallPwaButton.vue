<template>
  <button
    v-if="canInstall"
    @click="installApp"
    class="btn-install btn-glass fade-in"
    aria-label="Installer l'application"
  >
    <svg class="install-icon" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
    </svg>
    Installer l'app
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '../composables/useToast'

const canInstall = ref(false)
const deferredPrompt = ref(null)
const { showSuccessToast, showErrorToast } = useToast()

onMounted(() => {
  // Vérifier si l'app est déjà en mode standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    canInstall.value = false
    return
  }

  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    canInstall.value = true
  })

  // Cacher le bouton si l'app est déjà installée
  window.addEventListener('appinstalled', () => {
    canInstall.value = false
    deferredPrompt.value = null
    showSuccessToast('Application installée avec succès !')
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) {
    showErrorToast('Installation non disponible')
    return
  }

  try {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      showSuccessToast('Installation en cours...')
    }

    deferredPrompt.value = null
    canInstall.value = false
  } catch {
    showErrorToast("Erreur lors de l'installation")
  }
}
</script>

<style scoped>
@import '../style.css';

.btn-install {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  min-width: auto;
  white-space: nowrap;
}

.install-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .btn-install {
    bottom: 1rem;
    right: 1rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }

  .install-icon {
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 480px) {
  .btn-install {
    bottom: 0.75rem;
    right: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
