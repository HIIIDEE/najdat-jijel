-- 1. Enum du statut
DO $$ BEGIN
    CREATE TYPE medical_verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table des volontaires médicaux
CREATE TABLE IF NOT EXISTS public.medical_volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    specialty TEXT NOT NULL,
    license_number TEXT,
    wilaya_code TEXT NOT NULL,
    commune_id TEXT NOT NULL,
    current_workplace TEXT,
    can_teleconsult BOOLEAN NOT NULL DEFAULT false,
    can_field_intervene BOOLEAN NOT NULL DEFAULT true,
    has_emergency_kit BOOLEAN NOT NULL DEFAULT false,
    status medical_verification_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Sécurité RLS
ALTER TABLE public.medical_volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "medical_volunteers_public_insert" ON public.medical_volunteers;
DROP POLICY IF EXISTS "medical_volunteers_admin_select" ON public.medical_volunteers;
DROP POLICY IF EXISTS "medical_volunteers_admin_update" ON public.medical_volunteers;

-- Insertion ouverte à tout le monde
CREATE POLICY "medical_volunteers_public_insert"
    ON public.medical_volunteers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Lecture réservée aux administrateurs (aligné sur public.profiles)
CREATE POLICY "medical_volunteers_admin_select"
    ON public.medical_volunteers
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Modification réservée aux administrateurs
CREATE POLICY "medical_volunteers_admin_update"
    ON public.medical_volunteers
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );