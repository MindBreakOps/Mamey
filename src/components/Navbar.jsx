import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // 1. Pull the real translation engine from your Context
  const { lang, setLang, t } = useContext(AppContext);

  // 2. Automatically flip the website layout based on language
  useEffect(() => {
	document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
	document.documentElement.lang = lang;
  }, [lang]);

  // Hide Navbar completely on the Admin Dashboard
  if (location.pathname === '/admindashboard') return null;

  // 3. Map the navigation links to your dictionary fallback to English if missing
  const navItems = [
	{ path: '/', name: t?.home || 'Home' },
	{ path: '/services', name: t?.services || 'Our Services' },
	{ path: '/projects', name: t?.projects || 'Projects & Operations' },
	{ path: '/legal', name: t?.legal || 'Legal Documents' },
	{ path: '/clients', name: t?.clients || 'Clients & Partners' },
	{ path: '/contact', name: t?.contact || 'Contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
	<nav className="pro-navbar">
	  <div className="navbar-container">
		
		{/* Brand Logo */}
		<Link to="/" className="nav-brand">
		  <img src="/mamey.png" alt="Mamey Logo" style={{ width: '45px', height: 'auto' }} />
		  <div>
			<h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontFamily: 'Playfair Display, serif' }}>MAMEY</h2>
			<span style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
			  Enterprise
			</span>
		  </div>
		</Link>

		{/* Desktop Menu */}
		<div className="nav-desktop">
		  {navItems.map((item) => (
			<Link 
			  key={item.path} 
			  to={item.path} 
			  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
			>
			  {item.name}
			</Link>
		  ))}
		  
		  {/* THE WORKING TRANSLATION BUTTON */}
		  <button 
			className="lang-toggle" 
			onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
		  >
			<Globe size={16} /> 
			{lang === 'en' ? 'العربية' : 'English'}
		  </button>
		</div>

		{/* Mobile Hamburger Button */}
		<button className="mobile-toggle" onClick={toggleMenu} style={{ background: 'transparent', border: 'none', color: 'white' }}>
		  {isOpen ? <X size={28} /> : <Menu size={28} />}
		</button>
	  </div>

	  {/* Mobile Menu Dropdown */}
	  {isOpen && (
		<div style={{ background: 'var(--navy-dark)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
		  {navItems.map((item) => (
			<Link 
			  key={item.path} 
			  to={item.path} 
			  style={{ color: 'white', padding: '15px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
			  onClick={() => setIsOpen(false)}
			>
			  {item.name}
			</Link>
		  ))}
		  {/* Mobile Translation Button */}
		  <button 
			onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setIsOpen(false); }}
			style={{ marginTop: '20px', padding: '15px', background: 'white', color: 'var(--navy)', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
		  >
			{lang === 'en' ? 'Switch to العربية' : 'Switch to English'}
		  </button>
		</div>
	  )}
	</nav>
  );
}