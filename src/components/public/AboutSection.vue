<!-- src/components/AboutSection.vue -->
<template>
  <section ref="sectionRef" class="about-section">
    <div class="about-container">
      
      <!-- Colonne de gauche : Images -->
      <div class="about-images">
        
        <!-- Carré pointillé animé -->
        <div class="dots-square"></div>
        
        <!-- Forme plaque qui tourne -->
        <div class="rotating-shape"></div>
        
        <div class="images-wrapper">
          <!-- Image 1 -->
          <div 
            class="about-img-wrapper img-1" 
            :class="{ 'is-visible': isVisible }"
          >
            <img 
              src="https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/about-img-1.jpg" 
              alt="Médecin consultant un patient au Bénin" 
              loading="lazy"
            />
          </div>
          <!-- Image 2 -->
          <div 
            class="about-img-wrapper img-2" 
            :class="{ 'is-visible': isVisible }"
          >
            <img 
              src="https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/about-img-2.jpg" 
              alt="Équipe médicale BéninSanté" 
              loading="lazy"
            />
          </div>
        </div>
        
        <!-- Vidéo popup -->
        <div 
          class="about-video" 
          :class="{ 'is-visible': isVisible }"
        >
          <div class="video-thumb">
            <img 
              src="https://demo.awaikenthemes.com/theme-medipro/wp-content/uploads/2024/05/about-video-img.jpg" 
              alt="Vidéo de présentation BéninSanté" 
              loading="lazy"
            />
            <a href="#" class="video-play-btn" @click.prevent="openVideo">
              <i class="fas fa-play"></i>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Colonne de droite : Contenu -->
      <div class="about-content">
        <div 
          class="about-badge" 
          :class="{ 'is-visible': isVisible }"
        >
          <span>À propos de BéninSanté</span>
        </div>
        
        <h2 
          class="about-title" 
          :class="{ 'is-visible': isVisible }"
        >
          Votre santé, <span class="highlight">partout au Bénin</span>
        </h2>
        
        <p 
          class="about-description" 
          :class="{ 'is-visible': isVisible }"
        >
          BéninSanté est la première plateforme numérique qui centralise votre dossier médical, 
          simplifie vos rendez-vous et sécurise vos ordonnances, partout où vous êtes au Bénin.
        </p>
        
        <!-- Liste des services avec animation -->
        <ul class="about-list">
          <li 
            v-for="(item, index) in listItems" 
            :key="index"
            :class="{ 'is-visible': isVisible }"
            :data-index="index"
          >
            <span class="list-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="list-content">
              <i class="fas fa-check-circle"></i>
              <span class="list-text">{{ item }}</span>
            </div>
            <div class="list-glow"></div>
          </li>
        </ul>
        
        <a 
          href="/a-propos" 
          class="about-btn"
          :class="{ 'is-visible': isVisible }"
        >
          <i class="fas fa-arrow-alt-circle-right"></i>
          En savoir plus
        </a>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ===== ÉTAT =====
const sectionRef = ref(null)
const isVisible = ref(false)
let observer = null

// ===== DONNÉES =====
const listItems = [
  'Dossier médical unique et sécurisé',
  'Prise de rendez-vous en ligne simplifiée',
  'Ordonnances et résultats en toute sécurité'
]

// ===== MÉTHODES =====
const openVideo = () => {
  window.open('https://www.youtube.com/embed/VhBl3dHT5SY', '_blank')
}

const initAnimations = () => {
  if (!window.gsap) return
  
  window.gsap.to('.dots-square', {
    y: 25,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  window.gsap.to('.rotating-shape', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })
}

// ===== INTERSECTION OBSERVER =====
const setupObserver = () => {
  if (!window.IntersectionObserver) {
    isVisible.value = true
    return
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer && sectionRef.value) {
            observer.unobserve(sectionRef.value)
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
}

// ===== CYCLE DE VIE =====
onMounted(() => {
  setupObserver()
  initAnimations()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.about-section {
  padding: 100px 0;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--white) 100%);
  position: relative;
  overflow: hidden;
}

.about-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  gap: 60px;
}

/* ============================================================
   DÉCORATIONS ANIMÉES
   ============================================================ */
.dots-square {
  position: absolute;
  top: -40px;
  left: -40px;
  width: 220px;
  height: 220px;
  background-image: radial-gradient(var(--primary-blue) 3px, transparent 3px);
  background-size: 25px 25px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

.rotating-shape {
  position: absolute;
  bottom: -30px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(12, 205, 254, 0.10) 0%, rgba(37, 215, 176, 0.05) 100%);
  border-radius: 40px;
  transform: rotate(45deg);
  z-index: 0;
  pointer-events: none;
  border: 2px solid rgba(12, 205, 254, 0.15);
  backdrop-filter: blur(2px);
}

/* ============================================================
   PARTIE IMAGES
   ============================================================ */
.about-images {
  flex: 1;
  position: relative;
  z-index: 2;
}

.images-wrapper {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  z-index: 2;
}

.about-img-wrapper {
  border-radius: var(--border-radius-rounded);
  overflow: hidden;
  transition: transform var(--transition-bounce), 
              box-shadow 0.5s ease;
  
  clip-path: inset(0 100% 0 0);
  opacity: 0;
  transform: scale(0.92) rotate(-3deg);
  transition: 
    clip-path 1.4s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1),
    transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.5s ease;
}

