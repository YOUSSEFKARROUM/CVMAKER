import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminRequests from './AdminRequests';
import AdminAuditLog from './AdminAuditLog';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onBack={onBack}>
      {activeTab === 'overview'  && <AdminOverview onTabChange={setActiveTab} />}
      {activeTab === 'users'     && <AdminUsers />}
      {activeTab === 'requests'  && <AdminRequests />}
      {activeTab === 'audit'     && <AdminAuditLog />}
    </AdminLayout>
  );
}
