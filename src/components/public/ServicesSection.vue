<!-- src/components/ServicesSection.vue -->
<template>
  <section ref="sectionRef" class="services-section">
    <!-- Fond décoratif -->
    <div class="services-bg">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      <div class="bg-orb orb-4"></div>
      <div class="bg-grid"></div>
      <div class="bg-gradient-overlay"></div>
    </div>

    <div class="container position-relative">
      <!-- ===== EN-TÊTE ===== -->
      <div class="services-header" :class="{ 'is-visible': isVisible }">
        <h2 class="services-title">
          <span class="gradient-text">BéninSanté</span>
          <br />
          vous accompagne au quotidien
        </h2>
        <p class="services-subtitle">
          Un allié fiable à chaque étape de votre suivi de santé
        </p>
        <div class="header-cta-group">
          <button class="btn-primary-header">
            Découvrir
            <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn-secondary-header">
            <i class="fas fa-play-circle"></i>
            Voir la démo
          </button>
        </div>
      </div>

      <!-- ===== SLIDER PRINCIPAL ===== -->
      <div class="services-slider" :class="{ 'is-visible': isVisible }">
        <div class="slider-container">
          <TransitionGroup name="slide-horizontal" tag="div" class="slider-track">
            <div
              v-for="(service, index) in services"
              :key="service.id"
              v-show="currentServiceIndex === index"
              class="slider-slide"
            >
              <div class="slide-content">
                <!-- Partie Description -->
                <div class="slide-description">
                  <div class="slide-number">{{ String(index + 1).padStart(2, '0') }}</div>
                  <div class="slide-category">{{ service.category }}</div>
                  <h3 class="slide-title">{{ service.title }}</h3>
                  <p class="slide-description-text">{{ service.description }}</p>

                  <!-- Points clés -->
                  <div class="slide-features">
                    <div
                      v-for="(feature, idx) in service.features"
                      :key="idx"
                      class="feature-item"
                    >
                      <div class="feature-icon-wrapper">
                        <i class="fas fa-check-circle"></i>
                      </div>
                      <span>{{ feature }}</span>
                    </div>
                  </div>

                  <!-- CTA -->
                  <div class="slide-cta">
                    <button class="btn-slide-cta">
                      En savoir plus
                      <i class="fas fa-arrow-right"></i>
                    </button>
                    <span class="slide-cta-info">{{ service.ctaInfo }}</span>
                  </div>
                </div>

                <!-- Partie Visuelle -->
                <div class="slide-visual">
                  <div class="visual-container">
                    <!-- Mockup Desktop -->
                    <div class="mockup-desktop">
                      <div class="mockup-header">
                        <div class="mockup-dots">
                          <span class="dot red"></span>
                          <span class="dot yellow"></span>
                          <span class="dot green"></span>
                        </div>
                        <div class="mockup-title">
                          <span class="mockup-icon">{{ service.icon }}</span>
                          {{ service.label }} - BéninSanté
                        </div>
                        <div class="mockup-actions">
                          <span class="mockup-time">{{ service.time }}</span>
                        </div>
                      </div>
                      <div class="mockup-content">
                        <div class="dashboard-preview">
                          <div class="preview-header">
                            <div class="preview-avatar">{{ service.avatar }}</div>
                            <div class="preview-info">
                              <div class="preview-name">{{ service.profileName }}</div>
                              <div class="preview-status">{{ service.profileStatus }}</div>
                            </div>
                          </div>

                          <!-- Tags -->
                          <div class="preview-tags">
                            <span v-for="tag in service.tags" :key="tag.label" :class="'preview-tag ' + tag.class">
                              {{ tag.label }}
                            </span>
                          </div>

                          <!-- Contenu spécifique -->
                          <div class="preview-charts">
                            <!-- Pour Admin et Super Admin : graphiques -->
                            <div v-if="service.id === 'admin-hopital' || service.id === 'super-admin'" class="charts-container">
                              <div class="chart-row">
                                <div class="chart-box">
                                  <div class="chart-label">Consultations</div>
                                  <div class="chart-bar-container">
                                    <div class="chart-bar" :style="{ width: service.id === 'admin-hopital' ? '75%' : '92%', animationDelay: '0.2s' }"></div>
                                  </div>
                                  <div class="chart-value">{{ service.id === 'admin-hopital' ? '1 247' : '8 932' }}</div>
                                </div>
                                <div class="chart-box">
                                  <div class="chart-label">Patients</div>
                                  <div class="chart-bar-container">
                                    <div class="chart-bar" :style="{ width: service.id === 'admin-hopital' ? '60%' : '85%', animationDelay: '0.4s' }"></div>
                                  </div>
                                  <div class="chart-value">{{ service.id === 'admin-hopital' ? '856' : '5 421' }}</div>
                                </div>
                              </div>
                              <div class="chart-row">
                                <div class="chart-box">
                                  <div class="chart-label">Urgences</div>
                                  <div class="chart-bar-container">
                                    <div class="chart-bar" :style="{ width: service.id === 'admin-hopital' ? '45%' : '78%', animationDelay: '0.6s' }"></div>
                                  </div>
                                  <div class="chart-value">{{ service.id === 'admin-hopital' ? '342' : '2 187' }}</div>
                                </div>
                                <div class="chart-box">
                                  <div class="chart-label">Personnel</div>
                                  <div class="chart-bar-container">
                                    <div class="chart-bar" :style="{ width: service.id === 'admin-hopital' ? '80%' : '95%', animationDelay: '0.8s' }"></div>
                                  </div>
                                  <div class="chart-value">{{ service.id === 'admin-hopital' ? '124' : '2 456' }}</div>
                                </div>
                              </div>
                              <!-- Graphique circulaire pour Super Admin -->
                              <div v-if="service.id === 'super-admin'" class="donut-chart-container">
                                <div class="donut-chart">
                                  <svg viewBox="0 0 120 120" class="donut-svg">
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" stroke-width="12"/>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#0CCDFE" stroke-width="12"
                                      stroke-dasharray="283" stroke-dashoffset="70" stroke-linecap="round"
                                      class="donut-segment segment-1"/>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#8b5cf6" stroke-width="12"
                                      stroke-dasharray="283" stroke-dashoffset="180" stroke-linecap="round"
                                      class="donut-segment segment-2"/>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#25D7B0" stroke-width="12"
                                      stroke-dasharray="283" stroke-dashoffset="240" stroke-linecap="round"
                                      class="donut-segment segment-3"/>
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#fbbf24" stroke-width="12"
                                      stroke-dasharray="283" stroke-dashoffset="270" stroke-linecap="round"
                                      class="donut-segment segment-4"/>
                                  </svg>
                                  <div class="donut-center">
                                    <span class="donut-value">100%</span>
                                    <span class="donut-label">Couverture</span>
                                  </div>
                                </div>
                                <div class="donut-legend">
                                  <div class="legend-item"><span class="legend-color blue"></span> Hôpitaux</div>
                                  <div class="legend-item"><span class="legend-color purple"></span> Cliniques</div>
                                  <div class="legend-item"><span class="legend-color green"></span> Centres</div>
                                  <div class="legend-item"><span class="legend-color yellow"></span> Labos</div>
                                </div>
                              </div>
                            </div>

                            <!-- Stats simples pour Patient et Docteur -->
                            <div v-else class="preview-stats">
                              <div
                                v-for="(stat, statIndex) in service.stats"
                                :key="stat.label"
                                class="preview-stat"
                                :class="{ 'is-counting': isCounting }"
                              >
                                <span class="stat-value" :style="{ transitionDelay: (statIndex * 100) + 'ms' }">
                                  <AnimatedCounter
                                    :target="stat.value"
                                    :duration="2500"
                                    :delay="300 + (statIndex * 200)"
                                    :trigger="isVisible && currentServiceIndex === index"
                                  />
                                </span>
                                <span class="stat-label">{{ stat.label }}</span>
                                <span class="stat-sparkle" v-if="isCounting">✨</span>
                              </div>
                            </div>
                          </div>

                          <div class="preview-footer">
                            <span class="preview-link">
                              <i class="fas fa-arrow-up"></i> Retour en haut
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Mockup Mobile -->
                    <div class="mockup-mobile">
                      <div class="mobile-notch"></div>
                      <div class="mobile-header">
                        <span class="mobile-icon">{{ service.icon }}</span>
                        <span class="mobile-title">Profil</span>
                      </div>
                      <div class="mobile-content">
                        <div class="mobile-avatar">{{ service.avatar }}</div>
                        <div class="mobile-name">{{ service.mobileName }}</div>
                        <div class="mobile-tags">
                          <span v-for="tag in service.tags.slice(0, 3)" :key="tag.label" :class="'mobile-tag ' + tag.class">
                            {{ tag.label }}
                          </span>
                        </div>

                        <div class="mobile-stats">
                          <div v-for="(stat, statIndex) in service.mobileStats" :key="stat.label" class="mobile-stat-item">
                            <span class="mobile-stat-value" :class="{ 'is-counting': isCounting }">
                              <AnimatedCounter
                                :target="stat.value"
                                :duration="2500"
                                :delay="500 + (statIndex * 300)"
                                :trigger="isVisible && currentServiceIndex === index"
                              />
                            </span>
                            <span class="mobile-stat-label">{{ stat.label }}</span>
                          </div>
                        </div>

                        <div class="mobile-progress">
                          <div class="progress-bar">
                            <div class="progress-fill" style="width: 85%"></div>
                          </div>
                          <span class="progress-label">85% complété</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Navigation du slider -->
        <div class="slider-navigation">
          <button @click="prevSlide" class="nav-btn nav-prev" aria-label="Slide précédent">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="nav-dots">
            <button
              v-for="(service, index) in services"
              :key="service.id"
              @click="setActiveService(index)"
              class="nav-dot"
              :class="{ active: currentServiceIndex === index }"
              :aria-label="`Aller à ${service.label}`"
            />
          </div>

          <button @click="nextSlide" class="nav-btn nav-next" aria-label="Slide suivant">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import AnimatedCounter from './AnimatedCounter.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ===== DONNÉES =====
