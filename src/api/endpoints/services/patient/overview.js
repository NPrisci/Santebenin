import { api } from "@/api/clients/main";
import { splitDate } from "@/api/clients/help";

export const PatientOverviewService = {
  // GET /api/v1/user/baseinfos
  informations: async () => {
    try {
      const response = await api("/user/baseinfos");
      const data = response.data; // Prise en compte du double emballage "data.data"
      if (!data) return null;
      return {
        nom: data.nom,
        photo: data.photo,
        npi: data.npi,
        age: data.age,
        telephone: data.phone,
        roles: data.roles,
        email: data.email,
      };
    } catch (error) {
      console.warn("Échec API informations", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/urgences
  medicalInfos: async () => {
    try {
      const response = await api("/patient/dashboard/urgences");
      const data = response.data;
      if (!data) return null;
      return {
        group_sanguin: data.patient?.groupe_sanguin || "Inconnu",
        allergies: (data.antecedants?.allergies || []).map((a) => ({
          id: a.antecedant_id,
          libelle: a.designation,
          type_allergie: a.type,
          severite: a.notes, // Utilisation de notes ou fallback selon le besoin
        })),
        antecedents: (data.antecedants?.maladies || []).map((m) => ({
          id: m.antecedant_id,
          maladie: m.designation,
          code: m.maladie?.code,
          date_debut: m.date_debut,
        })),
      };
    } catch (error) {
      console.warn("Échec API medicalInfos", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/prevention
  annoncesData: async () => {
    try {
      const response = await api("/patient/dashboard/prevention");
      const data = response.data;
      if (!data) return { conseil: "", mainAnnonce: null, autresAnnonces: [] };
      return OverviewUtils.formatAnnonceData(data);
    } catch (error) {
      console.warn("Échec API annoncesData", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/constantes
  vitalSignData: async () => {
    try {
      const response = await api("/patient/dashboard/constantes");
      const data = response.data;
      if (!data) throw new Error("No data");
      return OverviewUtils.formatVitalSignData(data);
    } catch (error) {
      console.warn("Échec API vitalSignData", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/prochain-rdv
  appointmentsData: async () => {
    try {
      const response = await api("/patient/dashboard/prochain-rdv");
      const data = response.data; 
      if (!data || Array.isArray(data)) return [];
      return OverviewUtils.formatAppointmentsData(data);
    } catch (error) {
      console.warn("Échec API appointmentsData", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/personne-confiance
  trustsData: async () => {
    try {
      const response = await api("/patient/dashboard/personne-confiance");
      const data = response.data; // Extraction de l'arborescence "data.data"
      if (!data) throw new Error("No data");
      return OverviewUtils.formatTrustsData(data);
    } catch (error) {
      console.warn("Échec API trustsData", error);
      return null;
    }
  },

  // GET /api/v1/patient/dashboard/urgences/token -> Récupère le token actuel
  gettoken: async () => {
    try {
      const response = await api("/patient/dashboard/urgences/token");
      return response.token || null;
    } catch (error) {
      console.warn("Échec de récupération du token", error);
      return null;
    }
  },

  // POST /api/v1/patient/dashboard/urgences/token -> Régénère le token
  regenerateToken: async () => {
    try {
      const response = await api("/patient/dashboard/urgences/token", {
        method: "POST",
      });
      return response.token || null;
    } catch (error) {
      console.warn("Échec de régénération du token", error);
      return null;
    }
  },

  // POST /api/v1/patient/dashboard/constantes
  constantes: async (payload) => {
    try {
      const response = await api("/patient/dashboard/constantes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return {
        message: response.message,
        data: response.data?.data,
      };
    } catch (error) {
      throw error;
    }
  },
};

const OverviewUtils = {
  formatAnnonceData(data) {
    const conseil = data.conseil_ia || "";
    const annonces = data.annonces || [];

    if (annonces.length === 0) {
      return { conseil, mainAnnonce: null, autresAnnonces: [] };
    }

    const defaultCategories = [
      { label: "Alerte Sanitaire", value: "alerte" },
      { label: "Information Générale", value: "info" },
      { label: "Protocole", value: "protocole" },
      { label: "Événement", value: "evenement" },
      { label: "Santé", value: "Santé" },
    ];

    const formatCategorie = (categorieValue) => {
      const found = defaultCategories.find((cat) => cat.value.toLowerCase() === categorieValue?.toLowerCase());
      return found ? found.label : "Santé Publique";
    };

    const mainAnnonce = {
      id: annonces[0].id,
      title: annonces[0].titre,
      description: annonces[0].description,
      imageUrl: annonces[0].image_couverture, // Correction du champ image selon ROUTE.md
      categorie: formatCategorie(annonces[0].categorie),
    };

    const autresAnnonces = annonces.slice(1).map((a) => ({
      id: a.id,
      title: a.titre,
      content: a.description,
      imageUrl: a.image_couverture,
      categorie: formatCategorie(a.categorie),
    }));

    return { conseil, mainAnnonce, autresAnnonces };
  },

  formatVitalSignData(data) {
    const historiqueRaw = Array.isArray(data.historique) ? data.historique : [];
    
    const historique = this.sortHistoriqueByDate(historiqueRaw).map((record) => {
      // Extraction adaptative puisque les clés sont maintenant encapsulées dans un objet .mesures
      const m = record.mesures || {};
      
      // Extraction des valeurs pour éviter les répétitions
      const systolique = m.tension?.systolique || null;
      const glycemieVal = m.glycemie?.valeur || null;
      const tempVal = m.temperature?.valeur || null;
      const poulsVal = m.pouls?.valeur || null;
  
      return {
        id: record.id,
        source: record.source,
        date: record.date,
        tension_arterielle: m.tension?.valeur || null,
        poids: m.poids?.valeur || null,
        taille: m.taille?.valeur || null,
        tension_systolique: systolique,
        tension_diastolique: m.tension?.diastolique || null,
        glycemie: glycemieVal,
        temperature: tempVal,
        pouls: poulsVal,
        saturation_oxygene: m.oxygene?.valeur || null,
        statut_global: record.statut_global,
        
        // CORRECTION CRITIQUE : Ajout de l'objet statuts pour chaque ligne de l'historique
        statuts: {
          tension_systolique: systolique == null ? null : this.determineStatus(systolique, [110, 130], [90, 140]),
          glycemie: glycemieVal == null ? null : this.determineStatus(glycemieVal, [0.7, 1.1], [0.5, 1.25]),
          temperature: tempVal == null ? null : this.determineStatus(tempVal, [36.5, 37.5], [35, 38.5]),
          pouls: poulsVal == null ? null : this.determineStatus(poulsVal, [60, 100], [50, 120]),
        }
      };
    });
  
    const latest = historique[0] || {};
  
    return {
      historique,
      graphiques: this.buildGraphData(data, historique),
      poids: {
        value: latest.poids,
        status: latest.poids == null ? null : this.determineStatus(latest.poids, [60, 80], [50, 90]),
        unit: "kg",
      },
      taille: {
        value: latest.taille == null ? null : latest.taille / 100, // Conversion cm en m
        unit: "m",
        status: latest.taille == null ? null : "normal",
      },
      tension_arterielle: {
        value: latest.tension_arterielle,
        unit: "mmHg",
        status: latest.tension_systolique == null ? null : this.determineStatus(latest.tension_systolique, [110, 130], [90, 140]),
      },
      glycemie: {
        value: latest.glycemie,
        status: latest.glycemie == null ? null : this.determineStatus(latest.glycemie, [0.7, 1.1], [0.5, 1.25]),
        unit: "g/L",
      },
      temperature: {
        value: latest.temperature,
        status: latest.temperature == null ? null : this.determineStatus(latest.temperature, [36.5, 37.5], [35, 38.5]),
        unit: "°C",
      },
      pouls: {
        value: latest.pouls,
        status: latest.pouls == null ? null : this.determineStatus(latest.pouls, [60, 100], [50, 120]),
        unit: "bpm",
      },
      date: latest.date || null,
    };
  },

  buildGraphData(data, historique) {
    const graphs = data.graphiques || {};
    return {
      poids: Array.isArray(graphs.poids) ? graphs.poids : historique.filter((i) => i.poids != null).map((i) => ({ date: i.date, valeur: i.poids })),
      tension: Array.isArray(graphs.tension) ? graphs.tension : historique.filter((i) => i.tension_systolique != null).map((i) => ({ date: i.date, systolique: i.tension_systolique, diastolique: i.tension_diastolique })),
      glycemie: Array.isArray(graphs.glycemie) ? graphs.glycemie : historique.filter((i) => i.glycemie != null).map((i) => ({ date: i.date, valeur: i.glycemie })),
      temperature: Array.isArray(graphs.temperature) ? graphs.temperature : historique.filter((i) => i.temperature != null).map((i) => ({ date: i.date, valeur: i.temperature })),
      pouls: Array.isArray(graphs.pouls) ? graphs.pouls : historique.filter((i) => i.pouls != null).map((i) => ({ date: i.date, valeur: i.pouls })),
    };
  },

  determineStatus(value, normalRange, warningRange) {
    if (value >= normalRange[0] && value <= normalRange[1]) return "normal";
    if (value >= warningRange[0] && value <= warningRange[1]) return "warning";
    return "danger";
  },

  sortHistoriqueByDate(historique) {
    return [...historique].sort((a, b) => new Date(b.date_raw || 0) - new Date(a.date_raw || 0)); // Plus performant avec date_raw ISO
  },

  formatAppointmentsData(data) {
    if (!data || !data.date) return [];
    // Découpage de la date (Ex: "2026-07-15 14:30:00")
    const [datePart, timePart] = data.date.split(" ");
    const [mois, jour] = splitDate(datePart); 

    return [{
      id: data.id,
      date: jour,
      month: mois,
      time: timePart ? timePart.substring(0, 5) : "", // "14:30"
      doctorName: `Dr. ${data.professionnel?.nom || ""} ${data.professionnel?.prenom || ""}`,
      speciality: data.professionnel?.specialite?.nom || "Généraliste",
      establishment: data.structure?.nom || "Non spécifié",
      notes: "",
    }];
  },

  formatTrustsData(data) {
    // Les listes arrivent déjà segmentées de l'API (tutores et proteges)
    return {
      tutores: (data.tutores || []).map((t) => ({
        id: t.id,
        nom: t.full_name || `${t.nom} ${t.prenom}`,
        relation: t.relation_status,
        photo_url: t.photo_url,
        status: t.relation_status,
      })),
      protegees: (data.proteges || []).map((p) => ({
        id: p.id,
        nom: p.full_name || `${p.nom} ${p.prenom}`,
        relation: p.relation_status,
        photo_url: p.photo_url,
        status: p.relation_status,
      })),
    };
  },
};