import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

/* ─────────────────────────────────────────────────────────────
   PHOSPHOR ICONS — inline SVG, no external dependency
───────────────────────────────────────────────────────────── */
const Ph = {
  Globe: ({ size = 15 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.6-28.06-10.85-51-24-67.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-18.9,0-37.07-25.67-40-72H168C165.07,190.33,146.9,216,128,216Zm-40-88c2.93-46.33,21.1-72,40-72s37.07,25.67,40,72Zm15.2-67.11C90.85,77,81.6,99.94,80,128H40.37A88.17,88.17,0,0,1,103.2,60.89ZM40.37,144H80c1.6,28.06,10.85,51,24,67.11A88.17,88.17,0,0,1,40.37,144Zm111.43,67.11C164.85,195,174.1,172.06,175.8,144h39.83A88.17,88.17,0,0,1,151.8,211.11Z"/>
	</svg>
  ),
  List: ({ size = 18 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
	</svg>
  ),
  X: ({ size = 15 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
	</svg>
  ),
  House: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"/>
	</svg>
  ),
  Buildings: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M240,208h-8V96a16,16,0,0,0-16-16H160V40a16,16,0,0,0-16-16H40A16,16,0,0,0,24,40V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM216,96V208H160V96ZM40,40H144V208H104V168a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v40H40ZM80,208v-32h16v32Z"/>
	</svg>
  ),
  Briefcase: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z"/>
	</svg>
  ),
  Shield: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M208,40H48A16,16,0,0,0,32,56V112c0,91.4,83.3,122.28,84.1,122.58a8,8,0,0,0,7.8,0C124.7,234.28,208,203.4,208,112V56A16,16,0,0,0,208,40Zm0,72c0,78.42-66.35,109.4-80,114.94C114.35,221.4,48,190.42,48,112V56H208Z"/>
	</svg>
  ),
  Users: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
	</svg>
  ),
  Phone: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/>
	</svg>
  ),
};

