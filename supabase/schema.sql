-- ==============================================================================
-- BREWRICH WEALTH & INSTITUTIONAL TRADING PLATFORM
-- Supabase Database Schema & RLS Policies
-- ==============================================================================

-- 1. Create table for tracking Module and Payment Status
CREATE TABLE IF NOT EXISTS public.module_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    amount_paid NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    order_id TEXT,
    payment_id TEXT,
    signature TEXT,
    quiz_1_unlocked BOOLEAN DEFAULT FALSE,
    quiz_2_unlocked BOOLEAN DEFAULT FALSE,
    quiz_1_score INTEGER,
    quiz_2_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on email and user_id for high-speed queries
CREATE INDEX IF NOT EXISTS idx_module_status_email ON public.module_status(email);
CREATE INDEX IF NOT EXISTS idx_module_status_user_id ON public.module_status(user_id);
CREATE INDEX IF NOT EXISTS idx_module_status_is_paid ON public.module_status(is_paid);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.module_status ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Policy: Allow authenticated users to view their own module_status record
DROP POLICY IF EXISTS "Users can view their own module status" ON public.module_status;
CREATE POLICY "Users can view their own module status"
    ON public.module_status
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id OR auth.jwt() ->> 'email' = email
    );

-- Policy: Allow authenticated users to update their quiz scores
DROP POLICY IF EXISTS "Users can update their own quiz scores" ON public.module_status;
CREATE POLICY "Users can update their own quiz scores"
    ON public.module_status
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id OR auth.jwt() ->> 'email' = email
    )
    WITH CHECK (
        auth.uid() = user_id OR auth.jwt() ->> 'email' = email
    );

-- Policy: Service role has full access (for payment verification webhook/API)
DROP POLICY IF EXISTS "Service role has full access to module_status" ON public.module_status;
CREATE POLICY "Service role has full access to module_status"
    ON public.module_status
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Trigger for updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_module_status_updated_at ON public.module_status;
CREATE TRIGGER set_module_status_updated_at
    BEFORE UPDATE ON public.module_status
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Trigger to automatically initialize module_status row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.module_status (user_id, email, is_paid, quiz_1_unlocked, quiz_2_unlocked)
    VALUES (
        NEW.id,
        NEW.email,
        FALSE,
        FALSE,
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
