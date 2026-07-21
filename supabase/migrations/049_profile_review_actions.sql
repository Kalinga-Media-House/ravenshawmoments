-- Migration 049: Profile Review and User Control Actions
-- Description: Adds tracking columns for administrative actions (suspension, restoration, soft deletion)
-- and creates the profile_correction_requests table.

-- 1. Add tracking columns to public.profiles if they do not exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'suspended_by') THEN
        ALTER TABLE public.profiles ADD COLUMN suspended_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'suspended_at') THEN
        ALTER TABLE public.profiles ADD COLUMN suspended_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'suspension_reason') THEN
        ALTER TABLE public.profiles ADD COLUMN suspension_reason text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'suspension_expires_at') THEN
        ALTER TABLE public.profiles ADD COLUMN suspension_expires_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'restored_by') THEN
        ALTER TABLE public.profiles ADD COLUMN restored_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'restored_at') THEN
        ALTER TABLE public.profiles ADD COLUMN restored_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'deleted_by') THEN
        ALTER TABLE public.profiles ADD COLUMN deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'deletion_reason') THEN
        ALTER TABLE public.profiles ADD COLUMN deletion_reason text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'previous_profile_status') THEN
        -- Re-use the existing profile_status enum
        ALTER TABLE public.profiles ADD COLUMN previous_profile_status public.profile_status;
    END IF;
END $$;

-- 2. Create profile_correction_requests table
CREATE TABLE IF NOT EXISTS public.profile_correction_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
    requested_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz,
    resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. Add RLS Policies for profile_correction_requests
ALTER TABLE public.profile_correction_requests ENABLE ROW LEVEL SECURITY;

-- Read Policy: User can view their own requests, Admins/CRs/BMCs can view requests for profiles they manage.
-- We use a simple policy for viewing (authenticated users can view if they requested it, or if they have administrative roles over the target).
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profile_correction_requests' AND policyname = 'Users can view their own correction requests'
    ) THEN
        CREATE POLICY "Users can view their own correction requests"
            ON public.profile_correction_requests
            FOR SELECT
            TO authenticated
            USING (
                requested_by = auth.uid() OR profile_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.profile_roles pr
                    JOIN public.roles r ON r.id = pr.role_id
                    WHERE pr.profile_id = auth.uid() AND pr.is_active = true 
                    AND r.code IN ('SUPER_ADMIN', 'ADMIN')
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profile_correction_requests' AND policyname = 'Admins can insert correction requests'
    ) THEN
        CREATE POLICY "Admins can insert correction requests"
            ON public.profile_correction_requests
            FOR INSERT
            TO authenticated
            WITH CHECK (
                requested_by = auth.uid()
            );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profile_correction_requests' AND policyname = 'Admins can update correction requests'
    ) THEN
        CREATE POLICY "Admins can update correction requests"
            ON public.profile_correction_requests
            FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.profile_roles pr
                    JOIN public.roles r ON r.id = pr.role_id
                    WHERE pr.profile_id = auth.uid() AND pr.is_active = true 
                    AND r.code IN ('SUPER_ADMIN', 'ADMIN')
                )
            );
    END IF;
END $$;
