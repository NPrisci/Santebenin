<template>
  <div class="blog-section">
    <div class="container">
      <!-- En-tête du blog avec animation -->
      <div class="blog-header" ref="headerRef">
        <span class="blog-badge">Our Blog</span>
        <h2 class="blog-title">Dernières actualités & articles.</h2>
        <p class="blog-description">
          Découvrez nos derniers articles sur la santé, le bien-être et les innovations médicales.
        </p>
      </div>

      <!-- Navigation desktop / mobile -->
      <div class="blog-controls">
        <div class="blog-indicators">
          <button
            v-for="(_, index) in visibleSlides"
            :key="index"
            class="indicator-dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            :aria-label="`Aller à l'article ${index + 1}`"
          ></button>
        </div>
        <div class="blog-nav-arrows">
          <button
            class="nav-arrow prev"
            @click="prevSlide"
            :disabled="currentSlide === 0"
            aria-label="Article précédent"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="nav-arrow next"
            @click="nextSlide"
            :disabled="currentSlide === visibleSlides - 1"
            aria-label="Article suivant"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Conteneur du carrousel -->
      <div class="blog-carousel-wrapper">
        <div
          class="blog-carousel"
          :style="carouselStyle"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="blog-slide"
            :class="{
              'is-active': isSlideActive(index),
              'is-prev': isSlidePrev(index),
              'is-next': isSlideNext(index)
            }"
          >
            <div class="blog-card">
              <div class="blog-card-inner">
                <!-- Image -->
                <a :href="article.link" class="blog-image-link">
                  <div class="blog-image-wrapper">
                    <img
                      :src="article.image"
                      :alt="article.title"
                      class="blog-image"
                      loading="lazy"
                    />
                    <div class="blog-image-overlay">
                      <span class="read-now">Lire l'article</span>
                    </div>
                  </div>
                </a>

                <!-- Contenu -->
                <div class="blog-content">
                  <div class="blog-meta">
                    <span class="blog-date">
                      <i class="far fa-calendar-alt"></i>
                      {{ formatDate(article.date) }}
                    </span>
                    <span class="blog-category">{{ article.category }}</span>
                  </div>
                  <h3 class="blog-post-title">
                    <a :href="article.link">{{ article.title }}</a>
                  </h3>
                  <p class="blog-excerpt">{{ article.excerpt }}</p>
                  <div class="blog-footer">
                    <a :href="article.link" class="read-more-btn">
                      <span>Lire la suite</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                    <div class="blog-share">
                      <button @click="shareArticle(article)" class="share-btn" aria-label="Partager">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12M16 8L12 4M12 4L8 8M12 4V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue mobile : indicateurs de pagination -->
      <div class="mobile-pagination" v-if="isMobile">
        <span class="pagination-current">{{ currentSlide + 1 }}</span>
        <span class="pagination-separator">/</span>
        <span class="pagination-total">{{ visibleSlides }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Données des articles
const articles = ref([
  {
    id: 1,
    title: 'Meilleur annuaire de réseau médical pour médecins et clients',
    excerpt: 'Découvrez comment notre annuaire médical révolutionne la mise en relation entre professionnels de santé et patients à la recherche de soins de qualité.',
    image: 'https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/post-1.jpg',
    link: 'https://demo.awaikenthemes.com/theme-medipro/best-medical-network-directory-for-physicians-clients/',
    date: '2024-05-15',
    category: 'Médecine'
  },
  {
    id: 2,
    title: "L'importance des bilans de santé réguliers",
    excerpt: 'Les bilans de santé réguliers sont essentiels pour prévenir les maladies et maintenir une bonne qualité de vie. Voici pourquoi vous ne devriez pas les négliger.',
    image: 'https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/post-2.jpg',
    link: 'https://demo.awaikenthemes.com/theme-medipro/the-importance-of-regular-health-checkups/',
    date: '2024-05-10',
    category: 'Prévention'
  },
  {
    id: 3,
    title: 'Mieux gérer le stress pour une meilleure santé mentale',
    excerpt: 'Le stress chronique peut avoir des conséquences graves sur votre santé mentale et physique. Apprenez des techniques efficaces pour le gérer au quotidien.',
    image: 'https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/post-3.jpg',
    link: 'https://demo.awaikenthemes.com/theme-medipro/managing-better-stress-for-better-mental-health/',
    date: '2024-05-05',
    category: 'Bien-être'
  },
  {
    id: 4,
    title: 'Les avancées technologiques en imagerie médicale',
    excerpt: 'L\'imagerie médicale connaît une révolution technologique. Découvrez les dernières innovations qui transforment le diagnostic et le suivi des patients.',
    image: 'https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/post-1.jpg',
    link: 'https://demo.awaikenthemes.com/theme-medipro/technological-advancements-in-medical-imaging/',
    date: '2024-04-28',
    category: 'Technologie'
  },
  {
    id: 5,
    title: 'Nutrition et santé : les aliments à privilégier',
    excerpt: 'Une alimentation équilibrée est la clé d\'une bonne santé. Découvrez les aliments à intégrer dans votre quotidien pour booster votre vitalité.',
    image: 'https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/post-2.jpg',
    link: 'https://demo.awaikenthemes.com/theme-medipro/nutrition-and-health-foods-to-prioritize/',
    date: '2024-04-20',
    category: 'Nutrition'
  }
])

// État du carrousel
const currentSlide = ref(0)
const isMobile = ref(window.innerWidth <= 768)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
let autoPlayInterval = null
const headerRef = ref(null)

// Calcul du nombre de slides visibles
const slidesPerView = computed(() => {
  if (window.innerWidth <= 768) return 1
  if (window.innerWidth <= 1024) return 2
  return 3
})

const visibleSlides = computed(() => {
  return Math.min(articles.value.length, slidesPerView.value)
})

// Style du carrousel
const carouselStyle = computed(() => {
  const totalSlides = articles.value.length
  const visible = slidesPerView.value
  const slideWidth = 100 / visible
  
  let offset = currentSlide.value * slideWidth
  const maxOffset = (totalSlides - visible) * slideWidth
  if (offset > maxOffset) {
    offset = maxOffset
  }
  
  return {
    transform: `translateX(-${offset}%)`,
    transition: isDragging.value ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
})

// Vérification des slides actives
const isSlideActive = (index) => {
  const visible = slidesPerView.value
  return index >= currentSlide.value && index < currentSlide.value + visible
}

const isSlidePrev = (index) => {
  return index < currentSlide.value
}

const isSlideNext = (index) => {
  return index >= currentSlide.value + slidesPerView.value
}

// Navigation
const goToSlide = (index) => {
  const maxIndex = articles.value.length - slidesPerView.value
  const targetIndex = Math.min(Math.max(index, 0), maxIndex)
  currentSlide.value = targetIndex
}

const nextSlide = () => {
  const maxIndex = articles.value.length - slidesPerView.value
  if (currentSlide.value < maxIndex) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

// Touch events
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  isDragging.value = false
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
  
  touchStartX.value = 0
  touchEndX.value = 0
}

// Auto-play
const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(() => {
    if (currentSlide.value < articles.value.length - slidesPerView.value) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// Gestion du responsive
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  const maxIndex = articles.value.length - slidesPerView.value
  if (currentSlide.value > maxIndex) {
    currentSlide.value = Math.max(0, maxIndex)
  }
}

// Formatage de la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Partage d'article
const shareArticle = (article) => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.excerpt,
      url: article.link
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(article.link).then(() => {
      alert('Lien copié dans le presse-papier !')
    }).catch(() => {})
  }
}

// Animation au scroll
const initScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1
  })
  
  if (headerRef.value) {
    observer.observe(headerRef.value)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  startAutoPlay()
  nextTick(() => {
    initScrollAnimation()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAutoPlay()
})
</script>

<style scoped>
/* ============================================================
   STYLES DE BASE
   ============================================================ */
.blog-section {
  padding: 80px 0;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--white) 100%);
  overflow: hidden;
  position: relative;
}

