<!-- src/components/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-container">
      
      <!-- Grille -->
      <div class="footer-grid">
        
        <!-- Colonne 1 : Logo & Réseaux sociaux -->
        <div class="footer-col">
          <div class="footer-logo-wrapper">
            <div class="footer-logo">
              <img 
                src="/src/assets/images/logo1.png" 
                alt="BéninSanté Logo" 
                class="footer-logo-img"
                @error="handleImageError"
              />
              <span class="footer-logo-text">
                Bénin<span class="logo-green">Santé</span>
              </span>
            </div>
          </div>
          <p class="footer-description">
            BéninSanté est la première plateforme numérique de santé au Bénin.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="fab fa-x-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Colonne 2 : Liens rapides -->
        <div class="footer-col">
          <h3 class="footer-heading">Liens rapides</h3>
          <ul class="footer-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/a-propos">À propos</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <!-- Colonne 3 : Coordonnées -->
        <div class="footer-col">
          <h3 class="footer-heading">Coordonnées</h3>
          <ul class="footer-contacts">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>Cotonou, Bénin</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <span>contact@beninsante.bj</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span>+229 01 57 21 92 14</span>
            </li>
            <li>
              <i class="fas fa-clock"></i>
              <span>8h - 18h, Lundi - Samedi</span>
            </li>
          </ul>
        </div>

        <!-- Colonne 4 : Newsletter -->
        <div class="footer-col">
          <h3 class="footer-heading">Newsletter</h3>
          <p class="footer-newsletter-text">Restez informé des actualités de BéninSanté.</p>
          <form @submit.prevent="submitNewsletter" class="footer-form">
            <input 
              type="email" 
              v-model="newsletterEmail"
              class="footer-input"
              placeholder="Votre email"
              required
            />
            <button type="submit" class="footer-btn">
              S'abonner
            </button>
          </form>
        </div>

      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          Copyright &copy; 2026 <strong class="copyright-highlight">BéninSanté</strong>. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      newsletterEmail: ''
    }
  },
  methods: {
    submitNewsletter() {
      if (this.newsletterEmail) {
        alert('Merci pour votre abonnement à la newsletter BéninSanté !')
        this.newsletterEmail = ''
      }
    },
    handleImageError(event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
/* ============================================================
   STYLES DU FOOTER
   ============================================================ */

/* ============================================================
   1. FOOTER PRINCIPAL
   ============================================================ */
.app-footer {
  background: var(--bg-dark-green);
  color: var(--white);
  padding: 60px 0 0;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ============================================================
   2. GRILLE
   ============================================================ */
.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

/* ============================================================
   3. COLONNES
   ============================================================ */
.footer-col {
  display: flex;
  flex-direction: column;
}

/* ============================================================
   4. LOGO
   ============================================================ */
.footer-logo-wrapper {
  margin-bottom: 15px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo-img {
  height: 45px;
  width: auto;
  display: block;
}

.footer-logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
}

.logo-green {
  color: var(--primary-green);
}

/* ============================================================
   5. DESCRIPTION
   ============================================================ */
.footer-description {
  color: #a0b4c8;
  font-size: 14px;
  line-height: 1.6;
  max-width: 280px;
  margin: 0 0 20px 0;
}

/* ============================================================
   6. RÉSEAUX SOCIAUX
   ============================================================ */
.footer-socials {
  display: flex;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--white);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.social-link:hover {
  background: var(--primary-blue);
  color: var(--bg-dark-green);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(12, 205, 254, 0.3);
}

/* ============================================================
   7. TITRES DES COLONNES
   ============================================================ */
.footer-heading {
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  margin: 0 0 20px 0;
  position: relative;
  padding-bottom: 10px;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-blue);
  border-radius: 2px;
}

/* ============================================================
   8. LISTES
   ============================================================ */
.footer-links,
.footer-contacts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #a0b4c8;
  text-decoration: none;
  font-size: 14px;
  transition: color var(--transition-smooth);
}

.footer-links a:hover {
  color: var(--primary-blue);
}

/* ============================================================
   9. CONTACTS
   ============================================================ */
.footer-contacts li {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  color: #a0b4c8;
  font-size: 14px;
}

.footer-contacts li i {
  color: var(--primary-blue);
  width: 18px;
  margin-top: 3px;
  flex-shrink: 0;
}

/* ============================================================
   10. NEWSLETTER
   ============================================================ */
.footer-newsletter-text {
  color: #a0b4c8;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.footer-form {
  display: flex;
  gap: 10px;
}

.footer-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 14px;
  outline: none;
  transition: var(--transition-smooth);
}

.footer-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.footer-input:focus {
  border-color: var(--primary-blue);
  background: rgba(255, 255, 255, 0.15);
}

.footer-btn {
  padding: 10px 20px;
  background: var(--primary-blue);
  border: none;
  border-radius: 8px;
  color: var(--bg-dark-green);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: var(--transition-smooth);
}

.footer-btn:hover {
  background: var(--primary-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 215, 176, 0.3);
}

/* ============================================================
   11. COPYRIGHT
   ============================================================ */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  text-align: center;
}

.footer-copyright {
  color: #a0b4c8;
  font-size: 14px;
  margin: 0;
}

.copyright-highlight {
  color: var(--primary-blue);
}

/* ============================================================
   12. RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .app-footer {
    padding: 40px 0 0;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-form {
    flex-direction: column;
  }
  
  .footer-btn {
    width: 100%;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .app-footer {
    padding: 30px 0 0;
  }
  
  .footer-container {
    padding: 0 15px;
  }
}
</style>