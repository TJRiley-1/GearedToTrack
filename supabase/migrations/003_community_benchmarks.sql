-- Community benchmarks: anonymous percentile aggregation
-- Only exposes aggregate statistics, never individual data

-- View: public lap performances for users who have opted in to data sharing
CREATE OR REPLACE VIEW public_lap_performances AS
SELECT
  ls.event_type,
  ls.track_length,
  lt.time_ms
FROM lap_sessions ls
JOIN lap_times lt ON lt.session_id = ls.id
JOIN profiles p ON p.id = ls.user_id
WHERE p.share_data_enabled = true
  AND p.share_lap_times = true;

-- RPC: get community benchmarks with percentile aggregation
-- Only returns events with >= 5 distinct users to preserve anonymity
CREATE OR REPLACE FUNCTION get_community_benchmarks()
RETURNS TABLE (
  event_type TEXT,
  track_length INTEGER,
  sample_size BIGINT,
  p10_ms DOUBLE PRECISION,
  p25_ms DOUBLE PRECISION,
  p50_ms DOUBLE PRECISION,
  p75_ms DOUBLE PRECISION,
  p90_ms DOUBLE PRECISION
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  WITH best_times AS (
    SELECT
      ls.event_type,
      ls.track_length,
      ls.user_id,
      MIN(lt.time_ms) AS best_time_ms
    FROM lap_sessions ls
    JOIN lap_times lt ON lt.session_id = ls.id
    JOIN profiles p ON p.id = ls.user_id
    WHERE p.share_data_enabled = true
      AND p.share_lap_times = true
    GROUP BY ls.event_type, ls.track_length, ls.user_id
  )
  SELECT
    bt.event_type,
    bt.track_length::INTEGER,
    COUNT(*)::BIGINT AS sample_size,
    PERCENTILE_CONT(0.10) WITHIN GROUP (ORDER BY bt.best_time_ms) AS p10_ms,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY bt.best_time_ms) AS p25_ms,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY bt.best_time_ms) AS p50_ms,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY bt.best_time_ms) AS p75_ms,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY bt.best_time_ms) AS p90_ms
  FROM best_times bt
  GROUP BY bt.event_type, bt.track_length
  HAVING COUNT(*) >= 5
  ORDER BY bt.event_type, bt.track_length;
$$;
