-- ============================================
-- HAPP — Migration 004: Yük Tabloları (Load Charts)
-- ============================================

CREATE TABLE load_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  
  -- Görünürlük
  is_public BOOLEAN DEFAULT false,
  is_preset BOOLEAN DEFAULT false,  -- HAPP varsayılan tabloları
  
  -- Vinç bilgisi
  name TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  crane_type TEXT DEFAULT 'mobile',
  
  -- Kapasite verileri
  max_capacity NUMERIC NOT NULL,
  max_boom NUMERIC NOT NULL,
  pivot_height NUMERIC DEFAULT 3,
  boom_lengths NUMERIC[] NOT NULL,
  
  -- Ana veri: [{r: 3, caps: [500, 420, null, ...]}, ...]
  chart_data JSONB NOT NULL,
  
  -- Ek konfigürasyon
  counterweight_config TEXT,
  outrigger_config TEXT DEFAULT 'full',
  jib_lengths NUMERIC[],
  notes TEXT,
  source TEXT,  -- "manufacturer_manual", "user_input", "csv_import"
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER load_charts_updated_at
  BEFORE UPDATE ON load_charts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE load_charts ENABLE ROW LEVEL SECURITY;

-- Herkes preset ve public tabloları görebilir
CREATE POLICY "Public/preset charts visible"
  ON load_charts FOR SELECT
  USING (
    is_public = true OR
    is_preset = true OR
    user_id = auth.uid() OR
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );

-- Kullanıcı kendi tablosunu oluşturabilir
CREATE POLICY "User can create charts"
  ON load_charts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Kullanıcı kendi tablosunu güncelleyebilir
CREATE POLICY "User can update own charts"
  ON load_charts FOR UPDATE
  USING (user_id = auth.uid());

-- Kullanıcı kendi tablosunu silebilir
CREATE POLICY "User can delete own charts"
  ON load_charts FOR DELETE
  USING (user_id = auth.uid() AND is_preset = false);

-- Indexler
CREATE INDEX idx_load_charts_public ON load_charts(is_public) WHERE is_public = true;
CREATE INDEX idx_load_charts_preset ON load_charts(is_preset) WHERE is_preset = true;
CREATE INDEX idx_load_charts_user ON load_charts(user_id);

-- ============================================
-- PRESET YÜK TABLOLARI
-- ============================================

-- 500t Mobil Vinç (Genel / LTM 1500 benzeri)
INSERT INTO load_charts (
  is_public, is_preset, name, manufacturer, model, crane_type,
  max_capacity, max_boom, pivot_height,
  boom_lengths, chart_data, outrigger_config, source, notes
) VALUES (
  true, true,
  '500t Mobil Vinç (Genel)',
  'Genel', 'LTM 1500 Benzeri', 'mobile',
  500, 84, 3.2,
  ARRAY[15,21,28,35,42,50,58,66,74,84],
  '[
    {"r":3,  "caps":[500,420,null,null,null,null,null,null,null,null]},
    {"r":4,  "caps":[400,365,310,null,null,null,null,null,null,null]},
    {"r":5,  "caps":[330,300,270,240,null,null,null,null,null,null]},
    {"r":6,  "caps":[280,255,235,210,185,null,null,null,null,null]},
    {"r":7,  "caps":[240,220,205,185,165,150,null,null,null,null]},
    {"r":8,  "caps":[210,195,180,165,148,135,120,null,null,null]},
    {"r":9,  "caps":[185,175,162,148,133,122,108,96,null,null]},
    {"r":10, "caps":[165,155,145,134,120,110,98,88,78,null]},
    {"r":12, "caps":[132,125,118,110,100,91,82,74,66,58]},
    {"r":14, "caps":[108,102,97,92,84,77,70,63,57,50]},
    {"r":16, "caps":[90,86,82,78,72,66,60,55,49,43]},
    {"r":18, "caps":[76,73,70,67,62,57,52,48,43,38]},
    {"r":20, "caps":[65,62,60,57,54,50,46,42,38,33]},
    {"r":22, "caps":[null,54,52,50,47,44,41,37,34,30]},
    {"r":24, "caps":[null,47,46,44,42,39,36,33,30,27]},
    {"r":26, "caps":[null,null,40,39,37,35,32,30,27,24]},
    {"r":28, "caps":[null,null,36,35,33,31,29,27,24,22]},
    {"r":30, "caps":[null,null,32,31,30,28,26,24,22,19]},
    {"r":34, "caps":[null,null,null,25,24,23,21,20,18,16]},
    {"r":38, "caps":[null,null,null,null,20,19,18,16,15,13]},
    {"r":42, "caps":[null,null,null,null,16,15,14,13,12,10]},
    {"r":46, "caps":[null,null,null,null,null,12,11,10,9,8]},
    {"r":50, "caps":[null,null,null,null,null,10,9,8,7,6]},
    {"r":56, "caps":[null,null,null,null,null,null,7,6,5,5]},
    {"r":62, "caps":[null,null,null,null,null,null,null,5,4,4]},
    {"r":70, "caps":[null,null,null,null,null,null,null,null,3,3]}
  ]'::jsonb,
  'full', 'preset',
  'Genel 500t sınıfı mobil vinç yük tablosu. Tam dışa ayak, standart karşı ağırlık. Gerçek kaldırma için üretici tablosunu referans alın.'
);

