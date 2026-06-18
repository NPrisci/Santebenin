# 🏥 BéninSanté

> **Plateforme SaaS de santé numérique dédiée au système de santé béninois**

---

## 📋 Présentation du projet

**BéninSanté** est une solution SaaS (Software as a Service) de santé numérique conçue pour moderniser et digitaliser le système de santé de la République du Bénin.

La plateforme s'adresse à deux types d'acteurs :

- **Les professionnels de santé** — médecins, cliniciens, pharmaciens, gestionnaires d'établissements — qui ont besoin d'outils performants pour la gestion des dossiers médicaux, la coordination des soins et l'administration de leurs structures.
- **Les patients** — qui bénéficient d'un espace personnel sécurisé pour accéder à leur historique médical, gérer leur profil de santé (groupe sanguin, allergies, antécédents) et suivre leurs interactions avec les professionnels de santé.

BéninSanté s'engage à respecter les normes **HDS (Hébergement de Données de Santé)** en vigueur, avec un chiffrement de bout en bout garantissant la confidentialité et l'intégrité de toutes les données médicales traitées sur la plateforme.

---

## 🛠️ Stack technique

| Technologie | Rôle |
|---|---|
| **Vue 3** (Composition API) | Framework JavaScript principal |
| **Vite** | Bundler et serveur de développement |
| **Bootstrap 5.3** | Système de design et composants CSS |
| **Font Awesome / PrimeIcons** | Bibliothèques d'icônes |
| **SweetAlert2** | Boîtes de dialogue de confirmation |
| **Vue Router** | Gestion de la navigation |

---

## 🚀 Installation & lancement

```sh
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Lancer les tests unitaires
npm run test:unit

# Analyser le code avec ESLint
npm run lint
```

---

## 📦 Bibliothèque de composants

L'ensemble des composants de l'interface suit la convention de nommage **`Med*`** (pour "Medical"), garantissant une cohérence visuelle et fonctionnelle à travers toute l'application.

---

### 🔵 Composants communs (`src/components/common/`)

Ces composants sont les briques fondamentales de l'interface, réutilisables dans toutes les vues de la plateforme.

---

#### `MedAutoComplete`
Champ de recherche intelligent avec liste déroulante et résultats regroupés par catégories. Supporte la navigation au clavier (flèches, Entrée, Échap), la mise en surbrillance des termes correspondants dans les résultats, un état de chargement skeleton, un bouton d'effacement, et une action optionnelle "Ajouter un nouvel élément" quand aucun résultat n'est trouvé.

---

#### `MedAvatar`
Affichage de l'avatar d'un utilisateur (médecin ou patient). Supporte une image source avec fallback automatique sur les initiales du nom, 5 tailles (`xs` à `xl`), deux formes (`circle` ou `rounded`), une pastille de statut de présence colorée (`available`, `busy`, `away`, `offline`) et un badge de notification.

---

#### `MedButton`
Bouton d'action universel de la plateforme. Supporte toutes les variantes de couleur Bootstrap (dont les versions `outline-*`), 3 tailles, un état de chargement avec spinner intégré, des icônes gauche et droite (Font Awesome), le mode pleine largeur, et peut se transformer en lien `<a>` si une prop `href` est fournie.

---

#### `MedCard`
Conteneur de contenu structuré sous forme de carte. Supporte un en-tête avec titre, sous-titre et icône, un slot d'actions dans l'en-tête, un pied de page optionnel, un état de chargement avec animation shimmer intégrée, un mode repliable/dépliable animé, ainsi qu'un effet de survol "lift" configurable.

---

#### `MedChip`
Bouton de sélection en forme de pilule, utilisé pour les filtres, les tags et les choix rapides (ex: groupe sanguin, allergies, spécialités). Affiche une icône de validation animée (`fas fa-check`) quand il est actif, et supporte l'état désactivé.

---

