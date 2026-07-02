<template>
  <div class="container-fluid py-4 page-patient-overview">

    <!-- L'affichage global s'exécute immédiatement. Chaque bloc gère son propre état d'isLoading via MedSkeleton -->
    <div class="fade-in">

      <!-- ========================================================= -->
      <!-- EN-TÊTE : PROFIL PATIENT & BLOC MÉDICAL D'URGENCE         -->
      <!-- ========================================================= -->
      <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg position-relative overflow-hidden">

        <!-- SKELETON : Chargement du profil -->
        <div v-if="isLoading" class="row align-items-center g-3">
          <div class="col-12 col-md-5 d-flex align-items-center gap-3">
            <MedSkeleton type="circle" size="85px" />
            <div class="flex-grow-1">
              <MedSkeleton type="text" width="35%" class="mb-2" />
              <MedSkeleton type="text" width="65%" class="mb-2" />
              <MedSkeleton type="text" width="50%" />
            </div>
          </div>
          <div class="col-12 col-md-4 border-start-md px-md-4 d-flex flex-column gap-3">
            <div class="d-flex align-items-center gap-3">
              <MedSkeleton type="circle" size="56px" />
              <div class="flex-grow-1">
                <MedSkeleton type="text" width="50%" />
              </div>
            </div>
            <div>
              <MedSkeleton type="text" width="80%" class="mb-1" />
            </div>
            <div>
              <MedSkeleton type="text" width="75%" />
            </div>
          </div>
          <div class="col-12 col-md-3 d-flex flex-column align-items-center justify-content-center">
            <MedSkeleton type="rect" width="110px" height="110px" class="rounded" />
          </div>
        </div>

        <!-- CONTENU CHARGÉ : Profil Patient -->
        <div v-else class="row align-items-center g-3">
          <div class="col-12 col-md-5 d-flex align-items-center gap-3">
            <div class="position-relative">
              <img :src="informations?.photo || '/assets/images/default-avatar.png'"
                class="rounded-circle border border-2 border-white shadow-sm object-fit-cover"
                style="width: 85px; height: 85px" alt="Avatar" />
            </div>
            <div>
              <span class="badge bg-primary-subtle text-primary mb-1 rounded-pill text-xs px-2 py-1 fw-semibold">Espace
                Patient</span>
              <h4 class="mb-1 text-dark fw-bold tracking-tight text-title">
                {{ informations?.nom }}
              </h4>
              <p class="text-xs text-muted mb-0 font-monospace">
                NPI :
                <span class="fw-semibold text-secondary">{{ informations?.npi || "Non renseigné" }}</span>
              </p>
              <p class="text-xs text-muted mb-0">
                {{ informations?.age }} ans &middot; {{ informations?.telephone }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4 border-start-md px-md-4 d-flex flex-column gap-3">
            <div class="d-flex align-items-center gap-3">
              <div
                class="badge bg-danger text-white rounded-circle fs-4 d-flex align-items-center justify-content-center shadow-sm font-monospace"
                style="width: 56px; height: 56px; min-width: 56px; letter-spacing: -1px">
                {{ medicalInfos?.group_sanguin || "?" }}
              </div>
              <div>
                <div class="text-xxs text-uppercase tracking-wider text-muted fw-bold">
                  Groupe Sanguin
                </div>
                <div class="text-xs text-dark fw-semibold">Information d'urgence</div>
              </div>
            </div>

            <div class="med-medical-block">
              <div class="text-xxs text-muted fw-bold text-uppercase mb-1.5 d-flex align-items-center gap-1">
                <i class="pi pi-exclamation-triangle text-danger text-xxs"></i> Allergies déclarées :
              </div>
              <div class="d-flex flex-wrap gap-1" v-if="medicalInfos?.allergies?.length">
                <span v-for="(all, idx) in medicalInfos.allergies" :key="idx"
                  class="badge text-xxs bg-danger-subtle text-danger border border-danger-subtle rounded-sm px-2 py-1 fw-medium">
                  {{ all.libelle }} &middot;
                  <span class="opacity-75 text-lowercase">{{ all.severite }}</span>
                </span>
              </div>
              <span v-else class="text-xs text-muted fst-italic ps-1">Aucune allergie connue</span>
            </div>

            <div class="med-medical-block">
              <div class="text-xxs text-muted fw-bold text-uppercase mb-1.5 d-flex align-items-center gap-1">
                <i class="pi pi-paperclip text-info text-xxs"></i> Antécédents notables :
              </div>
              <div class="d-flex flex-wrap gap-1" v-if="medicalInfos?.antecedents?.length">
                <span v-for="(ant, idx) in medicalInfos.antecedents" :key="idx"
                  class="badge text-xxs border rounded-sm px-2 py-1 fw-medium d-inline-flex flex-column align-items-start gap-0.5 bg-light text-secondary border-light-subtle">
                  {{ ant.maladie }}
                </span>
              </div>
              <span v-else class="text-xs text-muted fst-italic ps-1">Aucun antécédent renseigné</span>
            </div>
          </div>

          <div class="col-12 col-md-3 d-flex flex-column align-items-center justify-content-md-end text-center">
            <MedQrCode :value="qrToken" :loading="isQrLoading" />
            <button @click="handleRefreshQr"
              class="btn btn-link text-xs text-primary mt-2 p-0 decoration-none d-flex align-items-center gap-1"
              :disabled="isQrLoading">
              <i class="pi pi-refresh" :class="{ 'pi-spin': isQrLoading }"></i> Régénérer le code
            </button>
          </div>

          <!-- BOUTON D'ACCÈS GLOBAL : Placé de manière discrète en bas du bloc d'informations -->
          <div class="col-12 border-top mt-3 pt-2 d-flex justify-content-end">
            <button @click="router.push({ name: 'patient-carnet' })"
              class="btn btn-link text-primary text-xs p-0 decoration-none fw-semibold d-flex align-items-center gap-1">
              <i class="pi pi-book text-xs"></i> Consulter mon carnet de santé
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- GRILLE PRINCIPALE (GAUCHE) & PANNEAU LATÉRAL (DROITE)     -->
      <!-- ========================================================= -->
      <div class="row g-4">

        <!-- COLONNE GAUCHE -->
        <div class="col-12 col-lg-8">

          <!-- CONSEIL PRÉVENTION DU JOUR -->
          <div v-if="isLoading" class="card border-0 bg-primary-bg p-3 mb-4 rounded">
            <div class="d-flex align-items-center gap-3">
              <MedSkeleton type="circle" size="24px" />
              <div class="flex-grow-1">
                <MedSkeleton type="text" width="80%" />
              </div>
            </div>
          </div>
          <div v-else-if="annonces?.conseil"
            class="card border-0 bg-primary-bg p-3 mb-4 rounded d-flex flex-row align-items-start gap-3">
            <div class="text-primary fs-4 mt-1">
              <i class="pi pi-sparkles"></i>
            </div>
            <div>
              <h6 class="text-sm fw-bold text-primary-dark mb-1">Conseil Prévention du jour</h6>
              <p class="text-xs text-dark lh-base mb-0">{{ annonces.conseil }}</p>
            </div>
          </div>

          <!-- SUIVI DES CONSTANTES VITALES -->
          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h5 class="mb-0 text-dark fw-bold text-title text-md">Suivi de vos constantes</h5>
                <p class="text-xs text-muted mb-0">
                  Parcourez vos différents enregistrements chronologiques
                </p>
              </div>

              <!-- Contrôles temporels -->
              <div v-if="!isLoading && hasHistory" class="d-flex align-items-center gap-2 border rounded p-1 bg-light">
                <button @click="prevRecord" class="btn btn-sm btn-light border-0"
                  :disabled="activeHistoryIndex >= vitalSigns.historique.length - 1" title="Enregistrement plus ancien">
                  <i class="pi pi-chevron-left text-xs"></i>
                </button>
                <span class="text-xs px-2 font-monospace fw-bold text-secondary">
                  {{ activeRecord?.date }}
                  <span class="badge bg-secondary ms-1 text-xxs py-0-5" style="font-family: var(--body-family)">
                    {{ activeRecord?.source === "medecin" ? "Médical" : "Patient" }}
                  </span>
                </span>
                <button @click="nextRecord" class="btn btn-sm btn-light border-0" :disabled="activeHistoryIndex === 0"
                  title="Enregistrement plus récent">
                  <i class="pi pi-chevron-right text-xs"></i>
                </button>
              </div>
              <div v-else-if="isLoading" class="d-flex align-items-center bg-light border rounded p-1"
                style="height: 34px; width: 180px;">
                <MedSkeleton type="text" width="80%" class="mx-auto" />
              </div>
            </div>

            <!-- SKELETONS CONSTANTES -->
            <div v-if="isLoading" class="row g-2">
              <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1" v-for="i in 5" :key="i">
                <div class="border rounded p-3 text-center h-100 bg-white border-light-subtle">
                  <MedSkeleton type="text" width="45%" class="mx-auto mb-2" />
                  <MedSkeleton type="rect" height="28px" width="70%" class="mx-auto" />
                </div>
              </div>
            </div>

            <!-- CONTENU CHARGÉ AVEC TRANSITION -->
            <div v-else>
              <Transition name="fade-slide" mode="out-in">
                <div class="row g-2" v-if="activeRecord" :key="activeHistoryIndex">
                  <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                    <div class="border rounded p-3 text-center h-100 bg-white border-light-subtle">
                      <div class="text-muted text-xxs text-uppercase fw-medium mb-1">Poids</div>
                      <div class="fs-4 fw-bold font-monospace text-dark mb-1">
                        {{ activeRecord.poids || "—" }}<span class="text-xs text-muted fw-normal ms-1">kg</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                    <div class="border rounded p-3 text-center h-100 bg-white transition-base"
                      :class="getBadgeStatusClass(activeRecord.statuts?.tension_systolique)">
                      <div class="text-xxs text-uppercase fw-medium mb-1">Tension</div>
                      <div class="fs-4 fw-bold font-monospace mb-1">
                        {{ activeRecord.tension_arterielle || "—" }}<span
                          class="text-xs text-muted fw-normal ms-1">mmHg</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                    <div class="border rounded p-3 text-center h-100 bg-white transition-base"
                      :class="getBadgeStatusClass(activeRecord.statuts?.glycemie)">
                      <div class="text-xxs text-uppercase fw-medium mb-1">Glycémie</div>
                      <div class="fs-4 fw-bold font-monospace mb-1">
                        {{ activeRecord.glycemie || "—" }}<span class="text-xs text-muted fw-normal ms-1">g/L</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                    <div class="border rounded p-3 text-center h-100 bg-white transition-base"
                      :class="getBadgeStatusClass(activeRecord.statuts?.temperature)">
                      <div class="text-xxs text-uppercase fw-medium mb-1">Température</div>
                      <div class="fs-4 fw-bold font-monospace mb-1">
                        {{ activeRecord.temperature || "—" }}<span class="text-xs text-muted fw-normal ms-1">°C</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4 col-lg-2.5 flex-grow-1">
                    <div class="border rounded p-3 text-center h-100 bg-white transition-base"
                      :class="getBadgeStatusClass(activeRecord.statuts?.pouls)">
                      <div class="text-xxs text-uppercase fw-medium mb-1">Pouls</div>
                      <div class="fs-4 fw-bold font-monospace mb-1">
                        {{ activeRecord.pouls || "—" }}<span class="text-xs text-muted fw-normal ms-1">bpm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else :key="'empty'">
                  <MedEmptyState icon="pi pi-exclamation-circle" size="sm" title="Historique indisponible"
                    description="Aucun enregistrement chronologique de vos constantes médicales n'a été trouvé."
                    :bordered="true" />
                </div>
              </Transition>
            </div>
          </div>

          <!-- ANALYSES GRAPHIQUES -->
          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
              <h5 class="mb-0 text-dark fw-bold text-title text-md">Analyses & Évolutions</h5>
              <div class="btn-group border rounded p-0-5 bg-light" role="group">
                <button type="button" class="btn btn-sm px-3 rounded-sm border-0 transition-fast"
                  :class="activeGraphTab === 'poids' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted'"
                  @click="activeGraphTab = 'poids'">
                  Poids
                </button>
                <button type="button" class="btn btn-sm px-3 rounded-sm border-0 transition-fast"
                  :class="activeGraphTab === 'tension' ? 'bg-white shadow-xs text-primary fw-bold' : 'text-muted'"
                  @click="activeGraphTab = 'tension'">
                  Tension Artérielle
                </button>
              </div>
            </div>

            <div v-if="isLoading" class="w-100 d-flex justify-content-center align-items-center" style="height: 260px">
              <MedSkeleton type="rect" width="100%" height="260px" class="rounded" />
            </div>
            <div v-else-if="formattedGraphData.labels.length > 0" class="w-100">
              <MedGraph :type="'line'" :data="formattedGraphData" :height="260" :showLegend="true" :theme="'medical'" />
            </div>
            <div v-else>
              <MedEmptyState icon="pi pi-exclamation-circle" size="sm" title="Historique indisponible"
                description="Aucune donnée historique suffisante pour générer le graphique." :bordered="true" />
            </div>
          </div>

          <!-- INFORMATIONS DE PRÉVENTION & SANTÉ -->
          <div class="mb-2">
            <h5 class="text-dark fw-bold text-title text-md mb-3">
              Informations de Prévention & Santé
            </h5>

            <!-- SKELETON PREV -->
            <div v-if="isLoading">
              <div class="card border-0 shadow-sm bg-white overflow-hidden mb-3 rounded-lg p-4">
                <div class="row g-3">
                  <div class="col-md-4">
                    <MedSkeleton type="rect" height="130px" class="rounded" />
                  </div>
                  <div class="col-md-8">
                    <MedSkeleton type="text" width="25%" class="mb-2" />
                    <MedSkeleton type="text" width="75%" class="mb-2" />
                    <MedSkeleton type="text" width="90%" />
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="annonces?.mainAnnonce || annonces?.autresAnnonces?.length">
              <!-- Annonce Principale -->
              <div v-if="annonces?.mainAnnonce"
                class="card border-0 shadow-sm bg-white overflow-hidden mb-3 rounded-lg">
                <div class="row g-0">
                  <div class="col-md-4 bg-light" style="min-height: 160px">
                    <img :src="annonces.mainAnnonce.imageUrl" class="img-fluid w-100 h-100 object-fit-cover"
                      alt="Couverture" />
                  </div>
                  <div class="col-md-8 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <span class="badge bg-info-subtle text-info text-xxs mb-2 border border-info-subtle rounded-sm">
                        {{ annonces.mainAnnonce.categorie }}
                      </span>
                      <h6 class="fw-bold text-dark text-base mb-2">
                        {{ annonces.mainAnnonce.title }}
                      </h6>
                      <p class="text-xs text-muted text-truncate-3 lh-relaxed">
                        {{ annonces.mainAnnonce.description }}
                      </p>
                    </div>
                    <button class="btn btn-link text-primary text-xs text-start p-0 decoration-none fw-medium mt-2"
                      @click="redirecttoArticle(annonces.mainAnnonce.id)">
                      Lire l'article complet <i class="pi pi-arrow-right ms-1 text-xxs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Autres Annonces -->
              <div class="row g-3" v-if="annonces?.autresAnnonces?.length">
                <div class="col-12 col-md-6" v-for="annonce in annonces.autresAnnonces" :key="annonce.id">
                  <div
                    class="card border-light shadow-xs bg-white h-100 p-3 rounded d-flex flex-column justify-content-between">
                    <div>
                      <span class="text-xxs fw-bold text-secondary text-uppercase tracking-wider mb-1 d-block">
                        {{ annonce.categorie }}
                      </span>
                      <h6 class="text-sm fw-bold text-dark text-truncate-2 mb-2">
                        {{ annonce.title }}
                      </h6>
                      <p class="text-xs text-muted text-truncate-2 mb-0 lh-base">
                        {{ annonce.content }}
                      </p>
                    </div>
                    <div class="border-top mt-3 pt-2 text-start">
                      <span class="text-primary text-xs cursor-pointer fw-medium"
                        @click="redirecttoArticle(annonce.id)">Consulter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- BLOC V-ELSE STRUCTURÉ : Aux couleurs de Benin Sante avec CTA (En l'absence de données) -->
            <div v-else class="card border-0 bg-primary-bg p-4 rounded-lg text-center">
              <div class="text-primary fs-3 mb-2">
                <i class="pi pi-heart-fill opacity-75"></i>
              </div>
              <h6 class="fw-bold text-primary-dark text-base mb-1">Espace Conseil & Prévention</h6>
              <p class="text-xs text-dark opacity-75 mb-3 px-2 lh-base max-w-md mx-auto" style="max-width: 480px">
                Votre espace personnalisé est en cours de configuration. Retrouvez très prochainement ici des fiches
                thématiques de sensibilisation adaptées à votre profil médical.
              </p>
              <div>
                <button @click="router.push('/patient/articles')"
                  class="btn btn-sm btn-primary px-3 rounded shadow-xs text-xs">
                  Découvrir les guides de santé <i class="pi pi-arrow-right ms-1 text-xxs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE (PANNEAU LATÉRAL) -->
        <div class="col-12 col-lg-4">

          <!-- BOUTON D'ACTION D'ENREGISTREMENT -->
          <div class="card border-0 bg-secondary-bg p-4 mb-4 rounded-lg shadow-sm text-center">
            <div v-if="isLoading">
              <MedSkeleton type="circle" size="44px" class="mx-auto mb-2" />
              <MedSkeleton type="text" width="60%" class="mx-auto mb-2" />
              <MedSkeleton type="text" width="80%" class="mx-auto" />
            </div>
            <template v-else>
              <div class="d-flex justify-content-center align-items-center">
                <div
                  class="badge bg-secondary text-white rounded-circle fs-4 mb-2 d-inline-flex align-items-center justify-content-center"
                  style="width: 44px; height: 44px">
                  <i class="pi pi-heart"></i>
                </div>
              </div>
              <h6 class="fw-bold text-secondary-dark text-base mb-1">Prenez soin de vous</h6>
              <p class="text-xs text-muted mb-3 px-2 lh-base">
                Renseignez vos constantes du jour pour alimenter votre courbe d'analyse de santé.
              </p>
              <template v-if="!hasRecordedConstantesToday">
                <button class="btn btn-secondary w-100 text-xs py-2 fw-semibold rounded shadow-xs"
                  @click="isConstantesModalOpen = true">
                  <i class="pi pi-plus me-1 text-xxs"></i> Enregistrer mes constantes
                </button>
              </template>
              <template v-else>
                <div class="text-xs text-muted fw-semibold">
                  Vous avez déjà enregistré vos constantes aujourd'hui.
                </div>
              </template>
            </template>
          </div>

          <!-- PROCHAINS RENDEZ-VOUS -->
          <div class="card border-0 shadow-sm p-4 mb-4 bg-white rounded-lg">
            <h5 class="mb-3 text-dark fw-bold text-title text-md">Prochains Rendez-vous</h5>

            <div v-if="isLoading" class="d-flex flex-column gap-3">
              <div class="d-flex gap-3" v-for="i in 2" :key="i">
                <MedSkeleton type="rect" width="50px" height="52px" class="rounded" />
                <div class="flex-grow-1">
                  <MedSkeleton type="text" width="50%" class="mb-2" />
                  <MedSkeleton type="text" width="85%" />
                </div>
              </div>
            </div>
            <div v-else-if="appointments?.length" class="med-appointment-timeline ps-2">
              <div class="d-flex gap-3 mb-3 position-relative med-timeline-item" v-for="rdv in appointments"
                :key="rdv.id">
                <div class="bg-light rounded text-center d-flex flex-column justify-content-center border"
                  style="width: 50px; height: 52px; min-width: 50px">
                  <span class="fs-5 fw-bold font-monospace text-dark lh-1">{{ rdv.date }}</span>
                  <span class="text-xxs text-uppercase text-muted fw-semibold" style="font-size: 0.6rem !important">{{
                    rdv.month
                    }}</span>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center justify-content-between mb-0-5">
                    <h6 class="text-xs fw-bold text-dark mb-0">{{ rdv.doctorName }}</h6>
                    <span class="text-xxs badge bg-light text-secondary font-monospace border">{{ rdv.time }}</span>
                  </div>
                  <p class="text-xxs text-muted mb-0 fw-medium">{{ rdv.speciality }}</p>
                  <p class="text-xxs text-muted mb-0">
                    <i class="pi pi-building text-xxs me-1"></i>{{ rdv.establishment }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <MedEmptyState icon="pi pi-calendar" size="sm" title="Aucun rendez-vous"
                description="Vous n'avez aucun rendez-vous planifié pour le moment." :bordered="false" />
            </div>
          </div>

          <!-- RÉSEAU DE CONFIANCE -->
          <div class="card border-0 shadow-sm p-4 bg-white rounded-lg">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="mb-3 text-dark fw-bold text-title text-md">Réseau de Confiance</h5>
              <button type="button" @click="$router.push('/parametres')"
                class="btn btn-sm btn-light border text-xxs py-1 px-2 rounded d-flex align-items-center gap-1 text-primary fw-semibold">
                <i class="bi bi-plus-lg"></i> Ajouter
              </button>
            </div>

            <div v-if="isLoading" class="d-flex flex-column gap-3 mb-3">
              <div>
                <MedSkeleton type="text" width="40%" class="mb-2" />
                <div class="d-flex align-items-center gap-2">
                  <MedSkeleton type="circle" size="28px" />
                  <div class="flex-grow-1">
                    <MedSkeleton type="text" width="60%" />
                  </div>
                </div>
              </div>
            </div>
            <template v-else>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="text-xxs fw-bold text-muted text-uppercase">Mes Tuteurs (Veillent sur moi)</div>
                </div>

                <div class="d-flex flex-column gap-2" v-if="trusts?.tutores?.length">
                  <div v-for="tuteur in trusts.tutores" :key="tuteur.id"
                    class="d-flex align-items-center justify-content-between p-2 border border-light rounded bg-light-subtle">
                    <div class="d-flex align-items-center gap-2">
                      <img :src="tuteur.photo_url || '/assets/images/default-avatar.png'" class="rounded-circle border"
                        style="width: 28px; height: 28px; object-fit: cover" />
                      <div>
                        <div class="text-xs fw-semibold text-dark">{{ tuteur.nom }}</div>
                        <div class="text-xxs text-muted lh-1">{{ tuteur.relation }}</div>
                      </div>
                    </div>
                    <span class="badge text-xxs"
                      :class="tuteur.status === 'valide' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'">
                      {{ tuteur.status === "valide" ? "Actif" : "En attente" }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-xxs text-muted fst-italic ps-1">Aucun tuteur rattaché</div>
              </div>

              <div>
                <div class="text-xxs fw-bold text-muted text-uppercase mb-2">Mes Protégés (Sous ma garde)</div>
                <div class="d-flex flex-column gap-2" v-if="trusts?.protegees?.length">
                  <div v-for="p in trusts.protegees" :key="p.id"
                    class="d-flex align-items-center justify-content-between p-2 border border-light rounded bg-light-subtle">
                    <div class="d-flex align-items-center gap-2">
                      <img :src="p.photo_url || '/assets/images/default-avatar.png'" class="rounded-circle border"
                        style="width: 28px; height: 28px; object-fit: cover" />
                      <div>
                        <div class="text-xs fw-semibold text-dark">{{ p.nom }}</div>
                        <div class="text-xxs text-muted lh-1">{{ p.relation }}</div>
                      </div>
                    </div>
                    <span class="badge text-xxs bg-success-subtle text-success">Protégé</span>
                  </div>
                </div>
                <div v-else class="text-xxs text-muted fst-italic ps-1">Aucun protégé rattaché</div>
              </div>
            </template>
          </div>
          <!-- ========================================================= -->
          <!-- SECTION NOUVELLE : BANNIÈRE DE SOUSCRIPTION ROLES PRO     -->
          <!-- ========================================================= -->
          <div v-if="!isLoading"
            class="card border-0 shadow-sm p-4 mb-4 bg-gradient-subscription rounded-lg text-white mt-3">
            <div class="row align-items-center g-3">
              <div class="col-12">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span
                    class="badge bg-white text-primary rounded-pill text-xxs px-2 py-1 fw-bold tracking-wider text-uppercase">
                    Opportunité BéninSanté
                  </span>
                </div>
                <h5 class="fw-bold mb-1 text-white">Devenez un Acteur clé de notre réseau de santé</h5>
                <p class="text-xs mb-0 text-white-50 lh-base">
                  Vous êtes professionnel de santé, pharmacien ou gestionnaire d'établissement ? Explorez notre
                  concept,
                  soumettez votre demande pour certifier votre profil et commencez à proposer vos services sur la
                  plateforme.
                </p>
              </div>
              <div class="col-12 d-flex justify-content-md-end align-items-center">
                <button @click="router.push({ name: 'patient-subscription-landing' })"
                  class="btn btn-white text-primary fw-bold text-xs px-4 py-2.5 rounded shadow-sm d-inline-flex align-items-center gap-2 transition-base">
                  Rejoindre le réseau <i class="pi pi-arrow-right text-xxs"></i>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <MedPatientConstantesModal v-model="isConstantesModalOpen" :lastRecord="vitalSigns.historique[0]"
      @success="fetchDashboardData" />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import { PatientOverviewService } from "@/api/endpoints/services/patient/overview";
  import MedQrCode from "@/components/common/MedQrCode.vue";
  import MedGraph from "@/components/common/MedGraph.vue";
  import MedEmptyState from "@/components/common/MedEmptyState.vue";
  import MedPatientConstantesModal from "@/components/services/patients/MedPatientConstantesModal.vue";
  import MedSkeleton from "@/components/common/MedSkeleton.vue";
  import { encryptService } from "@/api/endpoints/encrypt";
  import { useUiStore } from "@/router/ui";
  import router from "@/router";

  // --- ÉTATS DES DONNÉES ---
  const informations = ref(null);
  const medicalInfos = ref(null);
  const annonces = ref({ conseil: "", mainAnnonce: null, autresAnnonces: [] });
  const vitalSigns = ref({ historique: [], graphiques: {}, date: null });
  const appointments = ref([]);
  const trusts = ref({ tutores: [], protegees: [] });

  // --- ÉTATS TECHNIQUES ---
  const ui = useUiStore();
  const isLoading = ref(true);
  const qrToken = ref("");
  const isQrLoading = ref(false);
  const activeGraphTab = ref("poids");
  const isConstantesModalOpen = ref(false);

  // --- INDEX DE NAVIGATION CHRONOLOGIQUE DES CONSTANTES ---
  const activeHistoryIndex = ref(0);

  // --- CHARGEMENT INITIAL DES DONNÉES DE LA PAGE ---
  const fetchDashboardData = async () => {
    isLoading.value = true;
    try {
      const [infoRes, medRes, annRes, vitalRes, appRes, trustRes] = await Promise.all([
        PatientOverviewService.informations(),
        PatientOverviewService.medicalInfos(),
        PatientOverviewService.annoncesData(),
        PatientOverviewService.vitalSignData(),
        PatientOverviewService.appointmentsData(),
        PatientOverviewService.trustsData(),
      ]);

      if (infoRes) informations.value = infoRes;
      if (medRes) medicalInfos.value = medRes;
      if (annRes) annonces.value = annRes;
      if (vitalRes) vitalSigns.value = vitalRes;
      if (appRes) appointments.value = appRes;
      if (trustRes) trusts.value = trustRes;

      const response = await PatientOverviewService.gettoken();
      if (response) {
        qrToken.value = response;
      }
    } catch (error) {
      console.error("Erreur globale lors de la récupération du dashboard :", error);
    } finally {
      isLoading.value = false;
      ui.setMainLoading(false);
    }
  };

  // --- GESTION DU QR CODE D'URGENCE ---
  const handleRefreshQr = async () => {
    isQrLoading.value = true;
    try {
      const response = await PatientOverviewService.regenerateToken();
      if (response) {
        qrToken.value = response;
      }
    } catch (error) {
      console.warn("Impossible de régénérer le token d'urgence");
    } finally {
      isQrLoading.value = false;
    }
  }

  // --- CALCULATEURS DYNAMIQUES POUR LA NAVIGATION TEMPORELLE ---
  const hasHistory = computed(() => vitalSigns.value?.historique?.length > 0);

  const activeRecord = computed(() => {
    if (!hasHistory.value) return null;
    return vitalSigns.value.historique[activeHistoryIndex.value];
  });

  const hasRecordedConstantesToday = computed(() => {
    const latest = vitalSigns.value?.historique?.[0]?.date;
    if (!latest) return false;

    const [datePart] = latest.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    if (!day || !month || !year) return false;

    const recordDate = new Date(year, month - 1, day);
    const today = new Date();
    return (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getDate() === today.getDate()
    );
  });

  const nextRecord = () => {
    if (activeHistoryIndex.value > 0) activeHistoryIndex.value--;
  };
  const prevRecord = () => {
    if (activeHistoryIndex.value < vitalSigns.value.historique.length - 1) {
      activeHistoryIndex.value++;
    }
  };

  const formattedGraphData = computed(() => {
    const rawData = vitalSigns.value?.graphiques?.[activeGraphTab.value];
    if (!rawData || !Array.isArray(rawData)) {
      return { labels: [], datasets: [] };
    }

    const labels = rawData.map((item) => item.date);

    if (activeGraphTab.value === "poids") {
      return {
        labels,
        datasets: [
          {
            label: "Évolution du Poids (kg)",
            data: rawData.map((item) => item.valeur),
            borderColor: "#0284c7",
            backgroundColor: "#0284c71a",
            tension: 0.4,
          },
        ],
      };
    } else if (activeGraphTab.value === "tension") {
      return {
        labels,
        datasets: [
          {
            label: "Systolique (max)",
            data: rawData.map((item) => item.systolique),
            borderColor: "#ef4444",
            backgroundColor: "transparent",
            tension: 0.4,
          },
          {
            label: "Diastolique (min)",
            data: rawData.map((item) => item.diastolique),
            borderColor: "#3b82f6",
            backgroundColor: "transparent",
            tension: 0.4,
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  });

  const getBadgeStatusClass = (status) => {
    if (status === "normal") return "bg-success-subtle text-success border-success-subtle";
    if (status === "warning") return "bg-warning-subtle text-warning border-warning-subtle";
    if (status === "danger") return "bg-danger-subtle text-danger border-danger-subtle";
    return "bg-light text-muted";
  };

  const redirecttoArticle = async (id) => {
    const redirectionId = await encryptService.encrypt(id);
    router.push({
      name: "patient-annonce-details",
      params: { id: redirectionId },
    });
  };

  onMounted(() => {
    fetchDashboardData();
  });
</script>

<style scoped>

  /* Alignements & Bordures thématiques */
  .border-start-md {
    @media (min-width: 768px) {
      border-left: 1px solid var(--medical-gray-200, #dee2e6) !important;
    }
  }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Timeline épurée pour les RDV */
  .med-appointment-timeline {
    border-left: 2px dashed var(--medical-gray-200, #e2e8f0);
  }

  .med-timeline-item::before {
    content: "";
    position: absolute;
    left: -13px;
    top: 20px;
    width: 8px;
    height: 8px;
    background-color: var(--medical-primary, #0284c7);
    border-radius: 50%;
  }

  .bg-primary-bg {
    background-color: var(--medical-primary-bg, #f0f9ff) !important;
  }

  .bg-secondary-bg {
    background-color: var(--medical-secondary-bg, #f0fdfa) !important;
  }

  .text-primary-dark {
    color: var(--medical-primary-dark, #0369a1) !important;
  }

  .text-secondary-dark {
    color: var(--medical-secondary-dark, #0f766e) !important;
  }

  .mb-1\.5 {
    margin-bottom: 0.35rem !important;
  }

  .ps-0-5 {
    padding-left: 0.15rem !important;
  }

  /* Thématisation douce pour l'antécédent familial */
  .bg-purple-subtle {
    background-color: #f5f3ff !important;
  }

  .text-purple {
    color: #6d28d9 !important;
  }

  .border-purple-subtle {
    border-color: #ddd6fe !important;
  }

  .med-medical-block {
    min-height: 42px;
  }

  /* Micro utilitaires typographiques */
  .text-xxs {
    font-size: 0.72rem !important;
  }

  .text-xs {
    font-size: 0.82rem !important;
  }

  .text-sm {
    font-size: 0.9rem !important;
  }

  .text-base {
    font-size: 1rem !important;
  }

  .text-md {
    font-size: 1.15rem !important;
  }

  .py-0-5 {
    padding-top: 0.15rem !important;
    padding-bottom: 0.15rem !important;
  }

  .p-0-5 {
    padding: 0.2rem !important;
  }

  .shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  }

  .fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  /* ========================================================= */
  /* ANIMATION : NAVIGATION CHRONOLOGIQUE DES CONSTANTES VITALES*/
  /* ========================================================= */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-8px);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(8px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Thémantisation de la bannière de souscription */
  .bg-gradient-subscription {
    background: linear-gradient(135deg, var(--medical-primary, #0284c7) 0%, #0369a1 100%) !important;
  }

  .btn-white {
    background-color: #ffffff !important;
    color: var(--medical-primary, #0284c7) !important;
    border: 1px solid #ffffff !important;
  }

  .btn-white:hover {
    background-color: #f8fafc !important;
    transform: translateY(-1px);
  }

  .text-white-50 {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .transition-base {
    transition: all 0.2s ease-in-out;
  }
</style>