<!-- src/components/public/HeroSection.vue -->
<template>
  <section id="accueil" class="hero-section" ref="heroSection">
    <div class="hero-container">

      <!-- Colonne de gauche : Contenu texte -->
      <div class="hero-content">
        <div class="hero-badge animate-target">
          <span>Votre santé, partout au Bénin 🇧🇯</span>
        </div>

        <!-- Le titre avec animation lettre par lettre -->
        <h1 class="hero-tile" ref="heroTitle">
          Un seul dossier médical,
        </h1>
        <h1 class="hero-tile" ref="heroTitle"> partout où vous êtes soigné</h1>

        <p ref="heroSubtitle" class="hero-subtitle">
          La plateforme qui simplifie votre parcours de santé.
        </p>
        <p ref="heroSubtitle" class="hero-description">
          BeninSanté centralise votre dossier médical,
          simplifie vos rendez-vous et sécurise vos
          ordonnances grâce à une plateforme moderne
          connectée au NPI.
        </p>

        <div class="hero-buttons animate-target">
          <a href="/recherche-medicaments" class="btn-readmore">
            <i class="fas fa-magnifying-glass"></i>
            Rechercher un médicament
          </a>
          <a href="#" class="btn-video" @click.prevent="openVideo">
            <i class="fas fa-play-circle"></i>
            Voir la démo
          </a>
        </div>

        <!-- Bandeau de confiance -->
        <div class="hero-trust animate-target">
          <span><i class="fas fa-lock"></i> Données médicales protégées</span>
          <span><i class="fas fa-shield-halved"></i> Connexions sécurisées</span>
          <span><i class="fas fa-hospital"></i> Pharmacies partenaires vérifiées</span>
        </div>
      </div>

      <!-- Colonne de droite : Images décalées -->
      <div class="hero-imag">
        <div class="dots-background"></div>

        <div class="hero-image-wrapper imag-1 animate-img">
          <img src="../../assets/images/hero/doc4.jfif"
            alt="Consultation médicale au Bénin" />
        </div>

        <div class="hero-image-wrapper imag-2 animate-img">
          <img src="../../assets/images/hero/pharma8.png"
            alt="Pharmacie partenaire BeninSanté" />
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'

