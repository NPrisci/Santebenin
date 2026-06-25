import { api } from "@/api/clients/main";
import { formatDate, splitDate } from "@/api/clients/help";

export const PatientOverviewService = {
  informations: async () => {
    try {
      const response = await api("/user/baseinfos");
      const data = response.data;
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
      console.warn("Échec API informations, fallback activé", error);
      return null;
    }
  },

  medicalInfos: async () => {
    try {
      const response = await api("/patient/dashboard/urgences");
      return {
        group_sanguin: response.data.groupe_sanguin,
        allergies: response.data.allergies.map((a) => ({
          libelle: a.libelle,
          type_allergie: a.type_allergie,
          severite: a.severite,
        })),
        antecedents: response.data.antecedents.map((a) => ({
          maladie: a.maladie.nom,
          lien_parente: a.lien_parente,
          est_familiale: a.est_familiale,
        })),
      };
    } catch (error) {
      console.warn("Échec API medicalInfos, fallback activé", error);
      return null;
    }
  },

  annoncesData: async () => {
    try {
      const response = await api("/patient/dashboard/prevention");
      const data = response.data;
      if (!data || data.annonces.length === 0)
        return { conseil: data?.conseil_ia || "", mainAnnonce: null, autresAnnonces: [] };
      return OverviewUtils.formatAnnonceData(data);
    } catch (error) {
      console.warn("Échec API annoncesData, fallback activé", error);
      return null;
    }
  },

  vitalSignData: async () => {
    try {
      const response = await api("/patient/dashboard/constantes");
      const data = response.data;
      if (!data) throw new Error("No data");
      return OverviewUtils.formatVitalSignData(data);
    } catch (error) {
      console.warn("Échec API vitalSignData, fallback activé", error);
      return null;
    }
  },

  appointmentsData: async () => {
    try {
      const response = await api("/patient/dashboard/prochain-rdv");
      const data = response.data;
      if (!data) return [];
      return OverviewUtils.formatAppointmentsData(data);
    } catch (error) {
      console.warn("Échec API appointmentsData, fallback activé", error);
      return null;
    }
  },

  trustsData: async () => {
    try {
      const response = await api("/patient/dashboard/personne-confiance");
      const data = response.data;
      if (!data) throw new Error("No data");
      return OverviewUtils.formatTrustsData(data);
    } catch (error) {
      console.warn("Échec API trustsData, fallback activé", error);
      return null;
    }
  },

  gettoken: async () => {
    try {
      const response = await api("/patient/dashboard/urgences/token", {
        method: "POST",
      });
      if (!response.success) throw new Error("No data");
      const data = response.token;
      return data;
    } catch (error) {
      console.warn("Échec API token, fallback activé", error);
      return null;
    }
  },

  constantes: async (data) => {
    try {
      if (!OverviewUtils.checkData()) {
        return { errors: "Veuillez renseigner au moins une constante" };
      }
      const response = await api("/patient/dashboard/constantes", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.success) throw new Error("No data");
      return {
        mssage: response.message,
        data: response.data,
      };
    } catch (error) {
      console.warn("UNe erreur est survenue lors de la soumission de la requete");
    }
  },
};

