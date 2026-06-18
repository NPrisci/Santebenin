import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Les variables d'environnement Vite doivent commencer par VITE_
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_KEY,
   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Définit la langue du SMS en fonction du navigateur
auth.useDeviceLanguage();

export { app, auth };

/**
 * Initialise le reCAPTCHA invisible requis par Firebase
 * Doit être appelé avant l'envoi du SMS.
 */
export function setupRecaptcha(containerId = 'recaptcha-container') {
   if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
         'size': 'invisible',
         'callback': (response) => {
            // reCAPTCHA résolu
            console.log("reCAPTCHA vérifié avec succès.");
         },
         'expired-callback': () => {
            // Si expiré, on réinitialise
            window.recaptchaVerifier.render().then(function (widgetId) {
               // eslint-disable-next-line no-undef
               grecaptcha.reset(widgetId);
            });
         }
      });
   }
}

/**
 * Envoie le code OTP au numéro de téléphone
 */
export async function sendFirebaseOtp(phone) {
   if (!window.recaptchaVerifier) {
      throw new Error("Le reCAPTCHA n'est pas initialisé. Appelez setupRecaptcha() d'abord.");
   }

   try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      // On sauvegarde la demande pour la vérification ultérieure
      window.confirmationResult = confirmationResult;
      return confirmationResult;
   } catch (error) {
      console.error("Erreur lors de l'envoi du SMS via Firebase :", error);
      // Si erreur, on reset le recaptcha pour pouvoir réessayer
      if (window.recaptchaVerifier) {
         // eslint-disable-next-line no-undef
         window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId)).catch(() => { });
      }
      throw error;
   }
}

/**
 * Vérifie le code OTP saisi par l'utilisateur
 */
export async function verifyFirebaseOtp(code) {
   if (!window.confirmationResult) {
      throw new Error("Aucune demande de code OTP en attente.");
   }

   try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      // On récupère le token d'identité sécurisé généré par Firebase
      const idToken = await user.getIdToken();

      return { user, idToken };
   } catch (error) {
      console.error("Le code OTP est invalide ou a expiré :", error);
      throw error;
   }
}