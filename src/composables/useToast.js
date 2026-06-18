/**
 * useToast — Composable de notification toast pour BéninSanté
 *
 * Utilisation :
 *   const toast = useToast()
 *
 *   toast('Message')                          // warning par défaut
 *   toast('Message', 'success', 4000)         // appel explicite
 *   toast.success('Opération réussie !')
 *   toast.error('Une erreur est survenue.')
 *   toast.info('Information importante.')
 *   toast.warning('Attention !')
 */

const DEFAULT_DURATION = 3000

// Correspondance type → classe Bootstrap
const TYPE_CONFIG = {
  success: { bg: 'bg-success' },
  info:    { bg: 'bg-info' },
  warning: { bg: 'bg-warning' },
  error:   { bg: 'bg-danger' },
}

/**
 * Fonction bas niveau qui déclenche le toast natif bs5-toast.
 * @param {string} message  - Contenu du toast
 * @param {string} type     - 'success' | 'info' | 'warning' | 'error'
 * @param {number} duration - Durée d'affichage en ms
 */
function fire(message, type = 'warning', duration = DEFAULT_DURATION) {
  if (!window.bs5 || !window.bs5.Toast) {
    console.warn("[useToast] La librairie bs5-toast n'est pas chargée.")
    return
  }

  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.warning

  new window.bs5.Toast({
    body: `<span class="text-white fw-medium">${message}</span>`,
    className: `border-0 ${config.bg}`,
    btnCloseWhite: true,
    duration,
  }).show()
}

export function useToast() {
  /**
   * Fonction principale — appelable directement :
   *   toast('Mon message')
   *   toast('Mon message', 'error', 5000)
   */
  const toast = (message, type = 'warning', duration = DEFAULT_DURATION) => {
    fire(message, type, duration)
  }

  // ── Méthodes raccourcies ─────────────────────────────────────────────────
  toast.success = (message, duration = DEFAULT_DURATION) => fire(message, 'success', duration)
  toast.error   = (message, duration = DEFAULT_DURATION) => fire(message, 'error',   duration)
  toast.info    = (message, duration = DEFAULT_DURATION) => fire(message, 'info',    duration)
  toast.warning = (message, duration = DEFAULT_DURATION) => fire(message, 'warning', duration)

  return toast
}