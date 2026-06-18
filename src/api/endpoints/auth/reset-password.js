import { api } from "@/api/clients/main";


const ResetPasswordService = {
   init: async (npi) => {
      console.log(npi)
      if (!npi) {
         throw new Error("Le NPI est requis")
      }
      const response = await api('/auth/reset-password/init', {
         method: 'POST',
         body: JSON.stringify({ npi }),
      })
      return response
   },

   verify: async (npi, otp, type) => {
      if (!npi || !otp) {
         throw new Error("Le NPI et le code OTP sont requis")
      }
      const response = await api('/auth/reset-password/verify', {
         method: 'POST',
         body: JSON.stringify({ npi, code: otp, type }),
      })
      return response.message
   },

   confirm: async (npi, otp, newPassword) => {
      if (!npi || !otp || !newPassword) {
         throw new Error("Le NPI, le code OTP et le nouveau mot de passe sont requis")
      }
      const response = await api('/auth/reset-password/confirm', {
         method: 'POST',
         body: JSON.stringify({
            npi,
            code: otp,
            password: newPassword,
            password_confirmation: newPassword,
         }),
      })
      return response.message
   }
}

export default ResetPasswordService
