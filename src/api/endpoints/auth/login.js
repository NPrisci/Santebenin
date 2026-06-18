import { api } from "@/api/clients/main";

const AuthService = {
   async init(npi) {
      if (!npi) {
         return Promise.reject({ message: "Le numéro npi est requis" });
      }
      return api(`/auth/login/init`, {
         method: 'POST',
         body: { npi }
      });
   },

   async verifyPassword(npi, password) {
      if (!npi || !password) {
         return Promise.reject({ message: "Le NPI et le mot de passe sont requis" });
      }
      return api(`/auth/login/verify`, {
         method: 'POST',
         body: { npi, password }
      });
   },

   async verifyCode(type, code, temp_token) {
      if (!type || !code) {
         return Promise.reject({ message: "Le type et le code sont requis" });
      }
      return api(`/auth/login/validate`, {
         method: 'POST',
         body: { type, code, temp_token }
      });
   },

   async logout() {
      return api(`/auth/logout`, {
         method: 'POST'
      });
   }
};

export default AuthService;