const services = [
  {
    id: 'patient',
    label: 'Patient',
    icon: '👤',
    avatar: '👤',
    profileName: 'Profil patient',
    profileStatus: 'Complété à 85%',
    mobileName: 'Profil patient',
    category: 'SUIVI PERSONNEL',
    title: 'Suivi santé personnel',
    time: '14:30',
    description: 'Plus un seul vaccin ou rendez-vous médical manqué ! Avec BéninSanté, prenez soin de votre santé et de celle de vos proches.',
    features: [
      'Recevez des rappels de vaccins et de suivis réguliers',
      'Bénéficiez de conseils fiables pour préserver votre santé',
      'Facilitez le suivi : grossesse, parentalité, maladie chronique'
    ],
    tags: [
      { label: 'Vaccin COVID-19', class: 'primary' },
      { label: 'Appendicite', class: 'warning' },
      { label: 'Passés', class: 'info' },
      { label: 'Tachycardie', class: 'danger' },
      { label: 'Entourage', class: 'secondary' }
    ],
    stats: [
      { value: 12, label: 'Suivis' },
      { value: 4, label: 'Rappels' },
      { value: 100, label: 'Sécurisé' }
    ],
    mobileStats: [
      { value: 12, label: 'Suivis' },
      { value: 4, label: 'Rappels' }
    ],
    ctaInfo: 'Gratuit • Sécurisé'
  },
  {
    id: 'docteur',
    label: 'Docteur',
    icon: '👨‍⚕️',
    avatar: '👨‍⚕️',
    profileName: 'Profil médecin',
    profileStatus: 'Connecté',
    mobileName: 'Profil médecin',
    category: 'GESTION MÉDICALE',
    title: 'Gestion des patients',
    time: '14:30',
    description: 'Visualisez les dossiers patients, planifiez les consultations et suivez les traitements en temps réel.',
    features: [
      'Accès instantané aux dossiers médicaux',
      'Planification des rendez-vous',
      'Suivi des traitements en cours'
    ],
    tags: [
      { label: 'Consultations', class: 'primary' },
      { label: 'Traitements', class: 'info' },
      { label: 'Urgences', class: 'danger' },
      { label: 'Suivi', class: 'secondary' }
    ],
    stats: [
      { value: 156, label: 'Patients' },
      { value: 42, label: 'Rendez-vous' },
      { value: 98, label: 'Satisfaction' }
    ],
    mobileStats: [
      { value: 156, label: 'Patients' },
      { value: 42, label: 'RDV' }
    ],
    ctaInfo: 'Certifié • RGPD'
  },
  {
    id: 'admin-hopital',
    label: 'Admin Hôpital',
    icon: '🏥',
    avatar: '🏥',
    profileName: 'Administrateur',
    profileStatus: 'Supervision active',
    mobileName: 'Admin hôpital',
    category: 'ADMINISTRATION',
    title: 'Administration hospitalière',
    time: '14:30',
    description: 'Supervisez les services, gérez le personnel et optimisez les ressources de votre établissement.',
    features: [
      'Gestion du personnel médical',
      'Supervision des services',
      'Optimisation des ressources'
    ],
    tags: [
      { label: 'Personnel', class: 'primary' },
      { label: 'Services', class: 'info' },
      { label: 'Ressources', class: 'warning' },
      { label: 'Performance', class: 'secondary' }
    ],
    stats: [
      { value: 124, label: 'Personnel' },
      { value: 856, label: 'Patients' },
      { value: 342, label: 'Urgences' }
    ],
    mobileStats: [
      { value: 124, label: 'Pers.' },
      { value: 856, label: 'Pats.' }
    ],
    ctaInfo: 'Haute disponibilité'
  },
  {
    id: 'super-admin',
    label: 'Admin Principal',
    icon: '⚙️',
    avatar: '⚙️',
    profileName: 'Super Administrateur',
    profileStatus: 'Contrôle total',
    mobileName: 'Admin principal',
    category: 'SUPERVISION',
    title: 'Supervision globale',
    time: '14:30',
    description: "Contrôle total sur l'ensemble du système. Gérez les utilisateurs et les permissions.",
    features: [
      'Gestion des utilisateurs',
      'Configuration du système',
      'Audit et sécurité'
    ],
    tags: [
      { label: 'Système', class: 'primary' },
      { label: 'Sécurité', class: 'danger' },
      { label: 'Audit', class: 'warning' },
      { label: 'Performance', class: 'info' }
    ],
    stats: [
      { value: 2456, label: 'Utilisateurs' },
      { value: 8932, label: 'Consultations' },
      { value: 2187, label: 'Urgences' }
    ],
    mobileStats: [
      { value: 2456, label: 'Users' },
      { value: 8932, label: 'Cons.' }
    ],
    ctaInfo: 'Accès privilégié'
  }
]

