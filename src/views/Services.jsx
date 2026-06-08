import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../context/AppContext';

/* ────────────────────────────────────────────────────────────
   ALL PHOSPHOR ICONS AS INLINE SVG
──────────────────────────────────────────────────────────── */
const ICONS = {
  Briefcase: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z"/>
	</svg>
  ),
  Buildings: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M240,208h-8V96a16,16,0,0,0-16-16H160V40a16,16,0,0,0-16-16H40A16,16,0,0,0,24,40V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM216,96V208H160V96ZM40,40H144V208H104V168a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v40H40ZM80,208v-32h16v32Z"/>
	</svg>
  ),
  Globe: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.6-28.06-10.85-51-24-67.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-18.9,0-37.07-25.67-40-72H168C165.07,190.33,146.9,216,128,216Zm-40-88c2.93-46.33,21.1-72,40-72s37.07,25.67,40,72Zm15.2-67.11C90.85,77,81.6,99.94,80,128H40.37A88.17,88.17,0,0,1,103.2,60.89ZM40.37,144H80c1.6,28.06,10.85,51,24,67.11A88.17,88.17,0,0,1,40.37,144Zm111.43,67.11C164.85,195,174.1,172.06,175.8,144h39.83A88.17,88.17,0,0,1,151.8,211.11Z"/>
	</svg>
  ),
  Shield: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M208,40H48A16,16,0,0,0,32,56V112c0,91.4,83.3,122.28,84.1,122.58a8,8,0,0,0,7.8,0C124.7,234.28,208,203.4,208,112V56A16,16,0,0,0,208,40Zm0,72c0,78.42-66.35,109.4-80,114.94C114.35,221.4,48,190.42,48,112V56H208Z"/>
	</svg>
  ),
  Users: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
	</svg>
  ),
  Truck: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M240,112H232V64a16,16,0,0,0-16-16H24A16,16,0,0,0,8,64V192h15.22A24,24,0,0,0,48,216a23.84,23.84,0,0,0,23.61-20H152.39A24,24,0,0,0,176,216a23.84,23.84,0,0,0,23.61-20H240a8,8,0,0,0,8-8V120A8,8,0,0,0,240,112ZM48,200a8,8,0,1,1,8-8A8,8,0,0,1,48,200Zm128,0a8,8,0,1,1,8-8A8,8,0,0,1,176,200ZM24,64H216V112H24ZM232,180H200.78A24,24,0,0,0,176,168a23.84,23.84,0,0,0-23.61,20H72.61A24,24,0,0,0,48,168a23.84,23.84,0,0,0-23.61,20H24V128H232Z"/>
	</svg>
  ),
  FileText: (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24">
	  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216ZM88,128a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,128Zm0,40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,168Z"/>
	</svg>
  )
};

function DynamicIcon({ name }) {
  return ICONS[name] || ICONS.Briefcase;
}