const NAV_ICONS = {
  '/':          Ph.House,
  '/about':     Ph.Buildings,
  '/services':  Ph.Briefcase,
  '/projects':  Ph.Buildings,
  '/legal':     Ph.Shield,
  '/clients':   Ph.Users,
  '/contact':   Ph.Phone,
};

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useContext(AppContext);

  /* Sync dir/lang on html element */
  useEffect(() => {
	document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
	document.documentElement.lang = lang;
  }, [lang]);

  /* Scrolled state for navbar shadow */
  useEffect(() => {
	const onScroll = () => setScrolled(window.scrollY > 8);
	window.addEventListener('scroll', onScroll, { passive: true });
	return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close drawer on route change */
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  /* Esc key closes drawer */
  useEffect(() => {
	if (!drawerOpen) return;
	const handler = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
	document.addEventListener('keydown', handler);
	return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen]);

  /* Lock body scroll when drawer open */
  useEffect(() => {
	document.body.style.overflow = drawerOpen ? 'hidden' : '';
	return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* Hide on admin route */
  if (location.pathname === '/admindashboard') return null;

  const navItems = [
	{ path: '/',          label: t?.home      ?? 'Home'                 },
	{ path: '/about',     label: t?.about     ?? 'About Us'             },
	{ path: '/blog', label: t?.navBlog ?? 'News' },
	{ path: '/services',  label: t?.services  ?? 'Our Services'         },
	{ path: '/projects',  label: t?.projects  ?? 'Projects & Operations'},
	{ path: '/legal',     label: t?.legal     ?? 'Legal Documents'      },
	{ path: '/clients',   label: t?.clients   ?? 'Clients & Partners'   },
	{ path: '/contact',   label: t?.contact   ?? 'Contact'              },
  ];

  const isActive = (path) =>
	path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
	<>
	  {/* ── NAVBAR ── */}
	  <nav
		className={`pro-navbar${scrolled ? ' scrolled' : ''}`}
		role="navigation"
		aria-label="Main navigation"
	  >
		<div className="navbar-container">

		  {/* Brand */}
		  <Link to="/" className="nav-brand" aria-label={t?.siteName ?? 'Mamey — Home'}>
			<img src="/mamey.png" alt="" aria-hidden="true" width="38" height="38" />
			<div className="nav-brand-text">
			  <div className="nav-brand-name">{t?.siteName ?? 'MAMEY'}</div>
			  <div className="nav-brand-sub">{t?.siteTagline ?? 'General Trading & Investment'}</div>
			</div>
		  </Link>

		  {/* Desktop nav */}
		  <div className="nav-desktop" role="menubar" aria-label="Site navigation">
			{navItems.map((item) => (
			  <Link
				key={item.path}
				to={item.path}
				role="menuitem"
				className={`nav-link${isActive(item.path) ? ' active' : ''}`}
				aria-current={isActive(item.path) ? 'page' : undefined}
			  >
				{item.label}
			  </Link>
			))}
		  </div>

		  {/* Right cluster */}
		  <div className="nav-actions">
			<button
			  className="lang-toggle"
			  onClick={toggleLang}
			  aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
			>
			  <Ph.Globe size={14} />
			  <span>{t?.switchLang ?? (lang === 'en' ? 'العربية' : 'English')}</span>
			</button>

			<button
			  className="mobile-toggle"
			  onClick={() => setDrawerOpen(true)}
			  aria-label={t?.openMenu ?? 'Open navigation menu'}
			  aria-expanded={drawerOpen}
			  aria-controls="mobile-drawer"
			  aria-haspopup="dialog"
			>
			  <Ph.List size={18} />
			</button>
		  </div>

		</div>
	  </nav>

	  {/* ── BACKDROP ── */}
	  <div
		className={`mobile-drawer-backdrop${drawerOpen ? ' open' : ''}`}
		onClick={() => setDrawerOpen(false)}
		aria-hidden="true"
	  />

	  {/* ── MOBILE DRAWER ── */}
	  <aside
		id="mobile-drawer"
		className={`mobile-drawer${drawerOpen ? ' open' : ''}`}
		role="dialog"
		aria-modal="true"
		aria-label={t?.navigationMenu ?? 'Navigation menu'}
		aria-hidden={!drawerOpen}
		tabIndex={-1}
	  >
		{/* Sticky drawer header */}
		<div className="drawer-header">
		  <Link
			to="/"
			className="nav-brand"
			onClick={() => setDrawerOpen(false)}
			aria-label={t?.siteName ?? 'Mamey — Home'}
		  >
			<img src="/mamey.png" alt="" aria-hidden="true" style={{ width: 30 }} />
			<div className="nav-brand-text">
			  <div className="nav-brand-name" style={{ fontSize: '1.05rem' }}>
				{t?.siteName ?? 'MAMEY'}
			  </div>
			  <div className="nav-brand-sub">{t?.siteTagline ?? 'General Trading & Investment'}</div>
			</div>
		  </Link>
		  <button
			className="drawer-close"
			onClick={() => setDrawerOpen(false)}
			aria-label={t?.closeMenu ?? 'Close menu'}
		  >
			<Ph.X size={14} />
		  </button>
		</div>

		{/* Nav links */}
		<nav className="drawer-nav" role="menu" aria-label="Mobile site navigation">
		  {navItems.map((item, i) => {
			const Icon = NAV_ICONS[item.path] ?? Ph.House;
			const active = isActive(item.path);
			return (
			  <Link
				key={item.path}
				to={item.path}
				role="menuitem"
				className={`drawer-link${active ? ' active' : ''}`}
				aria-current={active ? 'page' : undefined}
				style={{ animationDelay: `${i * 40}ms` }}
				onClick={() => setDrawerOpen(false)}
			  >
				<Icon size={16} />
				<span>{item.label}</span>
				{active && (
				  <span
					style={{
					  marginLeft: 'auto',
					  width: 6, height: 6,
					  borderRadius: '50%',
					  background: 'var(--blue)',
					  flexShrink: 0,
					}}
					aria-hidden="true"
				  />
				)}
			  </Link>
			);
		  })}
		</nav>

		{/* Lang toggle footer */}
		<div className="drawer-footer">
		  <button
			className="drawer-lang-btn"
			onClick={() => { toggleLang(); setDrawerOpen(false); }}
			aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
		  >
			<Ph.Globe size={14} />
			<span>
			  {lang === 'en' ? 'Switch to العربية' : 'Switch to English'}
			</span>
		  </button>
		</div>
	  </aside>
	</>
  );
}