.about-img-wrapper.img-1.is-visible {
  clip-path: inset(0 0% 0 0);
  opacity: 1;
  transform: scale(1) rotate(0deg);
  transition-delay: 0.3s;
}

.about-img-wrapper.img-2.is-visible {
  clip-path: inset(0 0% 0 0);
  opacity: 1;
  transform: scale(1) rotate(0deg);
  transition-delay: 0.7s;
}

.about-img-wrapper:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px var(--shadow-card-hover);
}

.about-img-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform var(--transition-spring);
}

.about-img-wrapper:hover img {
  transform: scale(1.05);
}

/* Dimensions des images */
.img-1 {
  width: 280px;
  height: 500px;
  margin-top: 150px;
  margin-bottom: 0;
}

.img-2 {
  width: 280px;
  height: 500px;
  margin-top: 0;
  margin-bottom: 150px;
}

/* ============================================================
   VIDÉO POPUP
   ============================================================ */
.about-video {
  position: absolute;
  bottom: 20px;
  right: 80px;
  z-index: 3;
  opacity: 0;
  transform: translateY(40px) scale(0.85);
  transition: 
    opacity 1s cubic-bezier(0.65, 0, 0.35, 1),
    transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.about-video.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 1.1s;
}

.video-thumb {
  position: relative;
  top: 90px;
  left: 90px;
  border-radius: var(--border-radius-rounded);
  overflow: hidden;
  width: 300px;
  height: 180px;
  cursor: pointer;
  box-shadow: 0 15px 30px var(--shadow-dark);
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
  transition: transform 0.5s ease, filter 0.5s ease;
}

.video-thumb:hover img {
  transform: scale(1.1);
  filter: brightness(0.5);
}

.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: var(--transition-bounce);
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
}

.video-play-btn i {
  color: var(--primary-blue);
  font-size: 22px;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.video-play-btn:hover {
  background-color: var(--primary-blue);
  transform: translate(-50%, -50%) scale(1.15);
}

.video-play-btn:hover i {
  color: var(--white);
}

/* ============================================================
   PARTIE CONTENU
   ============================================================ */
.about-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.about-badge,
.about-title,
.about-description,
.about-btn {
  opacity: 0;
  transform: translateY(30px);
  transition: 
    opacity 0.9s cubic-bezier(0.65, 0, 0.35, 1),
    transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.about-badge.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.about-title.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

.about-description.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.8s;
}

.about-btn.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 2.4s;
}

.about-badge span {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary-blue);
  margin-bottom: 15px;
}

.about-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2em;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.about-title .highlight {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-description {
  font-size: 18px;
  line-height: 1.6em;
  color: var(--text-gray);
  margin-bottom: 25px;
}

/* ============================================================
   LISTE AVEC ANIMATION
   ============================================================ */
.about-list {
  list-style: none;
  padding: 0;
  margin: 0 0 35px 0;
  overflow: hidden;
}

.about-list li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  padding: 14px 20px;
  border-radius: var(--border-radius-item);
  background: var(--white);
  border: 1px solid rgba(12, 205, 254, 0.08);
  box-shadow: 0 4px 15px var(--shadow-card);
  cursor: default;
  overflow: hidden;
  
  /* État initial : hors de l'écran à droite */
  opacity: 0;
  transform: translateX(120px) scale(0.85) rotateY(40deg);
  transform-origin: right center;
  
  /* Transition */
  transition: 
    opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 1s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease,
    background 0.4s ease,
    border-color 0.4s ease;
}

/* Effet de brillance au survol */
.about-list li::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(12, 205, 254, 0.04) 60deg,
    rgba(37, 215, 176, 0.04) 120deg,
    transparent 240deg
  );
  animation: rotateGlow 8s linear infinite;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.about-list li:hover::before {
  opacity: 1;
}

/* Glow au survol */
.about-list li .list-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(12, 205, 254, 0.06) 0%, 
              transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  border-radius: var(--border-radius-item);
}

.about-list li:hover .list-glow {
  opacity: 1;
}

/* Numéro d'ordre */
.about-list li .list-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--shadow-blue-light);
  transition: transform var(--transition-bounce),
              box-shadow 0.4s ease;
}

.about-list li:hover .list-number {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 6px 20px var(--shadow-blue-strong);
}

/* Contenu */
.about-list li .list-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative;
  z-index: 1;
}

.about-list li i {
  color: var(--primary-green);
  font-size: 20px;
  flex-shrink: 0;
  transition: transform var(--transition-bounce),
              color 0.4s ease;
}

.about-list li:hover i {
  transform: scale(1.2) rotate(10deg);
  color: var(--primary-blue);
}

