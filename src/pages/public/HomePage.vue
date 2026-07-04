<template>
  <div class="home-page" ref="homePageRef">
    <AppHeader ref="headerRef" />
    
    <main ref="mainRef">
      <HeroSection ref="heroRef" />
      <ActionCardsSection ref="actionCardsRef" />
      <AboutSection ref="aboutRef" />
      <ServicesSection ref="servicesRef" />
      <SlideSection ref="slideRef" />
      <HowWeWorkSection ref="howWeWorkRef" />
      <ServicesShowcaseSection ref="servicesShowcaseRef" />
      <FaqSection ref="faqRef" />
      <TestimonialsSection ref="testimonialsRef" />
      <BlogSection ref="blogRef" />
      <ContactFormSection ref="contactRef" />
    </main>
    
    <AppFooter ref="footerRef" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMouse } from '@vueuse/core'

import "@/assets/css/home.css";

// Importer les composants
import AppHeader from '@/components/public/AppHeader.vue'
import AppFooter from '@/components/public/AppFooter.vue'
import HeroSection from '@/components/public/HeroSection.vue'
import ActionCardsSection from '@/components/public/ActionCardsSection.vue'
import AboutSection from '@/components/public/AboutSection.vue'
import ServicesSection from '@/components/public/ServicesSection.vue'
import HowWeWorkSection from '@/components/public/HowWeWorkSection.vue'
import SlideSection from '@/components/public/SlideSection.vue'
import FaqSection from '@/components/public/FaqSection.vue'
import TestimonialsSection from '@/components/public/TestimonialsSection.vue'
import BlogSection from '@/components/public/BlogSection.vue'
import ContactFormSection from '@/components/public/ContactFormSection.vue'
import ServicesShowcaseSection from '@/components/public/ServicesShowcaseSection.vue'

