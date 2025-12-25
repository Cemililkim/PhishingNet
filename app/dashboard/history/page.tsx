import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserScans } from '@/lib/data/scans';
import { dbScanToDisplay } from '@/lib/db-types';
import HistoryContent from './HistoryContent';

export default async function HistoryPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch all scans (up to 100)
    const scans = await getUserScans(100);
    const displayScans = scans.map(dbScanToDisplay);

    return <HistoryContent user={user} scans={displayScans} />;
}
