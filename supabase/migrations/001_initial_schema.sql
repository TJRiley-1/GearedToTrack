-- GearedtoTrack Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  default_track_length INTEGER DEFAULT 250,
  wheel_diameter INTEGER DEFAULT 668,
  share_data_enabled BOOLEAN DEFAULT false,
  share_age BOOLEAN DEFAULT false,
  share_lap_times BOOLEAN DEFAULT false,
  share_gear_ratios BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chainrings table
CREATE TABLE chainrings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teeth INTEGER NOT NULL CHECK (teeth > 0),
  brand TEXT,
  purchase_date DATE,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sprockets table
CREATE TABLE sprockets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teeth INTEGER NOT NULL CHECK (teeth > 0),
  brand TEXT,
  purchase_date DATE,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lap sessions table
CREATE TABLE lap_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  track_name TEXT,
  track_length INTEGER DEFAULT 250,
  chainring_id UUID REFERENCES chainrings(id) ON DELETE SET NULL,
  sprocket_id UUID REFERENCES sprockets(id) ON DELETE SET NULL,
  notes TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lap times table
CREATE TABLE lap_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES lap_sessions(id) ON DELETE CASCADE,
  lap_number INTEGER NOT NULL CHECK (lap_number > 0),
  time_ms INTEGER NOT NULL CHECK (time_ms > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_chainrings_user_id ON chainrings(user_id);
CREATE INDEX idx_sprockets_user_id ON sprockets(user_id);
CREATE INDEX idx_lap_sessions_user_id ON lap_sessions(user_id);
CREATE INDEX idx_lap_sessions_event_type ON lap_sessions(event_type);
CREATE INDEX idx_lap_sessions_session_date ON lap_sessions(session_date DESC);
CREATE INDEX idx_lap_times_session_id ON lap_times(session_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chainrings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE lap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lap_times ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for chainrings
CREATE POLICY "Users can view own chainrings"
  ON chainrings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chainrings"
  ON chainrings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chainrings"
  ON chainrings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chainrings"
  ON chainrings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for sprockets
CREATE POLICY "Users can view own sprockets"
  ON sprockets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sprockets"
  ON sprockets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sprockets"
  ON sprockets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sprockets"
  ON sprockets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for lap_sessions
CREATE POLICY "Users can view own sessions"
  ON lap_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON lap_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON lap_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON lap_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for lap_times (through session ownership)
CREATE POLICY "Users can view lap times of own sessions"
  ON lap_times FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lap_sessions
      WHERE lap_sessions.id = lap_times.session_id
      AND lap_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert lap times to own sessions"
  ON lap_times FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lap_sessions
      WHERE lap_sessions.id = lap_times.session_id
      AND lap_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lap times of own sessions"
  ON lap_times FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM lap_sessions
      WHERE lap_sessions.id = lap_times.session_id
      AND lap_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete lap times of own sessions"
  ON lap_times FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lap_sessions
      WHERE lap_sessions.id = lap_times.session_id
      AND lap_sessions.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
