<template>
    <div
      class="med-timeline"
      :class="[
        layout === 'alternate' ? 'med-timeline--alternate' : 'med-timeline--left'
      ]"
    >
      <div
        v-for="(item, index) in events"
        :key="item.id"
        class="med-timeline__item"
        :class="[
          layout === 'alternate'
            ? (index % 2 === 0 ? 'med-timeline__item--side-a' : 'med-timeline__item--side-b')
            : 'med-timeline__item--side-a',
          index === events.length - 1 ? 'med-timeline__item--last' : ''
        ]"
      >
        <!-- Marqueur (point sur l'axe) -->
        <div class="med-timeline__marker-wrap">
          <slot name="marker" :item="item">
            <div
              class="med-timeline__marker"
              :class="[
                `marker-${item.type || 'default'}`,
                item.photo ? 'med-timeline__marker--photo' : ''
              ]"
            >
              <img
                v-if="item.photo"
                :src="item.photo"
                :alt="item.title"
                class="med-timeline__marker-photo"
              />
              <i v-else-if="item.icon" :class="item.icon" aria-hidden="true"></i>
              <span v-else class="med-timeline__marker-initial">
                {{ (item.title || '?').charAt(0).toUpperCase() }}
              </span>
            </div>
          </slot>
        </div>
  
        <!-- Carte de contenu -->
        <div class="med-timeline__card-wrap">
          <div
            class="med-timeline__card"
            :class="`card-${item.type || 'default'}`"
          >
            <slot name="content" :item="item">
              <div class="med-timeline__card-header">
                <div class="med-timeline__card-heading">
                  <h5 class="med-timeline__title">{{ item.title }}</h5>
                  <p v-if="item.subtitle" class="med-timeline__subtitle">
                    {{ item.subtitle }}
                  </p>
                </div>
                <span class="med-timeline__date">{{ item.date }}</span>
              </div>
              <div v-if="item.description" class="med-timeline__card-body">
                <p>{{ item.description }}</p>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({

    events: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * Mode d'affichage : 'left' (axe à gauche) ou 'alternate' (gauche/droite).
     */
    layout: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'alternate'].includes(value)
    }
  })
  </script>
  
  <style scoped>
  /* ==========================================================================
     MedTimelineComponent - Coquille visuelle pure
     S'appuie exclusivement sur les variables CSS exposées par main.css
     ========================================================================== */
  
  .med-timeline {
    position: relative;
    width: 100%;
    padding: 0.5rem 0;
  }
  
  .med-timeline__item {
    position: relative;
    display: flex;
    width: 100%;
    padding-bottom: 2.5rem;
  }
  
  .med-timeline__item--last {
    padding-bottom: 0;
  }
  
  /* ---------- Axe vertical ---------- */
  /* La ligne est dessinée sur le marker-wrap lui-même, du centre du marqueur
     courant jusqu'au centre du marqueur suivant. Elle s'arrête donc naturellement
     au niveau du dernier élément. */
  .med-timeline__marker-wrap {
    position: relative;
    flex: 0 0 auto;
    width: 2.75rem;
    display: flex;
    justify-content: center;
  }
  
  .med-timeline__marker-wrap::before {
    content: '';
    position: absolute;
    top: 2.75rem;
    bottom: -2.5rem;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background-color: var(--medical-gray-200);
  }
  
  .med-timeline__item--last .med-timeline__marker-wrap::before {
    display: none;
  }
  
  /* ---------- Marqueur ---------- */
  .med-timeline__marker {
    position: relative;
    z-index: 1;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--medical-white);
    border: 2px solid var(--medical-gray-200);
    color: var(--medical-gray-500);
    font-size: 1.1rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
  }
  
  .med-timeline__marker.marker-default {
    border-color: var(--medical-primary);
    color: var(--medical-primary);
    background-color: var(--medical-primary-bg);
  }
  
  .med-timeline__marker.marker-success {
    border-color: var(--medical-accent-success);
    color: var(--medical-accent-success);
    background-color: var(--medical-secondary-bg);
  }
  
  .med-timeline__marker.marker-danger {
    border-color: var(--medical-accent-danger);
    color: var(--medical-accent-danger);
    background-color: #fef2f2;
  }
  
  .med-timeline__marker.marker-warning {
    border-color: var(--medical-accent-warning);
    color: var(--medical-accent-warning);
    background-color: #fffbeb;
  }
  
  .med-timeline__marker.marker-info {
    border-color: var(--medical-accent-info);
    color: var(--medical-accent-info);
    background-color: #eef2ff;
  }
  
  /* --- Marqueur photo (prioritaire sur icon / initiale) --- */
  .med-timeline__marker--photo {
    padding: 0;
    overflow: hidden;
    background-color: var(--medical-gray-100);
  }
  
  .med-timeline__marker-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }
  
  /* --- Fallback initiale (si ni photo ni icon ne sont fournis) --- */
  .med-timeline__marker-initial {
    font-family: var(--title-family);
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
  }
  
  /* ---------- Carte ---------- */
  .med-timeline__card-wrap {
    flex: 1 1 auto;
    min-width: 0;
    padding-left: 1.25rem;
  }
  
  .med-timeline__card {
    background-color: var(--medical-white);
    border: 1px solid var(--medical-gray-200);
    border-left: 4px solid var(--medical-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1rem 1.25rem;
    transition: box-shadow var(--transition-base), transform var(--transition-base);
  }
  
  .med-timeline__card:hover {
    box-shadow: var(--shadow-md);
  }
  
  .med-timeline__card.card-success { border-left-color: var(--medical-accent-success); }
  .med-timeline__card.card-danger  { border-left-color: var(--medical-accent-danger); }
  .med-timeline__card.card-warning { border-left-color: var(--medical-accent-warning); }
  .med-timeline__card.card-info    { border-left-color: var(--medical-accent-info); }
  .med-timeline__card.card-default { border-left-color: var(--medical-primary); }
  
  .med-timeline__card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .med-timeline__title {
    margin: 0;
    font-size: 1.05rem;
    color: var(--medical-gray-800);
  }
  
  .med-timeline__subtitle {
    margin: 0.15rem 0 0;
    font-size: 0.85rem;
    color: var(--medical-gray-500);
    font-weight: 400;
  }
  
  .med-timeline__date {
    flex: 0 0 auto;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--medical-gray-600);
    background-color: var(--medical-gray-50);
    border-radius: var(--radius-sm);
    padding: 0.2rem 0.55rem;
    white-space: nowrap;
  }
  
  .med-timeline__card-body {
    margin-top: 0.6rem;
    color: var(--medical-gray-600);
    font-size: 0.9rem;
  }
  
  .med-timeline__card-body p {
    margin: 0;
  }
  
  /* ==========================================================================
     LAYOUT "left" (par défaut) : axe à gauche, contenu à droite
     ========================================================================== */
  .med-timeline--left .med-timeline__item {
    flex-direction: row;
  }
  
  /* ==========================================================================
     LAYOUT "alternate" : alternance gauche/droite sur desktop (>= 768px)
     ========================================================================== */
  @media (min-width: 768px) {
    .med-timeline--alternate {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .med-timeline--alternate .med-timeline__item {
      width: 100%;
      max-width: 900px;
    }
  
    /* Élément "côté A" : carte à droite du marqueur, marqueur à gauche du centre */
    .med-timeline--alternate .med-timeline__item--side-a {
      flex-direction: row;
      padding-right: calc(50% - 1.375rem);
    }
  
    /* Élément "côté B" : carte à gauche du marqueur, marqueur à droite du centre */
    .med-timeline--alternate .med-timeline__item--side-b {
      flex-direction: row-reverse;
      padding-left: calc(50% - 1.375rem);
    }
  
    .med-timeline--alternate .med-timeline__item--side-b .med-timeline__card-wrap {
      padding-left: 0;
      padding-right: 1.25rem;
      text-align: right;
    }
  
    .med-timeline--alternate .med-timeline__item--side-b .med-timeline__card-header {
      flex-direction: row-reverse;
    }
  }
  
  /* ==========================================================================
     RESPONSIVE : sous 768px, on force le comportement "left" quel que soit
     le layout demandé, pour préserver la lisibilité du texte.
     ========================================================================== */
  @media (max-width: 767.98px) {
    .med-timeline--alternate .med-timeline__item,
    .med-timeline--alternate .med-timeline__item--side-b {
      flex-direction: row;
      padding-left: 0;
      padding-right: 0;
    }
  
    .med-timeline--alternate .med-timeline__item--side-b .med-timeline__card-wrap {
      padding-left: 1.25rem;
      padding-right: 0;
      text-align: left;
    }
  
    .med-timeline--alternate .med-timeline__item--side-b .med-timeline__card-header {
      flex-direction: row;
    }
  
    .med-timeline__marker-wrap {
      width: 2.25rem;
    }
  
    .med-timeline__marker {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 0.95rem;
    }
  
    .med-timeline__marker-wrap::before {
      top: 2.25rem;
      bottom: -2.5rem;
    }
  
    .med-timeline__card-wrap {
      padding-left: 1rem;
    }
  
    .med-timeline__date {
      font-size: 0.75rem;
    }
  }
  </style>