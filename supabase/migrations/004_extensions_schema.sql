-- =====================================================
-- EXTENSIONS SCHEMA - All future modules
-- =====================================================

-- =====================================================
-- 1. UPDATED CATEGORIES (realistic, split ST vs PM)
-- =====================================================

-- Add routing target to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS routed_to TEXT NOT NULL DEFAULT 'services_techniques'
  CHECK (routed_to IN ('services_techniques', 'police_municipale', 'both'));

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Sub-categories for more precise classification
INSERT INTO categories (name, slug, icon, color, service_id, routed_to, parent_id, description, sort_order) VALUES
  -- Voirie sub-categories
  ('Nid de poule', 'nid-de-poule', 'road', '#6366F1',
    (SELECT id FROM services WHERE slug = 'voirie'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'voirie'),
    'Trou ou affaissement dans la chaussee', 1),
  ('Trottoir degrade', 'trottoir-degrade', 'road', '#6366F1',
    (SELECT id FROM services WHERE slug = 'voirie'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'voirie'),
    'Dalles soulevees, fissures, racines', 2),
  ('Marquage efface', 'marquage-efface', 'road', '#6366F1',
    (SELECT id FROM services WHERE slug = 'voirie'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'voirie'),
    'Passage pieton, ligne de stop, bande cyclable', 3),
  ('Bouche d egout', 'bouche-egout', 'road', '#6366F1',
    (SELECT id FROM services WHERE slug = 'voirie'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'voirie'),
    'Bouchee, affaissee ou manquante', 4),

  -- Proprete sub-categories
  ('Depot sauvage', 'depot-sauvage', 'trash', '#F59E0B',
    (SELECT id FROM services WHERE slug = 'proprete'), 'both',
    (SELECT id FROM categories WHERE slug = 'proprete'),
    'Encombrants, gravats, sacs abandonnes', 1),
  ('Poubelle debordante', 'poubelle-debordante', 'trash', '#F59E0B',
    (SELECT id FROM services WHERE slug = 'proprete'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'proprete'),
    'Container plein ou renverse', 2),
  ('Tag / graffiti', 'tag-graffiti', 'trash', '#F59E0B',
    (SELECT id FROM services WHERE slug = 'proprete'), 'both',
    (SELECT id FROM categories WHERE slug = 'proprete'),
    'Tag, graffiti, affichage sauvage', 3),
  ('Dejections canines', 'dejections-canines', 'trash', '#F59E0B',
    (SELECT id FROM services WHERE slug = 'proprete'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'proprete'),
    'Zone souilee de maniere recurrente', 4),

  -- Espaces verts sub-categories
  ('Arbre dangereux', 'arbre-dangereux', 'tree', '#10B981',
    (SELECT id FROM services WHERE slug = 'espaces-verts'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'espaces-verts'),
    'Branche cassee, arbre penche, risque de chute', 1),
  ('Vegetation debordante', 'vegetation-debordante', 'tree', '#10B981',
    (SELECT id FROM services WHERE slug = 'espaces-verts'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'espaces-verts'),
    'Haie non taillee, vegetal sur trottoir', 2),
  ('Jeux enfants abimes', 'jeux-enfants', 'tree', '#10B981',
    (SELECT id FROM services WHERE slug = 'espaces-verts'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'espaces-verts'),
    'Equipement de jeux casse ou dangereux', 3),
  ('Berges de Seine', 'berges-seine', 'tree', '#10B981',
    (SELECT id FROM services WHERE slug = 'espaces-verts'), 'services_techniques',
    (SELECT id FROM categories WHERE slug = 'espaces-verts'),
    'Dechets, chemin impraticable, erosion', 4);

-- Update existing categories with routed_to
UPDATE categories SET routed_to = 'police_municipale' WHERE slug = 'stationnement';
UPDATE categories SET routed_to = 'police_municipale' WHERE slug = 'nuisances';
UPDATE categories SET description = 'Chaussee, trottoir, signalisation' WHERE slug = 'voirie';
UPDATE categories SET description = 'Nettoyage, dechets, conteneurs' WHERE slug = 'proprete';
UPDATE categories SET description = 'Lampadaires, eclairage public' WHERE slug = 'eclairage';
UPDATE categories SET description = 'Parcs, arbres, berges de Seine' WHERE slug = 'espaces-verts';
UPDATE categories SET description = 'Bancs, potelets, panneaux' WHERE slug = 'mobilier-urbain';
UPDATE categories SET description = 'Vehicule genant, epave (-> PM)' WHERE slug = 'stationnement';
UPDATE categories SET description = 'Bruit, troubles (-> PM)' WHERE slug = 'nuisances';

