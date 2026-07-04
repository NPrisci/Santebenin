<!-- src/components/FaqSection.vue -->
<template>
  <section class="faq-section">
    <div class="container">
      <div class="faq-wrapper">
        
        <!-- Colonne gauche : Image dynamique -->
        <div class="faq-image">
          <div class="image-container">
            <img 
              :src="currentImage" 
              :alt="currentImageAlt"
              class="faq-image-transition"
            />
            <div class="image-badge">
              <span class="badge-icon">{{ currentBadgeIcon }}</span>
              <span class="badge-text">{{ currentBadgeText }}</span>
            </div>
            <div class="image-indicator">
              <span 
                class="indicator-dot" 
                v-for="(item, index) in faqItems" 
                :key="index"
                :class="{ active: activeIndex === index }"
                @click="toggleFaq(index)"
              ></span>
            </div>
          </div>
        </div>
        
        <!-- Colonne droite : FAQ Accordéon -->
        <div class="faq-content">
          
          <!-- Badge -->
          <div class="faq-badge">
            <span>FAQ</span>
          </div>
          
          <!-- Titre -->
          <h2 class="faq-title">
            Des réponses à vos <span class="highlight">questions</span>
          </h2>
          
          <p class="faq-subtitle">
            Retrouvez ci-dessous les réponses aux questions les plus fréquemment posées 
            sur BéninSanté.
          </p>
          
          <!-- Accordéon -->
          <div class="faq-accordion">
            <div 
              v-for="(item, index) in faqItems" 
              :key="index"
              class="faq-item"
              :class="{ active: activeIndex === index }"
            >
              <button 
                class="faq-question" 
                @click="toggleFaq(index)"
                :aria-expanded="activeIndex === index"
              >
                <span class="question-icon">
                  <i class="fas fa-question-circle"></i>
                </span>
                <span class="question-text">{{ item.question }}</span>
                <span class="question-toggle">
                  <i v-if="activeIndex !== index" class="fas fa-plus"></i>
                  <i v-else class="fas fa-minus"></i>
                </span>
              </button>
              <div class="faq-answer" :class="{ open: activeIndex === index }">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </div>
          
          <!-- Lien vers plus de questions -->
          <div class="faq-footer">
            <a href="/faq" class="faq-link">
              Voir toutes les questions
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
  name: 'FaqSection',
  data() {
    return {
      activeIndex: 0,
      faqItems: [
        {
          question: "Qu'est-ce que BéninSanté ?",
          answer: "BéninSanté est une plateforme numérique qui centralise votre dossier médical, simplifie vos rendez-vous et sécurise vos ordonnances, partout où vous êtes au Bénin.",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
          imageAlt: "Plateforme BéninSanté - Dossier médical numérique",
          badgeIcon: "🏥",
          badgeText: "Plateforme santé"
        },
        {
          question: "Comment créer mon compte BéninSanté ?",
          answer: "Pour créer votre compte, rendez-vous sur la page d'accueil de BéninSanté et cliquez sur 'Activer Mon espace santé'. Vous devrez fournir votre numéro NPI et suivre les étapes d'inscription.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          imageAlt: "Inscription à BéninSanté - Création de compte",
          badgeIcon: "📝",
          badgeText: "Création de compte"
        },
        {
          question: "Mes données sont-elles sécurisées ?",
          answer: "Oui, la sécurité de vos données est notre priorité absolue. BéninSanté utilise un chiffrement de bout en bout et respecte les normes de protection des données en vigueur.",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
          imageAlt: "Sécurité des données BéninSanté",
          badgeIcon: "🔒",
          badgeText: "Sécurité garantie"
        },
        {
          question: "Puis-je consulter mes résultats d'analyses en ligne ?",
          answer: "Oui, dès que vos résultats d'analyses sont disponibles, ils sont automatiquement ajoutés à votre dossier médical sur BéninSanté. Vous pouvez les consulter à tout moment depuis votre espace personnel.",
          image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop",
          imageAlt: "Résultats d'analyses en ligne BéninSanté",
          badgeIcon: "📊",
          badgeText: "Résultats en ligne"
        },
        {
          question: "Comment prendre un rendez-vous avec un médecin ?",
          answer: "Pour prendre rendez-vous, connectez-vous à votre espace BéninSanté, sélectionnez 'Prendre rendez-vous', choisissez votre médecin et la date qui vous convient. Vous recevrez une confirmation par email et SMS.",
          image: "https://images.unsplash.com/photo-1631815589968-6d0d44c2dd2a?w=800&h=600&fit=crop",
          imageAlt: "Prise de rendez-vous BéninSanté",
          badgeIcon: "📅",
          badgeText: "Rendez-vous en ligne"
        }
      ]
    }
  },
  computed: {
    currentImage() {
      return this.faqItems[this.activeIndex]?.image || this.faqItems[0].image
    },
    currentImageAlt() {
      return this.faqItems[this.activeIndex]?.imageAlt || this.faqItems[0].imageAlt
    },
    currentBadgeIcon() {
      return this.faqItems[this.activeIndex]?.badgeIcon || this.faqItems[0].badgeIcon
    },
    currentBadgeText() {
      return this.faqItems[this.activeIndex]?.badgeText || this.faqItems[0].badgeText
    }
  },
  methods: {
    toggleFaq(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
    }
  }
}
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.faq-section {
  padding: 80px 0 100px;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--white) 100%);
  position: relative;
  overflow: hidden;
}

