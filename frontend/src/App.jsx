import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { PlacesPage } from './pages/PlacesPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { FoodCulturePage } from './pages/FoodCulturePage';
import { HotelsPage } from './pages/HotelsPage';
import { MapPage } from './pages/MapPage';
import { ItinerariesPage } from './pages/ItinerariesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/places" element={<PlacesPage />} />
                <Route path="/places/:slug" element={<PlaceDetailPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/food-culture" element={<FoodCulturePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/itineraries" element={<ItinerariesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/about-contact" element={<AboutContactPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
