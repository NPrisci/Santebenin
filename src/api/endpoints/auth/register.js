import { api } from "@/api/clients/main";
import { encryptService } from "../encrypt";
import { setupRecaptcha, sendFirebaseOtp, verifyFirebaseOtp } from "@/api/clients/firebase";

const RegisterService = {
   /**
    * 1. Initialiser l'inscription avec le NPI (identifiant patient/médecin)
    */
   init(npi) {
      if (!npi) {
         return Promise.reject({ message: "Le numéro NPI est requis" });
      }
      return api("/auth/register/check", { method: 'POST', body: { npi } });
   },

   /**
    * 2. Décrypter le téléphone reçu du backend et envoyer le code OTP
    */
   async sendCode(npi, encryptedPhone, recaptchaContainerId = 'recaptcha-container') {
      if (!npi || !encryptedPhone) {
         return Promise.reject({ message: "Le numéro NPI et le numéro de téléphone sont requis" });
      }

      try {
         // Décrypter le téléphone (renvoyé crypté par l'API pour la sécurité)
         const decryptedPhone = await encryptService.decrypt(encryptedPhone);
         if (!decryptedPhone) {
            return Promise.reject({ message: "Le numéro de téléphone est invalide" });
         }

         // Initialiser le Recaptcha invisible Firebase
         setupRecaptcha(recaptchaContainerId);

         // S'assurer que le numéro est au format international E.164
         // Ex: si le numéro local est '97000000', on force '+229' devant.
         // Si c'est déjà un '+', on le garde tel quel.
         const formattedPhone = decryptedPhone.startsWith('+') ? decryptedPhone : `+229${decryptedPhone}`;

         // Envoi du SMS via Firebase
         const smsStatus = await sendFirebaseOtp(formattedPhone);

         return Promise.resolve({ success: true, message: "Code envoyé avec succès" });
      } catch (error) {
         console.error("Erreur sendCode:", error);
         return Promise.reject(error);
      }
   },

   /**
    * 3. Vérifier le code saisi et finaliser l'inscription côté backend
    */
   async verifyAndRegister(npi, code, extraData = {}) {
      if (!npi || !code) {
         return Promise.reject({ message: "Le NPI et le code OTP sont requis" });
      }

      try {
         // 1. Validation du code OTP auprès de Firebase
         const { idToken } = await verifyFirebaseOtp(code);

         // 2. Envoi du jeton sécurisé (idToken) au backend pour valider le téléphone
         // et procéder à la création effective du compte avec les données supplémentaires (mot de passe, etc.)
         const response = await api("/auth/register/verify", {
            method: 'POST',
            body: {
               npi,
               token: idToken,
               ...extraData
            }
         });

         return response;
      } catch (error) {
         console.error("Erreur verifyAndRegister:", error);
         return Promise.reject(error);
      }
   },

   /**
    * 3. Definir un mot de passe de connexion
    */
   async setPassword(npi, password) {
      if (!npi || !password) {
         return Promise.reject({ message: "Le NPI et le mot de passe sont requis" });
      }

      try {
         const response = await api("/auth/register/define-password", {
            method: 'POST',
            body: {
               npi,
               password,
               password_confirmation: password
            }
         });

         return response;
      } catch (error) {
         console.error("Erreur setPassword:", error);
         return Promise.reject(error);
      }
   },

   /**
    * 4. Choix du canal de notification
    */
   async setNotificationChannel(npi, channel, email, phone) {
      if (!npi || !channel) {
         return Promise.reject({ message: "Le NPI et le canal de notification sont requis" });
      }

      if (channel !== "via whatsapp" && channel !== "via email") {
         return Promise.reject({ message: "Le canal de notification doit être 'via whatsapp' ou 'via email'" });
      }

      if (channel === "via whatsapp") {
         if (!phone) {
            return Promise.reject({ message: "Le numéro de téléphone est requis" });
         }
      }

      if (channel === "via email") {
         if (!email) {
            return Promise.reject({ message: "L'email est requis" });
         }
      }

      try {
         const response = await api("/auth/register/choose-canal", {
            method: 'POST',
            body: {
               npi,
               canal: channel,
               email: email || null,
               whatsapp_phone: phone || null
            }
         });

         return response;
      } catch (error) {
         console.error("Erreur setNotificationChannel:", error);
         return Promise.reject(error);
      }
   },

   /**
    * 5. Activation du compte (Verification finale)
    */
   async activate(npi, code, canal) {
      if (!npi || !code || !canal) {
         return Promise.reject({ message: "Le NPI, le code OTP et le canal sont requis" });
      }

      try {
         const response = await api("/auth/register/verify-canal", {
            method: 'POST',
            body: {
               npi,
               code,
               canal
            }
         });

         return response;
      } catch (error) {
         console.error("Erreur activate:", error);
         return Promise.reject(error);
      }
   }
};

export default RegisterService;