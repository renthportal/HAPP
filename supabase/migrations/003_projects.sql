-- ============================================
-- HAPP — Migration 003: Projeler & Vinçler & Rehber
-- ============================================

-- Ana proje tablosu — her kaldırma planı bir proje
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Vinç konfigürasyonu (HAPP cfg state'inin tamamı)
  config JSONB NOT NULL DEFAULT '{
    "craneType": "mobile",
    "boomLength": 30,
    "boomAngle": 45,
    "jibEnabled": false,
    "jibLength": 10,
    "jibAngle": 15,
    "pivotHeight": 2.5,
    "pivotDist": 1.2,
    "craneEnd": 4,
    "loadWeight": 5,
    "counterweight": 20,
    "windSpeed": 0,
    "skinId": "default",
    "loadW": 3,
    "loadH": 2,
    "loadShape": "box",
    "slingType": "2leg",
    "slingLength": 4,
    "slingLegs": 2,
    "hookBlockH": 1.2,
    "chartId": ""
  }',
  
  -- Canvas nesneleri (binalar, engeller)
  objects JSONB DEFAULT '[]',
  
  -- Cetveller
  rulers JSONB DEFAULT '[]',
  
  -- Kaldırma planı form verisi
  lift_plan JSONB DEFAULT '{
    "jobTitle": "",
    "location": "",
    "date": "",
    "supervisor": "",
    "supplier": "",
    "supplierContact": "",
    "client": "",
    "clientContact": "",
    "loadWeight": 0,
    "riggingWeight": 0,
    "hookBlockWeight": 0,
    "wll": 0,
    "notes": ""
  }',
  
  -- Durum
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','completed','archived')),
  
  -- Meta
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kayıtlı vinç konfigürasyonları (tekrar kullanım)
CREATE TABLE saved_cranes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  crane_type TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  config JSONB NOT NULL,
  chart_id UUID REFERENCES load_charts(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rehber (tedarikçi, müşteri, vinç firması)
CREATE TABLE directory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('supplier','client','crane_company','subcontractor')),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER directory_updated_at
  BEFORE UPDATE ON directory_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_cranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_entries ENABLE ROW LEVEL SECURITY;

-- Projeler: sahibi veya takım üyesi erişebilir
CREATE POLICY "projects_select" ON projects FOR SELECT USING (
  user_id = auth.uid() OR
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (
  user_id = auth.uid() OR
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('owner','admin','member'))
);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (
  user_id = auth.uid()
);

-- Kayıtlı vinçler
CREATE POLICY "cranes_access" ON saved_cranes FOR ALL USING (
  user_id = auth.uid() OR
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);

-- Rehber
CREATE POLICY "directory_access" ON directory_entries FOR ALL USING (
  user_id = auth.uid() OR
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);

-- Indexler
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_saved_cranes_user ON saved_cranes(user_id);
CREATE INDEX idx_directory_user ON directory_entries(user_id);
CREATE INDEX idx_directory_type ON directory_entries(entry_type);
