<template>
  <section class="contact-form-section">
    <!-- Image de fond -->
    <div class="background-image"></div>
    
    <!-- Overlay -->
    <div class="overlay"></div>

    <div class="container">
      <div class="contact-wrapper">
        <!-- En-tête -->
        <div class="contact-header" data-aos="fade-up">
          <span class="contact-subtitle">Contactez-nous</span>
          <h2 class="contact-title">
            Prenez <span class="highlight">rendez-vous</span> en ligne
          </h2>
          <p class="contact-description">
            Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs délais.
          </p>
        </div>

        <!-- Contenu principal -->
        <div class="contact-content">
          <!-- Carte de gauche : Informations -->
          <div class="contact-info-card" data-aos="fade-right">
            <div class="contact-info-inner">
              <div class="contact-icon-wrapper">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 class="contact-info-title">
                <strong>BéninSanté</strong>
                <span class="sub-title">Prenez soin de votre santé en toute simplicité</span>
              </h3>
              
              <div class="contact-features">
                <div class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>Consultation en ligne 24/7</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>Professionnels de santé qualifiés</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>Dossier médical sécurisé</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span>Prise de rendez-vous simplifiée</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte de droite : Formulaire -->
          <div class="contact-form-card" data-aos="fade-left">
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <span class="input-icon">👤</span>
                    <input 
                      type="text" 
                      v-model="form.name"
                      class="form-control"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <span class="input-icon">✉️</span>
                    <input 
                      type="email" 
                      v-model="form.email"
                      class="form-control"
                      placeholder="Votre email"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <span class="input-icon">📱</span>
                    <input 
                      type="tel" 
                      v-model="form.phone"
                      class="form-control"
                      placeholder="Votre numéro de téléphone"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <span class="input-icon">📅</span>
                    <input 
                      type="date" 
                      v-model="form.date"
                      class="form-control date-input"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-12">
                  <div class="input-group">
                    <span class="input-icon">💬</span>
                    <textarea 
                      v-model="form.message"
                      class="form-control"
                      rows="4"
                      placeholder="Votre message (optionnel)"
                    ></textarea>
                  </div>
                </div>
                <div class="form-group col-md-12">
                  <button type="submit" class="btn-submit">
                    <span>Envoyer le message</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  date: '',
  message: ''
})

const submitForm = () => {
  console.log('Formulaire soumis :', form)
  
  // Simulation d'envoi
  const button = document.querySelector('.btn-submit')
  button.innerHTML = 'Envoi en cours...'
  button.disabled = true
  
  setTimeout(() => {
    alert('✅ Votre message a été envoyé avec succès !')
    
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
    button.innerHTML = `
      <span>Send Message</span>
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
      </svg>
    `
    button.disabled = false
  }, 1500)
}
</script>

<style scoped>
.contact-form-section {
  padding: 80px 0;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Image de fond */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/images/hero/contact.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 0;
}

/* Overlay sombre */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  position: relative;
  z-index: 2;
  width: 100%;
}

.contact-wrapper {
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-header {
  text-align: center;
  padding: 40px 20px 20px;
  background-color: transparent !important;
  position: relative;
}

.contact-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #0077b6, #00b4d8);
  border-radius: 2px;
}

.contact-subtitle {
  color: #00b4d8;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: inline-block;
  padding: 5px 15px;
  background: rgba(0, 180, 216, 0.1);
  border-radius: 50px;
  margin-bottom: 10px;
}

.contact-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a2a3a;
  margin: 0;
}

.contact-content {
  display: flex;
  flex-wrap: wrap;
}

.contact-info-card {
  flex: 1;
  min-width: 280px;
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.contact-info-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.5); }
}

.contact-info-inner {
  color: white;
  position: relative;
  z-index: 1;
}

.contact-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.contact-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.contact-info-title {
  font-size: 28px;
  line-height: 1.4;
  font-weight: 400;
  margin-bottom: 20px;
}