-- =====================================================
-- 2. ALERTES GEOLOCALISEES
-- =====================================================

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),

  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('travaux', 'intemperie', 'securite', 'evenement', 'info')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),

  -- Zone geographique (cercle)
  center GEOGRAPHY(Point, 4326),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  radius_meters INTEGER NOT NULL DEFAULT 1000,

  -- Ou commune entiere
  commune_wide BOOLEAN NOT NULL DEFAULT false,

  -- Validite
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,

  -- Stats
  sent_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_alerts_active ON alerts (active, starts_at, ends_at);
CREATE INDEX idx_alerts_location ON alerts USING GIST (center);

-- =====================================================
-- 3. AGENDA EVENEMENTS MUNICIPAUX
-- =====================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),

  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  body TEXT, -- rich content

  -- Lieu
  location_name TEXT,
  location GEOGRAPHY(Point, 4326),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,

  -- Dates
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT false,

  -- Categorisation
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'culture', 'sport', 'enfance', 'seniors', 'solidarite', 'environnement', 'conseil_municipal')),

  image_url TEXT,
  registration_url TEXT,
  max_participants INTEGER,

  published BOOLEAN NOT NULL DEFAULT false,
  cancelled BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_events_date ON events (starts_at) WHERE published = true;

-- Rappels
CREATE TABLE event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- =====================================================
-- 4. ANNUAIRE SERVICES + EQUIPEMENTS
-- =====================================================

CREATE TABLE municipal_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'administratif'
    CHECK (category IN ('administratif', 'education', 'sport', 'culture', 'sante', 'social', 'securite', 'technique')),

  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Lieu
  address TEXT,
  location GEOGRAPHY(Point, 4326),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,

  -- Horaires (JSON: {lundi: {open: "08:30", close: "17:00"}, ...})
  opening_hours JSONB,

  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'ecole', 'creche', 'sport', 'culture', 'parc', 'parking',
    'mairie', 'poste', 'sante', 'commerce', 'transport', 'autre'
  )),

  address TEXT,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,

  description TEXT,
  phone TEXT,
  opening_hours JSONB,
  image_url TEXT,
  accessibility BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_facilities_location ON public_facilities USING GIST (location);
CREATE INDEX idx_facilities_type ON public_facilities (type);

-- =====================================================
-- 5. SONDAGES & BUDGET PARTICIPATIF
-- =====================================================

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),

  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('poll', 'budget_participatif')),

  -- Dates
  opens_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closes_at TIMESTAMPTZ NOT NULL,

  -- Budget participatif
  total_budget NUMERIC(12, 2), -- budget total en euros

  published BOOLEAN NOT NULL DEFAULT false,
  anonymous BOOLEAN NOT NULL DEFAULT false,

  -- Stats
  total_votes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  estimated_cost NUMERIC(12, 2), -- for budget participatif
  vote_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id) -- 1 vote par personne par sondage
);

-- =====================================================
-- 6. ASSISTANT IA (conversations)
-- =====================================================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL, -- for anonymous users
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB, -- RAG sources used
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_messages_conv ON ai_messages (conversation_id, created_at);

-- Knowledge base for RAG
CREATE TABLE ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  source_url TEXT,
  embedding VECTOR(1024), -- for semantic search (requires pgvector)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- 7. TOURNEES AGENTS
-- =====================================================

CREATE TABLE agent_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),

  name TEXT NOT NULL,
  date DATE NOT NULL,
  agent_id UUID NOT NULL REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),

  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),

  -- Route optimization
  optimized_route JSONB, -- ordered list of stops with coords
  estimated_duration_min INTEGER,
  actual_duration_min INTEGER,

  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE tour_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES agent_tours(id) ON DELETE CASCADE,
  signalement_id UUID REFERENCES signalements(id),

  -- Or custom stop (not linked to signalement)
  label TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,

  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'arrived', 'completed', 'skipped')),

  -- Intervention
  photo_before_url TEXT,
  photo_after_url TEXT,
  notes TEXT,
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  checklist JSONB -- [{task: "Reboucher", done: true}, ...]
);

