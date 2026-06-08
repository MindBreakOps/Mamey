import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './views/Home';
import About from './views/About';
import Blog from './views/Blog';
import Services from './views/Services';
import Projects from './views/Projects';
import LegalDocs from './views/LegalDocs';
import Clients from './views/Clients';
import Contact from './views/Contact';
import Privacy from './views/Privacy'; // Added!
import Terms from './views/Terms';     // Added!

// Admin
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you use this for Admin

import './App.css';

// A small wrapper to hide the footer on the Admin Dashboard
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admindashboard';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main 
        className={isAdmin ? '' : 'main-content'} 
        style={{ 
          flex: 1, 
          width: '100%', 
          maxWidth: isAdmin ? 'none' : '1200px', 
          margin: '0 auto',
          alignSelf: 'center',
          paddingLeft: isAdmin ? '0' : 'var(--content-px)',
          paddingRight: isAdmin ? '0' : 'var(--content-px)'
        }}
      >
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/legal" element={<LegalDocs />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Added the missing routes here! */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AppProvider>
  );
}