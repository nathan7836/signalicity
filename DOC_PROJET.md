# Signalicity - Document Descriptif du Projet

## 1. Presentation generale

**Signalicity** est une plateforme municipale de signalement citoyen developpee pour la ville de **Croissy-sur-Seine** (~10 000 habitants, Yvelines, Ile-de-France). Elle permet aux habitants de signaler des incidents sur la voie publique (voirie degradee, eclairage defaillant, proprete, espaces verts...) et aux services municipaux de gerer, suivre et resoudre ces signalements de maniere efficace.

Le projet se compose de deux applications complementaires :
- **Application web** (back-office + portail citoyen) pour les agents municipaux et les citoyens sur desktop
- **Application mobile** (iOS/Android) pour les citoyens en mobilite

---

## 2. Architecture technique

### 2.1 Monorepo

Le projet est organise en **monorepo** avec npm workspaces et Turborepo :

```
signalicity/
├── apps/
│   ├── web/          # Application web Next.js 14
│   └── mobile/       # Application mobile Expo/React Native
├── packages/
│   ├── shared/       # Types TypeScript & constantes partagees
│   └── ai/           # Couche d'abstraction IA (Mistral AI)
├── supabase/         # Migrations SQL, config, seed data
└── turbo.json        # Configuration Turborepo
```

### 2.2 Stack technique

| Composant | Technologie |
|-----------|------------|
| **Frontend web** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Frontend mobile** | Expo 51, React Native 0.74, Expo Router |
| **Backend / BDD** | Supabase (PostgreSQL + PostGIS, Auth, RLS) |
| **Intelligence artificielle** | Mistral AI (Pixtral, Mistral Large, Mistral Small) |
| **Cartographie web** | Leaflet + React-Leaflet |
| **Cartographie mobile** | React Native Maps |
| **Stockage fichiers** | Scaleway S3 (via AWS SDK) |
| **Notifications push** | Expo Notifications (APNs / FCM) |
| **Graphiques** | Recharts |
| **Icones** | Lucide React (web), Expo Vector Icons (mobile) |
| **Deploiement web** | Vercel |
| **Deploiement mobile** | EAS Build |

---

## 3. Fonctionnalites

### 3.1 Application citoyen (mobile + web)

- **Signaler un incident** : prise de photo, geolocalisation automatique, description libre
- **Suivi des signalements** : visualisation du statut (recu, en cours, resolu) et historique
- **Mes signalements** : liste des signalements personnels
- **Notifications** : alertes push sur changement de statut
- **Carte interactive** : visualisation des incidents sur la commune
- **Alertes municipales** : informations et alertes de la mairie
- **Agenda** : evenements municipaux
- **Annuaire** : contacts des services municipaux
- **Budget participatif** : espace de participation citoyenne
- **Assistant IA** : chatbot d'aide et d'information

### 3.2 Back-office agent/admin (web)

- **Dashboard** : statistiques en temps reel (total, resolus, en cours, taux de resolution, delai moyen)
- **Liste des signalements** : filtrage par statut, categorie, gravite ; recherche textuelle
- **Detail signalement** : photo, localisation sur carte, historique de statut, notes internes
- **Gestion des statuts** : changement de statut avec notification automatique au citoyen
- **Affectation** : attribution a un service ou agent
- **Carte globale** : vue cartographique de tous les signalements avec heatmap
- **Tournees** : organisation des interventions terrain
- **Police municipale** : espace dedie
- **Export** : CSV (compatible Excel avec BOM UTF-8) et rapport HTML/PDF
- **Parametres** : configuration de la plateforme

### 3.3 Fonctionnalites IA (Mistral AI)

| Fonction | Modele | Description |
|----------|--------|-------------|
| **Classification photo** | Pixtral (vision) | Analyse automatique de la photo pour categoriser le signalement et evaluer la gravite |
| **Generation de description** | Mistral Large | Redaction automatique d'une description factuelle a partir de la categorie et gravite |
| **Detection de doublons** | Mistral Large | Comparaison semantique avec les signalements existants dans un rayon de 50m |
| **Reponse citoyen** | Mistral Large | Generation de messages personnalises lors des changements de statut |
| **Moderation** | Mistral Small | Detection de contenus injurieux, donnees personnelles ou hors sujet |

Un systeme de **pre-filtrage par mots-cles** permet d'eviter les appels IA pour les cas evidents (ex: "nid de poule" -> voirie/high).

---

## 4. Modele de donnees

### Tables principales

- **`services`** : services municipaux (Voirie, Proprete, Eclairage, Espaces verts, Services techniques)
- **`categories`** : 8 categories de signalement (Voirie, Proprete, Eclairage, Espaces verts, Mobilier urbain, Stationnement, Nuisances, Autre)
- **`profiles`** : profils utilisateurs avec roles (citizen, agent, manager, admin, elected)
- **`signalements`** : signalements avec geolocalisation PostGIS, statut, gravite, affectation
- **`status_history`** : historique automatique des changements de statut (via trigger)
- **`notifications`** : notifications push