.blog-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 180, 216, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
}

/* ============================================================
   EN-TÊTE
   ============================================================ */
.blog-header {
  text-align: center;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateY(30px);
  transition: var(--transition-bounce);
}

.blog-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.blog-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--blog-blue) 0%, var(--blog-blue-dark) 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 20px;
  border-radius: var(--border-radius-pill);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 15px;
}

.blog-title {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 15px 0;
  line-height: 1.2;
}

.blog-title span {
  background: linear-gradient(135deg, var(--blog-blue), var(--blog-blue-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-description {
  font-size: 18px;
  color: var(--text-gray);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ============================================================
   CONTROLES
   ============================================================ */
.blog-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.blog-indicators {
  display: flex;
  gap: 8px;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--blog-border);
  background: transparent;
  cursor: pointer;
  transition: var(--transition-smooth);
  padding: 0;
}

.indicator-dot.active {
  background: var(--blog-blue);
  border-color: var(--blog-blue);
  transform: scale(1.2);
}

.indicator-dot:hover:not(.active) {
  border-color: var(--blog-blue);
  transform: scale(1.1);
}

.blog-nav-arrows {
  display: flex;
  gap: 10px;
}

.nav-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--blog-border);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
  color: var(--text-dark);
}

.nav-arrow:hover:not(:disabled) {
  background: var(--blog-blue);
  border-color: var(--blog-blue);
  color: white;
  transform: scale(1.05);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-arrow svg {
  width: 20px;
  height: 20px;
}

/* ============================================================
   CARROUSEL
   ============================================================ */
.blog-carousel-wrapper {
  overflow: hidden;
  position: relative;
  border-radius: var(--border-radius-item);
}

.blog-carousel {
  display: flex;
  gap: 30px;
  will-change: transform;
}

.blog-slide {
  flex: 0 0 calc((100% - 60px) / 3);
  min-width: 0;
  opacity: 0.4;
  transform: scale(0.95);
  transition: var(--transition-slide);
}

.blog-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

.blog-slide.is-prev,
.blog-slide.is-next {
  opacity: 0.6;
  transform: scale(0.97);
}

/* ============================================================
   CARTE D'ARTICLE
   ============================================================ */
.blog-card {
  background: white;
  border-radius: var(--border-radius-card);
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-card);
  transition: var(--transition-bounce);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--shadow-card-hover);
}

.blog-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Image */
.blog-image-link {
  display: block;
  overflow: hidden;
  position: relative;
}

.blog-image-wrapper {
  position: relative;
  overflow: hidden;
  padding-top: 65%;
}

.blog-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-image);
}

.blog-card:hover .blog-image {
  transform: scale(1.08);
}

.blog-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 180, 216, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-smooth);
}

.blog-card:hover .blog-image-overlay {
  opacity: 1;
}

.read-now {
  background: white;
  color: var(--blog-blue);
  padding: 10px 25px;
  border-radius: var(--border-radius-pill);
  font-weight: 600;
  font-size: 14px;
  transform: translateY(20px);
  transition: var(--transition-smooth);
}

.blog-card:hover .read-now {
  transform: translateY(0);
}

/* Contenu */
.blog-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-light-gray);
}

.blog-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.blog-date i {
  font-size: 14px;
}

.blog-category {
  background: var(--blog-bg-meta);
  color: var(--text-muted);
  padding: 3px 12px;
  border-radius: var(--border-radius-pill);
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blog-post-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.blog-post-title a {
  color: var(--text-dark);
  text-decoration: none;
  transition: color var(--transition-smooth);
}

.blog-post-title a:hover {
  color: var(--blog-blue);
}

.blog-excerpt {
  color: var(--text-gray);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px 0;
  flex: 1;
}

.blog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--blog-bg-meta);
}

/* ============================================================
   BOUTONS
   ============================================================ */
.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--blog-blue);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition-smooth);
}

.read-more-btn:hover {
  gap: 14px;
  color: var(--blog-blue-dark);
}

.read-more-btn svg {
  transition: transform var(--transition-smooth);
}

.read-more-btn:hover svg {
  transform: translateX(4px);
}

.share-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--blog-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light-gray);
  transition: var(--transition-smooth);
}

.share-btn:hover {
  background: var(--blog-blue);
  border-color: var(--blog-blue);
  color: white;
  transform: scale(1.05);
}

/* ============================================================
   PAGINATION MOBILE
   ============================================================ */
.mobile-pagination {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  font-size: 16px;
  color: var(--text-light-gray);
}

.pagination-current {
  font-weight: 700;
  color: var(--text-dark);
  font-size: 20px;
}

.pagination-separator {
  font-size: 18px;
}

.pagination-total {
  font-size: 16px;
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-slide.is-active .blog-card {
  animation: fadeInUp 0.6s ease forwards;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 1024px) {
  .blog-slide {
    flex: 0 0 calc((100% - 30px) / 2);
  }
  
  .blog-title {
    font-size: 34px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .blog-section {
    padding: 50px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .blog-header {
    margin-bottom: 30px;
  }
  
  .blog-title {
    font-size: 26px;
  }
  
  .blog-description {
    font-size: 15px;
  }
  
  .blog-slide {
    flex: 0 0 100%;
  }
  
  .blog-controls {
    display: none;
  }
  
  .mobile-pagination {
    display: flex;
  }
  
  .blog-carousel {
    gap: 0;
    padding: 0;
  }
  
  .blog-slide.is-prev,
  .blog-slide.is-next {
    opacity: 0.8;
    transform: scale(0.98);
  }
  
  .blog-card {
    margin: 0 5px;
  }
  
  .blog-post-title {
    font-size: 16px;
  }
  
  .blog-excerpt {
    font-size: 13px;
  }
  
  .blog-image-wrapper {
    padding-top: 55%;
  }
  
  .blog-content {
    padding: 18px;
  }
  
  .blog-meta {
    font-size: 12px;
    flex-wrap: wrap;
  }
  
  .read-more-btn {
    font-size: 13px;
  }
  
  .share-btn {
    width: 32px;
    height: 32px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .blog-section {
    padding: 40px 0;
  }
  
  .blog-title {
    font-size: 22px;
  }
  
  .blog-badge {
    font-size: 11px;
    padding: 4px 16px;
  }
  
  .blog-post-title {
    font-size: 15px;
  }
  
  .blog-excerpt {
    font-size: 12px;
    line-height: 1.5;
  }
  
  .blog-content {
    padding: 14px;
  }
  
  .blog-image-wrapper {
    padding-top: 50%;
  }
  
  .mobile-pagination {
    font-size: 14px;
    margin-top: 20px;
  }
  
  .pagination-current {
    font-size: 18px;
  }
}

/* Support pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .blog-slide,
  .blog-card,
  .blog-image,
  .blog-image-overlay,
  .read-now,
  .blog-header {
    transition: none !important;
    animation: none !important;
  }
  
  .blog-carousel {
    transition: none !important;
  }
}
</style>