// ===== ÉTAT =====
const sectionRef = ref(null)
const currentServiceIndex = ref(0)
const isVisible = ref(false)
const isCounting = ref(false)
let observer = null
let intervalId = null

// ===== NAVIGATION =====
function nextSlide() {
  currentServiceIndex.value = (currentServiceIndex.value + 1) % services.length
  isCounting.value = true
  setTimeout(() => { isCounting.value = false }, 300)
}

function prevSlide() {
  currentServiceIndex.value = (currentServiceIndex.value - 1 + services.length) % services.length
  isCounting.value = true
  setTimeout(() => { isCounting.value = false }, 300)
}

function setActiveService(index) {
  if (index !== currentServiceIndex.value) {
    currentServiceIndex.value = index
    isCounting.value = true
    setTimeout(() => { isCounting.value = false }, 300)
    resetInterval()
  }
}

function resetInterval() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  startInterval()
}

function startInterval() {
  if (!intervalId) {
    intervalId = setInterval(nextSlide, 6000)
  }
}

// ===== OBSERVER =====
function setupObserver() {
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
  startInterval()
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* ============================================================
   FOND ET DÉCORATIONS
   ============================================================ */
.services-section {
  position: relative;
  padding: 40px 0 40px;
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

.services-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 50%, rgba(12, 205, 254, 0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 50%, rgba(37, 215, 176, 0.04) 0%, transparent 60%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.20;
  animation: floatOrb 25s ease-in-out infinite alternate;
}

.orb-1 {
  width: 700px;
  height: 700px;
  top: -300px;
  right: -200px;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.15), transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  left: -150px;
  background: radial-gradient(circle, rgba(37, 215, 176, 0.12), transparent 70%);
  animation-delay: -8s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  top: 30%;
  left: 40%;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.08), transparent 70%);
  animation-delay: -15s;
}

