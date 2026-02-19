-- ============================================
-- HAPP — Migration 005: Filo Vinçleri & Konfigürasyonlar
-- ============================================

-- Firmaya ait vinçler (filo)
CREATE TABLE fleet_cranes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,                    -- "LTM 1300-6.2"
  manufacturer TEXT,                     -- "Liebherr"
  crane_type TEXT DEFAULT 'mobile',      -- mobile, crawler, rough, truck
  max_capacity NUMERIC,                  -- Maks kapasite (t)
  
  -- Genel bilgiler
  serial_number TEXT,
  year_of_manufacture INTEGER,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Konfigürasyonlar (her vinç altında birden fazla)
CREATE TABLE crane_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crane_id UUID REFERENCES fleet_cranes(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,                    -- "Teleskopik 87.5t CW"
  description TEXT,                      -- Açıklama
  
  -- Teknik bilgiler
  counterweight TEXT,                    -- "87.5t"
  boom_type TEXT DEFAULT 'telescopic',   -- telescopic, lattice, luffing
  max_boom NUMERIC,                      -- Bu konfig maks boom (m)
  max_capacity_at_config NUMERIC,        -- Bu konfig maks kapasite (t)
  outrigger_config TEXT DEFAULT 'full',  -- full, partial, retracted
  
  -- Nakliye bilgileri (JSONB array)
  -- [{type:"lowbed", count:3, notes:"Ana boom + CW"}, {type:"truck", count:1, notes:"Aksesuar"}]
  transport_vehicles JSONB DEFAULT '[]',
  
  -- Yük tablosu bağlantısı (load_charts tablosuna)
  load_chart_id UUID REFERENCES load_charts(id) ON DELETE SET NULL,
  
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_fleet_cranes_user ON fleet_cranes(user_id);
CREATE INDEX idx_crane_configs_crane ON crane_configs(crane_id);

-- RLS
ALTER TABLE fleet_cranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crane_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fleet_cranes_select" ON fleet_cranes FOR SELECT USING (true);
CREATE POLICY "fleet_cranes_insert" ON fleet_cranes FOR INSERT WITH CHECK (true);
CREATE POLICY "fleet_cranes_update" ON fleet_cranes FOR UPDATE USING (true);
CREATE POLICY "fleet_cranes_delete" ON fleet_cranes FOR DELETE USING (true);

CREATE POLICY "crane_configs_select" ON crane_configs FOR SELECT USING (true);
CREATE POLICY "crane_configs_insert" ON crane_configs FOR INSERT WITH CHECK (true);
CREATE POLICY "crane_configs_update" ON crane_configs FOR UPDATE USING (true);
CREATE POLICY "crane_configs_delete" ON crane_configs FOR DELETE USING (true);
