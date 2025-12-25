'use server';

import { createClient } from '@/lib/supabase/server';
import type { DbScanHistory, UserScanStats } from '@/lib/db-types';
import { analysisToDbInsert } from '@/lib/db-types';
import type { AnalysisResult } from '@/lib/types';

// Fetch user's scan history
export async function getUserScans(limit = 10): Promise<DbScanHistory[]> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        // Table might not exist yet - return empty array
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
            console.warn('scan_history table not found. Run the SQL migration first.');
            return [];
        }
        console.error('Error fetching scans:', error.message || error);
        return [];
    }

    return data || [];
}

// Fetch user's scan statistics
export async function getUserStats(): Promise<UserScanStats | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('user_scan_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        // Table/view might not exist or no data - return defaults
        return {
            user_id: user.id,
            total_scans: 0,
            safe_count: 0,
            suspicious_count: 0,
            dangerous_count: 0,
            last_scan_at: null,
        };
    }

    return data;
}

// Save a scan to history
export async function saveScan(
    result: AnalysisResult,
    subject?: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const insertData = analysisToDbInsert(user.id, result, subject);

    const { error } = await supabase
        .from('scan_history')
        .insert(insertData);

    if (error) {
        console.error('Error saving scan:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Delete a scan from history
export async function deleteScan(scanId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', scanId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting scan:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Get weekly trend data
export async function getWeeklyTrend(): Promise<{ thisWeek: number; lastWeek: number; percentChange: number }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { thisWeek: 0, lastWeek: 0, percentChange: 0 };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // This week's scans
    const { count: thisWeek } = await supabase
        .from('scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

    // Last week's scans
    const { count: lastWeek } = await supabase
        .from('scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', weekAgo.toISOString());

    const thisWeekCount = thisWeek || 0;
    const lastWeekCount = lastWeek || 0;
    const percentChange = lastWeekCount === 0
        ? (thisWeekCount > 0 ? 100 : 0)
        : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);

    return {
        thisWeek: thisWeekCount,
        lastWeek: lastWeekCount,
        percentChange,
    };
}
