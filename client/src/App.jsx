import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import TopHeaderBuiltIn from './components/layout/TopHeaderBuiltIn';
import MobileNav from './components/layout/MobileNav';

import Overview from './pages/Overview';
import DataValidation from './pages/DataValidation';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import ActivityLogs from './pages/ActivityLogs';
import SystemHealth from './pages/SystemHealth';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { healthApi } from './services/api';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dbHealth, setDbHealth] = useState({ isConnected: true, isInMemory: false });
  const { theme } = useTheme();

  const fetchHealthCheck = async () => {
    try {
      const res = await healthApi.getHealth();
      setDbHealth(res.database || { isConnected: true });
    } catch (e) {
      setDbHealth({ isConnected: false });
    }
  };

  useEffect(() => {
    fetchHealthCheck();
    const interval = setInterval(fetchHealthCheck, 20000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={setActiveTab} />;
      case 'validation':
        return <DataValidation onRecordSaved={() => fetchHealthCheck()} />;
      case 'records':
        return <Records />;
      case 'analytics':
        return <Analytics />;
      case 'logs':
        return <ActivityLogs />;
      case 'health':
        return <SystemHealth onHealthFetched={(h) => setDbHealth(h)} />;
      case 'settings':
        return <Settings />;
      case 'login':
        return <Login onLoginSuccess={() => setActiveTab('overview')} />;
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top 2-Tier BuiltIn Style Header */}
      <TopHeaderBuiltIn
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbHealth={dbHealth}
        onRefreshHealth={fetchHealthCheck}
      />

      <div className="flex-1 flex flex-col md:flex-row min-w-0 pb-20 md:pb-8">
        {/* Responsive Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