-- 250t Mobil Vinç (Genel / LTM 1250 benzeri)
INSERT INTO load_charts (
  is_public, is_preset, name, manufacturer, model, crane_type,
  max_capacity, max_boom, pivot_height,
  boom_lengths, chart_data, outrigger_config, source, notes
) VALUES (
  true, true,
  '250t Mobil Vinç (Genel)',
  'Genel', 'LTM 1250 Benzeri', 'mobile',
  250, 60, 2.8,
  ARRAY[12,18,24,30,38,46,54,60],
  '[
    {"r":3,  "caps":[250,210,null,null,null,null,null,null]},
    {"r":4,  "caps":[200,180,160,null,null,null,null,null]},
    {"r":5,  "caps":[165,150,138,125,null,null,null,null]},
    {"r":6,  "caps":[138,128,118,108,92,null,null,null]},
    {"r":7,  "caps":[118,110,102,95,82,70,null,null]},
    {"r":8,  "caps":[102,96,90,84,74,64,54,null]},
    {"r":10, "caps":[78,74,70,66,59,52,45,40]},
    {"r":12, "caps":[62,59,56,54,48,43,38,34]},
    {"r":14, "caps":[50,48,46,44,40,36,32,28]},
    {"r":16, "caps":[42,40,38,37,34,30,27,24]},
    {"r":18, "caps":[35,34,33,32,29,26,23,21]},
    {"r":20, "caps":[30,29,28,27,25,22,20,18]},
    {"r":24, "caps":[null,23,22,21,20,18,16,14]},
    {"r":28, "caps":[null,null,17,17,16,14,13,11]},
    {"r":32, "caps":[null,null,null,13,12,11,10,9]},
    {"r":38, "caps":[null,null,null,null,9,8,7,6]},
    {"r":44, "caps":[null,null,null,null,null,6,5,5]},
    {"r":50, "caps":[null,null,null,null,null,null,4,3]}
  ]'::jsonb,
  'full', 'preset',
  'Genel 250t sınıfı mobil vinç yük tablosu. Tam dışa ayak, standart karşı ağırlık.'
);

-- 100t Mobil Vinç (Genel)
INSERT INTO load_charts (
  is_public, is_preset, name, manufacturer, model, crane_type,
  max_capacity, max_boom, pivot_height,
  boom_lengths, chart_data, outrigger_config, source, notes
) VALUES (
  true, true,
  '100t Mobil Vinç (Genel)',
  'Genel', 'LTM 1100 Benzeri', 'mobile',
  100, 50, 2.5,
  ARRAY[10,16,22,28,36,44,50],
  '[
    {"r":3,  "caps":[100,85,null,null,null,null,null]},
    {"r":4,  "caps":[82,72,62,null,null,null,null]},
    {"r":5,  "caps":[68,60,54,48,null,null,null]},
    {"r":6,  "caps":[57,52,47,42,35,null,null]},
    {"r":7,  "caps":[49,45,41,37,31,25,null]},
    {"r":8,  "caps":[42,39,36,33,28,23,19]},
    {"r":10, "caps":[32,30,28,26,22,18,15]},
    {"r":12, "caps":[25,24,22,21,18,15,12]},
    {"r":14, "caps":[20,19,18,17,15,12,10]},
    {"r":16, "caps":[null,16,15,14,12,10,8]},
    {"r":18, "caps":[null,13,12,12,10,8,7]},
    {"r":20, "caps":[null,null,10,10,9,7,6]},
    {"r":24, "caps":[null,null,null,7,7,5,4]},
    {"r":28, "caps":[null,null,null,null,5,4,3]},
    {"r":34, "caps":[null,null,null,null,null,3,2]},
    {"r":40, "caps":[null,null,null,null,null,null,1.5]}
  ]'::jsonb,
  'full', 'preset',
  'Genel 100t sınıfı mobil vinç yük tablosu.'
);