#### `MedConfirm`
Boîte de dialogue de confirmation modale, construite sur **SweetAlert2** et entièrement stylisée avec Bootstrap 5. Supporte les types prédéfinis (`warning`, `danger`, `info`...), les icônes Font Awesome personnalisées, les textes HTML, les boutons configurables et les actions asynchrones via `preConfirm` (affichage d'un loader pendant le traitement).

**Utilisation via le composable `useConfirm.js` :**
L'application instancie un unique composant `MedConfirm` dans le layout principal, qui est piloté globalement par le composable `useConfirm`.

```javascript
import { useConfirm } from '@/composables/useConfirm'

const { confirm, confirmDelete, confirmAction } = useConfirm()

// Exemple : Demander une confirmation simple
const handleDelete = async () => {
  const result = await confirmDelete({
    text: 'Êtes-vous sûr de vouloir supprimer ce patient ?'
  })
  
  if (result.isConfirmed) {
    // Exécuter la suppression...
  }
}
```

#### `MedDateField`
Champ de saisie de date enrichi, basé sur la bibliothèque **VCalendar**, adapté aux normes d'affichage françaises. Permet une saisie intuitive de dates (ex: date de naissance, date de consultation) avec un calendrier visuel intégré.

---

#### `MedEmptyState`
Composant d'état vide affiché en l'absence de données dans une liste ou un module. Présente une icône, un titre, une description et un bouton d'action optionnel. Disponible en 3 tailles (`sm`, `md`, `lg`) et en mode encadré (type carte clinique).

---

#### `MedFileUpload`
Zone d'importation de fichier unique avec support du **glisser-déposer (Drag & Drop)**. Valide le type MIME et la taille maximale du fichier, affiche une icône contextuelle selon le format (PDF, image, Word...), et présente un panneau de prévisualisation une fois le fichier sélectionné avec la possibilité de le supprimer.

---

#### `MedInput`
Champ de saisie texte standardisé, conforme à la charte graphique de la plateforme, avec support des états d'erreur, d'aide contextuelle et d'icônes.

---

#### `MedMediaPreview`
Composant de prévisualisation de médias (images, vidéos, PDF). Affiche un aperçu miniature dans un cadre interactif avec une superposition au survol proposant deux actions : ouvrir en plein écran dans un `MedModal` de grande taille, ou supprimer le fichier. Gère proprement la mémoire en révoquant les URL d'objet lors de la destruction du composant.

---

#### `MedModal`
Fenêtre modale universelle, construite sans dépendance à la librairie JavaScript de Bootstrap (logique Vue pure). Utilise `<Teleport>` pour s'attacher directement au `<body>`. Supporte 5 tailles (`sm`, `md`, `lg`, `xl`, `fullscreen`), le centrage vertical, le défilement interne, le blocage de fermeture (`staticBackdrop`), la fermeture par touche Échap, et un en-tête de couleur personnalisable.

---

#### `MedMultiFileUpload`
Extension de `MedFileUpload` permettant la sélection et l'importation de **plusieurs fichiers simultanément**. Gère une liste de fichiers avec prévisualisation individuelle et suppression unitaire.

---

#### `MedOffCanvas`
Panneau coulissant latéral (off-canvas), utilisé pour les menus secondaires, les filtres avancés ou les détails de dossier sur mobile. S'affiche par-dessus le contenu principal depuis le côté de l'écran.

---

#### `MedOtpInput`
Champ de saisie de code OTP (One-Time Password) à cases individuelles. Supporte la navigation automatique entre les chiffres (focus suivant/précédent), la touche Retour arrière intelligente, le **copier-coller** du code entier, et une longueur configurable (défaut : 6 chiffres).

---

#### `MedPasswordField`
Champ de saisie de mot de passe avec bouton de bascule de visibilité intégré (afficher / masquer), conforme aux standards UX de sécurité.

---

#### `MedProgressBar`
Barre de progression configurable basée sur Bootstrap. Supporte les variantes de couleur, les rayures animées, 3 positions d'affichage du label (`inside`, `outside-top`, `outside-bottom`), un suffixe personnalisable (`%`, `Mo`…) et une transition CSS fluide lors des changements de valeur.

---

#### `MedSelect`
Liste déroulante de sélection stylisée, cohérente avec la charte graphique de la plateforme, supportant les états d'erreur et d'aide contextuelle.

---

#### `MedSkeleton`
Composant de placeholder animé ("skeleton loader") affiché pendant le chargement du contenu. Disponible en 3 types (`text`, `circle`, `rect`), 2 animations (`glow`, `wave`), et en tailles prédéfinies pour les avatars. Génère des largeurs de lignes variables pour simuler un paragraphe réaliste.

---

#### `MedTextArea`
Champ de saisie de texte multiligne standardisé, conforme à la charte graphique de la plateforme.

---

#### `MedToggle`
Interrupteur à bascule (switch), utilisé pour activer ou désactiver des paramètres (ex: notifications, préférences de confidentialité).

---

#### `MedTypeWritter`
Composant d'animation de texte simulant une frappe au clavier caractère par caractère, avec un curseur clignotant. La vitesse de frappe et le délai de démarrage sont configurables. Émet un événement `finished` à la fin de l'animation, permettant d'enchaîner des actions (ex: affichage d'un bouton, lancement d'une requête).

---

### 🟢 Composants principaux (`src/components/main/`)

Ces composants gèrent des états globaux et structurels de l'application.

---

#### `MedAppLoader`
Écran de chargement plein écran affiché lors de l'initialisation de l'application ou des transitions entre les sections du dashboard. Présente une animation SVG cinétique du logo **BéninSanté** (tracé ECG animé, révélation séquencée des lettres du logo), un indicateur de statut avec texte configurable, et disparaît avec une transition fluide (fade + scale + blur). Un badge de sécurité HDS est ancré en bas de l'écran.

---

#### `MedInternalError`
Page d'erreur **500** (erreur serveur interne). Affiche une illustration SVG animée avec un signal ECG défaillant et une pastille d'alerte pulsante. Propose deux actions : recharger la page, ou copier le code d'incident technique (avec retour visuel de confirmation). Rassure l'utilisateur sur l'intégrité de ses données.

---

#### `MedNotFound`
Page d'erreur **404** (page introuvable). Affiche une illustration SVG animée avec un radar médical tournant. Propose trois actions de secours : retour au tableau de bord, retour à la page précédente, et contact du service client par e-mail. Communique de manière bienveillante et rassurante sur la sécurité des données cliniques.

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── common/        # Composants réutilisables (MedButton, MedCard, MedModal…)
│   └── main/          # Composants structurels (MedAppLoader, MedNotFound, MedInternalError)
├── views/             # Pages et vues de l'application
├── router/            # Configuration de Vue Router
├── stores/            # Stores Pinia (état global)
└── assets/            # Ressources statiques (images, CSS global)
```

---

## 🔒 Sécurité & conformité

- Chiffrement des données de santé de bout en bout
- Conformité aux normes **HDS Bénin**
- Aucune donnée clinique compromise en cas d'erreur système

---

*BéninSanté — Digitalisons la santé au Bénin, ensemble.*