/* Décoration de fond - regroupées */
.faq-section::before,
.faq-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.faq-section::before {
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.05) 0%, transparent 70%);
}

.faq-section::after {
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(37, 215, 176, 0.05) 0%, transparent 70%);
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 1;
}

/* ============================================================
   WRAPPER PRINCIPAL
   ============================================================ */
.faq-wrapper {
  display: flex;
  align-items: stretch;
  gap: 60px;
}

/* ============================================================
   COLONNE GAUCHE - IMAGE DYNAMIQUE
   ============================================================ */
.faq-image {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.image-container {
  position: relative;
  border-radius: var(--border-radius-faq);
  overflow: hidden;
  box-shadow: 0 20px 50px var(--shadow-faq);
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--white);
}

.faq-image-transition {
  width: 100%;
  height: 100%;
  min-height: 500px;
  max-height: 600px;
  object-fit: cover;
  display: block;
  transition: opacity var(--transition-image), transform var(--transition-image);
  flex: 1;
  animation: imageFade 0.6s ease-in-out;
}

@keyframes imageFade {
  0% {
    opacity: 0;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ============================================================
   BADGE SUR IMAGE
   ============================================================ */
.image-badge {
  position: absolute;
  bottom: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--faq-badge-bg);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: var(--border-radius-pill);
  box-shadow: 0 4px 20px var(--shadow-faq);
  transition: var(--transition-faq);
  z-index: 2;
}

.badge-icon {
  font-size: 24px;
}

.badge-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
}

/* ============================================================
   INDICATEUR DE PROGRESSION
   ============================================================ */
.image-indicator {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 8px;
  background: var(--faq-indicator-bg);
  backdrop-filter: blur(8px);
  padding: 8px 12px;
  border-radius: var(--border-radius-pill);
  z-index: 2;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--faq-indicator-dot);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.indicator-dot:hover {
  transform: scale(1.3);
}

.indicator-dot.active {
  background: var(--primary-blue);
  width: 24px;
  border-radius: 5px;
}

/* ============================================================
   COLONNE DROITE - CONTENU
   ============================================================ */
.faq-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ============================================================
   BADGE FAQ
   ============================================================ */
.faq-badge {
  display: inline-block;
  margin-bottom: 15px;
}

.faq-badge span {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary-blue);
}

/* ============================================================
   TITRE
   ============================================================ */