.orb-4 {
  width: 250px;
  height: 250px;
  bottom: 20%;
  right: 30%;
  background: radial-gradient(circle, rgba(37, 215, 176, 0.08), transparent 70%);
  animation-delay: -5s;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 40px) scale(0.9); }
  100% { transform: translate(20px, -20px) scale(1.05); }
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
.services-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(30px);
  transition: var(--transition-bounce);
}

.services-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.services-title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.12;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.services-title .gradient-text {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services-subtitle {
  font-size: 1.15rem;
  color: var(--text-gray);
  max-width: 560px;
  margin: 0 auto 28px;
  font-style: italic;
}

.header-cta-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* ============================================================
   BOUTONS - COMMUNS
   ============================================================ */
.btn-primary-header,
.btn-secondary-header {
  padding: 12px 32px;
  border-radius: var(--border-radius-pill);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-bounce);
}

.btn-primary-header {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  color: var(--text-dark);
  border: none;
  box-shadow: 0 4px 20px var(--shadow-blue-light);
}

.btn-primary-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 35px var(--shadow-blue);
}

.btn-primary-header i {
  transition: transform var(--transition-smooth);
}

.btn-primary-header:hover i {
  transform: translateX(4px);
}

.btn-secondary-header {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  color: var(--text-dark);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-secondary-header:hover {
  background: white;
  box-shadow: 0 4px 20px var(--shadow-soft);
  transform: translateY(-2px);
}

/* ============================================================
   SLIDER
   ============================================================ */
.services-slider {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition-bounce);
}

