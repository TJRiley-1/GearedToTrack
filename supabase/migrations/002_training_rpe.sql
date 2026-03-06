-- Add RPE (Rate of Perceived Exertion) to lap sessions for training load tracking
ALTER TABLE lap_sessions ADD COLUMN rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10);

COMMENT ON COLUMN lap_sessions.rpe IS 'Rate of Perceived Exertion (1-10 Borg scale)';
