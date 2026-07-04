<!-- src/components/TestimonialsSection.vue -->
<template>
  <section class="testimonials-section">
    <div class="container">
      
      <!-- En-tête de section -->
      <div class="section-header" data-aos="fade-up">
        <span class="section-badge">Témoignages</span>
        <h2 class="section-title">
          Ce que nos patients <span class="highlight">disent de nous</span>
        </h2>
        <p class="section-subtitle">
          Découvrez les retours de nos utilisateurs sur leur expérience avec BéninSanté
        </p>
      </div>
      
      <!-- Carrousel de témoignages -->
      <div class="testimonials-slider">
        <!-- Slides -->
        <div class="slider-container">
          <div 
            v-for="(testimonial, index) in currentTestimonials" 
            :key="index"
            class="testimonial-card"
          >
            <!-- Avatar -->
            <div class="testimonial-avatar">
              <img :src="testimonial.avatar" :alt="testimonial.name" loading="lazy" />
              <div class="avatar-quote">
                <i class="fas fa-quote-right"></i>
              </div>
            </div>
            
            <!-- Infos auteur -->
            <div class="testimonial-author">
              <h4 class="author-name">{{ testimonial.name }}</h4>
              <span class="author-role">{{ testimonial.role }}</span>
            </div>
            
            <!-- Étoiles -->
            <div class="testimonial-stars">
              <i v-for="star in 5" :key="star" class="fas fa-star" 
                 :class="{ 'filled': star <= testimonial.rating }"></i>
            </div>
            
            <!-- Commentaire -->
            <p class="testimonial-text">{{ testimonial.text }}</p>
          </div>
        </div>
        
        <!-- Navigation -->
        <div class="slider-navigation">
          <button @click="prevSlide" class="nav-btn" aria-label="Témoignage précédent">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="nav-dots">
            <span 
              v-for="(page, index) in totalPages" 
              :key="index"
              class="dot"
              :class="{ active: currentPage === index }"
              @click="goToPage(index)"
            ></span>
          </div>
          <button @click="nextSlide" class="nav-btn" aria-label="Témoignage suivant">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      currentPage: 0,
      slidesPerView: 3,
      autoPlayInterval: null,
      testimonials: [
        {
          name: 'Marie Akindès',
          role: 'Enseignante, Cotonou',
          avatar: 'https://ui-avatars.com/api/?name=Marie+Akind%C3%A8s&background=0CCDFE&color=fff&size=80&bold=true',
          rating: 5,
          text: 'BéninSanté a complètement transformé ma façon de gérer ma santé. Je peux consulter mes résultats et prendre rendez-vous en quelques clics. Un vrai gain de temps !'
        },
        {
          name: 'Koffi Agossou',
          role: 'Commerçant, Porto-Novo',
          avatar: 'https://ui-avatars.com/api/?name=Koffi+Agossou&background=25D7B0&color=fff&size=80&bold=true',
          rating: 5,
          text: 'Grâce à BéninSanté, je n\'oublie plus jamais mes rendez-vous médicaux. Les rappels par SMS sont très pratiques. Je recommande vivement !'
        },
        {
          name: 'Fatoumata Diallo',
          role: 'Étudiante, Parakou',
          avatar: 'https://ui-avatars.com/api/?name=Fatoumata+Diallo&background=0CCDFE&color=fff&size=80&bold=true',
          rating: 4,
          text: 'La plateforme est intuitive et facile à utiliser. J\'apprécie particulièrement la possibilité de consulter mes ordonnances en ligne. Très pratique pour les étudiants !'
        },
        {
          name: 'Jean-Baptiste Zinsou',
          role: 'Médecin, Abomey-Calavi',
          avatar: 'https://ui-avatars.com/api/?name=Jean-Baptiste+Zinsou&background=25D7B0&color=fff&size=80&bold=true',
          rating: 5,
          text: 'En tant que médecin, BéninSanté facilite la gestion des dossiers patients. L\'accès aux informations est rapide et sécurisé. Un outil indispensable.'
        },
        {
          name: 'Agnès Hounkpatin',
          role: 'Infirmière, Natitingou',
          avatar: 'https://ui-avatars.com/api/?name=Agn%C3%A8s+Hounkpatin&background=0CCDFE&color=fff&size=80&bold=true',
          rating: 5,
          text: 'BéninSanté a révolutionné le suivi des patients dans notre structure. Les informations sont centralisées et accessibles à tous les professionnels de santé.'
        },
        {
          name: 'Paul Akpakpa',
          role: 'Fonctionnaire, Ouidah',
          avatar: 'https://ui-avatars.com/api/?name=Paul+Akpakpa&background=25D7B0&color=fff&size=80&bold=true',
          rating: 4,
          text: 'Je suis très satisfait de BéninSanté. La plateforme est sécurisée et me permet de garder un œil sur ma santé et celle de ma famille.'
        }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.testimonials.length / this.slidesPerView)
    },
    currentTestimonials() {
      const start = this.currentPage * this.slidesPerView
      const end = start + this.slidesPerView
      return this.testimonials.slice(start, end)
    }
  },
  methods: {
    nextSlide() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
      } else {
        this.currentPage = 0
      }
    },
    prevSlide() {
      if (this.currentPage > 0) {
        this.currentPage--
      } else {
        this.currentPage = this.totalPages - 1
      }
    },
    goToPage(index) {
      this.currentPage = index
    },
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    },
    updateSlidesPerView() {
      const width = window.innerWidth
      if (width < 768) {
        this.slidesPerView = 1
      } else if (width < 1024) {
        this.slidesPerView = 2
      } else {
        this.slidesPerView = 3
      }
      if (this.currentPage >= this.totalPages) {
        this.currentPage = 0
      }
    }
  },
  mounted() {
    this.updateSlidesPerView()
    window.addEventListener('resize', this.updateSlidesPerView)
    this.startAutoPlay()
  },
  beforeDestroy() {
    this.stopAutoPlay()
    window.removeEventListener('resize', this.updateSlidesPerView)
  }
}
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.testimonials-section {
  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0) 45%,
      var(--testimonial-bg-gradient) 65%,
      #5c9bdb 100%
    ),
    linear-gradient(
      var(--testimonial-bg-overlay),
      var(--testimonial-bg-overlay)
    ),
    url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: 80px 0 100px;
}

