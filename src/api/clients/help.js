export function formatDate(dateStr) {
   const date = new Date(dateStr);
   return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

export function splitDate(dateStr) {
   const date = new Date(dateStr);
   const mois = date.toLocaleString('fr-FR', { month: 'short' }).replace('.', '');
   const jour = date.getDate().toString();
   return [mois, jour];
}