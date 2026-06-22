import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabase/client';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export function useAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) { setIsAdmin(false); return; }

    // Vérification rapide par email (marche en local si .env défini)
    if (ADMIN_EMAIL && user.email === ADMIN_EMAIL) { setIsAdmin(true); return; }

    // Vérification par rôle en base (marche sur Vercel même sans env var)
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.uid)
      .single()
      .then(({ data }) => setIsAdmin(data?.role === 'admin'));
  }, [isAuthenticated, user?.uid]);

  async function getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async function banUser(userId: string, reason: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: true, ban_reason: reason, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
    await logAction('ban_user', userId, { reason });
  }

  async function unbanUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: false, ban_reason: null, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
    await logAction('unban_user', userId);
  }

  async function toggleDownloadAccess(userId: string, canDownload: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ can_download_pdf: canDownload, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
    await logAction(canDownload ? 'grant_download' : 'revoke_download', userId);
  }

  async function getDownloadRequests(status?: 'pending' | 'approved' | 'rejected') {
    let query = supabase
      .from('download_requests')
      .select('*, profiles:user_id(email, display_name)')
      .order('requested_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async function approveRequest(requestId: string, userId: string, note?: string) {
    const { error: reqError } = await supabase
      .from('download_requests')
      .update({
        status: 'approved',
        admin_note: note ?? null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.uid,
      })
      .eq('id', requestId);
    if (reqError) throw reqError;
    await toggleDownloadAccess(userId, true);
    await logAction('approve_download_request', userId, { requestId, note });
  }

  async function rejectRequest(requestId: string, userId: string, note?: string) {
    const { error } = await supabase
      .from('download_requests')
      .update({
        status: 'rejected',
        admin_note: note ?? null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.uid,
      })
      .eq('id', requestId);
    if (error) throw error;
    await logAction('reject_download_request', userId, { requestId, note });
  }

  async function getDashboardStats() {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, is_banned, can_download_pdf, total_cvs_created, total_downloads, created_at');

    const { data: pendingRequests } = await supabase
      .from('download_requests')
      .select('id')
      .eq('status', 'pending');

    const total = users?.length ?? 0;
    const banned = users?.filter(u => u.is_banned).length ?? 0;
    const withAccess = users?.filter(u => u.can_download_pdf).length ?? 0;
    const totalCVs = users?.reduce((sum, u) => sum + (u.total_cvs_created ?? 0), 0) ?? 0;
    const totalDownloads = users?.reduce((sum, u) => sum + (u.total_downloads ?? 0), 0) ?? 0;
    const pending = pendingRequests?.length ?? 0;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const newThisWeek = users?.filter(u => u.created_at > weekAgo).length ?? 0;

    return { total, banned, withAccess, totalCVs, totalDownloads, pending, newThisWeek };
  }

  async function getAuditLog(limit = 50) {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*, profiles:admin_id(email)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }

  async function logAction(action: string, targetUserId?: string, details?: Record<string, unknown>) {
    await supabase.from('admin_audit_log').insert({
      admin_id: user?.uid,
      action,
      target_user_id: targetUserId ?? null,
      details: details ?? null,
    });
  }

  return {
    isAdmin,
    getAllUsers,
    banUser,
    unbanUser,
    toggleDownloadAccess,
    getDownloadRequests,
    approveRequest,
    rejectRequest,
    getDashboardStats,
    getAuditLog,
  };
}
