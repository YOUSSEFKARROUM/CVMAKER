-- ══════════════════════════════════════════
-- NETTOYAGE (safe à relancer — DROP IF EXISTS)
-- ══════════════════════════════════════════
DROP POLICY IF EXISTS "Users can view own profile"       ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles"      ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can view own requests"      ON public.download_requests;
DROP POLICY IF EXISTS "Users can insert own requests"    ON public.download_requests;
DROP POLICY IF EXISTS "Admin can view all requests"      ON public.download_requests;
DROP POLICY IF EXISTS "Admin can update all requests"    ON public.download_requests;
DROP POLICY IF EXISTS "Admin can view audit log"         ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admin can insert audit log"       ON public.admin_audit_log;

DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_download_requests_status;
DROP INDEX IF EXISTS idx_download_requests_user;
DROP INDEX IF EXISTS idx_audit_log_admin;
DROP INDEX IF EXISTS idx_audit_log_created;

-- ══════════════════════════════════════════
-- TABLE : profiles (infos étendues des users)
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_banned BOOLEAN NOT NULL DEFAULT false,
  ban_reason TEXT,
  can_download_pdf BOOLEAN NOT NULL DEFAULT false,
  total_cvs_created INTEGER NOT NULL DEFAULT 0,
  total_downloads INTEGER NOT NULL DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'displayName', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'youssefaitkarroum.pro@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════
-- TABLE : download_requests
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.download_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_name TEXT NOT NULL,
  template_used TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- ══════════════════════════════════════════
-- TABLE : admin_audit_log
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- RLS (Row Level Security)
-- ══════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

ALTER TABLE public.download_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON public.download_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests"
  ON public.download_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all requests"
  ON public.download_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all requests"
  ON public.download_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view audit log"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can insert audit log"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ══════════════════════════════════════════
-- INDEX pour performance
-- ══════════════════════════════════════════
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_download_requests_status ON public.download_requests(status);
CREATE INDEX idx_download_requests_user ON public.download_requests(user_id);
CREATE INDEX idx_audit_log_admin ON public.admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_created ON public.admin_audit_log(created_at DESC);

-- ══════════════════════════════════════════
-- TABLE : saved_cvs (CVs persistés en Supabase)
-- ══════════════════════════════════════════
DROP POLICY IF EXISTS "Users CRUD own CVs" ON public.saved_cvs;
DROP INDEX IF EXISTS idx_saved_cvs_user;

CREATE TABLE IF NOT EXISTS public.saved_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mon CV',
  cv_data JSONB NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users CRUD own CVs" ON public.saved_cvs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_cvs_user ON public.saved_cvs(user_id);

-- ══════════════════════════════════════════
-- QUOTA TÉLÉCHARGEMENT (virement bancaire 30 DH = 4 PDFs)
-- Exécuter ce bloc dans Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS downloads_remaining INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS has_paid BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_approved_at TIMESTAMPTZ;
