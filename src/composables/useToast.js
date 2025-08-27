import { ref } from 'vue'

const toastMsg = ref('')
const showToast = ref(false)

export function useToast() {
  const showSuccessToast = (msg) => {
    toastMsg.value = msg
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }

  const showErrorToast = (msg) => {
    toastMsg.value = msg
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }

  return {
    toastMsg,
    showToast,
    showSuccessToast,
    showErrorToast,
  }
}