export default {
  name: 'HeroSection',
  setup() {
    const heroSubtitle = ref(null)
    const heroTitle = ref(null)
    const heroSection = ref(null)
    let lastParticleTime = 0
    let cleanupCursor = null
    let cleanupScroll = null
    let observer = null

    const openVideo = () => {
      window.open('https://www.youtube.com/embed/VhBl3dHT5SY', '_blank')
    }

    const createCursorTrail = () => {
      const gsap = window.gsap
      if (!gsap) {
        console.warn("GSAP n'est pas détecté pour l'animation du curseur")
        return () => { }
      }

      const createParticle = (e) => {
        const now = Date.now()
        if (now - lastParticleTime < 30) return
        lastParticleTime = now

        const particle = document.createElement('div')
        particle.className = 'cursor-particle'

        const size = Math.random() * 18 + 6
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'
        particle.style.left = (e.clientX - size / 2) + 'px'
        particle.style.top = (e.clientY - size / 2) + 'px'

        document.body.appendChild(particle)

        const destX = (Math.random() - 0.5) * 120
        const destY = (Math.random() - 0.5) * 120

        gsap.to(particle, {
          x: destX,
          y: destY,
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: function () {
            if (particle.parentNode) {
              particle.remove()
            }
          }
        })
      }

      let timeout = null
      const handleMouseMove = (e) => {
        if (timeout) return

        timeout = setTimeout(function () {
          createParticle(e)
          timeout = null
        }, 20)
      }

      document.addEventListener('mousemove', handleMouseMove)

      return function () {
        document.removeEventListener('mousemove', handleMouseMove)
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
      }
    }

    const prepareSubtitle = () => {
      const subtitleEl = heroSubtitle.value
      if (!subtitleEl) return null

      const text = subtitleEl.textContent.trim()
      subtitleEl.textContent = ''

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i)
        const span = document.createElement('span')
        if (char === ' ') {
          span.innerHTML = '&nbsp;'
          span.className = 'subtitle-space'
        } else {
          span.textContent = char
          span.className = 'subtitle-letter'
        }
        subtitleEl.appendChild(span)
      }

      return subtitleEl.querySelectorAll('.subtitle-letter')
    }

    const animateTitleLetters = function () {
      const titleEl = heroTitle.value
      if (!titleEl) {
        console.warn("Élément titre non trouvé")
        return
      }

      const gsap = window.gsap
      if (!gsap) {
        console.warn("GSAP n'est pas détecté pour l'animation du titre")
        return
      }

      var textBrut = titleEl.textContent.trim()
      titleEl.textContent = ""

      for (var i = 0; i < textBrut.length; i++) {
        var char = textBrut.charAt(i)
        var span = document.createElement('span')
        if (char === " ") {
          span.className = "magic-space"
          span.innerHTML = "&nbsp;"
        } else {
          span.textContent = char
          span.className = "magic-letter"
        }
        titleEl.appendChild(span)
      }

      var letterElements = titleEl.querySelectorAll('.magic-letter')
      var subtitleLetters = prepareSubtitle()

      gsap.set(letterElements, {
        y: -400,
        opacity: 0,
        rotation: function () {
          return (Math.random() - 0.5) * 80
        },
        scale: 0.6
      })

      if (subtitleLetters) {
        gsap.set(subtitleLetters, {
          opacity: 0,
          y: 40
        })
      }

      var tl = gsap.timeline({
        defaults: {
          ease: "power2.out"
        }
      })

      tl.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })

      tl.to(letterElements, {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.4,
        ease: "elastic.out(1, 0.6)",
        stagger: {
          each: 0.03,
          from: "random"
        }
      }, "-=0.3")

      if (subtitleLetters) {
        tl.to(
          subtitleLetters,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.03
          },
          "+=0.3"
        )
      }

      tl.to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.5")

      tl.to('.hero-trust', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")

      tl.fromTo('.animate-img',
        {
          opacity: 0,
          scale: 0.5,
          rotationY: 45,
          z: -300
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 1.6,
          ease: "elastic.out(1, 0.75)",
          stagger: 0.2
        },
        "-=1"
      )

      gsap.to('.dots-background', {
        y: 30,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })

      tl.eventCallback("onComplete", function () {
        var elements = document.querySelectorAll('.animate-target, .hero-buttons, .hero-trust, .btn-readmore, .btn-video')
        for (var k = 0; k < elements.length; k++) {
          if (elements[k]) {
            elements[k].style.opacity = '1'
            elements[k].style.visibility = 'visible'
          }
        }

        var letters = document.querySelectorAll('.magic-letter')
        for (var l = 0; l < letters.length; l++) {
          letters[l].style.opacity = '1'
        }
      })
    }

    const setupScrollAnimations = function () {
      var gsap = window.gsap
      if (!gsap) return function () { }

      var animateElements = document.querySelectorAll('.animate-img, .hero-image-wrapper')

      observer = new IntersectionObserver(function (entries) {
        for (var m = 0; m < entries.length; m++) {
          var entry = entries[m]
          var target = entry.target

          if (entry.isIntersecting) {
            gsap.to(target, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "back.out(1.7)",
              clearProps: "opacity,transform",
              overwrite: 'auto'
            })
          } else {
            gsap.to(target, {
              opacity: 0.3,
              y: -30,
              scale: 0.95,
              duration: 0.4,
              ease: "power2.in",
              clearProps: "opacity,transform",
              overwrite: 'auto'
            })
          }
        }
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      })

      for (var n = 0; n < animateElements.length; n++) {
        if (animateElements[n]) {
          observer.observe(animateElements[n])
        }
      }

      return function () {
        if (observer) {
          observer.disconnect()
        }
      }
    }

    const addParticleStyles = function () {
      if (document.getElementById('cursor-particle-styles')) return

      var style = document.createElement('style')
      style.id = 'cursor-particle-styles'
      style.textContent = `
        .cursor-particle {
          position: fixed;
          pointer-events: none;
          border-radius: 80%;
          background: radial-gradient(circle, #25D7B0 0%, #0CCDFE 70%);
          z-index: 9999;
          will-change: transform, opacity;
        }
        
        .hero-buttons,
        .hero-trust,
        .btn-readmore, 
        .btn-video, 
        .hero-badge {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `
      document.head.appendChild(style)
    }

    onMounted(function () {
      nextTick(function () {
        addParticleStyles()
        cleanupCursor = createCursorTrail()
        animateTitleLetters()
        cleanupScroll = setupScrollAnimations()

        return function () {
          if (cleanupCursor) cleanupCursor()
          if (cleanupScroll) cleanupScroll()

          var particles = document.querySelectorAll('.cursor-particle')
          for (var p = 0; p < particles.length; p++) {
            particles[p].remove()
          }
        }
      })
    })

    onBeforeUnmount(function () {
      if (cleanupCursor) cleanupCursor()
      if (cleanupScroll) cleanupScroll()

      var particles = document.querySelectorAll('.cursor-particle')
      for (var p = 0; p < particles.length; p++) {
        particles[p].remove()
      }

      var styles = document.getElementById('cursor-particle-styles')
      if (styles) styles.remove()
    })

    return {
      heroTitle,
      heroSubtitle,
      heroSection,
      openVideo
    }
  }
}
</script>