// Enregistrer le plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    HeroSection,
    ActionCardsSection,
    AboutSection,
    ServicesSection,
    HowWeWorkSection,
    SlideSection,
    FaqSection,
    TestimonialsSection,
    BlogSection,
    ContactFormSection,
    ServicesShowcaseSection
  },
  setup() {
    // Refs pour les sections
    const homePageRef = ref(null)
    const mainRef = ref(null)
    const headerRef = ref(null)
    const heroRef = ref(null)
    const actionCardsRef = ref(null)
    const aboutRef = ref(null)
    const servicesRef = ref(null)
    const slideRef = ref(null)
    const howWeWorkRef = ref(null)
    const servicesShowcaseRef = ref(null)
    const faqRef = ref(null)
    const testimonialsRef = ref(null)
    const blogRef = ref(null)
    const contactRef = ref(null)
    const footerRef = ref(null)
    
    // Refs pour le curseur
    const cursorContainer = ref(null)
    const cursorBall = ref(null)
    const cursorTrail = ref(null)

    // Curseur magique avec VueUse
    const { x, y } = useMouse({ touch: false })
    
    // Variables pour l'animation du curseur
    let cursorAnimationId = null
    let cleanupFunctions = []

    // --- 1. CURSEUR MAGIQUE ---
    const initMagicCursor = () => {
      const ball = document.getElementById('ball')
      const trail = document.getElementById('cursor-trail')
      
      if (!ball) return

      // Variables pour l'inertie
      let currentX = 0
      let currentY = 0
      let targetX = 0
      let targetY = 0
      let scale = 1
      let targetScale = 1
      let color = '#00b4d8'
      let targetColor = '#F7A582'
      
      // Variables pour la traînée
      let trailPositions = []
      const TRAIL_LENGTH = 8

      // Mise à jour de la position cible
      const updateTarget = () => {
        targetX = x.value
        targetY = y.value
      }

      // Animation d'inertie avec traînée
      const animateCursor = () => {
        // Lissage avec interpolation
        currentX += (targetX - currentX) * 0.15
        currentY += (targetY - currentY) * 0.15
        scale += (targetScale - scale) * 0.1

        // Mettre à jour la position de la balle
        ball.style.transform = `translate(${currentX - 7}px, ${currentY - 7}px) scale(${scale})`
        ball.style.backgroundColor = color
        
        // Mettre à jour la traînée
        if (trail) {
          trailPositions.unshift({ x: currentX, y: currentY })
          if (trailPositions.length > TRAIL_LENGTH) {
            trailPositions.pop()
          }
          
          const trailDots = trail.querySelectorAll('.trail-dot')
          trailDots.forEach((dot, index) => {
            if (index < trailPositions.length) {
              const pos = trailPositions[index]
              const progress = 1 - (index / TRAIL_LENGTH)
              dot.style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px) scale(${progress * 0.6 + 0.4})`
              dot.style.opacity = progress * 0.6
            }
          })
        }

        cursorAnimationId = requestAnimationFrame(animateCursor)
      }

      // Délégation d'événements pour les éléments interactifs
      const handleMouseOver = (e) => {
        const target = e.target.closest('a, button, .cursor-pointer, .interactive, input, textarea, select, .card-item, .service-card, .step-card, .testimonial-card, .blog-card, .faq-item, .nav-menu a, .footer-links a, .social-icon')
        if (target) {
          targetScale = 2.8
          color = targetColor
          if (ball) {
            ball.style.mixBlendMode = 'difference'
          }
        }
      }

      const handleMouseOut = (e) => {
        const target = e.target.closest('a, button, .cursor-pointer, .interactive, input, textarea, select, .card-item, .service-card, .step-card, .testimonial-card, .blog-card, .faq-item, .nav-menu a, .footer-links a, .social-icon')
        if (target) {
          targetScale = 1
          color = '#00b4d8'
          if (ball) {
            ball.style.mixBlendMode = 'normal'
          }
        }
      }

      // Watcher sur la position de la souris
      const stopWatch = watch([x, y], updateTarget)

      // Créer les points de la traînée
      if (trail) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const dot = document.createElement('div')
          dot.className = 'trail-dot'
          trail.appendChild(dot)
        }
      }

      // Démarrer l'animation
      animateCursor()

      // Attacher les listeners
      document.addEventListener('mouseover', handleMouseOver)
      document.addEventListener('mouseout', handleMouseOut)

      // Nettoyage
      return () => {
        stopWatch()
        if (cursorAnimationId) {
          cancelAnimationFrame(cursorAnimationId)
        }
        document.removeEventListener('mouseover', handleMouseOver)
        document.removeEventListener('mouseout', handleMouseOut)
        cleanupFunctions.forEach(fn => fn())
        cleanupFunctions = []
      }
    }

    // --- 2. ANIMATIONS AU SCROLL ---
    const initScrollAnimations = () => {
      if (typeof ScrollTrigger === 'undefined') return

      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
      })

      // Animation des titres avec effet "reveal" par mots
      const titles = document.querySelectorAll('.animate-title')
      titles.forEach(title => {
        const words = title.textContent.split(' ')
        if (words.length > 3) {
          title.innerHTML = words.map(word => 
            `<span class="word" style="display:inline-block;opacity:0;transform:translateY(30px)">${word}</span>`
          ).join(' ')
          
          const wordSpans = title.querySelectorAll('.word')
          gsap.from(wordSpans, {
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.1
          })
        } else {
          gsap.from(title, {
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true
            },
            opacity: 0,
            y: 50,
            duration: 0.9,
            ease: 'power3.out'
          })
        }
      })

      // Animation des textes avec flou
      const texts = document.querySelectorAll('.animate-text')
      texts.forEach(text => {
        gsap.from(text, {
          scrollTrigger: {
            trigger: text,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          },
          opacity: 0,
          y: 30,
          filter: 'blur(4px)',
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.15
        })
      })

      // Animation des images avec parallaxe
      const images = document.querySelectorAll('.animate-img')
      images.forEach(img => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          opacity: 0,
          scale: 0.9,
          rotation: 0.5,
          duration: 1.3,
          ease: 'expo.out'
        })

        gsap.to(img, {
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          },
          y: -30,
          ease: 'none'
        })
      })

      // Animation des cartes avec stagger
      const cardGroups = document.querySelectorAll('.animate-cards')
      cardGroups.forEach(group => {
        const cards = group.querySelectorAll('.card-item, .service-card, .step-card, .testimonial-card, .blog-card, .faq-item')
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true
            },
            opacity: 0,
            y: 70,
            scale: 0.95,
            rotation: 1,
            duration: 0.9,
            stagger: {
              amount: 0.6,
              from: 'start',
              ease: 'power2.out'
            },
            ease: 'power3.out'
          })
        }
      })

      // Animation des sections
      const sections = document.querySelectorAll('.section-animate')
      sections.forEach((section, index) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          },
          opacity: 0,
          y: 60,
          duration: 1,
          delay: index * 0.06,
          ease: 'power3.out'
        })
      })

      // Animation des badges
      const badges = document.querySelectorAll('.animate-badge')
      badges.forEach(badge => {
        gsap.from(badge, {
          scrollTrigger: {
            trigger: badge,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true
          },
          opacity: 0,
          scale: 0.6,
          rotation: -5,
          duration: 0.7,
          ease: 'back.out(1.7)'
        })
      })

      // Animation des boutons
      const buttons = document.querySelectorAll('.animate-btn')
      buttons.forEach(btn => {
        gsap.from(btn, {
          scrollTrigger: {
            trigger: btn,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true
          },
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.7,
          delay: 0.2,
          ease: 'power2.out'
        })
      })

      // Animation des compteurs
      const counters = document.querySelectorAll('.animate-counter')
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 0
        const obj = { value: 0 }
        
        gsap.to(obj, {
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true
          },
          value: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            const val = Math.round(obj.value)
            counter.textContent = val.toLocaleString()
          }
        })
      })

      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 500)
    }

    // --- 3. ANIMATION DE L'HERO ---
    const initHeroAnimation = () => {
      const hero = document.querySelector('.hero-section')
      if (!hero) return

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' }
      })

      const heroBadge = hero.querySelector('.hero-badge')
      const heroTitle = hero.querySelector('.hero-title')
      const heroSubtitle = hero.querySelector('.hero-subtitle')
      const heroText = hero.querySelector('.hero-text')
      const heroButtons = hero.querySelector('.hero-buttons')
      const heroImage = hero.querySelector('.hero-image')
      const heroStats = hero.querySelector('.hero-stats')

      if (heroBadge) {
        tl.from(heroBadge, {
          opacity: 0,
          scale: 0.7,
          rotation: -5,
          duration: 0.7,
          ease: 'back.out(1.7)'
        }, 0.2)
      }

      if (heroTitle) {
        const titleText = heroTitle.textContent
        const words = titleText.split(' ')
        heroTitle.innerHTML = words.map((word, i) => 
          `<span class="hero-word" style="display:inline-block;opacity:0;transform:translateY(60px)">${word}</span>`
        ).join(' ')
        
        const wordSpans = heroTitle.querySelectorAll('.hero-word')
        tl.from(wordSpans, {
          opacity: 0,
          y: 60,
          duration: 1.2,
          stagger: 0.08,
          ease: 'power3.out'
        }, 0.4)
      }

      if (heroSubtitle) {
        tl.from(heroSubtitle, {
          opacity: 0,
          x: -50,
          duration: 0.9,
          ease: 'power3.out'
        }, '-=0.6')
      }

      if (heroText) {
        tl.from(heroText, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4')
      }

      if (heroButtons) {
        tl.from(heroButtons, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.3')
      }

      if (heroImage) {
        tl.from(heroImage, {
          opacity: 0,
          scale: 0.85,
          rotation: 3,
          duration: 1.5,
          ease: 'expo.out'
        }, '-=1')
      }

      if (heroStats) {
        tl.from(heroStats, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.5')
      }
    }

    // --- 4. HEADER ANIMATION ---
    const initHeaderAnimation = () => {
      const header = document.querySelector('.main-header')
      if (!header) return

      gsap.to(header, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top -10px',
          end: 'top -120px',
          scrub: 0.4,
          toggleActions: 'play none none reverse'
        },
        backgroundColor: 'var(--dark-navy)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(10px)',
        paddingTop: '10px',
        paddingBottom: '10px',
        ease: 'none'
      })
    }

    // --- CYCLE DE VIE ---
    let cleanupCursor = null

    onMounted(async () => {
      await nextTick()

      // Initialiser le curseur magique
      cleanupCursor = initMagicCursor()

      await nextTick()
      initHeroAnimation()
      initHeaderAnimation()

      await nextTick()
      setTimeout(() => {
        initScrollAnimations()
      }, 300)

      document.body.classList.add('custom-cursor-active')
    })

    onBeforeUnmount(() => {
      if (cleanupCursor) {
        cleanupCursor()
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        ScrollTrigger.clearMatchMedia()
      }
      document.body.classList.remove('custom-cursor-active')
    })

    return {
      homePageRef,
      mainRef,
      headerRef,
      heroRef,
      actionCardsRef,
      aboutRef,
      servicesRef,
      slideRef,
      howWeWorkRef,
      servicesShowcaseRef,
      faqRef,
      testimonialsRef,
      blogRef,
      contactRef,
      footerRef,
      cursorContainer,
      cursorBall,
      cursorTrail
    }
  }
}
</script>

<style scoped>
/* ============================================================
   HOME PAGE
   ============================================================ */
.home-page {
  width: 100%;
  overflow-x: hidden;
  cursor: default;
}

/* ============================================================
   CURSEUR MAGIQUE
   ============================================================ */
#magic-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 999999;
}

#ball {
  position: fixed;
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  pointer-events: none;
  border: none;
  background: var(--blog-blue);
  transition: background-color var(--transition-smooth);
  will-change: transform, background-color;
  box-shadow: 0 0 30px rgba(0, 180, 216, 0.3);
  mix-blend-mode: normal;
  transform: translate(-50%, -50%);
}

#cursor-trail {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 999998;
}

.trail-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 180, 216, 0.15);
  pointer-events: none;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
  transition: opacity 0.1s ease;
}

/* ============================================================
   CLASSES D'ANIMATION
   ============================================================ */
.section-animate { opacity: 0; }
.animate-title { opacity: 0; }
.animate-title .word { display: inline-block; opacity: 0; transform: translateY(30px); }
.animate-text { opacity: 0; }
.animate-img { opacity: 0; will-change: transform, opacity; }
.animate-cards { opacity: 0; }
.card-item, .service-card, .step-card, .testimonial-card, .blog-card, .faq-item { opacity: 0; }
.animate-badge { opacity: 0; }
.animate-btn { opacity: 0; }
.animate-counter { opacity: 0; }
.hero-word { display: inline-block; opacity: 0; transform: translateY(60px); }

/* ============================================================
   SUPPORT PRÉFÉRENCES MOUVEMENT RÉDUIT
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  #magic-cursor, #cursor-trail { display: none !important; }
  .home-page { cursor: auto !important; }
  .section-animate, .animate-title, .animate-title .word, .animate-text,
  .animate-img, .animate-cards, .card-item, .service-card, .step-card,
  .testimonial-card, .blog-card, .faq-item, .animate-badge, .animate-btn,
  .animate-counter, .hero-word {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}

/* ============================================================
   RESPONSIVE - CURSEUR
   ============================================================ */
@media (max-width: 768px) {
  #ball { width: 10px; height: 10px; }
  .trail-dot { width: 6px; height: 6px; }
}
</style>