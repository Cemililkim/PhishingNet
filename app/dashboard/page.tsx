import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserScans, getUserStats, getWeeklyTrend } from '@/lib/data/scans';
import { dbScanToDisplay } from '@/lib/db-types';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch real data
    const [scans, stats, trend] = await Promise.all([
        getUserScans(10),
        getUserStats(),
        getWeeklyTrend(),
    ]);

    // Convert scans to display format
    const recentScans = scans.map(dbScanToDisplay);

    // Prepare stats with trend percentages
    const dashboardStats = {
        totalScans: stats?.total_scans || 0,
        safeCount: stats?.safe_count || 0,
        threatsCount: (stats?.suspicious_count || 0) + (stats?.dangerous_count || 0),
        weeklyChange: trend.percentChange,
    };

    return (
        <DashboardContent
            user={user}
            initialScans={recentScans}
            stats={dashboardStats}
        />
    );
}
