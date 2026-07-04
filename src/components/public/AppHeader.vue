<template>
  <header 
    class="main-header" 
    :class="{ 
      hidden: hideHeader, 
      top: isAtTop, 
      sticky: isScrolled && !isAtTop 
    }"
  >
    <div class="header-container font-playfair">
      <!-- Logo -->
      <div class="logo">
        <a href="/">
          <img src="../../assets/images/logo1.png" alt="BeninSanté" />
          <span class="logo-text">
            <span class="text-primary-blue">Bénin</span>
            <span class="text-green">Santé</span>
          </span>
        </a>
      </div>

      <!-- Actions Desktop -->
      <div class="header-actions">
        <a href="/aide" class="aide">
          <i class="fas fa-circle-question"></i> Besoin d'aide
        </a>
        <a href="/activer" class="btn-activate">
          Activer Mon espace santé
        </a>
        <a href="/login" @click="login" class="btn-login">
          <i class="fas fa-user-circle"></i> Se connecter
        </a>
      </div>

      <!-- Hamburger -->
      <div class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div class="mobile-menu" :class="{ active: isMenuOpen }">
      <ul>
        <li v-for="item in navItems" :key="item.id">
          <a :href="`#${item.id}`" @click.prevent="scrollToSection(item.id)">
            {{ item.label }}
          </a>
        </li>
        <li><a href="/aide" @click="closeMenu">Besoin d'aide</a></li>
        <li>
          <a href="/activer" @click="closeMenu" class="mobile-activate-btn">
            Activer Mon espace santé
          </a>
        </li>
        <li>
          <a href="/login" @click="login" class="mobile-login-btn">
            <i class="fas fa-user-circle"></i> Se connecter
          </a>
          
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMenuOpen = ref(false)
const hideHeader = ref(false)
const isAtTop = ref(true)
const isScrolled = ref(false)
let lastScrollY = 0

const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'contact', label: 'Contact' }
]

const handleScroll = () => {
  const currentScrollY = window.scrollY
  isAtTop.value = currentScrollY < 50
  isScrolled.value = currentScrollY > 50
  hideHeader.value = currentScrollY > lastScrollY && currentScrollY > 100
  lastScrollY = currentScrollY
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const scrollToSection = (id) => {
  closeMenu()
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ============================================================
   HEADER PRINCIPAL 
   ============================================================ */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: transparent;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  height: 80px;
}

.main-header.hidden {
  transform: translateY(-100%);
}

/* Mode "top" : glass effect */
.main-header.top {
  background: transparent;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 0px solid rgba(255, 255, 255, 0.12);
  margin: 15px auto 0;
  width: 95%;
  border-radius: 50px;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 64px;
}

/* Mode "sticky" : sombre */
.main-header.sticky {
  height: 70px;
}

/* ============================================================
   CONTAINER
   ============================================================ */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  height: 100%;
}

/* ============================================================
   LOGO
   ============================================================ */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 100%;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  animation: pulseLogoGroup 2.5s ease-in-out infinite;
  transform-origin: center;
  height: 100%;
}

.logo img {
  height: 42px;
  width: auto;
  display: block;
  vertical-align: middle;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  line-height: 0;
  height: 100%;
}

.text-blue {
  color: var(--primary-blue);
}

.text-green {
  color: var(--primary-green);
}

@keyframes pulseLogoGroup {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

/* ============================================================
   HEADER ACTIONS
   ============================================================ */
.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

/* Lien Aide */
.aide {
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.aide::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2px;
  background: var(--primary-blue);
  transition: width 0.3s ease;
}

.aide:hover {
  color: var(--primary-blue);
}

.aide:hover::after {
  width: 100%;
}

/* Bouton Activer */
.btn-activate {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  border-radius: 50px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 38px;
}

.btn-activate:hover {
  background: var(--primary-green);
  color: var(--dark-navy);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 215, 176, 0.4);
}

/* Bouton Connexion */
.btn-login {
  background: var(--primary-blue);
  color: var(--dark-navy);
  border: none;
  border-radius: 50px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 38px;
}

.btn-login i {
  font-size: 16px;
}

.btn-login:hover {
  background: var(--white);
  color: var(--dark-navy);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(12, 205, 254, 0.4);
}

/* ============================================================
   HAMBURGER
   ============================================================ */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
  padding: 4px;
}

.hamburger span {
  width: 24px;
  height: 2.5px;
  background: var(--white);
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* ============================================================
   MENU MOBILE
   ============================================================ */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 350px;
  height: 100vh;
  background: var(--dark-navy);
  z-index: 1001;
  padding: 80px 20px 30px;
  transition: right 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu ul li a {
  display: block;
  padding: 15px 0;
  color: var(--white);
  text-decoration: none;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu ul li a i {
  margin-right: 10px;
}

.mobile-activate-btn {
  color: var(--primary-green) !important;
  font-weight: 600;
}

.mobile-login-btn {
  background: var(--primary-blue);
  color: #0F172A !important;
  text-align: center;
  border-radius: 50px;
  margin-top: 20px;
  padding: 15px !important;
  font-weight: 600;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1024px) {
  .header-actions {
    display: none;
  }
  
  .hamburger {
    display: flex;
  }

  .logo img {
    height: 35px;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 20px;
  }
  
  .logo img {
    height: 32px;
  }

  .logo-text {
    font-size: 1rem;
  }

  .logo a {
    gap: 8px;
  }

  .main-header.top {
    width: 98%;
    border-radius: 30px;
    margin: 10px auto 0;
    top: 5px;
    height: 58px;
  }

  .main-header {
    height: 60px;
  }

  .main-header.sticky {
    height: 60px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 15px;
  }
  
  .logo img {
    height: 28px;
  }

  .logo-text {
    font-size: 0.9rem;
  }

  .logo a {
    gap: 6px;
  }

  .main-header.top {
    border-radius: 20px;
    padding: 0;
    height: 52px;
  }

  .main-header {
    height: 54px;
  }

  .main-header.sticky {
    height: 54px;
  }
}
</style>


