<!-- src/components/ServicesSection.vue -->
<template>
  <section class="services-section">
    <div class="container">
      <!-- En-tête -->
      <div class="services-header" data-aos="fade-up">
        <span class="services-badge">Nos Services</span>
        <h2 class="services-title">Des services <span class="highlight">adaptés</span> à vos besoins</h2>
        <p class="services-subtitle">BéninSanté vous propose une gamme complète de services pour faciliter votre parcours de santé</p>
      </div>

      <!-- Grille des services -->
      <div class="services-grid">
        <!-- Service 1 : Dossier Médical -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="100">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M53.0147 8.27775C51.5254 6.79629 49.5579 5.98633 47.4671 5.98633H47.4594C45.3686 5.98633 43.3934 6.80431 41.9195 8.28581L39.9673 10.2303L38.0228 8.29349C36.5417 6.80398 34.5665 5.98633 32.4752 5.98633H32.4676C30.3767 5.98633 28.4092 6.79661 26.9353 8.27775C25.4616 9.7281 24.6435 11.6956 24.6282 13.8177C24.6282 15.9008 25.4462 17.8683 26.9353 19.3729L32.5371 24.9747C33.6635 21.8111 36.6881 19.5427 40.222 19.5427C43.6245 19.5427 46.541 21.6335 47.7682 24.5965L52.9996 19.3652C54.4888 17.8682 55.3067 15.9007 55.3067 13.8099C55.291 11.7033 54.473 9.73616 53.0146 8.27766L53.0147 8.27775Z" fill="#0CCDFE"/>
              <path d="M18.3861 44.2785V42.2593C18.3861 41.1152 19.0379 40.0729 20.047 39.6052C23.4997 38.0033 25.7659 34.5173 25.8204 30.7239C25.8372 29.5458 25.1038 28.5188 24.0655 28.1784V21.5567C24.0655 19.669 22.5298 18.1329 20.6425 18.1329L19.878 18.1325V18.1296C19.878 17.7036 19.5328 17.3581 19.1065 17.3581C18.6801 17.3581 18.335 17.7036 18.335 18.1296V19.6788C18.335 20.1048 18.6801 20.4503 19.1065 20.4503C19.5328 20.4503 19.878 20.1048 19.878 19.6788V19.6759H20.6421C21.6789 19.6759 22.5222 20.5195 22.5222 21.5566V28.1809C22.2038 28.283 21.9036 28.4419 21.6453 28.6644C21.0868 29.1453 20.7665 29.8432 20.7665 30.5799C20.7665 32.3649 19.786 34.0103 18.209 34.8729C16.5412 35.7853 14.551 35.6484 12.7503 34.4941C11.5861 33.749 10.9395 32.3421 10.9764 30.6355C10.9918 29.9204 10.7026 29.2294 10.1826 28.7397C9.90661 28.4802 9.57576 28.2951 9.2211 28.1812V21.5566C9.2211 20.5194 10.0647 19.6758 11.1019 19.6758H11.8832V19.6787C11.8832 20.1047 12.2287 20.4502 12.6547 20.4502C13.0807 20.4502 13.4262 20.1047 13.4262 19.6787V18.1295C13.4262 17.7035 13.0807 17.358 12.6547 17.358C12.2287 17.358 11.8832 17.7035 11.8832 18.1295V18.1325H11.1015C9.21379 18.1325 7.67771 19.6685 7.67771 21.5562V28.1828C6.6442 28.5275 5.906 29.5468 5.92314 30.7301C5.97987 34.5206 8.24605 38.0044 11.6965 39.6052C12.7056 40.0733 13.3577 41.1153 13.3577 42.2593V44.2785C13.3577 45.6648 14.4853 46.7924 15.8716 46.7924C17.258 46.7928 18.3859 45.6652 18.3859 44.2785L18.3861 44.2785Z" fill="#0CCDFE"/>
              <path d="M39.4968 35.8153V46.023C39.4968 50.2666 36.04 53.7234 31.7964 53.7234H24.3431C20.8479 53.7234 17.8926 51.3778 16.9591 48.1835C16.6118 48.2837 16.2491 48.3379 15.871 48.3379C15.7089 48.3379 15.5471 48.3302 15.385 48.3072C16.4035 52.3041 20.0377 55.2667 24.3432 55.2667H31.7965C36.8965 55.2667 41.0401 51.1157 41.0401 46.023V35.8069C40.77 35.8299 40.4999 35.8453 40.2221 35.8453C39.9751 35.8453 39.7361 35.8376 39.4967 35.8146L39.4968 35.8153Z" fill="#0CCDFE"/>
              <path d="M40.2238 26.1405C39.3663 26.1405 38.6694 26.8377 38.6694 27.6952C38.6694 28.5524 39.3663 29.2496 40.2238 29.2496C41.0813 29.2496 41.7781 28.5524 41.7781 27.6952C41.7781 26.8381 41.0813 26.1405 40.2238 26.1405Z" fill="#0CCDFE"/>
              <path d="M40.2239 21.0868C36.5791 21.0868 33.6143 24.0517 33.6143 27.6961C33.6143 31.3405 36.5791 34.3054 40.2239 34.3054C43.8677 34.3054 46.8329 31.3405 46.8329 27.6961C46.8329 24.0517 43.8677 21.0868 40.2239 21.0868ZM40.2239 30.7942C38.5159 30.7942 37.1263 29.4049 37.1263 27.6966C37.1263 25.9886 38.5156 24.5986 40.2239 24.5986C41.9319 24.5986 43.3216 25.9882 43.3216 27.6966C43.3216 29.4046 41.9319 30.7942 40.2239 30.7942Z" fill="#0CCDFE"/>
            </svg>
          </div>
          <h3 class="service-title">Dossier Médical</h3>
          <p class="service-description">Accédez à vos informations de santé en toute sécurité, où que vous soyez au Bénin.</p>
          <a href="/dossier-medical" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>

        <!-- Service 2 : Rendez-vous -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="200">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
              <path d="M28.5925 53.6692C15.4792 53.6692 4.80957 42.9996 4.80957 29.8839C4.80957 16.7695 15.4787 6.09985 28.5925 6.09985C41.7069 6.09985 52.3777 16.7694 52.3777 29.8839C52.3777 30.4278 51.9373 30.8682 51.3934 30.8682C50.8496 30.8682 50.4092 30.4278 50.4092 29.8839C50.4092 17.8548 40.6232 8.06877 28.594 8.06877C16.566 8.06877 6.78004 17.8548 6.78004 29.8839C6.78004 41.9131 16.5656 51.6991 28.594 51.6991C29.1379 51.6991 29.5783 52.1399 29.5783 52.6834C29.5783 53.2272 29.1379 53.6681 28.5936 53.6681L28.5925 53.6692Z" fill="#25D7B0"/>
              <path d="M55.7635 42.9586H51.3554V38.5504C51.3554 38.1874 51.0615 37.8939 50.6989 37.8939H44.882C44.5199 37.8939 44.2255 37.1874 44.2255 38.5504V42.9586H39.8174C39.4553 42.9586 39.1609 43.252 39.1609 43.6151V49.4319C39.1609 49.795 39.4548 50.0884 39.8174 50.0884H44.2255V54.4966C44.2255 54.8596 44.5194 55.1531 44.882 55.1531H50.6989C51.061 55.1531 51.3554 54.8596 51.3554 54.4966V50.0884H55.7635C56.1257 50.0884 56.42 49.795 56.42 49.4319V43.6151C56.4196 43.2525 56.1257 42.9586 55.7635 42.9586Z" fill="#25D7B0"/>
            </svg>
          </div>
          <h3 class="service-title">Prise de Rendez-vous</h3>
          <p class="service-description">Planifiez vos consultations médicales en ligne en quelques clics, où que vous soyez.</p>
          <a href="/rendez-vous" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>

        <!-- Service 3 : Ordonnances -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="300">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
              <path d="M23.9018 17.311C23.4301 18.1355 22.7998 18.8315 22.0608 19.341C22.7997 19.8509 23.4297 20.5456 23.9018 21.3713C24.3735 20.5464 25.0038 19.8508 25.7424 19.341C25.0038 18.8315 24.3735 18.1355 23.9018 17.311Z" fill="#25D7B0"/>
              <path d="M38.4674 23.3629C37.8008 24.7016 36.8129 25.8021 35.6245 26.5223C36.8121 27.2429 37.8008 28.3426 38.4674 29.6821C39.1339 28.3426 40.1226 27.2429 41.3102 26.5223C40.1226 25.802 39.1339 24.7016 38.4674 23.3629Z" fill="#25D7B0"/>
              <path d="M46.5675 13.0838C47.2516 11.5495 48.2836 10.2577 49.5368 9.33261C48.6833 7.50709 47.3606 6.39753 45.792 5.8009C44.9763 7.04578 43.9093 8.05872 42.676 8.73364C44.3499 9.64917 45.7216 11.1855 46.5675 13.0838Z" fill="#25D7B0"/>
              <path d="M47.4962 17.5188C47.4962 18.0315 47.0806 18.4471 46.5679 18.4471C46.0553 18.4471 45.6397 18.0315 45.6397 17.5188C45.6397 13.1857 42.7029 9.66165 39.0925 9.66165C38.5799 9.66165 38.1643 9.24605 38.1643 8.7334C38.1643 8.22075 38.5799 7.80514 39.0925 7.80514C40.9701 7.80514 42.6612 6.84627 43.8563 5.32141C39.6087 4.76621 34.4227 6.84504 31.6865 8.55001C33.5025 9.80161 35.5944 11.0882 37.4811 11.058H37.4903C37.9508 11.058 38.3267 11.4286 38.3314 11.8908C38.3358 12.3549 37.9632 12.7351 37.499 12.7399C37.4795 12.7403 37.4597 12.7403 37.4398 12.7403C34.7167 12.7403 32.0107 10.8373 29.8328 9.30612C29.1396 8.81933 28.485 8.35838 27.9317 8.03467C27.9146 8.02433 27.9011 8.012 27.8856 8.00087C22.085 4.84231 9.47058 1.48715 9.95419 15.6429C10.6764 36.8303 18.2551 28.6791 16.1669 42.094C15.439 46.7659 19.8902 55.6973 23.4605 55.6973C27.0302 55.6973 15.7744 36.4709 30.2573 36.4943C44.7403 36.4712 33.4851 55.6973 37.0542 55.6973C40.6244 55.6973 45.0764 46.7663 44.3486 42.094C42.2594 28.6791 49.8374 36.8308 50.5613 15.6429C50.6205 13.9029 50.4754 12.4381 50.1759 11.1941C48.5548 12.6258 47.4966 14.9239 47.4966 17.5189L47.4962 17.5188Z" fill="#25D7B0"/>
            </svg>
          </div>
          <h3 class="service-title">Ordonnances</h3>
          <p class="service-description">Retrouvez toutes vos ordonnances numériques, sécurisées et accessibles à tout moment.</p>
          <a href="/ordonnances" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>

        <!-- Service 4 : Analyses -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="400">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M30.6961 51.9355C30.6961 51.9355 4.77588 35.4706 4.77588 24.5486C4.77588 7.59514 24.1751 3.19319 30.6961 14.1152C37.0538 3.19319 56.4534 7.59456 56.4534 24.5486C56.4534 35.4706 30.6961 51.9355 30.6961 51.9355Z" fill="#0CCDFE"/>
            </svg>
          </div>
          <h3 class="service-title">Résultats d'Analyses</h3>
          <p class="service-description">Consultez vos résultats d'analyses en ligne, rapidement et en toute confidentialité.</p>
          <a href="/analyses" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>

        <!-- Service 5 : Urgences et Alertes -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="500">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5Z" fill="#25D7B0" opacity="0.2"/>
              <path d="M30 10C18.5 10 9 19.5 9 31C9 42.5 18.5 52 30 52C41.5 52 51 42.5 51 31C51 19.5 41.5 10 30 10Z" fill="none" stroke="#25D7B0" stroke-width="3"/>
              <path d="M28 18H32V34H28V18Z" fill="#25D7B0"/>
              <path d="M28 38H32V42H28V38Z" fill="#25D7B0"/>
              <circle cx="30" cy="40" r="3" fill="#25D7B0"/>
              <path d="M16 31L20 27L24 31L20 35L16 31Z" fill="#25D7B0"/>
              <path d="M36 31L40 27L44 31L40 35L36 31Z" fill="#25D7B0"/>
            </svg>
          </div>
          <h3 class="service-title">Urgences & Alertes</h3>
          <p class="service-description">Recevez des alertes en cas d'urgence, localisez les services d'urgence et soyez informé en temps réel.</p>
          <a href="/urgences" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>

        <!-- Service 6 : Suivi -->
        <div class="service-card" data-aos="fade-up" data-aos-delay="600">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
              <path d="M28.5925 53.6692C15.4792 53.6692 4.80957 42.9996 4.80957 29.8839C4.80957 16.7695 15.4787 6.09985 28.5925 6.09985C41.7069 6.09985 52.3777 16.7694 52.3777 29.8839C52.3777 30.4278 51.9373 30.8682 51.3934 30.8682C50.8496 30.8682 50.4092 30.4278 50.4092 29.8839C50.4092 17.8548 40.6232 8.06877 28.594 8.06877C16.566 8.06877 6.78004 17.8548 6.78004 29.8839C6.78004 41.9131 16.5656 51.6991 28.594 51.6991C29.1379 51.6991 29.5783 52.1399 29.5783 52.6834C29.5783 53.2272 29.1379 53.6681 28.5936 53.6681L28.5925 53.6692Z" fill="#0CCDFE"/>
              <path d="M42.0187 28.8304C41.9765 28.2883 41.9115 27.7527 41.8067 27.2304C41.7261 26.8289 41.6236 26.4357 41.5082 26.0479C41.3933 25.662 41.2587 25.2852 41.1113 24.9153C40.9877 24.6053 40.8494 24.3041 40.7043 24.0061C40.5532 23.6957 40.3925 23.3917 40.2186 23.096C40.0684 22.8387 39.9192 22.58 39.7525 22.3342C39.5795 22.0787 39.389 21.8366 39.199 21.5944C39.0315 21.381 38.858 21.175 38.6785 20.9722C38.4849 20.7538 38.294 20.5336 38.087 20.3285C37.9067 20.1496 37.713 19.9847 37.5226 19.8154C37.3156 19.6318 37.105 19.4532 36.8871 19.2816C36.6935 19.1291 36.4971 18.9799 36.2952 18.8384C36.0759 18.685 35.8484 18.5445 35.6199 18.404C35.4144 18.2771 35.2129 18.1439 35.0005 18.0286C34.7693 17.9031 34.5281 17.7969 34.2896 17.6852C34.0744 17.584 33.8592 17.4838 33.6372 17.3936C33.3945 17.2952 33.1469 17.2063 32.8974 17.1216C32.6717 17.0457 32.4428 16.9765 32.2116 16.9124C31.9575 16.8415 31.703 16.7705 31.4429 16.7142C31.2067 16.6629 30.965 16.6281 30.7242 16.5901C30.4582 16.548 30.1945 16.499 29.9235 16.4725C29.6754 16.4482 29.4222 16.445 29.1699 16.4345C28.9781 16.4258 28.7895 16.4056 28.5949 16.4056C28.5052 16.4056 28.4178 16.4175 28.3285 16.4194C28.0653 16.4244 27.8043 16.4391 27.5447 16.4592C27.2449 16.483 26.9501 16.5187 26.6562 16.5618C26.381 16.6016 26.105 16.6359 25.8353 16.6922C25.5149 16.7591 25.2026 16.8465 24.8913 16.9358C24.5915 17.0218 24.2985 17.1216 24.0078 17.2274C23.6639 17.3519 23.3265 17.4879 22.9965 17.6394C22.6705 17.7891 22.3482 17.9452 22.0365 18.1197C21.6473 18.3376 21.271 18.5743 20.9071 18.8283C20.5193 19.0994 20.1489 19.3914 19.7919 19.7005C19.2883 20.1363 18.8181 20.6069 18.3831 21.1114C16.4823 23.3212 15.2935 26.15 15.1483 29.2516C15.1382 29.4622 15.1162 29.6705 15.1162 29.8838C15.1162 30.3558 15.1418 30.8218 15.189 31.281C15.2375 31.7498 15.3126 32.2108 15.4074 32.6646C15.4994 33.1004 15.612 33.5284 15.7448 33.9482C15.8533 34.2902 15.9792 34.6244 16.1138 34.9545C16.2511 35.291 16.4063 35.6178 16.5693 35.9401C16.7089 36.2157 16.8581 36.484 17.0161 36.7486C17.1823 37.0283 17.3521 37.3044 17.5371 37.5694C17.6973 37.7992 17.8653 38.0217 18.0393 38.241C18.2238 38.4731 18.4193 38.6952 18.6189 38.9149C18.796 39.1104 18.9705 39.3068 19.1582 39.4913C19.3582 39.6877 19.5683 39.8731 19.7803 40.0571C19.9694 40.2206 20.163 40.3776 20.3613 40.531C20.576 40.6976 20.7893 40.8665 21.0141 41.0199C21.2137 41.1559 21.4238 41.2758 21.6303 41.4013C21.8574 41.5391 22.0831 41.6778 22.3188 41.8014C22.5294 41.9131 22.7469 42.012 22.9639 42.1132C23.2019 42.2226 23.4423 42.3269 23.6877 42.4235C23.9088 42.511 24.1322 42.5943 24.3583 42.6698C24.6078 42.7527 24.8624 42.8223 25.1183 42.891C25.3499 42.9528 25.5788 43.0201 25.8151 43.07C26.0765 43.1249 26.3447 43.1592 26.6112 43.1986C26.8534 43.2348 27.0942 43.2741 27.3405 43.297C27.6142 43.3227 27.893 43.3304 28.1714 43.3391C28.3124 43.3437 28.4502 43.3602 28.5926 43.3602C28.7093 43.3602 28.8224 43.3456 28.9378 43.3433C29.228 43.3355 29.5173 43.325 29.8025 43.2993C30.0763 43.2751 30.3446 43.2329 30.6138 43.1922C30.921 43.1464 31.2263 43.0965 31.5262 43.0292C31.815 42.9651 32.1003 42.8914 32.3818 42.8086C32.716 42.7106 33.0406 42.5948 33.3629 42.4721C33.6774 42.3521 33.9846 42.2226 34.2863 42.0802C34.6525 41.909 35.0096 41.7231 35.3562 41.5203C35.7119 41.3134 36.0566 41.0923 36.3899 40.8542C36.8275 40.542 37.2423 40.2032 37.6397 39.842C38.1002 39.4226 38.5406 38.9809 38.9399 38.5029C40.7202 36.37 41.8414 33.6772 42.0273 30.734C42.0452 30.4506 42.0708 30.1691 42.0708 29.8806C42.0726 29.5286 42.0466 29.1788 42.0187 28.8304Z" fill="#0CCDFE"/>
            </svg>
          </div>
          <h3 class="service-title">Suivi Médical</h3>
          <p class="service-description">Suivez vos constantes et votre évolution médicale en toute simplicité.</p>
          <a href="/suivi" class="service-link">
            En savoir plus <i class="fas fa-arrow-alt-circle-right"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesSection'
}
</script>

