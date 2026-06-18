import { api } from "../clients/main";
const crypto = globalThis.crypto;

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

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
   },

   async localEncrypt(text) {
      const keyData = Uint8Array.from(atob(ENCRYPTION_KEY), c => c.charCodeAt(0));
      const key = await crypto.subtle.importKey(
         "raw",
         keyData,
         { name: "AES-GCM" },
         false,
         ["encrypt"]
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(text);
      const ciphertext = await crypto.subtle.encrypt(
         { name: "AES-GCM", iv },
         key,
         encoded
      );

      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(ciphertext), iv.length);
      return btoa(String.fromCharCode(...combined));
   },

   async localDecrypt(encrypted) {
      const keyData = Uint8Array.from(atob(ENCRYPTION_KEY), c => c.charCodeAt(0));
      const key = await crypto.subtle.importKey(
         "raw",
         keyData,
         { name: "AES-GCM" },
         false,
         ["decrypt"]
      );

      const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt(
         { name: "AES-GCM", iv },
         key,
         ciphertext
      );
      return new TextDecoder().decode(decrypted);
   }
}