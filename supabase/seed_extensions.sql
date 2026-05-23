-- =====================================================
-- SEED DATA: Realistic Croissy-sur-Seine content
-- =====================================================

-- Service Police Municipale
INSERT INTO services (name, slug) VALUES ('Police municipale', 'police-municipale');

-- Alertes
INSERT INTO alerts (title, body, type, severity, latitude, longitude, center, radius_meters, commune_wide, starts_at, ends_at) VALUES
('Travaux rue de Paris', 'Travaux de voirie du 20 au 30 mai. Circulation alternee. Deviation par la rue de Verdun.', 'travaux', 'warning', 48.8790, 2.1345, ST_SetSRID(ST_MakePoint(2.1345, 48.8790), 4326)::geography, 300, false, now(), now() + interval '10 days'),
('Alerte meteo orange', 'Vigilance orange vent violent. Evitez les deplacements inutiles. Eloignez-vous des arbres.', 'intemperie', 'critical', 48.8783, 2.1372, ST_SetSRID(ST_MakePoint(2.1372, 48.8783), 4326)::geography, 5000, true, now(), now() + interval '1 day'),
('Coupure d eau programmee', 'Coupure d eau le 25 mai de 9h a 14h secteur parc Chanorier pour travaux de canalisation.', 'info', 'info', 48.8788, 2.1320, ST_SetSRID(ST_MakePoint(2.1320, 48.8788), 4326)::geography, 500, false, now() + interval '5 days', now() + interval '5 days 5 hours');

-- Evenements
INSERT INTO events (title, description, starts_at, ends_at, category, location_name, address, latitude, longitude, location, published, all_day) VALUES
('Fete de la musique', 'Concert gratuit sur les berges de Seine. Plusieurs groupes locaux se produiront de 18h a minuit.', now() + interval '30 days', now() + interval '30 days 6 hours', 'culture', 'Berges de Seine', 'Berges de Seine, 78290 Croissy-sur-Seine', 48.8775, 2.1350, ST_SetSRID(ST_MakePoint(2.1350, 48.8775), 4326)::geography, true, false),
('Brocante du centre-ville', 'Grande brocante annuelle. Plus de 100 exposants attendus. Restauration sur place.', now() + interval '15 days', now() + interval '15 days 8 hours', 'general', 'Place de la Mairie', 'Place de la Mairie, 78290 Croissy-sur-Seine', 48.8783, 2.1372, ST_SetSRID(ST_MakePoint(2.1372, 48.8783), 4326)::geography, true, true),
('Conseil municipal', 'Seance publique du conseil municipal. Ordre du jour : budget 2026, amenagement berges.', now() + interval '7 days', now() + interval '7 days 3 hours', 'conseil_municipal', 'Salle du conseil, Mairie', 'Place de la Mairie, 78290 Croissy-sur-Seine', 48.8783, 2.1372, ST_SetSRID(ST_MakePoint(2.1372, 48.8783), 4326)::geography, true, false),
('Stage multisport enfants', 'Stage vacances pour les 6-12 ans. Inscription obligatoire. 5 euros par jour.', now() + interval '45 days', now() + interval '49 days', 'sport', 'Gymnase municipal', '10 Rue du Stade, 78290 Croissy-sur-Seine', 48.8770, 2.1390, ST_SetSRID(ST_MakePoint(2.1390, 48.8770), 4326)::geography, true, false),
('Atelier seniors numerique', 'Initiation tablette et smartphone. Gratuit sur inscription. Places limitees a 15 personnes.', now() + interval '10 days', now() + interval '10 days 2 hours', 'seniors', 'Espace Marcel Pagnol', '5 Rue des Arts, 78290 Croissy-sur-Seine', 48.8795, 2.1360, ST_SetSRID(ST_MakePoint(2.1360, 48.8795), 4326)::geography, true, false);

