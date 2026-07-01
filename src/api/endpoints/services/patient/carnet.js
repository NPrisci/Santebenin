import { api } from "@/api/clients/main";
import { formatDate, formatDateTime } from "@/api/clients/help";

export const CarnetService = {
    async profil() {
        const response = await api('/patient/carnet/profil')
        return FormatCarnet.profil(response.data)
    },

    async indications() {
        const response = await api('/patient/carnet/indications')
        return FormatCarnet.indications(response.indications)
    },

    async alertes() {
        const response = await api('/patient/carnet/alertes');
        return {
            rendez_vous: FormatCarnet.rendez_vous(response.rendez_vous),
            prevention: FormatCarnet.prevention(response.prevention)
        }
    },

    async timeline(){
        const response = await api('/patient/carnet/timeline');
        return FormatCarnet.timeline(response.timeline)
    },

    async traitements(){
        const response = await api('/patient/carnet/traitements');
        return FormatCarnet.traitements(response.current_traitments)
    }
}

const FormatCarnet = {
    profil(data) {
        return {
            nom: data.nom,
            prenom: data.prenom,
            npi: data.npi,
            photo: data.photo,
            phone: data.phone,
            contact_email: data.email,
            age: data.age,
            sexe: data.sexe === 'M' ? 'Homme' : 'Femme',
            naissance: formatDate(data.date_naissance, 'Day DD Month YYYY'),
            groupe_sanguin: data.groupe_sanguin
        }
    },

    indications(data) {
        if (!data) return {};

        // Configuration avec Font Awesome et PrimeIcons au choix
        const configConstantes = {
            poids: {
                label_affichage: 'Poids',
                icon_fa: 'fa-solid fa-weight-scale',
                icon_pi: 'pi pi-gauge',
                getBadgeClass: (item) => 'bg-info-subtle text-info-emphasis border border-info-subtle'
            },
            tension: {
                label_affichage: 'Tension Artérielle',
                icon_fa: 'fa-solid fa-heart-pulse',
                icon_pi: 'pi pi-heart-fill',
                getBadgeClass: (item) => item.status === 'danger'
                    ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                    : 'bg-success-subtle text-success-emphasis border border-success-subtle'
            },
            glycemie: {
                label_affichage: 'Glycémie',
                icon_fa: 'fa-solid fa-droplet',
                icon_pi: 'pi pi-percentage',
                getBadgeClass: (item) => item.status === 'danger'
                    ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                    : 'bg-success-subtle text-success-emphasis border border-success-subtle'
            },
            frequence_cardiaque: {
                label_affichage: 'Fréquence Cardiaque',
                icon_fa: 'fa-solid fa-wave-square',
                icon_pi: 'pi pi-activity',
                getBadgeClass: (item) => item.status === 'danger'
                    ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                    : 'bg-success-subtle text-success-emphasis border border-success-subtle'
            }
        };

        const resultatsFormates = {};

        Object.keys(data).forEach((cle) => {
            const item = data[cle];
            const config = configConstantes[cle] || {
                label_affichage: cle,
                icon_fa: 'fa-solid fa-chart-line',
                icon_pi: 'pi pi-chart-line',
                getBadgeClass: () => 'bg-light text-dark border'
            };

            const valeurAffichable = (item.valeur === '/' || item.valeur === null || item.valeur === undefined)
                ? '--'
                : item.valeur;

            resultatsFormates[cle] = {
                cle: cle,
                titre: config.label_affichage,
                valeur: valeurAffichable,
                unite: item.unit,
                valeur_complete: valeurAffichable !== '--' ? `${valeurAffichable} ${item.unit}` : '--',
                icone_fa: config.icon_fa,
                icone_pi: config.icon_pi,
                statut_label: item.label || item.imc_status || 'Normal',
                statut_code: item.status || (cle === 'poids' ? 'normal' : 'inconnu'),
                classe_couleur: config.getBadgeClass(item),
                tendance: item.tendance || null,
                source: item.source,
                date: item.date
            };
        });

        return resultatsFormates;
    },

    rendez_vous(data) {
        if (!data) return null;

        // Si l'API renvoie parfois un objet unique au lieu d'un tableau,
        const listeRendezVous = Array.isArray(data) ? data : [data];

        // Configuration des statuts Bootstrap & Icônes
        const configStatuts = {
            'VALIDE': {
                label: 'Confirmé',
                badgeClass: 'bg-success-subtle text-success-emphasis border border-success-subtle',
                icon_fa: 'fa-solid fa-calendar-check',
                icon_pi: 'pi pi-calendar-plus'
            },
            'EN_ATTENTE': {
                label: 'En attente',
                badgeClass: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
                icon_fa: 'fa-solid fa-calendar-days',
                icon_pi: 'pi pi-calendar'
            },
            'ANNULE': {
                label: 'Annulé',
                badgeClass: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
                icon_fa: 'fa-solid fa-calendar-xmark',
                icon_pi: 'pi pi-calendar-times'
            }
        };

        return listeRendezVous.map((rendez) => {
            const datetimeFormate = rendez.date ? formatDateTime(rendez.date) : { date: '--', heure: '--' };

            // Récupération de la config du statut avec un fallback sécurisé
            const statutConfig = configStatuts[rendez.statut] || {
                label: rendez.statut || 'Inconnu',
                badgeClass: 'bg-light text-dark border',
                icon_fa: 'fa-solid fa-calendar',
                icon_pi: 'pi pi-calendar'
            };

            return {
                id: rendez.id,
                redirect_id: rendez.id, // Gardé selon ton initialisation

                // Données de date et heure extraites
                date_affichage: datetimeFormate.date,   // "05 Juillet 2026"
                heure_affichage: datetimeFormate.heure, // "14:30"

                // Informations du professionnel de santé
                medecin: {
                    id: rendez.professionnel?.id || null, 
                    nom: rendez.professionnel ? `Dr ${rendez.professionnel.prenom} ${rendez.professionnel.nom}` : 'Nn spécifié',
                    specialite: rendez.professionnel?.specialite?.nom || 'Médecine Générale',
                    photo: rendez.professionnel?.photo
                },

                // Informations de la structure hospitalière
                structure: {
                    nom: rendez.structure?.nom || 'Centre de santé',
                    telephone: rendez.structure?.telephone || null,
                    localisation: rendez.structure?.localisation || 'Non spécifiée'
                },

                // Gestion du statut visuel
                statut_code: rendez.statut,
                statut_label: statutConfig.label,
                classe_couleur: statutConfig.badgeClass,
                icone_fa: statutConfig.icon_fa,
                icone_pi: statutConfig.icon_pi
            };
        });
    },

    prevention(data) {
        if (!data) return null;

        // Si l'API renvoie parfois un objet unique au lieu d'un tableau,
        const listePrevention = Array.isArray(data) ? data : [data];

        return listePrevention.map((liste) => {
            return {
                type: liste.type,
                contenu: liste.contenu,
                image: liste.image,
                redirect_id: liste.annonce_id
            }
        })
    },

    timeline(data) {
        if (!data) return null;

        const timelines = Array.isArray(data) ? data : [data];

        return timelines.map((line) => {
            const datetimeFormate = line.date_evenement ? formatDateTime(line.date_evenement) : { date: '--', heure: '--' };
            console.log(datetimeFormate)

            // Construction dynamique du résumé textuel selon les clés présentes
            let texteResume = '--';
            if (line.resume) {
                const parties = [];
                if (line.resume.motif) parties.push(`Motif : ${line.resume.motif}`);
                if (line.resume.diagnostic) parties.push(`Diagnostic : ${line.resume.diagnostic}`);
                if (line.resume.conclusion) parties.push(`Conclusion : ${line.resume.conclusion}`);
                if (line.resume.observations) parties.push(`Observations : ${line.resume.observations}`);
                
                if (parties.length > 0) {
                    texteResume = parties.join(' | ');
                }
            }

            return {
                id: line.id,
                type: line.type,
                date: `Le ${datetimeFormate.date} à ${datetimeFormate.heure}`,
                responsable: line.responsable ? {
                    id: line.responsable.id,
                    nom: line.responsable.nom ? `Dr ${line.responsable.nom}` : 'Non spécifié',
                    photo: line.responsable.photo || null
                } : null,
                structure: line.structure?.nom ?? 'Aucune structure médicale affectée',
                resume: texteResume
            };
        });
    },

    traitements(data) {
        if (!data) return null;

        const listeTraitements = Array.isArray(data) ? data : [data];

        return listeTraitements.map((trait) => {
            const titreAffichage = trait.nom_generique && trait.nom_generique !== trait.nom_medicament
                ? `${trait.nom_medicament} (${trait.nom_generique})`
                : trait.nom_medicament || 'Médicament non spécifié';

            return {
                id: trait.id || null,
                titre: titreAffichage,
                medicament: trait.nom_medicament,
                nom_generique: trait.nom_generique,
                posologie: trait.posologie || 'Non spécifiée',
                instructions: trait.instructions || 'Aucune instruction particulière',
                statut: trait.statut || 'actif',
                
                // Correction de la faute de frappe (trait sans s) + gestion du pluriel pour l'affichage
                restants: trait.jours_restants !== undefined && trait.jours_restants !== null
                    ? `${trait.jours_restants} jour${trait.jours_restants > 1 ? 's' : ''} restant${trait.jours_restants > 1 ? 's' : ''}`
                    : '--',
                jours_restants_raw: trait.jours_restants
            };
        });
    }
}