CREATE INDEX idx_tour_stops_tour ON tour_stops (tour_id, sort_order);

-- =====================================================
-- 8. POLICE MUNICIPALE
-- =====================================================

CREATE TABLE pm_main_courante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  agent_id UUID NOT NULL REFERENCES profiles(id),

  type TEXT NOT NULL CHECK (type IN (
    'constat', 'intervention', 'ronde', 'pv',
    'plainte', 'info', 'accident', 'autre'
  )),

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Lieu
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location GEOGRAPHY(Point, 4326),
  address TEXT,

  -- Lien eventuel avec signalement citoyen
  signalement_id UUID REFERENCES signalements(id),

  -- PV
  pv_number TEXT,
  plate_number TEXT,
  infraction_type TEXT,

  -- Pieces jointes
  photos JSONB, -- array of URLs

  severity TEXT NOT NULL DEFAULT 'normal'
    CHECK (severity IN ('low', 'normal', 'high', 'urgent')),

  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed', 'transferred'))
);

CREATE INDEX idx_pm_mc_date ON pm_main_courante (created_at DESC);
CREATE INDEX idx_pm_mc_agent ON pm_main_courante (agent_id);
CREATE INDEX idx_pm_mc_type ON pm_main_courante (type);

-- Rondes planifiees
CREATE TABLE pm_patrols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  name TEXT NOT NULL,
  date DATE NOT NULL,
  agent_ids UUID[] NOT NULL, -- multiple agents

  route JSONB, -- ordered waypoints
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),

  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  incidents_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

-- =====================================================
-- 9. MULTI-TENANT / MULTI-COMMUNES
-- =====================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Croissy-sur-Seine"
  slug TEXT NOT NULL UNIQUE, -- "croissy"

  -- Config
  population INTEGER,
  department TEXT,
  region TEXT,

  -- Branding
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  logo_url TEXT,

  -- Center
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,

  -- Plan
  plan TEXT NOT NULL DEFAULT 'pro'
    CHECK (plan IN ('essentiel', 'pro', 'premium')),

  -- Modules actives
  modules JSONB NOT NULL DEFAULT '["signalements"]',

  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add tenant_id to key tables
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE polls ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Default tenant: Croissy
INSERT INTO tenants (name, slug, population, department, region, latitude, longitude, plan, modules)
VALUES (
  'Croissy-sur-Seine', 'croissy', 10000, '78', 'Ile-de-France',
  48.8783, 2.1372, 'premium',
  '["signalements", "alertes", "agenda", "annuaire", "participatif", "assistant_ia", "tournees", "police_municipale"]'
);

-- =====================================================
-- 10. WEBHOOKS / CONNECTEURS SI
-- =====================================================

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),

  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT, -- HMAC signing secret

  events TEXT[] NOT NULL, -- ['signalement.created', 'signalement.updated', ...]
  active BOOLEAN NOT NULL DEFAULT true,

  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_logs_webhook ON webhook_logs (webhook_id, created_at DESC);

-- RLS for new tables
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_main_courante ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tours ENABLE ROW LEVEL SECURITY;

-- Public read for citizen-facing data
CREATE POLICY public_read_alerts ON alerts FOR SELECT USING (active = true);
CREATE POLICY public_read_events ON events FOR SELECT USING (published = true);
CREATE POLICY public_read_polls ON polls FOR SELECT USING (published = true);
CREATE POLICY public_read_services ON municipal_services FOR SELECT USING (active = true);
CREATE POLICY public_read_facilities ON public_facilities FOR SELECT USING (active = true);

-- Staff write
CREATE POLICY staff_manage_alerts ON alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY staff_manage_events ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY staff_manage_polls ON polls FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Citizen votes
CREATE POLICY citizen_vote ON poll_votes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY citizen_own_votes ON poll_votes FOR SELECT USING (user_id = auth.uid());

-- AI conversations: own only
CREATE POLICY own_ai_conv ON ai_conversations FOR ALL USING (user_id = auth.uid());

-- PM: police only
CREATE POLICY pm_access ON pm_main_courante FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')
    AND service_id = (SELECT id FROM services WHERE slug = 'police-municipale'))
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tours: agents only
CREATE POLICY agent_tours_access ON agent_tours FOR ALL USING (
  agent_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