### Fonctions spatiales (PostGIS)

- **`nearby_signalements(lat, lng, radius)`** : recherche de signalements a proximite (deduplication)
- **`signalements_per_day(days)`** : statistiques quotidiennes pour le dashboard
- **`signalements_heatmap()`** : donnees de densite pour la carte de chaleur

### Securite (Row Level Security)

- Les citoyens ne voient que leurs propres signalements
- Les agents/managers/admins voient tous les signalements
- Seul le staff peut modifier les signalements
- Chaque utilisateur ne voit que ses propres notifications

---

## 5. Roles utilisateurs

| Role | Droits |
|------|--------|
| **Citoyen** (`citizen`) | Creer et suivre ses signalements |
| **Agent** (`agent`) | Voir tous les signalements, changer statut, notes internes |
| **Manager** (`manager`) | Idem agent + affecter des signalements, gerer les agents |
| **Admin** (`admin`) | Acces complet, parametres, export, gestion des utilisateurs |
| **Elu** (`elected`) | Vue en lecture seule sur l'ensemble des signalements et statistiques |

---

## 6. Pages de l'application web

### Back-office (agents/admins)
| Route | Description |
|-------|-------------|
| `/` | Dashboard avec KPIs et graphiques |
| `/signalements` | Liste filtrable de tous les signalements |
| `/signalements/[id]` | Detail d'un signalement |
| `/carte` | Carte interactive avec tous les signalements |
| `/tournees` | Gestion des tournees d'intervention |
| `/police` | Espace police municipale |
| `/alertes` | Gestion des alertes municipales |
| `/agenda` | Agenda des evenements |
| `/annuaire` | Annuaire des services |
| `/participatif` | Budget participatif |
| `/assistant` | Assistant IA |
| `/parametres` | Parametres de la plateforme |
| `/login` | Authentification |

### Portail citoyen
| Route | Description |
|-------|-------------|
| `/citoyen` | Page d'accueil citoyen |
| `/signaler` | Formulaire de signalement |
| `/mes-signalements` | Signalements du citoyen |
| `/suivi/[id]` | Suivi d'un signalement |

---

## 7. Application mobile

### Ecrans principaux
| Ecran | Description |
|-------|-------------|
| Accueil (tabs) | Carte des signalements + acces rapide |
| Mes signalements | Liste des signalements du citoyen |
| Notifications | Centre de notifications |
| Signaler | Formulaire de creation (photo + geo) |
| Detail signalement | Suivi d'un signalement specifique |
| Alertes | Alertes municipales |
| Agenda | Evenements |
| Annuaire | Contacts des services |
| Participatif | Budget participatif |
| Assistant | Chatbot IA |
| Login | Authentification Supabase |

---

## 8. APIs

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/signalements` | GET | Liste des signalements (avec filtres) |
| `/api/signalements` | POST | Creation d'un signalement |
| `/api/signalements/[id]` | GET/PATCH | Detail et mise a jour d'un signalement |
| `/api/signalements/[id]/classify` | POST | Classification IA d'un signalement |
| `/api/stats` | GET | Statistiques du dashboard |
| `/api/export?format=csv\|pdf` | GET | Export des donnees (CSV ou rapport HTML) |

---

## 9. Composants UI

### Web
- `AppShell` / `Sidebar` : layout general avec navigation laterale
- `MapView` : carte Leaflet (import dynamique SSR-safe)
- `StatsCard` : cartes de statistiques du dashboard
- `SignalementRow` : ligne de tableau pour la liste
- `StatusBadge` / `SeverityBadge` : badges de statut et gravite
- `StatusTimeline` : historique visuel des changements de statut
- `SecureImage` : affichage securise des photos (Scaleway S3)

### Mobile
- `Button` : bouton stylise
- `StatusBadge` : badge de statut
- `CategoryPill` : pastille de categorie
- `SignalementCard` : carte de signalement
- `StepIndicator` : indicateur d'etapes (formulaire de signalement)

---

## 10. Deploiement et environnement

### Mode developpement
- Fonctionne **sans configuration Supabase** (donnees mock + client placeholder)
- `npm run dev:web` -> http://localhost:3000
- `npm run dev:mobile` -> Expo Dev Server

### Variables d'environnement requises (production)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` : connexion Supabase
- `MISTRAL_API_KEY` : API Mistral AI
- `SCALEWAY_ACCESS_KEY_ID` / `SCALEWAY_SECRET_ACCESS_KEY` / `SCALEWAY_BUCKET` : stockage S3

### Deploiement
- **Web** : Vercel (ou Docker)
- **Mobile** : EAS Build (Expo Application Services)
- **Base de donnees** : Supabase Cloud ou self-hosted

---

## 11. Localisation et contexte

- **Langue** : francais
- **Commune cible** : Croissy-sur-Seine (48.8783°N, 2.1372°E)
- **Fuseau horaire** : Europe/Paris
- **Format dates** : dd/mm/yyyy (fr-FR)
- **Export CSV** : separateur point-virgule (`;`), BOM UTF-8 pour compatibilite Excel
