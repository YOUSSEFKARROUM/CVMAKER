import { supabase } from '../supabase/client';
import { useAuth } from './useAuth';

export interface DownloadStatus {
  hasAccess: boolean;
  downloadsRemaining: number;
  requestStatus: { status: string; note?: string };
}

export function useDownloadRequest() {
  const { user } = useAuth();

  async function requestDownload(cvName: string, templateUsed: string) {
    if (!user) throw new Error('Not authenticated');

    // Check if already pending to avoid duplicates
    const { data: existing } = await supabase
      .from('download_requests')
      .select('id, status')
      .eq('user_id', user.uid)
      .eq('status', 'pending')
      .maybeSingle();

    if (existing) throw new Error('ALREADY_PENDING');

    const { error } = await supabase
      .from('download_requests')
      .insert({ user_id: user.uid, cv_name: cvName, template_used: templateUsed });
    if (error) throw error;
  }

  async function getMyRequests() {
    if (!user) return [];
    const { data, error } = await supabase
      .from('download_requests')
      .select('*')
      .eq('user_id', user.uid)
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async function checkDownloadStatus(): Promise<DownloadStatus> {
    if (!user) return { hasAccess: false, downloadsRemaining: 0, requestStatus: { status: 'none' } };

    const [profileResult, requestResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('can_download_pdf, downloads_remaining')
        .eq('id', user.uid)
        .single(),
      supabase
        .from('download_requests')
        .select('status, admin_note')
        .eq('user_id', user.uid)
        .order('requested_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    return {
      hasAccess: profileResult.data?.can_download_pdf ?? false,
      downloadsRemaining: profileResult.data?.downloads_remaining ?? 0,
      requestStatus: {
        status: requestResult.data?.status ?? 'none',
        note: requestResult.data?.admin_note ?? undefined,
      },
    };
  }

  async function canUserDownload(): Promise<boolean> {
    if (!user) return false;
    const { data, error } = await supabase
      .from('profiles')
      .select('can_download_pdf')
      .eq('id', user.uid)
      .single();
    if (error) return false;
    return data?.can_download_pdf ?? false;
  }

  return { requestDownload, getMyRequests, canUserDownload, checkDownloadStatus };
}