.faq-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2em;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.faq-title .highlight {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.faq-subtitle {
  font-size: 18px;
  color: var(--text-gray);
  margin-bottom: 30px;
  font-style: italic;
}

/* ============================================================
   ACCORDÉON
   ============================================================ */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.faq-item {
  border: 2px solid var(--faq-border);
  border-radius: var(--border-radius-faq-item);
  overflow: hidden;
  transition: var(--transition-accordion);
  background: var(--white);
}

.faq-item:hover {
  border-color: var(--faq-border-hover);
}

.faq-item.active {
  border-color: var(--primary-blue);
  box-shadow: 0 4px 20px var(--faq-shadow);
}

/* ============================================================
   QUESTION
   ============================================================ */
.faq-question {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 18px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  text-align: left;
  transition: var(--transition-smooth);
}

.faq-question:hover {
  color: var(--primary-blue);
}

.faq-item.active .faq-question {
  color: var(--primary-blue);
}

.question-icon {
  flex-shrink: 0;
  color: var(--primary-blue);
  font-size: 20px;
}

.question-text {
  flex: 1;
}

.question-toggle {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(12, 205, 254, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-blue);
  transition: var(--transition-smooth);
  font-size: 14px;
}

.faq-item.active .question-toggle {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  color: var(--white);
}

.faq-question:hover .question-toggle {
  transform: scale(1.1);
}

/* ============================================================
   RÉPONSE
   ============================================================ */
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.faq-answer.open {
  max-height: 300px;
}

.faq-answer p {
  padding: 0 20px 20px 54px;
  font-size: 16px;
  line-height: 1.7em;
  color: var(--text-gray);
  margin: 0;
}

/* ============================================================
   FOOTER
   ============================================================ */
.faq-footer {
  margin-top: 25px;
}

.faq-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-blue);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.faq-link i {
  font-size: 14px;
  transition: transform var(--transition-smooth);
}

.faq-link:hover {
  color: var(--primary-green);
}

.faq-link:hover i {
  transform: translateX(5px);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 1024px) {
  .faq-section {
    padding: 60px 0 70px;
  }

  .faq-wrapper {
    flex-direction: column;
    gap: 40px;
    align-items: stretch;
  }

  .faq-title {
    font-size: 36px;
  }

  .faq-image {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .faq-image-transition {
    min-height: 350px;
    max-height: 400px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .faq-section {
    padding: 50px 0 60px;
  }

  .container {
    padding: 0 20px;
  }

  .faq-wrapper {
    gap: 30px;
  }

  .faq-title {
    font-size: 28px;
  }

  .faq-subtitle {
    font-size: 16px;
  }

  .faq-question {
    font-size: 16px;
    padding: 14px 16px;
  }

  .faq-answer p {
    font-size: 15px;
    padding: 0 16px 16px 48px;
  }

  .image-badge {
    bottom: 15px;
    left: 15px;
    padding: 10px 16px;
  }

  .badge-text {
    font-size: 12px;
  }

  .badge-icon {
    font-size: 20px;
  }

  .image-indicator {
    bottom: 15px;
    right: 15px;
    padding: 6px 10px;
  }

  .faq-image-transition {
    min-height: 280px;
    max-height: 350px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .faq-title {
    font-size: 24px;
  }

  .faq-badge span {
    font-size: 13px;
  }

  .faq-question {
    font-size: 15px;
    padding: 12px 14px;
    gap: 10px;
  }

  .faq-answer p {
    font-size: 14px;
    padding: 0 14px 14px 42px;
  }

  .question-icon {
    font-size: 16px;
  }

  .question-toggle {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .image-badge {
    bottom: 10px;
    left: 10px;
    padding: 8px 14px;
  }

  .badge-text {
    font-size: 11px;
  }

  .badge-icon {
    font-size: 18px;
  }

  .faq-image-transition {
    min-height: 220px;
    max-height: 280px;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
  }

  .indicator-dot.active {
    width: 18px;
  }
}

/* ============================================================
   ACCESSIBILITÉ - RÉDUCTION DE MOUVEMENT
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  [data-aos] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .image-container img {
    transition: none;
  }

  @keyframes imageFade {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>