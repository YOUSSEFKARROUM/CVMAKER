import { supabase } from '../supabase/client';
import { useAuth } from './useAuth';

export function useDownloadRequest() {
  const { user } = useAuth();

  async function requestDownload(cvName: string, templateUsed: string) {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('download_requests')
      .insert({
        user_id: user.uid,
        cv_name: cvName,
        template_used: templateUsed,
      });
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

  return { requestDownload, getMyRequests, canUserDownload };
}
