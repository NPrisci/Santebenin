export function setAuthToken(token) {
   if (token) {
      localStorage.setItem('auth_token', token)
   } else {
      localStorage.removeItem('auth_token')
   }
}

export function setUserRole(roles) {
   if (roles && Array.isArray(roles)) {
      localStorage.setItem('user_role', JSON.stringify(roles))
   } else if (roles) {
      localStorage.setItem('user_role', JSON.stringify([roles]))
   } else {
      localStorage.removeItem('user_role')
   }
}

export function setUsedRole(role) {
   localStorage.setItem('used_role', role)
}

export function getUsedRole() {
   return localStorage.getItem('used_role')
}

export function getUserRole() {
   const roles = localStorage.getItem('user_role')
   if (!roles) return null

   try {
      return JSON.parse(roles)
   } catch (e) {
      return [roles]
   }
}

export function getAuthToken() {
   return localStorage.getItem('auth_token')
}

export function isAuthenticated() {
   return !!getAuthToken()
}

export function clearAuth() {
   localStorage.removeItem('auth_token')
   localStorage.removeItem('user_data')
   localStorage.removeItem('user_role')
}

export function isOnlyPatient() {
   const roles = getUserRole()
   return Array.isArray(roles) &&
      roles.length === 1 &&
      roles[0] === 'PATIENT'
}

export function isAdmin() {
   const roles = getUserRole()
   return Array.isArray(roles) &&
      roles.length === 1 &&
      roles[0] === 'ADMIN'
}

export function setNpiForReset(npi){
   localStorage.setItem('npi_for_reset', npi)
}

export function getNpiForReset(){
   return localStorage.getItem('npi_for_reset')
}

export function isMedecin(){
   const used = getUsedRole()
   if (used) return used === 'MEDECIN'

   // Sinon vérifier la liste des rôles de l'utilisateur
   const roles = getUserRole()
   if (!roles) return false

   if (Array.isArray(roles)) {
      return roles.includes('MEDECIN')
   }

   return roles === 'MEDECIN'
}