<style scoped>
/* ============================================================
   1. SECTION PRINCIPALE
   ============================================================ */
.hero-section {
  position: relative;
  background-image: url('../../assets/images/hero/sombre_bg_hero.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 50px 0;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  perspective: 1200px;
}

/* Formes décoratives - regroupées */
.hero-section::before,
.hero-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.hero-section::before {
  bottom: 0;
  left: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(37, 215, 176, 0.15) 0%, transparent 70%);
}

.hero-section::after {
  bottom: 50px;
  right: 0;
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, rgba(12, 205, 254, 0.1) 0%, transparent 60%);
}

/* ============================================================
   2. CONTENEURS
   ============================================================ */
.hero-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-content {
  flex: 1;
  max-width: 50%;
}



/* ============================================================
   3. FOND POINTILLÉ
   ============================================================ */
.dots-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px);
  background-size: 25px 25px;
  pointer-events: none;
  z-index: 0;
  border-radius: 50px;
}

/* ============================================================
   4. ANIMATION - ÉTATS INITIAUX
   ============================================================ */
.hero-badge,
.hero-buttons,
.hero-trust {
  opacity: 0;
  transform: translateY(30px);
  margin-bottom: 2rem;
}

/* ============================================================
   5. BADGE
   ============================================================ */
.hero-badge span {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary-blue);
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 20px;
  border-radius: 50px;
  margin-bottom: 25px;
}

/* ============================================================
   6. TITRE
   ============================================================ */
.hero-tile {
  font-size: clamp(2.3rem, 5vw, 1.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: #fbfdff;
  max-width: 900px;
  margin: 0 auto;
  letter-spacing: -1px;
}

.hero-tile span {
  color: #0d9488;
}

.hero-tile .magic-letter {
  display: inline-block;
  white-space: pre;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  color: var(--white);
}

.hero-tile .magic-space {
  display: inline-block;
}

/* ============================================================
   7. SOUS-TITRE & DESCRIPTION
   ============================================================ */
.hero-subtitle {
  opacity: 1;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  line-height: 1.8;
  font-size: 18px;
  margin-bottom: 15px;
  margin-top: 2rem;
}

.hero-subtitle .subtitle-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(40px);
  will-change: transform, opacity;
}

.hero-subtitle .subtitle-space {
  display: inline-block;
}