.contact-info-title strong {
  font-weight: 700;
  display: block;
  font-size: 32px;
  margin-bottom: 8px;
}

.contact-info-title .sub-title {
  font-size: 18px;
  font-weight: 300;
  opacity: 0.9;
}

.contact-features {
  margin-top: 25px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  width: 22px;
  height: 22px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.contact-form-card {
  flex: 1.5;
  min-width: 380px;
  background: white;
  padding: 50px 40px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.form-group {
  padding: 8px;
}

.col-md-6 {
  width: calc(50% - 16px);
}

.col-md-12 {
  width: calc(100% - 16px);
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.5;
  z-index: 1;
  pointer-events: none;
}

textarea ~ .input-icon {
  top: 20px;
  transform: none;
}

.form-control {
  width: 100%;
  padding: 14px 16px 14px 46px;
  font-size: 15px;
  border: 2px solid #e8edf4;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-family: inherit;
  color: #1a2a3a;
}

.form-control:focus {
  outline: none;
  border-color: #00b4d8;
  box-shadow: 0 0 0 4px rgba(0, 180, 216, 0.1);
  background: white;
  transform: translateY(-1px);
}

.form-control::placeholder {
  color: #94a3b8;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  padding-top: 20px;
}

/* ===== CORRECTION DU CHAMP DATE ===== */
.date-input {
  color: #1a2a3a !important;
  appearance: none;
  -webkit-appearance: none;
}

/* Supprime la couleur rouge du champ date invalide */
.date-input:invalid {
  color: #1a2a3a !important;
  border-color: #e8edf4 !important;
}

/* Supprime l'icône par défaut du champ date sur Chrome */
.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.3);
  cursor: pointer;
}

/* Supprime l'icône par défaut du champ date sur Firefox */
.date-input::-moz-calendar-picker-indicator {
  filter: invert(0.3);
  cursor: pointer;
}

/* Couleur du texte pour les navigateurs qui affichent "jj/mm/aaaa" en gris */
.date-input::placeholder {
  color: #94a3b8 !important;
}

/* Lorsque le champ date est vide mais requis, on garde la couleur normale */
.date-input:required:invalid {
  color: #1a2a3a !important;
  border-color: #e8edf4 !important;
}

/* ===== FIN CORRECTION ===== */

.btn-submit {
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  color: white;
  border: none;
  padding: 16px 35px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.btn-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-submit:hover::before {
  left: 100%;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 180, 216, 0.35);
}

.btn-submit:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.btn-submit:hover .btn-icon {
  transform: translateX(5px);
}

/* Responsive */
@media (max-width: 992px) {
  .contact-form-section {
    padding: 40px 0;
  }

  .contact-title {
    font-size: 32px;
  }

  .contact-content {
    flex-direction: column;
  }

  .contact-info-card {
    padding: 40px 30px;
  }

  .contact-info-title {
    font-size: 24px;
  }

  .contact-info-title strong {
    font-size: 28px;
  }

  .contact-form-card {
    padding: 30px 20px;
    min-width: auto;
  }

  .col-md-6 {
    width: calc(100% - 16px);
  }
}

@media (max-width: 576px) {
  .contact-header {
    padding: 30px 15px 15px;
  }

  .contact-title {
    font-size: 26px;
  }

  .contact-info-card {
    padding: 30px 20px;
  }

  .contact-info-title {
    font-size: 20px;
  }

  .contact-info-title strong {
    font-size: 24px;
  }

  .contact-form-card {
    padding: 20px 15px;
  }

  .form-control {
    font-size: 14px;
    padding: 12px 14px 12px 40px;
  }

  .btn-submit {
    font-size: 14px;
    padding: 14px 25px;
  }

  .background-image {
    background-attachment: scroll;
  }
}

/* Support des préférences de mouvement réduit */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .contact-wrapper {
    animation: none;
  }

  .contact-info-card::before {
    animation: none;
  }

  .btn-submit::before {
    display: none;
  }

  .btn-submit:hover {
    transform: none !important;
  }
}
</style>