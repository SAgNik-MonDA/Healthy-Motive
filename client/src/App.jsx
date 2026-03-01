import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import FloatingChat from './components/FloatingChat';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import EBooks from './pages/EBooks';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

// ScrollToTop Component to handle scrolling up on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout component to selectively hide common elements on auth pages
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname);

  return (
    <div className="font-body text-gray-900 bg-background dark:bg-darkBg dark:text-gray-100 min-h-[100vh] flex flex-col relative w-full overflow-x-hidden transition-colors duration-300">
      {!isAuthPage && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-grow w-full shrink-0">
        {children}
      </main>

      {/* Global Footer */}
      {!isAuthPage && <Footer />}

      {/* Global Floating Chat */}
      {!isAuthPage && <FloatingChat />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes (Entire website except Auth pages) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/e-books" element={<EBooks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>

            {/* Fallback for other routes */}
            <Route path="*" element={<div className="pt-32 text-center text-2xl font-bold min-h-screen bg-background dark:bg-darkBg dark:text-white transition-colors duration-300">Page Not Found</div>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