.hero-description {
  color: white;
  font-size: clamp(0.9rem, 2vw, 0.5rem);
  line-height: 1.6;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 0rem;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

/* ============================================================
   8. BOUTONS
   ============================================================ */
.hero-buttons {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 25px;
}

/* Styles communs aux deux boutons */
.btn-readmore,
.btn-video {
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-readmore {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  padding: 12px 30px;
  border: 2px solid var(--primary-blue);
  border-radius: 50px;
}

.btn-readmore i {
  font-size: 18px;
  transition: transform 0.3s ease;
  color: var(--primary-blue);
}

.btn-readmore:hover {
  background: var(--primary-blue);
  color: #0F172A;
}

.btn-readmore:hover i {
  transform: translateX(5px);
  color: #0F172A;
}

.btn-video {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
  color: var(--white);
}

.btn-video i {
  font-size: 28px;
  color: var(--primary-green);
  transition: transform 0.3s ease;
}

.btn-video:hover {
  color: var(--dark-navy);
}

.btn-video:hover i {
  transform: scale(1.1);
}

/* ============================================================
   9. BANDEAU DE CONFIANCE
   ============================================================ */
.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin-top: 30px;
}

.hero-trust span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
}

.hero-trust i {
  color: var(--primary-green);
  font-size: 15px;
}

/* ============================================================
   10. IMAGES
   ============================================================ */
.hero-imag {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  position: relative;
  align-items: center;
  transform-style: preserve-3d;
  min-height: 600px;
  margin-top: 4rem;
}

.hero-image-wrapper {
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  transition: transform 0.5s ease;
  z-index: 2;
  will-change: transform;
}

.hero-image-wrapper:hover {
  transform: translateY(-10px) !important;
}

.hero-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hero-image-wrapper:hover img {
  transform: scale(1.05);
}

/* Dimensions des images - regroupées */
.imag-1,
.imag-2 {
  width: 280px;
  height: 520px;
}

.imag-1 {
  margin-top: 80px;
  margin-bottom: 0;
}

.imag-2 {
  margin-top: 0;
  margin-bottom: 60px;
}

/* ============================================================
   11. RESPONSIVE
   ============================================================ */

/* Tablettes */
@media (max-width: 992px) {
  .hero-section {
    padding: 70px 0;
    min-height: auto;
  }

  .hero-container {
    flex-direction: column;
    text-align: center;
    gap: 50px;
  }

  .hero-content {
    max-width: 100%;
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-imag {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    min-height: auto;
  }

  .imag-1,
  .imag-2 {
    width: 280px;
    height: 500px;
  }

  .imag-1 {
    margin-top: 30px;
  }

  .imag-2 {
    margin-bottom: 30px;
  }
}

/* Mobiles */
@media (max-width: 768px) {
  .hero-section {
    padding: 50px 0;
  }

  .hero-container {
    padding: 0 20px;
    gap: 40px;
  }

  .hero-badge span {
    font-size: 12px;
    padding: 6px 15px;
    margin-bottom: 15px;
  }

  .hero-tile {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .hero-subtitle {
    font-size: 15px;
    margin-bottom: 25px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn-readmore,
  .btn-video {
    width: 100%;
    justify-content: center;
  }

  .hero-trust {
    justify-content: center;
    gap: 10px 20px;
  }

  .hero-imag {
    width: 70%;
    margin: 0 auto;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    align-items: center;
  }

  .hero-image-wrapper {
    width: 45%;
    max-width: 160px;
  }

  .imag-1,
  .imag-2 {
    width: 300px;
    height: 320px;
  }

  .imag-1 {
    margin-top: 100px;
    margin-bottom: 0;
  }

  .imag-2 {
    margin-top: 0;
    margin-bottom: 100px;
  }

  .dots-background {
    background-size: 15px 15px;
  }

  .hero-section::before {
    width: 150px;
    height: 150px;
  }

  .hero-section::after {
    width: 180px;
    height: 180px;
  }
}

/* Très petits mobiles */
@media (max-width: 480px) {
  .hero-imag {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    align-items: center;
    min-height: auto;
  }

  .hero-image-wrapper {
    width: 44%;
    max-width: 140px;
  }

  .imag-1,
  .imag-2 {
    width: 200px;
    height: 320px;
  }

  .imag-1 {
    margin-top: 80px;
    margin-bottom: 0;
  }

  .imag-2 {
    margin-top: 0;
    margin-bottom: 80px;
  }

  .hero-tile {
    font-size: 24px;
    width: 100%;
    max-width: 550px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .btn-readmore,
  .btn-video {
    font-size: 14px;
    padding: 10px 20px;
  }

  .btn-video i {
    font-size: 20px;
  }
}
</style>