.about-list li .list-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-dark);
  transition: color 0.4s ease, transform 0.4s ease;
  position: relative;
  z-index: 1;
}

.about-list li:hover .list-text {
  color: var(--primary-blue);
  transform: translateX(4px);
}

/* Animation d'entrée */
.about-list li.is-visible {
  opacity: 1;
  transform: translateX(0) scale(1) rotateY(0deg);
}

/* Stagger effect */
.about-list li:nth-child(1).is-visible { transition-delay: 1.0s; }
.about-list li:nth-child(2).is-visible { transition-delay: 1.3s; }
.about-list li:nth-child(3).is-visible { transition-delay: 1.6s; }

/* Soulignement au survol */
.about-list li::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
  border-radius: 3px;
  transition: all var(--transition-bounce);
  transform: translateX(-50%);
}

.about-list li:hover::after {
  width: 80%;
}

/* ============================================================
   BOUTON
   ============================================================ */
.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-blue);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.about-btn i {
  font-size: 18px;
  transition: transform var(--transition-smooth);
}

.about-btn:hover {
  color: var(--primary-green);
}

.about-btn:hover i {
  transform: translateX(5px);
}

/* ============================================================
   KEYFRAMES
   ============================================================ */
@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablettes */
@media (max-width: 992px) {
  .about-section {
    padding: 70px 0;
  }
  
  .about-container {
    flex-direction: column;
    gap: 50px;
  }
  
  .about-images {
    width: 100%;
  }
  
  .images-wrapper {
    justify-content: center;
  }
  
  .img-1 {
    width: 220px;
    height: 400px;
    margin-top: 150px;
    margin-bottom: 0;
  }

  .img-2 {
    width: 220px;
    height: 400px;
    margin-top: 0;
    margin-bottom: 150px;
  }

  .about-video {
    bottom: 20px;
    right: 80px;
  }
  
  .video-thumb {
    width: 220px;
    height: 130px;
    top: 50px;
    left: 50px;
  }
  
  .about-title {
    font-size: 36px;
  }
  
  .dots-square {
    width: 160px;
    height: 160px;
    background-size: 18px 18px;
    top: -20px;
    left: -20px;
  }
  
  .rotating-shape {
    width: 150px;
    height: 150px;
    bottom: -10px;
    right: -20px;
  }

  .about-list li .list-text {
    font-size: 16px;
  }
}

/* Mobiles */
@media (max-width: 768px) {
  .about-section {
    padding: 50px 0;
  }
  
  .about-container {
    padding: 0 20px;
    gap: 40px;
  }
  
  .images-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 30px;
  }
  
  .img-1 {
    width: 150px;
    height: auto;
    margin-top: 150px;
    margin-bottom: 0;
  }

  .img-2 {
    width: 150px;
    height: auto;
    margin-top: 0;
    margin-bottom: 150px;
  }

  .about-video {
    bottom: 20px;
    right: 80px;
  }
  
  .video-thumb {
    width: 200px;
    height: 120px;
    top: 0;
    left: 0;
  }
  
  .video-play-btn {
    width: 50px;
    height: 50px;
  }
  
  .video-play-btn i {
    font-size: 18px;
  }
  
  .about-badge span {
    font-size: 14px;
  }
  
  .about-title {
    font-size: 28px;
  }
  
  .about-description {
    font-size: 16px;
  }
  
  .about-list li {
    padding: 12px 16px;
    gap: 12px;
  }
  
  .about-list li .list-text {
    font-size: 15px;
  }
  
  .about-list li .list-number {
    min-width: 34px;
    height: 34px;
    font-size: 12px;
  }
  
  .about-btn {
    font-size: 16px;
  }
  
  .dots-square {
    width: 120px;
    height: 120px;
    background-size: 15px 15px;
    opacity: 0.5;
  }
  
  .rotating-shape {
    width: 100px;
    height: 100px;
    border-radius: 25px;
  }

  .about-list li {
    transform: translateX(60px) scale(0.9);
  }
}

/* Très petits mobiles */
@media (max-width: 480px) {
  .img-1 {
    width: 150px;
    height: auto;
    margin-top: 110px;
    margin-bottom: 0;
    transform: translateX(-25px) rotate(-2deg);
  }

  .img-2 {
    width: 150px;
    height: auto;
    margin-top: 0;
    margin-bottom: 110px;
  }

  .about-video {
    bottom: 0px;
    right: 0px;
  }
  
  .about-title {
    font-size: 24px;
  }
  
  .video-thumb {
    width: 180px;
    height: 100px;
  }
  
  .dots-square {
    width: 100px;
    height: 100px;
    background-size: 12px 12px;
  }
  
  .rotating-shape {
    width: 80px;
    height: 80px;
    border-radius: 20px;
  }

  .about-list li {
    padding: 10px 14px;
    flex-wrap: wrap;
  }
  
  .about-list li .list-number {
    min-width: 30px;
    height: 30px;
    font-size: 11px;
  }
  
  .about-list li .list-text {
    font-size: 14px;
  }

  .about-list li {
    transform: translateX(40px) scale(0.9);
  }
}
</style>