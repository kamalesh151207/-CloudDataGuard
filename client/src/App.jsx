import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';

import Overview from './pages/Overview';
import DataValidation from './pages/DataValidation';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import ActivityLogs from './pages/ActivityLogs';
import SystemHealth from './pages/SystemHealth';
import Settings from './pages/Settings';

import { healthApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dbHealth, setDbHealth] = useState({ isConnected: true, isInMemory: false });

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
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
        {/* Responsive Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          {/* Top Bar Navigation */}
          <TopBar
            activeTab={activeTab}
            dbHealth={dbHealth}
            onRefreshHealth={fetchHealthCheck}
          />

          {/* Page Body Viewport */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </main>
        </div>

        {/* Bottom Navigation for Mobile Devices */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ThemeProvider>
  );
}
