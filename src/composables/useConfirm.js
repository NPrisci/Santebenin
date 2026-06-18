import { reactive } from 'vue'

// État global partagé pour la boîte de dialogue de confirmation
const confirmState = reactive({
  isVisible: false,
  options: {},
  resolvePromise: null
})

export function useConfirm() {
  /**
   * Ouvre la boîte de dialogue avec les options fournies.
   * Retourne une promesse qui sera résolue lors de l'interaction utilisateur.
   */
  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      confirmState.options = options
      confirmState.resolvePromise = resolve
      confirmState.isVisible = true
    })
  }

  /**
   * Gestionnaire à attacher à l'événement @confirm du composant MedConfirm
   */
  const handleConfirm = (value) => {
    confirmState.isVisible = false
    if (confirmState.resolvePromise) {
      confirmState.resolvePromise({ isConfirmed: true, value })
      confirmState.resolvePromise = null
    }
  }

  /**
   * Gestionnaire à attacher à l'événement @cancel du composant MedConfirm
   */
  const handleCancel = () => {
    confirmState.isVisible = false
    if (confirmState.resolvePromise) {
      confirmState.resolvePromise({ isConfirmed: false })
      confirmState.resolvePromise = null
    }
  }

  // Raccourcis pratiques
  const confirmDelete = (options = {}) => {
    return confirm({
      title: "Suppression",
      text: "Cette action est irréversible. Voulez-vous continuer ?",
      type: "error",
      confirmButtonText: "Supprimer",
      confirmButtonClass: "btn btn-danger px-4",
      ...options
    })
  }

  const confirmAction = (options = {}) => {
    return confirm({
      type: "question",
      confirmButtonClass: "btn btn-primary px-4",
      ...options
    })
  }

  return {
    confirmState,
    confirm,
    confirmDelete,
    confirmAction,
    handleConfirm,
    handleCancel
  }
}