.services-slider.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.slider-container {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
}

.slider-track {
  position: relative;
}

.slider-slide {
  position: relative;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 25px 50px -12px var(--shadow-medium);
  padding: 40px;
}

.slide-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 50px;
  align-items: center;
}

/* ===== TRANSITIONS SLIDER ===== */
.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  transition: var(--transition-slide);
}

.slide-horizontal-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.98);
}

.slide-horizontal-leave-to {
  opacity: 0;
  transform: translateX(-60px) scale(0.98);
}

.slide-horizontal-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

/* ============================================================
   PARTIE DESCRIPTION
   ============================================================ */
.slide-description {
  position: relative;
  padding: 10px 0;
}

.slide-number {
  font-size: 48px;
  font-weight: 900;
  color: rgba(12, 205, 254, 0.06);
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -2px;
}

.slide-category {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-blue);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.slide-title {
  font-size: clamp(1.5rem, 2.2vw, 2.2rem);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
  line-height: 1.2;
}

.slide-description-text {
  color: var(--text-gray);
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 24px;
}

.slide-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.slide-features .feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
}

.feature-icon-wrapper {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: rgba(12, 205, 254, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.feature-icon-wrapper i {
  color: var(--primary-green);
  font-size: 12px;
}

.slide-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-slide-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  background: var(--text-dark);
  color: white;
  border: none;
  border-radius: var(--border-radius-pill);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-bounce);
}

.btn-slide-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--shadow-strong);
  background: #1e293b;
}

.btn-slide-cta i {
  transition: transform var(--transition-smooth);
}

.btn-slide-cta:hover i {
  transform: translateX(4px);
}

.slide-cta-info {
  font-size: 13px;
  color: var(--text-light-gray);
  font-weight: 500;
  font-style: italic;
}

/* ============================================================
   PARTIE VISUELLE
   ============================================================ */
.slide-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 450px;
}

.visual-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 10px;
}

/* ===== MOCKUP DESKTOP ===== */
.mockup-desktop {
  flex: 1;
  min-width: 320px;
  background: white;
  border-radius: var(--border-radius-mockup);
  box-shadow: 0 25px 60px -12px var(--shadow-medium);
  overflow: hidden;
  transition: var(--transition-smooth);
}

.slider-slide:hover .mockup-desktop {
  transform: translateY(-4px);
  box-shadow: 0 35px 80px -12px var(--shadow-strong);
}

.mockup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.mockup-dots {
  display: flex;
  gap: 6px;
}

