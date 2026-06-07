import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './views/Home';
import About from './views/About';
import Services from './views/Services';
import Projects from './views/Projects';
import LegalDocs from './views/LegalDocs';
import Clients from './views/Clients';
import Contact from './views/Contact';

// Admin
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

// A small wrapper to hide the footer on the Admin Dashboard
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admindashboard';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className={isAdmin ? '' : 'main-content'} style={{ flex: 1 }}>
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
            <Route path="/projects" element={<Projects />} />
            <Route path="/legal" element={<LegalDocs />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AppProvider>
  );
}