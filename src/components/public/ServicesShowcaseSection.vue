<template>
  <section class="services-showcase-section py-5 py-md-8 bg-white">
    <div class="container">
      <!-- En-tête -->
      <div class="text-center mb-5">
        <span class="badge-showcase text-uppercase fw-semibold d-inline-block mb-3">
          COMMENT ÇA MARCHE ?
        </span>

        <h2 class="display-4 fw-bold text-slate-800 mb-3">
          Votre santé en
          <span class="gradient-text">4 étapes simples</span>
        </h2>

        <p class="text-slate-600 mx-auto fs-5" style="max-width: 700px;">
          BéninSanté vous accompagne à chaque étape de votre parcours de santé, 
          de la prise de rendez-vous au suivi médical, en toute simplicité.
        </p>
      </div>

      <!-- Étapes horizontales -->
      <div class="row g-4 mb-5">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="col-12 col-sm-6 col-lg-3 text-center"
        >
          <div class="step-item">
            <!-- Cercle avec numéro et icône -->
            <div class="step-circle-wrapper">
              <div class="step-circle">
                <span class="step-icon">{{ step.icon }}</span>
              </div>
              <span class="step-number">{{ index + 1 }}</span>
            </div>

            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Bouton -->
      <div class="text-center">
        <a href="#" class="btn-showcase">
          <span>Get Started</span>
          <svg
            class="btn-arrow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    icon: '📅',
    title: 'Prenez rendez-vous',
    description: 'Choisissez votre médecin et planifiez votre consultation en ligne en quelques clics, où que vous soyez au Bénin.'
  },
  {
    icon: '🩺',
    title: 'Consultez en ligne',
    description: 'Effectuez votre consultation médicale à distance ou en cabinet. Accédez à votre dossier en temps réel.'
  },
  {
    icon: '💊',
    title: 'Recevez vos traitements',
    description: 'Obtenez vos ordonnances et recommandations médicales directement sur votre espace BéninSanté.'
  },
  {
    icon: '📊',
    title: 'Suivez votre santé',
    description: 'Consultez vos résultats, suivez vos constantes et gérez votre santé en toute sérénité.'
  }
]
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.services-showcase-section {
  padding: 80px 0;
  background: var(--bg-white);
  width: 100%;
}

/* ============================================================
   BADGE
   ============================================================ */
.badge-showcase {
  color: var(--showcase-green);
  font-size: 14px;
  letter-spacing: 1.5px;
  padding: 6px 20px;
  border-radius: var(--border-radius-pill);
}

/* ============================================================
   TITRE
   ============================================================ */
.text-slate-800 {
  color: var(--text-slate-800);
}

.text-slate-600 {
  color: var(--text-slate-600);
}

/* ===== GRADIENT BLEU → VERT ===== */
.gradient-text {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================================
   STEP ITEM
   ============================================================ */
.step-item {
  transition: transform var(--transition-smooth);
  padding: 15px 10px;
  border-radius: var(--border-radius-card);
}

.step-item:hover {
  transform: translateY(-6px);
}

/* ============================================================
   STEP CIRCLE
   ============================================================ */
.step-circle-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.step-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--showcase-blue-light), var(--showcase-indigo-light));
  border: 2px solid var(--showcase-blue-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all var(--transition-smooth);
}

.step-item:hover .step-circle {
  border-color: var(--showcase-blue-400);
  transform: scale(1.1);
}

.step-icon {
  font-size: 36px;
  line-height: 1;
}

.step-number {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--showcase-blue);
  color: var(--white);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
}

/* ============================================================
   STEP TITLE & DESCRIPTION
   ============================================================ */
.step-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-slate-800);
  margin-bottom: 8px;
  transition: color var(--transition-smooth);
}

.step-item:hover .step-title {
  color: var(--showcase-blue-600);
}

.step-description {
  font-size: 14px;
  color: var(--text-slate-500);
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

/* ============================================================
   BOUTON
   ============================================================ */
.btn-showcase {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, var(--showcase-blue-dark), var(--showcase-blue));
  color: var(--white);
  font-weight: 600;
  border-radius: var(--border-radius-pill);
  text-decoration: none;
  transition: all var(--transition-smooth);
  box-shadow: 0 8px 25px rgba(0, 180, 216, 0.3);
}

.btn-showcase:hover {
  background: linear-gradient(135deg, var(--showcase-blue-600), var(--showcase-indigo-600));
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(0, 180, 216, 0.4);
  color: var(--white);
}

.btn-arrow {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-smooth);
}

.btn-showcase:hover .btn-arrow {
  transform: translateX(4px);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 992px) {
  .services-showcase-section {
    padding: 60px 0;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .step-circle {
    width: 80px;
    height: 80px;
  }

  .step-icon {
    font-size: 30px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .services-showcase-section {
    padding: 50px 0;
  }

  .display-4 {
    font-size: 2rem;
  }

  .badge-showcase {
    font-size: 12px;
    padding: 4px 16px;
  }

  .step-item {
    padding: 10px 5px;
  }

  .step-circle {
    width: 72px;
    height: 72px;
  }

  .step-icon {
    font-size: 26px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 12px;
    top: -6px;
    right: -6px;
  }

  .step-title {
    font-size: 16px;
  }

  .step-description {
    font-size: 13px;
    max-width: 100%;
  }

  .btn-showcase {
    padding: 14px 32px;
    font-size: 15px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .services-showcase-section {
    padding: 40px 0;
  }

  .display-4 {
    font-size: 1.75rem;
  }

  .step-circle {
    width: 64px;
    height: 64px;
  }

  .step-icon {
    font-size: 22px;
  }

  .step-number {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .btn-showcase {
    padding: 12px 24px;
    font-size: 14px;
    gap: 8px;
  }

  .btn-arrow {
    width: 16px;
    height: 16px;
  }
}
</style>