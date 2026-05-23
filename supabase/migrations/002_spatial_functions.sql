-- Function to find nearby signalements (used for dedup)
CREATE OR REPLACE FUNCTION nearby_signalements(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_m INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category_id UUID,
  status TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_m DOUBLE PRECISION
)
LANGUAGE sql STABLE
AS $$
  SELECT
    s.id,
    s.title,
    s.description,
    s.category_id,
    s.status,
    s.latitude,
    s.longitude,
    ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) AS distance_m
  FROM signalements s
  WHERE
    s.status != 'resolved'
    AND ST_DWithin(
      s.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_m
    )
  ORDER BY distance_m;
$$;

-- Function for dashboard chart data (signalements per day, last 7 days)
CREATE OR REPLACE FUNCTION signalements_per_day(days INTEGER DEFAULT 7)
RETURNS TABLE (
  date DATE,
  received BIGINT,
  resolved BIGINT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    d::date AS date,
    COUNT(*) FILTER (WHERE s.created_at::date = d::date) AS received,
    COUNT(*) FILTER (WHERE s.resolved_at::date = d::date) AS resolved
  FROM
    generate_series(
      current_date - (days - 1),
      current_date,
      '1 day'
    ) AS d
  LEFT JOIN signalements s ON
    s.created_at::date = d::date
    OR s.resolved_at::date = d::date
  GROUP BY d::date
  ORDER BY d::date;
$$;

-- Function for heatmap data
CREATE OR REPLACE FUNCTION signalements_heatmap()
RETURNS TABLE (
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  weight INTEGER
)
LANGUAGE sql STABLE
AS $$
  SELECT
    ROUND(s.latitude::numeric, 4)::double precision AS latitude,
    ROUND(s.longitude::numeric, 4)::double precision AS longitude,
    COUNT(*)::integer AS weight
  FROM signalements s
  WHERE s.created_at > now() - interval '30 days'
  GROUP BY 1, 2;
$$;
