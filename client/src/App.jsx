import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureBadges } from './components/FeatureBadges';
import { RegistrationFlow } from './components/RegistrationFlow';
import { SuccessScreen } from './components/SuccessScreen';
import { Dashboard } from './components/Dashboard';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AdminMatchPanel } from './components/AdminMatchPanel';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';
import { api, storage } from './services/api';

export function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'success' | 'admin'
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeChatPartner, setActiveChatPartner] = useState(null);

  const refreshUserProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch {
      // Ignored
    }
  };

  // Track initial page view telemetry & check saved auth & URL path
  useEffect(() => {
    api.trackEvent({ eventType: 'Page_View' });

    const savedUser = storage.getUser();
    const token = storage.getToken();

    if (savedUser && token) {
      setUser(savedUser);
      refreshUserProfile();
    }

    // Check if URL specifies admin route
    if (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin')
    ) {
      setView('admin');
    }
  }, []);

  // Sync view with browser history / URL
  const navigateTo = (v) => {
    setView(v);
    if (v === 'admin') {
      window.history.pushState({}, '', '/admin/dashboard');
    } else if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = (newUser) => {
    setUser(newUser);
    setRegisteredUser(newUser);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    api.trackEvent({ eventType: 'Registration_Success', city: newUser.city });
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setView('dashboard');
    refreshUserProfile();
  };

  const handleAdminLoginSuccess = (adminUser) => {
    setUser(adminUser);
    setView('admin');
    refreshUserProfile();
  };

  const handleLogout = () => {
    storage.clearAuth();
    setUser(null);
    setRegisteredUser(null);
    setActiveChatPartner(null);
    setView('landing');
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleOpenChat = (partner) => {
    setActiveChatPartner(partner);
    api.trackEvent({ eventType: 'Chat_Opened', city: user?.city });
  };

  const scrollToRegistration = () => {
    if (view !== 'landing') {
      navigateTo('landing');
      setTimeout(() => {
        const el = document.getElementById('registration-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('registration-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Visual background layers */}
      <div className="navratri-bg" />
      <div className="bandhani-pattern" />

      {/* Navigation Header */}
      <Header
        user={user}
        currentView={view}
        onNavigate={navigateTo}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        onStartRegistration={scrollToRegistration}
      />

      {/* Main Content View Switch */}
      <main style={{ flex: 1 }}>
        {view === 'landing' && (
          <>
            <Hero onRegisterClick={scrollToRegistration} />
            <FeatureBadges />
            <RegistrationFlow
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setIsLoginOpen(true)}
            />
          </>
        )}

        {view === 'dashboard' && (
          <Dashboard
            user={user}
            onOpenChat={handleOpenChat}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAdmin={() => navigateTo('admin')}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        )}

        {view === 'admin' && (
          user && user.role === 'admin' ? (
            <AdminDashboard
              currentUser={user}
              onBackToSite={() => navigateTo('dashboard')}
              onLogout={handleLogout}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToSite={() => navigateTo('landing')}
            />
          )
        )}

        {view === 'success' && (
          <SuccessScreen
            user={registeredUser || user}
            onOpenProfile={() => navigateTo('dashboard')}
            onReset={() => navigateTo('landing')}
          />
        )}
      </main>

      {/* Cultural Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user || registeredUser}
      />

      <ChatDrawer
        isOpen={Boolean(activeChatPartner)}
        onClose={() => setActiveChatPartner(null)}
        currentUser={user}
        matchPartner={activeChatPartner}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        user={user}
      />

      <AdminMatchPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onMatchingExecuted={refreshUserProfile}
      />
    </div>
  );
}

export default App;

