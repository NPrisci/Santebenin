export function formatDate(dateStr, format = 'DD/MM/YYYY') {
   const date = new Date(dateStr);
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear();
   const monthName = date.toLocaleString('fr-FR', { month: 'long' });
   const shortMonth = date.toLocaleString('fr-FR', { month: 'short' });
   const dayName = date.toLocaleString('fr-FR', { weekday: 'long' });
   const shortDay = date.toLocaleString('fr-FR', { weekday: 'short' });

   const formats = {
      'DD/MM/YYYY': `${day}/${month}/${year}`,
      'DD/MM/YY': `${day}/${month}/${year.toString().slice(-2)}`,
      'DD Month YYYY': `${day} ${monthName} ${year}`,
      'DD Mon YYYY': `${day} ${shortMonth} ${year}`,
      'Month DD, YYYY': `${monthName} ${day}, ${year}`,
      'DD Month': `${day} ${monthName}`,
      'Month YYYY': `${monthName} ${year}`,
      'YYYY-MM-DD': `${year}-${month}-${day}`,
      'DD/MM': `${day}/${month}`,
      'MM/DD': `${month}/${day}`,
      'Day DD Month YYYY': `${dayName} ${day} ${monthName} ${year}`,
      'Day DD Mon YYYY': `${shortDay} ${day} ${shortMonth} ${year}`,
      'DD MMM YYYY': `${day} ${shortMonth} ${year}`
   };

   return formats[format] || formats['DD/MM/YYYY'];
}

export function splitDate(dateStr) {
   const date = new Date(dateStr);
   const mois = date.toLocaleString('fr-FR', { month: 'short' }).replace('.', '');
   const jour = date.getDate().toString();
   return [mois, jour];
}

export function isEmpty(obj) {
   return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function formatDateTime(dateStr) {
   const date = new Date(dateStr);
   return {
      date: formatDate(dateStr, 'DD Month YYYY'),
      time: date.toLocaleTimeString('fr-FR', {
         hour: '2-digit',
         minute: '2-digit'
      })
   };
}