<style scoped>
/* ============================================================
   SECTION PRINCIPALE
   ============================================================ */
.services-section {
  padding: 20px 0 20px;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--white) 100%);
  position: relative;
  overflow: hidden;
}

/* Décoration de fond - regroupées */
.services-section::before,
.services-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.services-section::before {
  top: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(12, 205, 254, 0.05) 0%, transparent 70%);
}

.services-section::after {
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
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
.services-header {
  text-align: center;
  margin-bottom: 50px;
}

.services-badge {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--primary-blue);
  margin-bottom: 15px;
}

.services-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2em;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.services-title .highlight {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services-subtitle {
  font-size: 18px;
  color: var(--text-gray);
  max-width: 600px;
  margin: 0 auto;
  font-style: italic;
}

/* ============================================================
   GRILLE DES SERVICES
   ============================================================ */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* ============================================================
   CARTE DE SERVICE
   ============================================================ */
.service-card {
  background: var(--white);
  border-radius: 20px;
  padding: 40px 30px 35px;
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: var(--transition-card);
  border: 2px solid rgba(12, 205, 254, 0.12);
  box-shadow: 0 4px 20px var(--shadow-card);
  display: flex;
  flex-direction: column;
}

/* Effet de fond au survol */
.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(12, 205, 254, 0.03) 0%, rgba(37, 215, 176, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.service-card:hover::before {
  opacity: 1;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(12, 205, 254, 0.12);
  border-color: var(--primary-blue);
}

/* Ligne décorative en haut */
.service-card::after {
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

.service-card:hover::after {
  width: 80%;
}

/* ============================================================
   ICÔNE
   ============================================================ */
.service-icon {
  margin-bottom: 20px;
  display: inline-block;
  transition: transform var(--transition-card);
}

.service-card:hover .service-icon {
  transform: scale(1.05) rotate(-3deg);
}

.service-icon svg {
  width: 55px;
  height: 55px;
}

/* ============================================================
   TITRE
   ============================================================ */
.service-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 12px;
  transition: color var(--transition-smooth);
}

.service-card:hover .service-title {
  color: var(--primary-blue);
}

/* ============================================================
   DESCRIPTION
   ============================================================ */
.service-description {
  font-size: 16px;
  line-height: 1.7em;
  color: var(--text-gray);
  margin-bottom: 20px;
  flex: 1;
}

/* ============================================================
   LIEN
   ============================================================ */
.service-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-blue);
  text-decoration: none;
  transition: var(--transition-smooth);
  padding-top: 15px;
  border-top: 2px solid rgba(12, 205, 254, 0.10);
}

.service-link i {
  font-size: 14px;
  transition: transform var(--transition-smooth);
}

.service-link:hover {
  color: var(--primary-green);
}

.service-link:hover i {
  transform: translateX(6px);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablette */
@media (max-width: 992px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .services-title {
    font-size: 36px;
  }

  .services-section {
    padding: 60px 0 70px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .services-section {
    padding: 50px 0 60px;
  }

  .container {
    padding: 0 20px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .services-title {
    font-size: 28px;
  }

  .services-subtitle {
    font-size: 16px;
  }

  .service-card {
    padding: 30px 24px 28px;
  }

  .service-title {
    font-size: 20px;
  }

  .service-description {
    font-size: 15px;
  }

  .service-icon svg {
    width: 45px;
    height: 45px;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .services-title {
    font-size: 24px;
  }

  .services-badge {
    font-size: 13px;
  }

  .service-card {
    padding: 24px 18px 24px;
  }

  .service-title {
    font-size: 18px;
  }

  .service-description {
    font-size: 14px;
  }

  .service-link {
    font-size: 14px;
  }

  .service-icon svg {
    width: 38px;
    height: 38px;
  }
}
</style>