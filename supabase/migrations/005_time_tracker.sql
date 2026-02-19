-- ============================================
-- HAPP — Migration 005: Zaman İzleyici (Time Tracker)
-- ============================================

-- Zaman olayları tablosu
CREATE TABLE time_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Temel bilgiler
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN (
    'general', 'health', 'fitness', 'education', 'career',
    'relationship', 'hobby', 'travel', 'milestone', 'other'
  )),

  -- Zaman tipi: 'countup' = geçmişten şimdiye, 'countdown' = şimdiden geleceğe
  event_type TEXT NOT NULL CHECK (event_type IN ('countup', 'countdown')),

  -- Tarihler
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ, -- sadece countdown için zorunlu

  -- Medya
  before_image_url TEXT,
  after_image_url TEXT,

  -- Görünürlük
  is_public BOOLEAN DEFAULT false,

  -- Renk teması
  color TEXT DEFAULT '#00A86B',

  -- İstatistikler
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Zaman damgaları
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beğeniler tablosu
CREATE TABLE time_event_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES time_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Eşik bildirimleri tablosu
CREATE TABLE time_event_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES time_events(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN (
    'days', 'weeks', 'months', 'years', 'seconds', 'custom'
  )),
  milestone_value BIGINT NOT NULL,
  label TEXT,
  notified BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger
CREATE TRIGGER time_events_updated_at
  BEFORE UPDATE ON time_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexler
CREATE INDEX idx_time_events_user_id ON time_events(user_id);
CREATE INDEX idx_time_events_public ON time_events(is_public) WHERE is_public = true;
CREATE INDEX idx_time_event_likes_event ON time_event_likes(event_id);
CREATE INDEX idx_time_event_milestones_event ON time_event_milestones(event_id);

-- RLS
ALTER TABLE time_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_event_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_event_milestones ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi eventlerini görebilir
CREATE POLICY "Users can view own events"
  ON time_events FOR SELECT
  USING (auth.uid() = user_id);

-- Herkese açık eventleri herkes görebilir
CREATE POLICY "Anyone can view public events"
  ON time_events FOR SELECT
  USING (is_public = true);

-- Kullanıcı kendi eventlerini oluşturabilir
CREATE POLICY "Users can create own events"
  ON time_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi eventlerini güncelleyebilir
CREATE POLICY "Users can update own events"
  ON time_events FOR UPDATE
  USING (auth.uid() = user_id);

-- Kullanıcı kendi eventlerini silebilir
CREATE POLICY "Users can delete own events"
  ON time_events FOR DELETE
  USING (auth.uid() = user_id);

-- Beğeni politikaları
CREATE POLICY "Users can like events"
  ON time_event_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike events"
  ON time_event_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
  ON time_event_likes FOR SELECT
  USING (true);

-- Milestone politikaları
CREATE POLICY "Users can manage own milestones"
  ON time_event_milestones FOR ALL
  USING (
    event_id IN (SELECT id FROM time_events WHERE user_id = auth.uid())
  );

-- Storage bucket (Supabase Dashboard'dan da oluşturulabilir)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('time-tracker-media', 'time-tracker-media', true);
