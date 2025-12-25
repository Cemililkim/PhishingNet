-- Create scan_history table to store user's email analysis results
CREATE TABLE IF NOT EXISTS scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    domain TEXT NOT NULL,
    subject TEXT,
    verdict TEXT NOT NULL CHECK (verdict IN ('safe', 'suspicious', 'dangerous')),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    spf_status TEXT NOT NULL,
    dkim_status TEXT NOT NULL,
    dmarc_status TEXT NOT NULL,
    is_lookalike BOOLEAN DEFAULT false,
    similar_to TEXT,
    ai_signals JSONB DEFAULT '[]'::jsonb,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_verdict ON scan_history(verdict);

-- Enable Row Level Security
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own scans
CREATE POLICY "Users can view own scans"
    ON scan_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: users can insert their own scans
CREATE POLICY "Users can insert own scans"
    ON scan_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: users can delete their own scans
CREATE POLICY "Users can delete own scans"
    ON scan_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create user_stats view for dashboard
CREATE OR REPLACE VIEW user_scan_stats AS
SELECT 
    user_id,
    COUNT(*) as total_scans,
    COUNT(*) FILTER (WHERE verdict = 'safe') as safe_count,
    COUNT(*) FILTER (WHERE verdict = 'suspicious') as suspicious_count,
    COUNT(*) FILTER (WHERE verdict = 'dangerous') as dangerous_count,
    MAX(created_at) as last_scan_at
FROM scan_history
GROUP BY user_id;