const OverviewUtils = {
  formatAnnonceData(data) {
    const conseil = data.conseil_ia;

    //La premiere annonce est considere comme principale, les autres sont des annonces
    const mainAnnonce = {
      id: data.annonces[0].id,
      title: data.annonces[0].titre,
      description: data.annonces[0].description,
      imageUrl: data.annonces[0].image_couverture_url,
      categorie: data.annonces[0].categorie,
    };
    const autresAnnonces = data.annonces.slice(1).map((a) => {
      return {
        id: a.id,
        title: a.titre,
        content: a.description,
        imageUrl: a.image_couverture_url,
        categorie: a.categorie,
      };
    });

    return {
      conseil,
      mainAnnonce,
      autresAnnonces,
    };
  },

  formatVitalSignData(data) {
    const historique = Array.isArray(data.historique)
      ? this.sortHistoriqueByDate(data.historique).map((record) =>
          this.formatHistoriqueRecord(record),
        )
      : [];

    const latest = historique[0] || {};

    return {
      historique,
      graphiques: this.buildGraphData(data, historique),
      poids: {
        value: latest.poids || null,
        status:
          latest.poids == null ? null : this.determineStatus(latest.poids, [60, 80], [50, 90]),
        unit: "kg",
        normalRange: [60, 80],
        warningRange: [50, 90],
      },
      taille: {
        value: latest.taille == null ? null : this.convertFromCmToM(latest.taille),
        unit: "m",
        status: latest.taille == null ? null : "normal",
        normalRange: [1.6, 1.8],
        warningRange: [1.5, 1.9],
      },
      tension_arterielle: {
        value: latest.tension_arterielle || this.buildTensionValue(latest),
        unit: "mmHg",
        status:
          latest.tension_systolique == null
            ? null
            : this.determineStatus(latest.tension_systolique, [60, 80], [50, 90]),
      },
      glycemie: {
        value: latest.glycemie || null,
        status:
          latest.glycemie == null
            ? null
            : this.determineStatus(latest.glycemie, [0.7, 1.0], [0.5, 1.2]),
        unit: "g/L",
      },
      temperature: {
        value: latest.temperature || null,
        status:
          latest.temperature == null
            ? null
            : this.determineStatus(latest.temperature, [36, 37.5], [35, 38]),
        unit: "°C",
      },
      pouls: {
        value: latest.pouls || null,
        status:
          latest.pouls == null ? null : this.determineStatus(latest.pouls, [60, 100], [50, 120]),
        unit: "bpm",
      },
      date: latest.date || null,
    };
  },

  formatHistoriqueRecord(record) {
    return {
      id: record.id,
      source: record.source,
      date: record.date,
      tension_arterielle: record.tension_arterielle || this.buildTensionValue(record),
      poids: record.poids,
      taille: record.taille,
      tension_systolique: record.tension_systolique,
      tension_diastolique: record.tension_diastolique,
      glycemie: record.glycemie,
      temperature: record.temperature,
      pouls: record.pouls,
      saturation_oxygene: record.saturation_oxygene,
      statuts: record.statuts,
      statut_global: record.statut_global,
    };
  },

  buildGraphData(data, historique) {
    const graphs = data.graphiques || {};

    return {
      poids: Array.isArray(graphs.poids)
        ? graphs.poids.map((item) => ({ date: item.date, valeur: item.valeur }))
        : historique
            .filter((item) => item.poids != null)
            .map((item) => ({ date: item.date, valeur: item.poids })),
      tension: Array.isArray(graphs.tension)
        ? graphs.tension.map((item) => ({
            date: item.date,
            systolique: item.systolique,
            diastolique: item.diastolique,
          }))
        : historique
            .filter((item) => item.tension_systolique != null && item.tension_diastolique != null)
            .map((item) => ({
              date: item.date,
              systolique: item.tension_systolique,
              diastolique: item.tension_diastolique,
            })),
      glycemie: Array.isArray(graphs.glycemie)
        ? graphs.glycemie.map((item) => ({ date: item.date, valeur: item.valeur }))
        : historique
            .filter((item) => item.glycemie != null)
            .map((item) => ({ date: item.date, valeur: item.glycemie })),
      temperature: Array.isArray(graphs.temperature)
        ? graphs.temperature.map((item) => ({ date: item.date, valeur: item.valeur }))
        : historique
            .filter((item) => item.temperature != null)
            .map((item) => ({ date: item.date, valeur: item.temperature })),
      pouls: Array.isArray(graphs.pouls)
        ? graphs.pouls.map((item) => ({ date: item.date, valeur: item.valeur }))
        : historique
            .filter((item) => item.pouls != null)
            .map((item) => ({ date: item.date, valeur: item.pouls })),
    };
  },

  buildTensionValue(record) {
    if (record.tension_systolique == null || record.tension_diastolique == null) {
      return null;
    }
    return `${record.tension_systolique}/${record.tension_diastolique}`;
  },

  sortHistoriqueByDate(historique) {
    return [...historique].sort((a, b) => {
      const dateA = this.parseHistoricDate(a.date);
      const dateB = this.parseHistoricDate(b.date);
      if (!dateA || !dateB) return 0;
      return dateB - dateA;
    });
  },

  parseHistoricDate(dateStr) {
    if (!dateStr) return null;
    const [datePart, timePart = "00:00"] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    if (!day || !month || !year) return null;
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours || 0, minutes || 0);
  },

  convertFromCmToM(cm) {
    return cm / 100;
  },

  determineStatus(value, normalRange, warningRange) {
    if (value >= normalRange[0] && value <= normalRange[1]) {
      return "normal";
    } else if (value >= warningRange[0] && value <= warningRange[1]) {
      return "warning";
    } else {
      return "danger";
    }
  },

  formatAppointmentsData(data) {
    data.map((a) => {
      const [mois, jour] = splitDate(a.date_rdv);
      return {
        id: a.id,
        date: jour,
        month: mois,
        time: a.heure,
        doctorName: `Dr. ${a.medecin.nom}`,
        speciality: a.medecin.specialite.nom,
        establishment: a.structure_sante.nom,
        notes: a.note,
      };
    });
  },

  formatTrustsData(data) {
    const tutores = data.filter((t) => t.role === "tuteur");
    const protegees = data.filter((p) => p.role === "protege");
    return {
      tutores: tutores.map((t) => {
        return {
          id: t.id,
          nom: t.nom,
          relation: t.relation,
          photo_url: t.photo_url,
          status: t.status,
        };
      }),
      protegees: protegees.map((p) => {
        return {
          id: p.id,
          nom: p.nom,
          relation: p.relation,
          photo_url: p.photo_url,
          status: p.status,
        };
      }),
    };
  },
};