-- Annuaire services
INSERT INTO municipal_services (name, slug, description, category, phone, email, address, latitude, longitude, location, opening_hours) VALUES
('Mairie', 'mairie', 'Accueil general, etat civil, urbanisme, elections', 'administratif', '01 30 53 00 00', 'mairie@croissy.fr', 'Place de la Mairie, 78290 Croissy-sur-Seine', 48.8783, 2.1372, ST_SetSRID(ST_MakePoint(2.1372, 48.8783), 4326)::geography, '{"lundi": {"open": "08:30", "close": "12:00"}, "mardi": {"open": "08:30", "close": "17:00"}, "mercredi": {"open": "08:30", "close": "12:00"}, "jeudi": {"open": "08:30", "close": "17:00"}, "vendredi": {"open": "08:30", "close": "17:00"}}'),
('Services techniques', 'services-tech', 'Voirie, espaces verts, batiments, eclairage public', 'technique', '01 30 53 00 10', 'technique@croissy.fr', '8 Rue des Ateliers, 78290 Croissy-sur-Seine', 48.8770, 2.1380, ST_SetSRID(ST_MakePoint(2.1380, 48.8770), 4326)::geography, '{"lundi": {"open": "08:00", "close": "16:30"}, "mardi": {"open": "08:00", "close": "16:30"}, "mercredi": {"open": "08:00", "close": "16:30"}, "jeudi": {"open": "08:00", "close": "16:30"}, "vendredi": {"open": "08:00", "close": "16:00"}}'),
('Police municipale', 'police-mun', 'Securite, stationnement, tranquillite publique', 'securite', '01 30 53 00 20', 'pm@croissy.fr', '2 Place de la Mairie, 78290 Croissy-sur-Seine', 48.8784, 2.1370, ST_SetSRID(ST_MakePoint(2.1370, 48.8784), 4326)::geography, '{"lundi": {"open": "08:30", "close": "18:00"}, "mardi": {"open": "08:30", "close": "18:00"}, "mercredi": {"open": "08:30", "close": "18:00"}, "jeudi": {"open": "08:30", "close": "18:00"}, "vendredi": {"open": "08:30", "close": "18:00"}, "samedi": {"open": "09:00", "close": "12:00"}}'),
('Mediatheque', 'mediatheque', 'Pret de livres, CD, DVD. Espace numerique. Animations.', 'culture', '01 30 53 00 30', 'mediatheque@croissy.fr', '12 Rue de la Paix, 78290 Croissy-sur-Seine', 48.8790, 2.1365, ST_SetSRID(ST_MakePoint(2.1365, 48.8790), 4326)::geography, '{"mardi": {"open": "15:00", "close": "19:00"}, "mercredi": {"open": "10:00", "close": "18:00"}, "vendredi": {"open": "15:00", "close": "19:00"}, "samedi": {"open": "10:00", "close": "17:00"}}');

-- Equipements publics
INSERT INTO public_facilities (name, type, address, latitude, longitude, location, description, accessibility) VALUES
('Parc Chanorier', 'parc', 'Rue du Parc, 78290 Croissy-sur-Seine', 48.8788, 2.1320, ST_SetSRID(ST_MakePoint(2.1320, 48.8788), 4326)::geography, 'Parc boise de 3 hectares en bord de Seine. Aire de jeux, sentiers.', true),
('Gymnase municipal', 'sport', '10 Rue du Stade, 78290 Croissy-sur-Seine', 48.8770, 2.1390, ST_SetSRID(ST_MakePoint(2.1390, 48.8770), 4326)::geography, 'Gymnase multisport : basket, badminton, gym.', true),
('Ecole elementaire Monet', 'ecole', '15 Rue Claude Monet, 78290 Croissy-sur-Seine', 48.8795, 2.1340, ST_SetSRID(ST_MakePoint(2.1340, 48.8795), 4326)::geography, 'Ecole elementaire publique. 12 classes.', true),
('Creche Les Petits Pas', 'creche', '3 Rue des Lilas, 78290 Croissy-sur-Seine', 48.8780, 2.1355, ST_SetSRID(ST_MakePoint(2.1355, 48.8780), 4326)::geography, 'Creche municipale. 40 places. 0-3 ans.', true),
('Parking Mairie', 'parking', 'Place de la Mairie, 78290 Croissy-sur-Seine', 48.8782, 2.1375, ST_SetSRID(ST_MakePoint(2.1375, 48.8782), 4326)::geography, 'Parking gratuit 80 places. 2 places PMR.', true),
('Tennis Club', 'sport', '20 Avenue du Sport, 78290 Croissy-sur-Seine', 48.8765, 2.1400, ST_SetSRID(ST_MakePoint(2.1400, 48.8765), 4326)::geography, '4 courts exterieurs, 2 couverts. Ecole de tennis.', false);

