-- ============================================
-- SCRIPT SQL POUR SUPABASE
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 1000.00,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des paris
CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT NOT NULL,
  selection TEXT CHECK (selection IN ('home', 'away')) NOT NULL,
  selected_team TEXT NOT NULL,
  odds DECIMAL(5, 2) NOT NULL,
  stake DECIMAL(10, 2) NOT NULL,
  potential_win DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'won', 'lost')) DEFAULT 'pending',
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- 3. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_bets_placed_at ON bets(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_balance ON users(balance DESC);

-- 4. Row Level Security (RLS)

-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Politiques pour users
-- Lecture publique (pour le classement)
CREATE POLICY "Users are viewable by everyone" 
  ON users FOR SELECT 
  USING (true);

-- Modification uniquement par soi-même
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Insertion via signup
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Politiques pour bets
-- Lecture publique (pour voir les paris des autres)
CREATE POLICY "Bets are viewable by everyone" 
  ON bets FOR SELECT 
  USING (true);

-- Création par utilisateur authentifié
CREATE POLICY "Users can create own bets" 
  ON bets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Modification uniquement par admin (pour régler les paris)
-- Note: pour un vrai site, il faudrait un système admin
CREATE POLICY "Users can view own bets" 
  ON bets FOR UPDATE 
  USING (auth.uid() = user_id);

-- 5. Fonction pour créer un utilisateur après signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    1000.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour auto-créer le profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Fonction pour mettre à jour le solde après un pari gagné
CREATE OR REPLACE FUNCTION public.settle_bet(bet_id UUID, is_won BOOLEAN)
RETURNS VOID AS $$
DECLARE
  bet_record RECORD;
BEGIN
  -- Récupérer le pari
  SELECT * INTO bet_record FROM bets WHERE id = bet_id;
  
  IF bet_record IS NULL THEN
    RAISE EXCEPTION 'Pari non trouvé';
  END IF;
  
  -- Mettre à jour le statut
  UPDATE bets 
  SET status = CASE WHEN is_won THEN 'won' ELSE 'lost' END,
      settled_at = NOW()
  WHERE id = bet_id;
  
  -- Si gagné, créditer le gain
  IF is_won THEN
    UPDATE users 
    SET balance = balance + bet_record.potential_win
    WHERE id = bet_record.user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Vue pour le classement
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.username,
  u.balance,
  u.created_at,
  COUNT(b.id) as total_bets,
  COUNT(CASE WHEN b.status = 'won' THEN 1 END) as won_bets,
  COUNT(CASE WHEN b.status = 'lost' THEN 1 END) as lost_bets,
  COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bets,
  COALESCE(SUM(b.stake), 0) as total_wagered,
  COALESCE(SUM(CASE WHEN b.status = 'won' THEN b.potential_win ELSE 0 END), 0) as total_won,
  CASE 
    WHEN COUNT(CASE WHEN b.status IN ('won', 'lost') THEN 1 END) > 0 
    THEN ROUND(
      COUNT(CASE WHEN b.status = 'won' THEN 1 END)::DECIMAL / 
      COUNT(CASE WHEN b.status IN ('won', 'lost') THEN 1 END) * 100, 2
    )
    ELSE 0 
  END as win_rate,
  COALESCE(SUM(CASE WHEN b.status = 'won' THEN b.potential_win ELSE 0 END), 0) - COALESCE(SUM(b.stake), 0) as profit_loss
FROM users u
LEFT JOIN bets b ON u.id = b.user_id
GROUP BY u.id, u.username, u.balance, u.created_at
ORDER BY profit_loss DESC;

-- 8. Données de test (optionnel)
-- Décommente pour ajouter des utilisateurs de test

/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'test1@test.com', crypt('password123', gen_salt('bf')), NOW(), '{"username": "ProGamer"}'),
  ('22222222-2222-2222-2222-222222222222', 'test2@test.com', crypt('password123', gen_salt('bf')), NOW(), '{"username": "BetKing"}'),
  ('33333333-3333-3333-3333-333333333333', 'test3@test.com', crypt('password123', gen_salt('bf')), NOW(), '{"username": "Lucky777"}');
*/

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================
-- 
-- 1. Créer un compte sur https://supabase.com
-- 2. Créer un nouveau projet
-- 3. Aller dans SQL Editor
-- 4. Copier-coller ce script et l'exécuter
-- 5. Aller dans Settings > API
-- 6. Copier l'URL et la clé anon
-- 7. Créer un fichier .env dans le dossier app:
--    VITE_SUPABASE_URL=https://votre-projet.supabase.co
--    VITE_SUPABASE_ANON_KEY=votre-clé-anon
-- 8. Relancer npm run dev
--
-- ============================================
