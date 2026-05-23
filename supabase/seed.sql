-- Demo data for development and presentations

-- Create demo users via auth (in real Supabase, use auth.users)
-- These profiles assume corresponding auth.users exist

-- Demo signalements with realistic Croissy-sur-Seine locations
INSERT INTO signalements (
  title, description, ai_description, photo_url,
  location, latitude, longitude, address,
  status, severity, category_id, guest_email, created_at
) VALUES
(
  'Nid de poule rue de Paris',
  'Important nid de poule sur la chaussee, dangereux pour les velos.',
  'Degradation de chaussee detectee : nid de poule de taille moyenne sur voie principale.',
  'https://placehold.co/800x600/6366F1/white?text=Voirie',
  ST_SetSRID(ST_MakePoint(2.1345, 48.8790), 4326)::geography,
  48.8790, 2.1345,
  '15 Rue de Paris, 78290 Croissy-sur-Seine',
  'received', 'high',
  (SELECT id FROM categories WHERE slug = 'voirie'),
  'jean.dupont@email.fr',
  now() - interval '2 hours'
),
(
  'Poubelle renversee avenue de Verdun',
  'Poubelle de tri renversee, dechets au sol.',
  'Container de tri selectif renverse. Dechets disperses sur le trottoir.',
  'https://placehold.co/800x600/F59E0B/white?text=Proprete',
  ST_SetSRID(ST_MakePoint(2.1380, 48.8775), 4326)::geography,
  48.8775, 2.1380,
  '8 Avenue de Verdun, 78290 Croissy-sur-Seine',
  'in_progress', 'medium',
  (SELECT id FROM categories WHERE slug = 'proprete'),
  'marie.martin@email.fr',
  now() - interval '1 day'
),
(
  'Lampadaire en panne',
  'Lampadaire eteint depuis plusieurs jours, zone sombre le soir.',
  'Eclairage public defaillant : lampadaire hors service.',
  'https://placehold.co/800x600/FBBF24/white?text=Eclairage',
  ST_SetSRID(ST_MakePoint(2.1360, 48.8800), 4326)::geography,
  48.8800, 2.1360,
  '22 Rue Jean Jaures, 78290 Croissy-sur-Seine',
  'resolved', 'medium',
  (SELECT id FROM categories WHERE slug = 'eclairage'),
  'pierre.durand@email.fr',
  now() - interval '5 days'
),
(
  'Branche cassee parc Chanorier',
  'Grosse branche cassee bloquant partiellement le chemin.',
  'Branche d arbre de grande taille tombee sur sentier pedestrian dans espace vert public.',
  'https://placehold.co/800x600/10B981/white?text=Espaces+Verts',
  ST_SetSRID(ST_MakePoint(2.1320, 48.8788), 4326)::geography,
  48.8788, 2.1320,
  'Parc Chanorier, 78290 Croissy-sur-Seine',
  'received', 'high',
  (SELECT id FROM categories WHERE slug = 'espaces-verts'),
  'sophie.leroy@email.fr',
  now() - interval '3 hours'
),
(
  'Banc casse place de la Mairie',
  'Assise du banc brisee, risque de blessure.',
  'Mobilier urbain endommage : banc public avec assise fracturee.',
  'https://placehold.co/800x600/8B5CF6/white?text=Mobilier',
  ST_SetSRID(ST_MakePoint(2.1372, 48.8783), 4326)::geography,
  48.8783, 2.1372,
  'Place de la Mairie, 78290 Croissy-sur-Seine',
  'in_progress', 'low',
  (SELECT id FROM categories WHERE slug = 'mobilier-urbain'),
  'lucas.moreau@email.fr',
  now() - interval '2 days'
),
(
  'Stationnement genant rue du Bac',
  'Vehicule stationne sur le trottoir, passage impossible pour les poussettes.',
  'Stationnement irregulier : vehicule sur trottoir bloquant la circulation pietonne.',
  'https://placehold.co/800x600/EF4444/white?text=Stationnement',
  ST_SetSRID(ST_MakePoint(2.1400, 48.8770), 4326)::geography,
  48.8770, 2.1400,
  '5 Rue du Bac, 78290 Croissy-sur-Seine',
  'received', 'medium',
  (SELECT id FROM categories WHERE slug = 'stationnement'),
  'emma.petit@email.fr',
  now() - interval '30 minutes'
),
(
  'Nuisances sonores chantier',
  'Travaux de chantier tres tot le matin avant 7h.',
  'Nuisances sonores signalees : activite de chantier en dehors des horaires autorises.',
  'https://placehold.co/800x600/EC4899/white?text=Nuisances',
  ST_SetSRID(ST_MakePoint(2.1350, 48.8760), 4326)::geography,
  48.8760, 2.1350,
  '12 Rue des Gabillons, 78290 Croissy-sur-Seine',
  'resolved', 'low',
  (SELECT id FROM categories WHERE slug = 'nuisances'),
  'thomas.garcia@email.fr',
  now() - interval '1 week'
),
(
  'Trottoir degrade rue de Seine',
  'Dalles soulevees par les racines, risque de chute.',
  'Degradation du trottoir par soulèvement de dalles, probablement cause par racines d arbre.',
  'https://placehold.co/800x600/6366F1/white?text=Voirie+2',
  ST_SetSRID(ST_MakePoint(2.1390, 48.8795), 4326)::geography,
  48.8795, 2.1390,
  '30 Rue de Seine, 78290 Croissy-sur-Seine',
  'in_progress', 'high',
  (SELECT id FROM categories WHERE slug = 'voirie'),
  'julie.bernard@email.fr',
  now() - interval '3 days'
);

-- Status history for demo
INSERT INTO status_history (signalement_id, old_status, new_status, note, created_at)
SELECT id, NULL, 'received', 'Signalement recu automatiquement', created_at
FROM signalements;

INSERT INTO status_history (signalement_id, old_status, new_status, note, created_at)
SELECT id, 'received', 'in_progress', 'Pris en charge par le service competent', created_at + interval '4 hours'
FROM signalements WHERE status IN ('in_progress', 'resolved');

INSERT INTO status_history (signalement_id, old_status, new_status, note, created_at)
SELECT id, 'in_progress', 'resolved', 'Intervention effectuee', created_at + interval '2 days'
FROM signalements WHERE status = 'resolved';
