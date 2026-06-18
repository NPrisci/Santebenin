import { api } from "@/api/clients/main";
import { formatDate, splitDate } from "@/api/clients/auth.";

const OverviewService = {
  informations: async () => {
    try {
      const response = await api('/user/baseinfos')
      const data = response.data
      return {
        nom: data.nom,
        photo: data.photo,
        npi: data.npi,
        age: data.age,
        telephone: data.phone,
        roles: data.roles,
        email: data.email,
      }
    } catch (error) {
      console.warn("Échec API informations, fallback activé", error);
      return null;
    }
  },

  medicalInfos: async () => {
    try {
      const response = await api('/patient/dashboard/urgences')
      return {
        group_sanguin: response.data.groupe_sanguin,
        allergies: response.data.allergies.map(a => ({
          libelle: a.libelle,
          type_allergie: a.type_allergie,
          severite: a.severite,
        })),
        antecedents: response.data.antecedents.map(a => ({
          maladie: a.maladie.nom,
          lien_parente: a.lien_parente,
          est_familiale: a.est_familiale,
        })),
      }
    } catch (error) {
      console.warn("Échec API medicalInfos, fallback activé", error);
      return null;
    }
  },

  annoncesData: async () => {
    try {
      const response = await api('/patient/dashboard/prevention')
      const data = response.data
      if (!data || data.annonces.length === 0) return { conseil: data?.conseil_ia || '', mainAnnonce: null, autresAnnonces: [] }
      return OverviewUtils.formatAnnonceData(data)
    } catch (error) {
      console.warn("Échec API annoncesData, fallback activé", error);
      return null;
    }
  },

  vitalSignData: async () => {
    try {
      const response = await api('/patient/dashboard/vital-sign')
      const data = response.data
      if (!data) throw new Error("No data");
      return OverviewUtils.formatVitalSignData(data)
    } catch (error) {
      console.warn("Échec API vitalSignData, fallback activé", error);
      return null;
    }
  },

  appointmentsData: async () => {
    try {
      const response = await api('/patient/dashboard/prochain-rdv')
      const data = response.data
      if (!data) return []
      return OverviewUtils.formatAppointmentsData(data)
    } catch (error) {
      console.warn("Échec API appointmentsData, fallback activé", error);
      return null;
    }
  },

  trustsData: async () => {
    try {
      const response = await api('/patient/dashboard/personne-confiane')
      const data = response.data
      if (!data) throw new Error("No data")
      return OverviewUtils.formatTrustsData(data)
    } catch (error) {
      console.warn("Échec API trustsData, fallback activé", error);
      return null;
    }
  },

}

const OverviewUtils = {

  formatAnnonceData(data) {
    const conseil = data.conseil_ia

    //La premiere annonce est considere comme principale, les autres sont des annonces 
    const mainAnnonce = {
        id: data.annonces[0].id,
        title: data.annonces[0].titre,
        content: data.annonces[0].description,
        date: formatDate(data.annonces[0].created_at),
        imageUrl: data.annonces[0].image_couverture_url,
        categorie: data.annonces[0].categorie,
    }
    const autresAnnonces = data.annonces.slice(1).map(a => {
      return {
        id: a.id,
        title: a.titre,
        content: a.description,
        date: formatDate(a.created_at),
        imageUrl: a.image_couverture_url,
        categorie: a.categorie,
      }
    })

    return {
      conseil,
      mainAnnonce,
      autresAnnonces,
    }
  },

  formatVitalSignData(data) {
    return {
      poids: {
        value: data.poids,
        status: this.determineStatus(data.poids, [60, 80], [50, 90]),
        unit: 'kg',
        normalRange: [60, 80],
        warningRange: [50, 90],
      },
      taille: {
        value: this.convertFromCmToM(data.taille),
        unit: 'm',
        status: 'normal',
        normalRange: [1.60, 1.80],
        warningRange: [1.50, 1.90],
      },
      tension_arterielle: {
        value: data.tension_systolique + '/' + data.tension_diastolique,
        unit: 'mmHg',
        status: this.determineStatus(data.tension_systolique, [60, 80], [50, 90]),
      },
      glycemie: {
        value: data.glycemie,
        status: this.determineStatus(data.glycemie, [0.7, 1.0], [0.5, 1.2]),
        unit: 'g/L',
      },
      temperature: {
        value: data.temperature,
        status: this.determineStatus(data.temperature, [36, 37.5], [35, 38]),
        unit: '°C',
      },
      pouls: {
        value: data.pouls,
        status: this.determineStatus(data.pouls, [60, 100], [50, 120]),
        unit: 'bpm',
      },
      date: formatDate(data.saisie_at),
    }
  },

  convertFromCmToM(cm) {
    return cm / 100
  },

  determineStatus(value, normalRange, warningRange) {
    if (value >= normalRange[0] && value <= normalRange[1]) {
      return 'normal'
    } else if (value >= warningRange[0] && value <= warningRange[1]) {
      return 'warning'
    } else {
      return 'danger'
    }
  },

  formatAppointmentsData(data){
    data.map(a=>{
      const [mois, jour] = splitDate(a.date_rdv)
      return {
        id: a.id,
        date: jour,
        month: mois,
        time: a.heure,
        doctorName: `Dr. ${a.medecin.nom}`,
        speciality: a.medecin.specialite.nom,
        establishment: a.structure_sante.nom,
        notes: a.note,
      }
    })
  },

  formatTrustsData(data){
    const tutores = data.filter(t=>t.role === 'tuteur')
    const protegees = data.filter(p=>p.role === 'protege')
    return {
      tutores: tutores.map(t=>{
        return {
          id: t.id,
          nom: t.nom,
          relation: t.relation,
          photo_url: t.photo_url,
          status: t.status
        }
      }),
      protegees: protegees.map(p=>{
        return {
          id: p.id,
          nom: p.nom,
          relation: p.relation,
          photo_url: p.photo_url,
          status: p.status
        }
      })
    }
  }
}

export default OverviewService
