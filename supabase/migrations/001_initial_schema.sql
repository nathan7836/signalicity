-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Services municipaux
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories de signalement
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'help-circle',
  color TEXT NOT NULL DEFAULT '#6B7280',
  service_id UUID REFERENCES services(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profils utilisateurs (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'citizen'
    CHECK (role IN ('citizen', 'agent', 'manager', 'admin', 'elected')),
  service_id UUID REFERENCES services(id),
  avatar_url TEXT,
  push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Signalements
CREATE TABLE signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Auteur (utilisateur connecte ou invite)
  user_id UUID REFERENCES profiles(id),
  guest_email TEXT,

  -- Contenu
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  ai_description TEXT,
  photo_url TEXT NOT NULL,
  photo_after_url TEXT,

  -- Geolocalisation
  location GEOGRAPHY(Point, 4326) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,

  -- Statut et priorite
  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'in_progress', 'resolved')),
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Affectation
  assigned_service_id UUID REFERENCES services(id),
  assigned_agent_id UUID REFERENCES profiles(id),

  -- Doublons
  duplicate_of UUID REFERENCES signalements(id),

  -- Notes internes
  internal_notes TEXT,
  resolved_at TIMESTAMPTZ,

  CONSTRAINT has_author CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL)
);

-- Index geographique
CREATE INDEX idx_signalements_location ON signalements USING GIST (location);
CREATE INDEX idx_signalements_status ON signalements (status);
CREATE INDEX idx_signalements_category ON signalements (category_id);
CREATE INDEX idx_signalements_created ON signalements (created_at DESC);
CREATE INDEX idx_signalements_user ON signalements (user_id);

-- Historique des statuts
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signalement_id UUID NOT NULL REFERENCES signalements(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_history_signalement ON status_history (signalement_id);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signalement_id UUID REFERENCES signalements(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, read, created_at DESC);

-- Trigger: maj updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER signalements_updated_at
  BEFORE UPDATE ON signalements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: historique auto des changements de statut
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO status_history (signalement_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.assigned_agent_id);
  END IF;
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER signalements_status_change
  BEFORE UPDATE ON signalements
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- RLS (Row Level Security)
ALTER TABLE signalements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Citoyens: voient leurs propres signalements
CREATE POLICY citizen_own_signalements ON signalements
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'manager', 'admin', 'elected'))
  );

CREATE POLICY citizen_insert_signalement ON signalements
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Agents+: peuvent modifier les signalements
CREATE POLICY staff_update_signalements ON signalements
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'manager', 'admin'))
  );

-- Profils: chacun voit le sien, staff voit tout
CREATE POLICY own_profile ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'manager', 'admin', 'elected'))
  );

-- Notifications: chacun les siennes
CREATE POLICY own_notifications ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY own_notifications_update ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Donnees initiales
INSERT INTO services (name, slug) VALUES
  ('Voirie', 'voirie'),
  ('Proprete urbaine', 'proprete'),
  ('Eclairage public', 'eclairage'),
  ('Espaces verts', 'espaces-verts'),
  ('Services techniques', 'services-techniques');

INSERT INTO categories (name, slug, icon, color, service_id) VALUES
  ('Voirie', 'voirie', 'road', '#6366F1', (SELECT id FROM services WHERE slug = 'voirie')),
  ('Proprete', 'proprete', 'trash', '#F59E0B', (SELECT id FROM services WHERE slug = 'proprete')),
  ('Eclairage', 'eclairage', 'lightbulb', '#FBBF24', (SELECT id FROM services WHERE slug = 'eclairage')),
  ('Espaces verts', 'espaces-verts', 'tree', '#10B981', (SELECT id FROM services WHERE slug = 'espaces-verts')),
  ('Mobilier urbain', 'mobilier-urbain', 'bench', '#8B5CF6', (SELECT id FROM services WHERE slug = 'services-techniques')),
  ('Stationnement', 'stationnement', 'car', '#EF4444', (SELECT id FROM services WHERE slug = 'voirie')),
  ('Nuisances', 'nuisances', 'volume-x', '#EC4899', (SELECT id FROM services WHERE slug = 'services-techniques')),
  ('Autre', 'autre', 'help-circle', '#6B7280', (SELECT id FROM services WHERE slug = 'services-techniques'));
