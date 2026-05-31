# Signalicity - Project Description Document

## 1. Overview

**Signalicity** is a municipal citizen reporting platform developed for the city of **Croissy-sur-Seine** (~10,000 inhabitants, Yvelines, Ile-de-France, France). It enables residents to report public space incidents (road damage, street lighting failures, cleanliness issues, green spaces...) and allows municipal services to manage, track, and resolve these reports efficiently.

The project consists of two complementary applications:
- **Web application** (back-office + citizen portal) for municipal staff and desktop citizens
- **Mobile application** (iOS/Android) for citizens on the go

---

## 2. Technical Architecture

### 2.1 Monorepo

The project is organized as a **monorepo** using npm workspaces and Turborepo:

```
signalicity/
├── apps/
│   ├── web/          # Next.js 14 web application
│   └── mobile/       # Expo/React Native mobile application
├── packages/
│   ├── shared/       # Shared TypeScript types & constants
│   └── ai/           # AI abstraction layer (Mistral AI)
├── supabase/         # SQL migrations, config, seed data
└── turbo.json        # Turborepo configuration
```

### 2.2 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Web frontend** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Mobile frontend** | Expo 51, React Native 0.74, Expo Router |
| **Backend / Database** | Supabase (PostgreSQL + PostGIS, Auth, RLS) |
| **Artificial intelligence** | Mistral AI (Pixtral, Mistral Large, Mistral Small) |
| **Web mapping** | Leaflet + React-Leaflet |
| **Mobile mapping** | React Native Maps |
| **File storage** | Scaleway S3 (via AWS SDK) |
| **Push notifications** | Expo Notifications (APNs / FCM) |
| **Charts** | Recharts |
| **Icons** | Lucide React (web), Expo Vector Icons (mobile) |
| **Web deployment** | Vercel |
| **Mobile deployment** | EAS Build |

---

## 3. Features

### 3.1 Citizen Application (mobile + web)

- **Report an incident**: photo capture, automatic geolocation, free-text description
- **Report tracking**: status visualization (received, in progress, resolved) and history
- **My reports**: personal report list
- **Notifications**: push alerts on status changes
- **Interactive map**: incident visualization across the municipality
- **Municipal alerts**: city hall information and alerts
- **Calendar**: municipal events
- **Directory**: municipal services contacts
- **Participatory budget**: civic participation space
- **AI assistant**: help and information chatbot

### 3.2 Staff/Admin Back-office (web)

- **Dashboard**: real-time statistics (total, resolved, in progress, resolution rate, average resolution time)
- **Report list**: filtering by status, category, severity; text search
- **Report detail**: photo, map location, status history, internal notes
- **Status management**: status changes with automatic citizen notification
- **Assignment**: attribution to a service or agent
- **Global map**: cartographic view of all reports with heatmap
- **Field rounds**: field intervention route planning
- **Municipal police**: dedicated section
- **Export**: CSV (Excel-compatible with UTF-8 BOM) and HTML/PDF report
- **Settings**: platform configuration

### 3.3 AI Features (Mistral AI)

| Feature | Model | Description |
|---------|-------|-------------|
| **Photo classification** | Pixtral (vision) | Automatic photo analysis to categorize the report and assess severity |
| **Description generation** | Mistral Large | Automatic factual description writing based on category and severity |
| **Duplicate detection** | Mistral Large | Semantic comparison with existing reports within a 50m radius |
| **Citizen response** | Mistral Large | Personalized message generation on status changes |
| **Moderation** | Mistral Small | Detection of offensive content, personal data, or off-topic submissions |

A **keyword pre-filtering** system avoids unnecessary AI calls for obvious cases (e.g., "pothole" -> roads/high).

---

## 4. Data Model

### Main Tables

- **`services`**: municipal departments (Roads, Cleanliness, Street Lighting, Green Spaces, Technical Services)
- **`categories`**: 8 report categories (Roads, Cleanliness, Lighting, Green Spaces, Street Furniture, Parking, Nuisances, Other)
- **`profiles`**: user profiles with roles (citizen, agent, manager, admin, elected)
- **`signalements`**: reports with PostGIS geolocation, status, severity, assignment
- **`status_history`**: automatic status change log (via database trigger)
- **`notifications`**: push notifications

