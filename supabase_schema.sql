-- Table Definition: user_projects
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    state_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, template_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own projects
CREATE POLICY "Users can view own projects" 
ON public.user_projects
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own projects
CREATE POLICY "Users can insert own projects" 
ON public.user_projects
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own projects
CREATE POLICY "Users can update own projects" 
ON public.user_projects
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own projects
CREATE POLICY "Users can delete own projects" 
ON public.user_projects
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger to auto-update 'updated_at' on row update
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.user_projects;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.user_projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