export default function Services() {
  const { t } = useContext(AppContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchServices = async () => {
	  try {
		const { data, error } = await supabase
		  .from('mamey_site_content')
		  .select('*')
		  .eq('category', 'services')
		  .order('created_at', { ascending: false });
  
		if (error) throw error;
		if (data) setServices(data);
	  } catch (err) {
		console.error('Supabase Error (Services):', err.message);
	  } finally {
		setLoading(false);
	  }
	};
  
	fetchServices();
  }, []);

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600&display=swap');
		.svc-root { font-family: 'DM Sans', sans-serif; }

		.svc-header { margin-bottom: clamp(36px, 5vw, 56px); }
		.svc-kicker {
		  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
		  color: var(--gold, #d4af37); margin-bottom: 14px;
		  display: flex; align-items: center; gap: 10px;
		}
		.svc-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
		.svc-h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4.5vw, 3rem);
		  font-weight: 900; line-height: 1.1;
		  color: var(--text-main, #1a1a1a); margin: 0 0 14px 0;
		}
		.svc-sub {
		  font-size: clamp(0.88rem, 1.8vw, 1rem); line-height: 1.75;
		  color: var(--text-muted, #666); max-width: 560px;
		}

		.svc-loading {
		  display: flex; flex-direction: column; align-items: center;
		  gap: 16px; padding: 80px 20px; color: var(--text-muted, #888);
		}
		.svc-spinner {
		  width: 36px; height: 36px;
		  border: 3px solid rgba(0,0,0,0.1);
		  border-top-color: var(--navy, #0d1b2a);
		  border-radius: 50%;
		  animation: svc-spin 0.8s linear infinite;
		}
		@keyframes svc-spin { to { transform: rotate(360deg); } }

		.svc-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		  gap: 24px;
		}

		.svc-card {
		  background: #ffffff; /* Pure white */
		  border-radius: 18px;
		  padding: clamp(24px, 3.5vw, 36px);
		  border: 1px solid rgba(0,0,0,0.06);
		  position: relative;
		  overflow: hidden;
		  cursor: default;
		  /* Removed opacity and animation so it ALWAYS shows */
		  transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
		}
		
		.svc-card:hover {
		  box-shadow: 0 18px 52px rgba(0,0,0,0.08);
		  border-color: rgba(212,175,55,0.3);
		  transform: translateY(-4px);
		}
		.svc-card::before {
		  content: '';
		  position: absolute;
		  top: 0; left: 0; right: 0;
		  height: 3px;
		  background: linear-gradient(90deg, var(--navy, #0d1b2a), var(--gold, #d4af37));
		  transform: scaleX(0);
		  transform-origin: left;
		  transition: transform 0.35s ease;
		}
		.svc-card:hover::before { transform: scaleX(1); }

		.svc-card-num {
		  position: absolute;
		  bottom: -12px; right: -4px;
		  font-family: 'Playfair Display', serif;
		  font-size: 5rem;
		  font-weight: 900;
		  color: rgba(13,27,42,0.04);
		  line-height: 1;
		  user-select: none;
		  pointer-events: none;
		  transition: color 0.3s;
		}
		.svc-card:hover .svc-card-num { color: rgba(212,175,55,0.06); }

		.svc-icon-box {
		  width: 52px; height: 52px;
		  border-radius: 14px;
		  background: var(--navy, #0d1b2a);
		  display: flex; align-items: center; justify-content: center;
		  color: var(--gold, #d4af37);
		  margin-bottom: 20px;
		  transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
		  position: relative;
		}
		.svc-card:hover .svc-icon-box {
		  transform: rotate(-8deg) scale(1.1);
		  box-shadow: 0 8px 24px rgba(13,27,42,0.3);
		}

		.svc-card-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1rem, 2.2vw, 1.1rem);
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 10px 0;
		  line-height: 1.3;
		  position: relative;
		}
		.svc-card-text {
		  font-size: 0.86rem;
		  line-height: 1.7;
		  color: var(--text-muted, #666);
		  margin: 0;
		  position: relative;
		}

		.svc-empty {
		  text-align: center; padding: 80px 20px;
		  color: var(--text-muted, #888);
		}
	  `}</style>

	  <div className="svc-root">

		<div className="svc-header">
		  <p className="svc-kicker">{t?.servicesKicker ?? 'What We Do'}</p>
		  <h1 className="svc-h1">{t?.servicesTitle ?? 'Corporate Services'}</h1>
		  <p className="svc-sub">{t?.servicesSub ?? 'Comprehensive operational divisions managed by Mamey Group across all geographic sectors.'}</p>
		</div>

		{loading ? (
		  <div className="svc-loading">
			<div className="svc-spinner" />
			<p>{t?.loadingServices ?? 'Loading enterprise services…'}</p>
		  </div>
		) : services.length === 0 ? (
		  <div className="svc-empty">
			<p>{t?.emptyServices ?? 'No service entries found. Add them via the dashboard.'}</p>
		  </div>
		) : (
		  <div className="svc-grid">
			{services.map((svc, i) => (
			  <div
				key={svc.id}
				className="svc-card"
				style={{ animationDelay: `${i * 0.1}s` }}
			  >
				<div className="svc-card-num">{String(i + 1).padStart(2, '0')}</div>
				<div className="svc-icon-box">
				  <DynamicIcon name={svc.icon_name} />
				</div>
				{/* Supabase Dynamic Data - Can be entered in Arabic directly on Dashboard */}
				<h3 className="svc-card-title">{svc.title}</h3>
				<p className="svc-card-text">{svc.description}</p>
			  </div>
			))}
		  </div>
		)}

	  </div>
	</>
  );
}