-- Sondage actif
INSERT INTO polls (title, description, type, opens_at, closes_at, published, total_budget) VALUES
('Budget participatif 2026', 'Choisissez le projet qui sera finance par la commune a hauteur de 50 000 euros.', 'budget_participatif', now(), now() + interval '30 days', true, 50000);

INSERT INTO poll_options (poll_id, title, description, estimated_cost, vote_count, sort_order) VALUES
((SELECT id FROM polls WHERE title LIKE 'Budget%'), 'Renovation aires de jeux', 'Remplacement des jeux du parc Chanorier et creation d une aire pour les tout-petits.', 45000, 127, 1),
((SELECT id FROM polls WHERE title LIKE 'Budget%'), 'Piste cyclable rue de Paris', 'Amenagement d une piste cyclable securisee sur toute la rue de Paris (1.2km).', 48000, 98, 2),
((SELECT id FROM polls WHERE title LIKE 'Budget%'), 'Jardins partages', 'Creation de 20 parcelles de jardins partages sur le terrain municipal rue des Gabillons.', 25000, 84, 3),
((SELECT id FROM polls WHERE title LIKE 'Budget%'), 'Eclairage solaire berges', 'Installation de 15 bornes d eclairage solaire le long du chemin de halage.', 35000, 72, 4);

-- Sondage eclair
INSERT INTO polls (title, description, type, opens_at, closes_at, published) VALUES
('Horaires piscine ete', 'Quels horaires d ouverture preferez-vous pour la piscine cet ete ?', 'poll', now(), now() + interval '14 days', true);

INSERT INTO poll_options (poll_id, title, vote_count, sort_order) VALUES
((SELECT id FROM polls WHERE title LIKE 'Horaires%'), '7h-20h (actuel)', 45, 1),
((SELECT id FROM polls WHERE title LIKE 'Horaires%'), '6h-21h (elargi)', 112, 2),
((SELECT id FROM polls WHERE title LIKE 'Horaires%'), '8h-22h (decale)', 67, 3);

-- Knowledge base for AI assistant
INSERT INTO ai_knowledge_base (title, content, category) VALUES
('Horaires mairie', 'La mairie de Croissy-sur-Seine est ouverte le lundi de 8h30 a 12h, mardi et jeudi de 8h30 a 17h, mercredi de 8h30 a 12h, vendredi de 8h30 a 17h. Fermee le samedi et dimanche.', 'services'),
('Carte d identite', 'Pour faire ou renouveler une carte d identite, prendre rendez-vous en ligne sur le site de la mairie. Apporter : ancien titre, photo, justificatif de domicile de moins de 3 mois, acte de naissance.', 'demarches'),
('Ramassage encombrants', 'Le ramassage des encombrants a lieu tous les premiers lundis du mois. Deposer les objets la veille au soir devant votre domicile. Maximum 2m3 par foyer. Prendre rendez-vous au 01 30 53 00 10.', 'services'),
('Inscriptions scolaires', 'Les inscriptions scolaires pour la rentree se font en mairie de mars a juin. Apporter : livret de famille, justificatif de domicile, carnet de vaccinations. Pour la maternelle : enfants ayant 3 ans dans l annee.', 'demarches'),
('Stationnement', 'Le stationnement est gratuit dans toute la commune. Les zones bleues (disque) sont limitees a 1h30 en centre-ville. La police municipale verbalise le stationnement genant (trottoirs, passages pietons).', 'reglementation'),
('Collecte dechets', 'Ordures menageres : mardi et vendredi matin. Tri selectif (bac jaune) : mercredi matin. Verre : points d apport volontaire. Dechetterie intercommunale a Chatou ouverte du lundi au samedi.', 'services'),
('Piscine municipale', 'Piscine decouverte ouverte de juin a septembre. Tarifs : adulte 5 euros, enfant 3 euros, carnet 10 entrees 40 euros. Cours de natation le mercredi.', 'loisirs');