.mockup-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mockup-dots .dot.red { background: #ef4444; }
.mockup-dots .dot.yellow { background: #eab308; }
.mockup-dots .dot.green { background: #22c55e; }

.mockup-title {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mockup-icon {
  font-size: 16px;
}

.mockup-actions {
  display: flex;
  align-items: center;
}

.mockup-time {
  font-size: 11px;
  color: var(--text-light-gray);
  font-weight: 500;
}

.mockup-content {
  padding: 20px;
}

/* ===== DASHBOARD PREVIEW ===== */
.dashboard-preview {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 12px;
}

.preview-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(12, 205, 254, 0.15), rgba(37, 215, 176, 0.15));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
}

.preview-status {
  font-size: 11px;
  color: var(--text-light-gray);
}

/* ===== TAGS ===== */
.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.preview-tag {
  padding: 3px 12px;
  border-radius: var(--border-radius-pill);
  font-size: 10px;
  font-weight: 600;
}

.preview-tag.primary { background: rgba(12, 205, 254, 0.12); color: var(--primary-blue); }
.preview-tag.warning { background: #fef3c7; color: #92400e; }
.preview-tag.info { background: #e0f2fe; color: #075985; }
.preview-tag.danger { background: #fee2e2; color: #991b1b; }
.preview-tag.secondary { background: #e2e8f0; color: #475569; }

/* ===== STATS ===== */
.preview-stats {
  display: flex;
  gap: 24px;
  padding: 14px 18px;
  background: white;
  border-radius: 8px;
  justify-content: space-around;
}

.preview-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  position: relative;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background var(--transition-smooth);
}

.preview-stat.is-counting {
  background: rgba(12, 205, 254, 0.06);
}

.preview-stat .stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-dark);
  min-width: 40px;
  display: inline-block;
  transition: color var(--transition-smooth);
  font-variant-numeric: tabular-nums;
}

.preview-stat .stat-label {
  font-size: 13px;
  color: var(--text-light-gray);
  font-weight: 500;
}

.preview-stat .stat-sparkle {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 14px;
}

.preview-footer {
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  margin-top: 12px;
}

.preview-link {
  font-size: 11px;
  color: var(--text-light-gray);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-smooth);
}

.preview-link:hover {
  color: var(--primary-blue);
}

.preview-link i {
  font-size: 10px;
}

/* ===== GRAPHIQUES ===== */
.preview-charts {
  margin-bottom: 12px;
}

.charts-container {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.chart-row:last-child {
  margin-bottom: 0;
}

.chart-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chart-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.chart-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
  border-radius: 4px;
  width: 0%;
  animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes growBar {
  from { width: 0%; }
  to { width: var(--target-width); }
}

.chart-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dark);
}

/* ===== DONUT CHART ===== */
.donut-chart-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.donut-chart {
  position: relative;
  width: 80px;
  height: 80px;
}

.donut-svg {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}

.donut-segment {
  animation: donutGrow 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.segment-1 {
  stroke-dashoffset: 70;
  animation-delay: 0.2s;
}

.segment-2 {
  stroke-dashoffset: 180;
  animation-delay: 0.4s;
}

.segment-3 {
  stroke-dashoffset: 240;
  animation-delay: 0.6s;
}

.segment-4 {
  stroke-dashoffset: 270;
  animation-delay: 0.8s;
}

@keyframes donutGrow {
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: var(--target-offset); }
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-value {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1;
}

.donut-label {
  font-size: 7px;
  color: var(--text-light-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.donut-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
}

.legend-item {
  font-size: 10px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-color.blue { background: var(--primary-blue); }
.legend-color.purple { background: #8b5cf6; }
.legend-color.green { background: var(--primary-green); }
.legend-color.yellow { background: #fbbf24; }

/* ===== MOCKUP MOBILE ===== */
.mockup-mobile {
  flex-shrink: 0;
  width: 160px;
  background: var(--text-dark);
  border-radius: var(--border-radius-mobile);
  padding: 16px 12px;
  box-shadow: 0 20px 50px -8px var(--shadow-strong);
  transition: var(--transition-smooth);
}

.slider-slide:hover .mockup-mobile {
  transform: translateY(-4px) scale(1.02);
}

.mobile-notch {
  width: 40px;
  height: 5px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  margin: 0 auto 12px;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.mobile-icon {
  font-size: 14px;
}

.mobile-title {
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.mobile-content {
  text-align: center;
}

.mobile-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1e293b, var(--text-dark));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 auto 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.mobile-name {
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.mobile-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-bottom: 10px;
}

.mobile-tag {
  padding: 2px 8px;
  border-radius: var(--border-radius-pill);
  font-size: 8px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
}

.mobile-tag.primary { background: rgba(12, 205, 254, 0.15); color: var(--primary-blue); }
.mobile-tag.warning { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
.mobile-tag.danger { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.mobile-tag.info { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
.mobile-tag.secondary { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }

.mobile-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
}

.mobile-stat-item {
  text-align: center;
}

.mobile-stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: white;
  min-width: 30px;
  transition: color var(--transition-smooth), transform var(--transition-smooth);
  font-variant-numeric: tabular-nums;
}

.mobile-stat-value.is-counting {
  color: var(--primary-blue);
  animation: mobileCounterPulse 0.3s ease-in-out;
}

@keyframes mobileCounterPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); color: var(--primary-green); }
  100% { transform: scale(1); }
}

.mobile-stat-label {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-progress {
  text-align: left;
}

.mobile-progress .progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.mobile-progress .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
  border-radius: 4px;
  width: 85%;
}

.mobile-progress .progress-label {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.3);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
.slider-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  color: var(--text-dark);
  cursor: pointer;
  transition: var(--transition-bounce);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.nav-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--shadow-soft);
}

.nav-btn:active {
  transform: scale(0.92);
}

.nav-dots {
  display: flex;
  gap: 8px;
}

.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #e2e8f0;
  cursor: pointer;
  transition: var(--transition-bounce);
  padding: 0;
}

.nav-dot.active {
  width: 32px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
  border-radius: 5px;
}

.nav-dot:hover {
  transform: scale(1.2);
}

.nav-dot.active:hover {
  transform: scale(1);
}

/* ============================================================
   RESPONSIVE - CONSERVÉ IDENTIQUE
   ============================================================ */
@media (max-width: 1024px) {
  .slide-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .mockup-desktop { min-width: 250px; }
  .mockup-mobile { width: 130px; }
}

@media (max-width: 991px) {
  .services-section { padding: 60px 0 40px; }
  .container { padding: 0 20px; }
  .slider-slide { padding: 30px; }
  .slide-content { grid-template-columns: 1fr; gap: 30px; }
  .slide-visual { min-height: 350px; }
  .visual-container { justify-content: center; }
  .mockup-desktop { min-width: 280px; max-width: 100%; }
  .mockup-mobile { width: 120px; }
  .charts-container { padding: 10px 12px; }
  .chart-row { gap: 10px; }
  .donut-chart-container { flex-direction: column; align-items: center; gap: 12px; }
  .preview-stat .stat-value { font-size: 20px; min-width: 30px; }
}

@media (max-width: 767px) {
  .services-section { padding: 40px 0 30px; }
  .services-header { margin-bottom: 30px; }
  .slider-slide { padding: 20px; border-radius: 20px; }
  .slide-number { font-size: 32px; }
  .slide-features .feature-item { font-size: 0.85rem; }
  .visual-container { flex-direction: column; align-items: center; gap: 20px; }
  .mockup-desktop { min-width: 0; width: 100%; max-width: 380px; }
  .mockup-mobile { width: 130px; }
  .preview-stats { flex-wrap: wrap; justify-content: center; gap: 12px; padding: 12px; }
  .preview-stat .stat-value { font-size: 18px; min-width: 28px; }
  .preview-stat .stat-label { font-size: 11px; }
  .chart-row { grid-template-columns: 1fr 1fr; gap: 8px; }
  .chart-box { gap: 2px; }
  .chart-label { font-size: 10px; }
  .chart-value { font-size: 11px; }
  .donut-legend { grid-template-columns: 1fr 1fr; gap: 2px 8px; }
  .legend-item { font-size: 9px; }
  .slider-navigation { gap: 12px; margin-top: 20px; }
  .nav-btn { width: 36px; height: 36px; font-size: 12px; }
  .header-cta-group { flex-direction: column; align-items: center; }
  .btn-primary-header, .btn-secondary-header { width: 100%; max-width: 280px; justify-content: center; }
  .mobile-stat-value { font-size: 16px; }
}

@media (max-width: 480px) {
  .slider-slide { padding: 16px; }
  .slide-title { font-size: 1.2rem; }
  .slide-description-text { font-size: 0.9rem; }
  .mockup-mobile { width: 110px; padding: 12px 8px; }
  .mobile-tags { gap: 3px; }
  .mobile-tag { font-size: 7px; padding: 1px 6px; }
  .mobile-stat-value { font-size: 14px; min-width: 20px; }
  .slide-cta { flex-direction: column; align-items: flex-start; }
  .btn-slide-cta { width: 100%; justify-content: center; }
  .chart-row { grid-template-columns: 1fr 1fr; gap: 6px; }
  .chart-box { gap: 2px; }
  .chart-label { font-size: 9px; }
  .chart-bar-container { height: 6px; }
  .chart-value { font-size: 10px; }
  .donut-chart { width: 60px; height: 60px; }
  .donut-svg { width: 60px; height: 60px; }
  .donut-value { font-size: 13px; }
  .donut-label { font-size: 6px; }
  .donut-legend { gap: 2px 6px; }
  .legend-item { font-size: 8px; }
  .legend-color { width: 8px; height: 8px; }
  .preview-stat .stat-value { font-size: 16px; min-width: 24px; }
  .preview-stat .stat-label { font-size: 10px; }
}
</style>