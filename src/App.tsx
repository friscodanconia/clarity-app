import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getProfile } from './lib/storage';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { DrillView } from './components/DrillView';
import { Dashboard } from './components/Dashboard';
import { SessionHistory } from './components/SessionHistory';
import { Settings } from './components/Settings';

export default function App() {
  const [hasProfile, setHasProfile] = useState(!!getProfile());

  useEffect(() => {
    setHasProfile(!!getProfile());
  }, []);

  if (!hasProfile) {
    return <Onboarding onComplete={() => setHasProfile(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/practice" replace />} />
          <Route path="/practice" element={<DrillView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<SessionHistory />} />
          <Route path="/settings" element={<Settings onReset={() => setHasProfile(false)} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
