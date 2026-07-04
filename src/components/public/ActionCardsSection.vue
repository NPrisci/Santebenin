<!-- src/components/ActionCardsSection.vue -->
<template>
  <section class="action-cards-section">
    <div class="container">
      <!-- En-tête de section -->
      <div class="section-header" data-aos="fade-up">
        <span class="section-badge">Votre santé, notre priorité</span>
        <h2 class="section-title">Prenez le contrôle de <span>votre santé</span></h2>
        <p class="section-subtitle">Une plateforme moderne au service de votre bien-être au Bénin</p>
      </div>

      <div class="cards-wrapper">
        
        <!-- Carte 1 : Rendez-vous -->
        <div class="card card-appointment" data-aos="fade-up" data-aos-delay="100">
          <div class="card-number">01</div>
          <div class="card-content">
            <div class="card-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <h3 class="card-title">Prenez Rendez-vous</h3>
            <p class="card-description">Consultez un médecin en ligne ou en cabinet en quelques clics, partout au Bénin.</p>
            <a href="/prendre-rendezvous" class="card-btn card-btn-appointment">
              Je prends rendez-vous
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <!-- Carte 2 : Dossier Médical -->
        <div class="card card-medical" data-aos="fade-up" data-aos-delay="200">
          <div class="card-number">02</div>
          <div class="card-content">
            <div class="card-icon">
              <i class="fas fa-folder-open"></i>
            </div>
            <h3 class="card-title">Mon Dossier Médical</h3>
            <p class="card-description">Accédez à vos informations de santé en toute sécurité, où que vous soyez.</p>
            <a href="/dossier-medical" class="card-btn card-btn-medical">
              Voir mon dossier
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <!-- Carte 3 : Service 24/7 -->
        <div class="card card-service" data-aos="fade-up" data-aos-delay="300">
          <div class="card-number">03</div>
          <div class="card-content">
            <div class="card-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h3 class="card-title">Service Disponible 24/7</h3>
            <p class="card-description">Accédez à vos ordonnances et résultats d'analyses à tout moment, jour et nuit.</p>
            <a href="/services" class="card-btn card-btn-service">
              Découvrir
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ActionCardsSection'
}
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.action-cards-section {
  padding: 100px 0 80px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #E5E7EB 100%);
  position: relative;
  overflow: hidden;
}

/* Effets de fond décoratifs - regroupés */
.action-cards-section::before,
.action-cards-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.action-cards-section::before {
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.06) 0%, transparent 70%);
}

.action-cards-section::after {
  bottom: -200px;
  left: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(37, 215, 176, 0.06) 0%, transparent 70%);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 1;
}

/* ============================================================
   EN-TÊTE DE SECTION
   ============================================================ */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-badge {
  display: inline-block;
  background: rgba(12, 205, 254, 0.10);
  color: var(--primary-blue);
  padding: 8px 24px;
  border-radius: var(--border-radius-pill);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
  border: 1px solid rgba(12, 205, 254, 0.15);
}

.section-title {
  font-size: 44px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.2;
  margin-bottom: 16px;
}

.section-title span {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-gray);
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
}

/* ============================================================
   GRILLE DES CARTES
   ============================================================ */
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* ============================================================
   STYLES COMMUNS POUR TOUTES LES CARTES
   ============================================================ */
.card {
  background: var(--bg-white);
  border-radius: var(--border-radius-card);
  padding: 40px 32px 45px;
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px var(--shadow-card);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Overlay au survol - commun */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(12, 205, 254, 0.03), rgba(37, 215, 176, 0.03));
  opacity: 0;
  transition: opacity 0.5s ease;
  border-radius: var(--border-radius-card);
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px var(--shadow-card-hover);
  border-color: rgba(12, 205, 254, 0.15);
}

/* Numéro de la carte */
.card-number {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 48px;
  font-weight: 800;
  opacity: 0.05;
  color: var(--text-dark);
  line-height: 1;
  transition: var(--transition-smooth);
}

.card:hover .card-number {
  opacity: 0.10;
  transform: scale(1.1);
}

/* Ligne décorative en bas - commune */
.card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary-blue), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
  border-radius: 0 0 var(--border-radius-card) var(--border-radius-card);
}

.card:hover::after {
  opacity: 1;
}

/* ============================================================
   CONTENU DES CARTES
   ============================================================ */
.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 28px;
  transition: var(--transition-smooth);
}

.card:hover .card-icon {
  transform: scale(1.05) rotate(-3deg);
}

/* Icônes spécifiques par carte */
.card-appointment .card-icon {
  background: rgba(12, 205, 254, 0.10);
  color: var(--primary-blue);
}

.card-medical .card-icon {
  background: rgba(37, 215, 176, 0.10);
  color: var(--primary-green);
}

.card-service .card-icon {
  background: rgba(255, 193, 7, 0.10);
  color: var(--color-service);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 12px;
  line-height: 1.3;
}

.card-description {
  font-size: 16px;
  color: var(--text-gray);
  line-height: 1.7;
  margin-bottom: 24px;
  flex: 1;
}

/* ============================================================
   BOUTONS DES CARTES - COMMUNS
   ============================================================ */
.card-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text-dark);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 0;
  transition: var(--transition-smooth);
  border-bottom: 2px solid transparent;
  width: fit-content;
}

.card-btn i {
  font-size: 14px;
  transition: transform var(--transition-smooth);
}

.card-btn:hover i {
  transform: translateX(6px);
}

/* Couleurs spécifiques des boutons */
.card-btn-appointment:hover {
  color: var(--primary-blue);
  border-bottom-color: var(--primary-blue);
}

.card-btn-medical:hover {
  color: var(--primary-green);
  border-bottom-color: var(--primary-green);
}

.card-btn-service:hover {
  color: var(--color-service);
  border-bottom-color: var(--color-service);
}

/* Lignes décoratives spécifiques par carte */
.card-medical::after {
  background: linear-gradient(90deg, transparent, var(--primary-green), transparent);
}

.card-service::after {
  background: linear-gradient(90deg, transparent, var(--color-service), transparent);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 1024px) {
  .cards-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .action-cards-section {
    padding: 70px 0 60px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .action-cards-section {
    padding: 50px 0 40px;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .cards-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section-title {
    font-size: 30px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
  
  .card {
    padding: 30px 24px 35px;
  }
  
  .card-number {
    font-size: 36px;
    top: 16px;
    right: 18px;
  }
  
  .card-title {
    font-size: 22px;
  }
  
  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .section-title {
    font-size: 26px;
  }
  
  .section-badge {
    font-size: 12px;
    padding: 6px 18px;
  }
  
  .card {
    padding: 24px 18px 30px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .card-description {
    font-size: 15px;
  }
  
  .card-btn {
    font-size: 15px;
  }
  
  .card-number {
    font-size: 28px;
    top: 12px;
    right: 14px;
  }
}
</style>