<script setup>
import { watch, onUnmounted } from "vue";
import Swal from "sweetalert2";

const model = defineModel({
  type: Boolean,
  default: false,
});

const emit = defineEmits(["confirm", "cancel"]);

const props = defineProps({
  title: {
    type: String,
    default: "Confirmation requise",
  },
  text: {
    type: String,
    default: "Êtes-vous sûr de vouloir continuer ?",
  },
  html: {
    type: String,
    default: "",
  },
  // Type prédéfini SweetAlert2 : 'success', 'error', 'warning', 'info', 'question'
  type: {
    type: String,
    default: "warning",
  },
  // Personnalisation totale avec Font Awesome (ex: 'fas fa-heartbeat text-danger')
  iconHtml: {
    type: String,
    default: "",
  },
  confirmButtonText: {
    type: String,
    default: "Confirmer",
  },
  cancelButtonText: {
    type: String,
    default: "Annuler",
  },
  // Classes de boutons Bootstrap (ex: 'btn btn-danger px-4 py-2')
  confirmButtonClass: {
    type: String,
    default: "btn btn-primary px-4",
  },
  cancelButtonClass: {
    type: String,
    default: "btn btn-light border px-4",
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  // Empêche la fermeture au clic extérieur ou touche Échap
  staticBackdrop: {
    type: Boolean,
    default: false,
  },
  // Fonction asynchrone exécutée au clic sur Confirmer (affiche un état de chargement)
  preConfirm: {
    type: Function,
    default: null,
  },
});

// Instance active de SweetAlert2 pour fermeture propre si le composant est détruit
let swalInstance = null;

const openConfirmDialog = () => {
  swalInstance = Swal.fire({
    title: props.title,
    text: props.html ? undefined : props.text,
    html: props.html || undefined,
    icon: props.iconHtml ? undefined : props.type,
    iconHtml: props.iconHtml ? `<i class="${props.iconHtml}"></i>` : undefined,
    showCancelButton: props.showCancelButton,
    confirmButtonText: props.confirmButtonText,
    cancelButtonText: props.cancelButtonText,

    // Désactivation du style injecté par défaut de SweetAlert2
    buttonsStyling: false,

    // Injection propre des classes Bootstrap
    customClass: {
      popup: "med-confirm-popup rounded-4 shadow-lg border-0 p-4",
      title: "fw-bold text-dark fs-4 pt-2",
      htmlContainer: "text-secondary small mt-2 px-3",
      confirmButton: props.confirmButtonClass,
      cancelButton: props.cancelButtonClass,
      actions: "gap-2 mt-4",
      icon: "border-0 my-2",
    },

    allowOutsideClick: !props.staticBackdrop,
    allowEscapeKey: !props.staticBackdrop,
    showLoaderOnConfirm: !!props.preConfirm,

    // Traitement de la promesse asynchrone si fournie
    preConfirm: async () => {
      if (props.preConfirm) {
        try {
          return await props.preConfirm();
        } catch (error) {
          Swal.showValidationMessage(`Erreur : ${error.message || error}`);
          return false;
        }
      }
      return true;
    },
  });

  // Gestion du résultat de l'interaction
  swalInstance.then((result) => {
    model.value = false; // Synchronisation en retour du v-model
    if (result.isConfirmed) {
      emit("confirm", result.value);
    } else if (result.isDismissed) {
      emit("cancel");
    }
  });
};

// Déclenchement réactif lors du passage du v-model à true
watch(model, (newVal) => {
  if (newVal) {
    openConfirmDialog();
  } else if (Swal.isVisible() && swalInstance) {
    Swal.close();
  }
});

// Nettoyage rigoureux du DOM si le cycle de vie du composant s'interrompt
onUnmounted(() => {
  if (Swal.isVisible() && swalInstance) {
    Swal.close();
  }
});
</script>

<template>
  <span style="display: none !important"></span>
</template>

<style>
.med-confirm-popup {
  font-family: var(--bs-body-font-family), sans-serif;
  max-width: 420px !important;
}

/* L'animation ne doit s'appliquer qu'à l'ouverture pour ne pas bloquer swal2-hide */
.med-confirm-popup.swal2-show {
  animation: medConfirmScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Icônes Font Awesome sur-mesure dans SweetAlert */
.med-confirm-popup .swal2-icon-content {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Effet d'amortissement premium à l'ouverture */
@keyframes medConfirmScaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Ajustements esthétiques sur le loader natif de SweetAlert2 re-stylisé */
.med-confirm-popup .swal2-styled.swal2-confirm .swal2-loader {
  border-color: #fff transparent #fff transparent;
  width: 1.2em;
  height: 1.2em;
  margin: 0 8px;
}
</style>