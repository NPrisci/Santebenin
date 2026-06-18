<script setup>
defineProps({
   strokeWidth: {
      type: [Number, String],
      default: 8
   }
})
</script>

<template>
   <svg 
      viewBox="0 0 120 100" 
      class="med-auth-logo img-fluid logo-shadow" 
      xmlns="http://www.w3.org/2000/svg"
   >
      <text 
         x="33" 
         y="19" 
         class="logo-text-sante" 
         font-family="var(--title-family), sans-serif"
         font-weight="800" 
         font-size="15" 
         text-anchor="middle" 
         letter-spacing="0.5"
      >
         <tspan x="33" dy="0">S</tspan>
         <tspan x="33" dy="15.5">A</tspan>
         <tspan x="33" dy="15.5">N</tspan>
         <tspan x="33" dy="15.5">T</tspan>
         <tspan x="33" dy="15.5">E</tspan>
      </text>

      <line 
         x1="44" 
         y1="15" 
         x2="44" 
         y2="85" 
         class="logo-separator" 
         stroke-width="2" 
      />

      <path 
         d="M 52 15 H 78 A 17.5 17.5 0 0 1 78 50 A 17.5 17.5 0 0 1 78 85 H 52 Z" 
         fill="none"
         class="logo-path-b" 
         :stroke-width="strokeWidth" 
         stroke-linecap="round"
         stroke-linejoin="round" 
      />

      <path 
         d="M 52 38 V 62 M 40 50 H 64" 
         fill="none" 
         class="logo-path-cross"
         :stroke-width="strokeWidth" 
         stroke-linecap="round" 
         stroke-linejoin="round" 
      />
   </svg>
</template>

<style scoped>
.med-auth-logo {
   width: 100%;
   max-width: 240px;
   height: auto;
   display: block;
   margin: auto;
}

/* Ombre portée douce pour détacher le logo du fond */
.logo-shadow {
   filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.22));
}

/* Remplissage de la typographie verticale (Turquoise Réactif) */
.logo-text-sante {
   fill: var(--medical-secondary-light);
}

/* Ligne séparatrice fixe */
.logo-separator {
   stroke: rgba(255, 255, 255, 0.2);
}

/* Tracé structurel blanc du B */
.logo-path-b {
   stroke: #ffffff;
   transition: stroke-width var(--transition-fast, 0.25s) ease;
}

/* Tracé de la croix clinique turquoise avec transition fluide */
.logo-path-cross {
   stroke: var(--medical-secondary-light);
   /* Remplacement du transition-all Tailwind par une transition ciblée et performante */
   transition: stroke-width var(--transition-fast, 0.25s) ease, stroke var(--transition-fast, 0.25s) ease;
}
</style>