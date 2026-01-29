-- ============================================
-- SCRIPT CORRECTIF POUR LES PARIS (RLS)
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Activer RLS sur la table bets (au cas où)
ALTER TABLE IF EXISTS public.bets ENABLE ROW LEVEL SECURITY;

-- 2. Nettoyer les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Bets are viewable by everyone" ON public.bets;
DROP POLICY IF EXISTS "Users can create own bets" ON public.bets;
DROP POLICY IF EXISTS "Users can view own bets" ON public.bets;

-- 3. Créer les politiques correctes

-- Lecture publique : tout le monde peut voir les paris (nécessaire pour le feed global et l'historique)
CREATE POLICY "Bets are viewable by everyone" 
  ON public.bets FOR SELECT 
  USING (true);

-- Insertion : Un utilisateur ne peut créer un pari que pour lui-même
CREATE POLICY "Users can create own bets" 
  ON public.bets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Mise à jour : Un utilisateur ne peut pas modifier ses paris (sauf via admin/backend si nécessaire)
-- Mais pour l'instant, disons qu'il peut voir ses propres mises à jour si on faisait des updates
-- Note : La mise à jour du statut est faite coté serveur ou admin. 
-- Pour sécuriser, on peut empêcher l'update par défaut ou le limiter.
-- Ici, on va permettre l'update si c'est son propre pari, utile si on veut implémenter une modif avant validation
-- CREATE POLICY "Users can update own bets" ... (Optionnel, pas nécessaire bloquant pour l'erreur actuelle)

-- ============================================
-- Ce script corrige l'erreur "row-level security policy violation" lors du pari.
-- ============================================