### Spatial Functions (PostGIS)

- **`nearby_signalements(lat, lng, radius)`**: nearby report search (for deduplication)
- **`signalements_per_day(days)`**: daily statistics for the dashboard
- **`signalements_heatmap()`**: density data for the heat map

### Security (Row Level Security)

- Citizens can only see their own reports
- Agents/managers/admins can see all reports
- Only staff can modify reports
- Each user can only see their own notifications

---

## 5. User Roles

| Role | Permissions |
|------|------------|
| **Citizen** (`citizen`) | Create and track their own reports |
| **Agent** (`agent`) | View all reports, change status, internal notes |
| **Manager** (`manager`) | Same as agent + assign reports, manage agents |
| **Admin** (`admin`) | Full access, settings, export, user management |
| **Elected official** (`elected`) | Read-only view of all reports and statistics |

---

## 6. Web Application Pages

### Back-office (agents/admins)
| Route | Description |
|-------|-------------|
| `/` | Dashboard with KPIs and charts |
| `/signalements` | Filterable list of all reports |
| `/signalements/[id]` | Report detail view |
| `/carte` | Interactive map with all reports |
| `/tournees` | Field intervention round management |
| `/police` | Municipal police section |
| `/alertes` | Municipal alerts management |
| `/agenda` | Events calendar |
| `/annuaire` | Services directory |
| `/participatif` | Participatory budget |
| `/assistant` | AI assistant |
| `/parametres` | Platform settings |
| `/login` | Authentication |

### Citizen Portal
| Route | Description |
|-------|-------------|
| `/citoyen` | Citizen home page |
| `/signaler` | Report submission form |
| `/mes-signalements` | Citizen's reports |
| `/suivi/[id]` | Report tracking |

---

## 7. Mobile Application

### Main Screens
| Screen | Description |
|--------|-------------|
| Home (tabs) | Report map + quick access |
| My reports | Citizen's report list |
| Notifications | Notification center |
| Report | Creation form (photo + geolocation) |
| Report detail | Specific report tracking |
| Alerts | Municipal alerts |
| Calendar | Events |
| Directory | Service contacts |
| Participatory | Participatory budget |
| Assistant | AI chatbot |
| Login | Supabase authentication |

---

## 8. APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signalements` | GET | List reports (with filters) |
| `/api/signalements` | POST | Create a report |
| `/api/signalements/[id]` | GET/PATCH | Report detail and update |
| `/api/signalements/[id]/classify` | POST | AI classification of a report |
| `/api/stats` | GET | Dashboard statistics |
| `/api/export?format=csv\|pdf` | GET | Data export (CSV or HTML report) |

---

## 9. UI Components

### Web
- `AppShell` / `Sidebar`: main layout with side navigation
- `MapView`: Leaflet map (dynamic import, SSR-safe)
- `StatsCard`: dashboard statistics cards
- `SignalementRow`: table row for the report list
- `StatusBadge` / `SeverityBadge`: status and severity badges
- `StatusTimeline`: visual status change history
- `SecureImage`: secure photo display (Scaleway S3)

### Mobile
- `Button`: styled button
- `StatusBadge`: status badge
- `CategoryPill`: category pill
- `SignalementCard`: report card
- `StepIndicator`: step indicator (report form)

---

## 10. Deployment and Environment

### Development Mode
- Works **without Supabase configuration** (mock data + placeholder client)
- `npm run dev:web` -> http://localhost:3000
- `npm run dev:mobile` -> Expo Dev Server

### Required Environment Variables (production)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase connection
- `MISTRAL_API_KEY`: Mistral AI API key
- `SCALEWAY_ACCESS_KEY_ID` / `SCALEWAY_SECRET_ACCESS_KEY` / `SCALEWAY_BUCKET`: S3 storage

### Deployment
- **Web**: Vercel (or Docker)
- **Mobile**: EAS Build (Expo Application Services)
- **Database**: Supabase Cloud or self-hosted

---

## 11. Localization and Context

- **Language**: French
- **Target municipality**: Croissy-sur-Seine (48.8783°N, 2.1372°E)
- **Timezone**: Europe/Paris
- **Date format**: dd/mm/yyyy (fr-FR)
- **CSV export**: semicolon separator (`;`), UTF-8 BOM for Excel compatibility
