import { api } from "../clients/main";

export const encryptService = {
   async encrypt(text) {
      if (!text) {
         return Promise.reject("Le message est requis");
      }
      const response = await api("/secure/encrypt", {
         method: "POST",
         body: { value: text }
      });
      return response.value;
   },

   async decrypt(encrypted) {
      if (!encrypted) {
         return Promise.reject("Le message crypté est requis");
      }
      const response = await api("/secure/decrypt", {
         method: "POST",
         body: { value: encrypted }
      });
      return response.value;
   }
}