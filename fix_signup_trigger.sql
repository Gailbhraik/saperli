-- ============================================
-- SCRIPT CORRECTIF POUR L'INSCRIPTION
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Assurons-nous que la fonction de gestion des nouveaux utilisateurs est correcte
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, balance)
  VALUES (
    NEW.id,
    NEW.email,
    -- Utiliser le username des métadonnées, ou la partie avant @ de l'email par défaut
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    1000.00
  )
  ON CONFLICT (id) DO NOTHING; -- Éviter les erreurs si l'utilisateur existe déjà
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recréer le trigger pour être sûr qu'il est actif
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Vérifier et nettoyer les politiques qui pourraient bloquer
-- On s'assure que l'utilisateur peut modifier SON PROPRE profil une fois créé
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- On s'assure que tout le monde peut lire les profils (pour le classement)
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
CREATE POLICY "Users are viewable by everyone" 
  ON public.users FOR SELECT 
  USING (true);

-- IMPORTANT : On supprime la politique d'INSERT manuelle car c'est le Trigger qui s'en charge maintenant
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- ============================================
-- Une fois ce script exécuté, l'erreur RLS devrait disparaître
-- ============================================