/* Décoration de fond - regroupées */
.testimonials-section::before,
.testimonials-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.testimonials-section::before {
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.06) 0%, transparent 70%);
}

.testimonials-section::after {
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
   EN-TÊTE
   ============================================================ */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-badge {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary-blue);
  margin-bottom: 15px;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2em;
  color: var(--white);
  margin-bottom: 12px;
}

.section-title .highlight {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-white-70);
  max-width: 600px;
  margin: 0 auto;
  font-style: italic;
}

/* ============================================================
   CARROUSEL
   ============================================================ */
.testimonials-slider {
  position: relative;
}

.slider-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* ============================================================
   CARTE DE TÉMOIGNAGE
   ============================================================ */
.testimonial-card {
  background: var(--white);
  border-radius: var(--border-radius-testimonial);
  padding: 35px 30px 30px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition-card);
  border: 2px solid var(--testimonial-border);
  box-shadow: 0 4px 20px var(--testimonial-shadow);
  position: relative;
  overflow: hidden;
  animation: fadeInCard 0.5s ease;
}

@keyframes fadeInCard {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.testimonial-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-blue);
  box-shadow: 0 20px 50px var(--shadow-testimonial);
}

/* Ligne décorative en haut */
.testimonial-card::after {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  width: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
  transition: var(--transition-card);
  border-radius: 0 0 4px 4px;
  transform: translateX(-50%);
}

.testimonial-card:hover::after {
  width: 60%;
}

/* ============================================================
   AVATAR
   ============================================================ */
.testimonial-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-blue);
  transition: var(--transition-smooth);
}

.testimonial-card:hover .testimonial-avatar img {
  border-color: var(--primary-green);
  transform: scale(1.05);
}

.avatar-quote {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 12px;
  box-shadow: 0 4px 12px var(--shadow-blue-light);
}

/* ============================================================
   AUTEUR
   ============================================================ */
.testimonial-author {
  margin-bottom: 12px;
}

.author-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 2px 0;
}

.author-role {
  font-size: 14px;
  color: var(--text-gray);
}

/* ============================================================
   ÉTOILES
   ============================================================ */
.testimonial-stars {
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
}

.testimonial-stars i {
  color: var(--testimonial-star-empty);
  font-size: 16px;
  transition: color var(--transition-smooth);
}

.testimonial-stars i.filled {
  color: var(--testimonial-star-filled);
}

/* ============================================================
   TEXTE
   ============================================================ */
.testimonial-text {
  font-size: 16px;
  line-height: 1.7em;
  color: var(--text-gray);
  margin: 0;
  flex: 1;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
.slider-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 35px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--testimonial-nav-border);
  background: var(--testimonial-nav-bg);
  color: var(--white);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-btn:hover {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  transform: scale(1.05);
}

.nav-dots {
  display: flex;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--testimonial-dot-bg);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.dot:hover {
  transform: scale(1.2);
}

.dot.active {
  background: var(--primary-blue);
  width: 32px;
  border-radius: 6px;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 1024px) {
  .testimonials-section {
    padding: 60px 0 70px;
  }

  .section-title {
    font-size: 36px;
  }

  .slider-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .testimonial-card {
    padding: 30px 25px 25px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .testimonials-section {
    padding: 50px 0 60px;
  }

  .container {
    padding: 0 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .slider-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .testimonial-card {
    padding: 25px 20px 22px;
  }

  .testimonial-avatar {
    width: 70px;
    height: 70px;
  }

  .avatar-quote {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  .author-name {
    font-size: 18px;
  }

  .testimonial-text {
    font-size: 15px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .dot.active {
    width: 24px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }

  .section-badge {
    font-size: 13px;
  }

  .testimonial-card {
    padding: 20px 16px 18px;
  }

  .testimonial-avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-quote {
    width: 24px;
    height: 24px;
    font-size: 9px;
    bottom: -3px;
    right: -3px;
  }

  .author-name {
    font-size: 16px;
  }

  .author-role {
    font-size: 12px;
  }

  .testimonial-text {
    font-size: 14px;
  }

  .testimonial-stars i {
    font-size: 14px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
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
  
  .testimonial-card:hover {
    transform: none;
  }
  
  @keyframes fadeInCard {
    from {
      opacity: 1;
      transform: none;
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}
</style>