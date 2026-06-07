import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, FolderOpen, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
	{ path: '/', name: 'Home', icon: Home },
	{ path: '/services', name: 'Our Services', icon: Briefcase },
	{ path: '/projects', name: 'Projects & Operations', icon: FolderOpen },
	{ path: '/legal', name: 'Legal Documents', icon: ShieldCheck },
  ];

  return (
	<aside style={{ width: '260px', height: '100vh', background: 'var(--navy)', position: 'fixed', padding: '30px 20px', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
	  
	  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
		<img src="/mamey.png" alt="Mamey" style={{ width: '45px', height: 'auto' }} />
		<div>
		  <h2 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>MAMEY</h2>
		  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise</span>
		</div>
	  </div>

	  <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
		{navItems.map((item) => {
		  const Icon = item.icon;
		  const isActive = location.pathname === item.path;
		  return (
			<Link 
			  key={item.path} 
			  to={item.path} 
			  style={{
				display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
				borderRadius: '8px', textDecoration: 'none', transition: '0.2s',
				background: isActive ? 'var(--accent)' : 'transparent',
				color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
				fontWeight: isActive ? '600' : '500'
			  }}
			>
			  <Icon size={18} /> {item.name}
			</Link>
		  );
		})}
	  </nav>

	  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
		© 2026 Mamey Co. Ltd.
	  </div>
	</aside>
  );
}