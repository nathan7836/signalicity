# Signalicity

Municipal citizen reporting platform for **Croissy-sur-Seine** (~10,000 inhabitants, Ile-de-France, France).

Signalicity enables residents to report public space incidents (road damage, street lighting, cleanliness, green spaces...) and municipal staff to manage, track, and resolve them efficiently — powered by AI.

## Features

**Citizens**
- Report incidents with photo + automatic geolocation
- Track report status (received → in progress → resolved)
- Push notifications on status changes
- Interactive map, municipal alerts, events calendar, directory, participatory budget, AI assistant

**Municipal Staff**
- Dashboard with real-time KPIs and charts
- Report management with filtering, assignment, and internal notes
- Heatmap and cartographic views
- Field intervention round planning
- CSV and PDF export

**AI (Mistral AI)**
- Photo classification and severity assessment (Pixtral vision)
- Automatic description generation (Mistral Large)
- Duplicate detection within 50m radius (Mistral Large)
- Personalized citizen notifications (Mistral Large)
- Content moderation (Mistral Small)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js 14, React 18, Tailwind CSS, Leaflet, Recharts |
| Mobile | Expo 51, React Native, React Native Maps |
| Backend | Supabase (PostgreSQL + PostGIS, Auth, RLS) |
| AI | Mistral AI (Pixtral, Mistral Large, Mistral Small) |
| Storage | Scaleway S3 |
| Push | Expo Notifications (APNs / FCM) |

## Project Structure

```
signalicity/
├── apps/
│   ├── web/            # Next.js 14 back-office + citizen portal
│   └── mobile/         # Expo/React Native citizen app
├── packages/
│   ├── shared/         # Shared TypeScript types & constants
│   └── ai/             # AI abstraction layer (Mistral)
└── supabase/           # SQL migrations & seed data
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/nathan7836/signalicity.git
cd signalicity
npm install
```

### Development

The app works **without any external configuration** in dev mode (mock data + placeholder clients).

```bash
# Web (http://localhost:3000)
npm run dev:web

# Mobile (Expo Dev Server)
npm run dev:mobile
```

### Production Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
MISTRAL_API_KEY=...
SCALEWAY_ACCESS_KEY_ID=...
SCALEWAY_SECRET_ACCESS_KEY=...
SCALEWAY_BUCKET=...
```

## Deployment

- **Web**: Vercel or Docker
- **Mobile**: EAS Build (Expo Application Services)
- **Database**: Supabase Cloud or self-hosted

## Documentation

- [Document descriptif (FR)](DOC_PROJET.md)
- [Project description (EN)](PROJECT_DOC.md)

## License

This project is licensed under the [MIT License](LICENSE).
