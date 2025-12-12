import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SkipNavigation from './components/SkipNavigation';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import ResourcesPage from './pages/ResourcesPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageHomePage from './pages/admin/ManageHomePage';
import ManageAboutPage from './pages/admin/ManageAboutPage';
import ManageProgramsPage from './pages/admin/ManageProgramsPage';
import ManageAdmissionsPage from './pages/admin/ManageAdmissionsPage';
import ManageContactPage from './pages/admin/ManageContactPage';
  import { useAccessibility } from './hooks/useAccessibility';
  import ManageEventsPage from './pages/admin/ManageEventsPage';
  import FloatingActionButtons from './components/FloatingActionButtons';

function App() {
  const { preferences } = useAccessibility();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const accessibilityClasses = `font-${preferences.fontFamily} text-${preferences.fontSize}`;

  return (
    <div className={`flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${accessibilityClasses}`}>
      <SkipNavigation />
      {!isAdminRoute && <Header />}
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/accessibility" element={<AccessibilityStatementPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="home" element={<ManageHomePage />} />
            <Route path="about" element={<ManageAboutPage />} />
            <Route path="programs" element={<ManageProgramsPage />} />
            <Route path="admissions" element={<ManageAdmissionsPage />} />
            <Route path="contact" element={<ManageContactPage />} />
            <Route path="events" element={<ManageEventsPage />} />
          </Route>
        </Routes>
      </main>
        {!isAdminRoute && <Footer />}
        <AccessibilityToolbar />
        {!isAdminRoute && <FloatingActionButtons />}
    </div>
  );
}

export default App;
