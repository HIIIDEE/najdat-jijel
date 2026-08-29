-- Table des signaux SOS (bouton طوارئ) — le code appelant (src/actions/sos.ts)
-- existait déjà sans table ni migration derrière ; celle-ci comble le manque.
CREATE TABLE IF NOT EXISTS public.emergency_sos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.emergency_sos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emergency_sos_public_insert" ON public.emergency_sos;
DROP POLICY IF EXISTS "emergency_sos_admin_select" ON public.emergency_sos;

-- إبلاغ الطوارئ متاح للجميع دون تسجيل دخول
CREATE POLICY "emergency_sos_public_insert"
    ON public.emergency_sos
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- القراءة محصورة بالأدمن (بيانات موقع حساسة وقت الخطر)
CREATE POLICY "emergency_sos_admin_select"
    ON public.emergency_sos
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
