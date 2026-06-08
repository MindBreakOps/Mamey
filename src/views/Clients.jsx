import React, { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

/* ── Custom Hook for Scroll Animations ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
	const el = ref.current;
	if (!el) return;
	const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
	obs.observe(el);
	return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Individual Client Card (Supports Logos & Fallbacks) ── */
function ClientCard({ client, bg, i, visible }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = client.name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
	<div 
	  className={`cli-client-card ${visible ? 'cli-visible' : ''}`} 
	  style={{ transitionDelay: `${i * 60}ms` }}
	>
	  <div className="cli-client-header">
		<div className="cli-client-logo-box" style={{ borderColor: `${bg}30` }}>
		  {client.logo && !imgErr ? (
			<img 
			  src={client.logo} 
			  alt={client.name} 
			  onError={() => setImgErr(true)} 
			  className="cli-client-img" 
			/>
		  ) : (
			<div className="cli-client-dot" style={{ background: bg }}>{initials}</div>
		  )}
		</div>
		<div className="cli-client-meta">
		  <h4 className="cli-client-name">{client.name}</h4>
		  <span className="cli-client-country">{client.country}</span>
		</div>
	  </div>
	  
	  <div className="cli-client-body">
		<p className="cli-client-detail">{client.detail}</p>
	  </div>

	  <div className="cli-client-footer">
		<span className="cli-client-sector" style={{ background: bg }}>
		  {client.sector}
		</span>
	  </div>
	</div>
  );
}

export default function Clients() {
  const { t } = useContext(AppContext);

  const [statsRef, statsVisible] = useReveal(0.15);
  const [clientsRef, clientsVisible] = useReveal(0.1);
  const [filter, setFilter] = useState(t?.filterAll ?? 'All');

  useEffect(() => {
	setFilter(t?.filterAll ?? 'All');
  }, [t]);

  // Clients Data with Logos & Descriptions
  const clientsData = [
	{ name: 'Kakira Sugar Company', country: t?.countryUganda ?? 'Uganda', sector: t?.sectorAgriculture ?? 'Agriculture', logo: '/logos/kakira.png', detail: t?.descKakira ?? 'Major agricultural supplier and manufacturer in East Africa.' },
	{ name: 'Gulf for Sugar', country: t?.countryUAE ?? 'Dubai, UAE', sector: t?.sectorCommodities ?? 'Commodities', logo: '/logos/gulfsugar.png', detail: t?.descGulf ?? 'Global trading partner for high-volume commodity imports.' },
	{ name: 'Mopishi Extra Maize Millers', country: t?.countryKenya ?? 'Kenya', sector: t?.sectorMilling ?? 'Milling', logo: '/logos/mopishi.png', detail: t?.descMopishi ?? 'Strategic milling operations and food processing distribution.' },
	{ name: 'UNDP', country: t?.countryJuba ?? 'Juba, South Sudan', sector: t?.sectorIntAgency ?? 'International Agency', logo: '/logos/undp.png', detail: t?.descUndp ?? 'Logistics and supply chain partner for UN development programs.' },
	{ name: 'UNIFIES', country: t?.countryJuba ?? 'Juba, South Sudan', sector: t?.sectorIntAgency ?? 'International Agency', logo: '/logos/unifies.png', detail: t?.descUnifies ?? 'Provision of operational support for international missions.' },
	{ name: 'Ministry of Health', country: t?.countrySouthSudan ?? 'South Sudan', sector: t?.sectorGovt ?? 'Government', logo: '/logos/moh.png', detail: t?.descMoh ?? 'Official supplier for government health infrastructure initiatives.' },
	{ name: 'Ministry of Economic Planning', country: t?.countrySouthSudan ?? 'South Sudan', sector: t?.sectorGovt ?? 'Government', logo: '/logos/moep.png', detail: t?.descMoep ?? 'Consulting and logistical fulfillment for national planning.' },
  ];

  // Guaranteed Vibrant Colors for Sectors
  const sectorColors = {
	[t?.sectorAgriculture ?? 'Agriculture']: '#196f3d',
	[t?.sectorCommodities ?? 'Commodities']: '#b9770e',
	[t?.sectorMilling ?? 'Milling']: '#6c3483',
	[t?.sectorIntAgency ?? 'International Agency']: '#0e6251',
	[t?.sectorGovt ?? 'Government']: '#154360',
  };

  const stats = [
	{ label: t?.statTotalAsset ?? 'Total Asset Value', value: '$5M+', sub: t?.statTotalAssetSub ?? 'Fully capitalised for major transactions' },
	{ label: t?.statContractSuccess ?? 'Contract Success', value: '100%', sub: t?.statContractSuccessSub ?? 'Unbroken record across all engagements' },
	{ label: t?.statActiveClients ?? 'Active Clients', value: `${clientsData.length}+`, sub: t?.statActiveClientsSub ?? 'Across government, private, and UN sectors' },
	{ label: t?.statRegionsServed ?? 'Regions Served', value: '3+', sub: t?.statRegionsServedSub ?? 'East Africa, North Africa & the Gulf' },
  ];

  const sectors = [t?.filterAll ?? 'All', ...Array.from(new Set(clientsData.map(c => c.sector)))];
  const filtered = filter === (t?.filterAll ?? 'All') ? clientsData : clientsData.filter(c => c.sector === filter);

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

		.cli-root { font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }

		/* ── HEADER ── */
		.cli-header { margin-bottom: clamp(36px, 5vw, 56px); }
		.cli-kicker { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--gold, #d4af37); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
		.cli-kicker::before { content: ''; display: block; width: 24px; height: 2px; background: currentColor; }
		.cli-h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 900; line-height: 1.1; color: var(--text-main, #1a1a1a); margin: 0 0 14px 0; }
		.cli-sub { font-size: clamp(0.95rem, 1.8vw, 1.05rem); line-height: 1.75; color: var(--text-muted, #555); max-width: 600px; }

		/* ── HERO STATS (Contrast Fixed) ── */
		.cli-hero {
		  background: linear-gradient(135deg, var(--navy, #0d1b2a) 0%, #1a365d 100%);
		  border-radius: 20px; padding: clamp(32px, 5vw, 56px); margin-bottom: clamp(40px, 6vw, 64px);
		  position: relative; overflow: hidden; opacity: 0; transform: translateY(20px);
		  transition: opacity 0.6s ease, transform 0.6s ease;
		  box-shadow: 0 20px 40px rgba(13, 27, 42, 0.15);
		}
		.cli-hero.cli-visible { opacity: 1; transform: translateY(0); }
		.cli-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 32px; position: relative; z-index: 2; }
		
		.cli-stat { border-left: 3px solid rgba(212,175,55,0.4); padding-left: 24px; opacity: 0; transform: translateY(12px); transition: opacity 0.5s ease, transform 0.5s ease; }
		.cli-stat.cli-visible { opacity: 1; transform: translateY(0); }
		.cli-stat:nth-child(1) { transition-delay: 0.1s; }
		.cli-stat:nth-child(2) { transition-delay: 0.2s; }
		.cli-stat:nth-child(3) { transition-delay: 0.3s; }
		.cli-stat:nth-child(4) { transition-delay: 0.4s; }
		
		.cli-stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.9); margin-bottom: 8px; }
		.cli-stat-value { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 900; color: #f6d365; line-height: 1; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
		.cli-stat-sub { font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.5; }

		/* ── FILTER PILLS (Visibility Fixed) ── */
		.cli-section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 700; color: var(--navy); margin-bottom: 12px; }
		.cli-section-divider { width: 48px; height: 4px; background: var(--gold, #d4af37); border-radius: 2px; margin-bottom: 32px; }
		
		.cli-filters { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
		.cli-pill {
		  padding: 10px 24px; border-radius: 50px; font-size: 0.9rem; font-weight: 600;
		  background: #f1f5f9; color: #475569; border: none; cursor: pointer; 
		  transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
		}
		.cli-pill.active { background: var(--navy, #0d1b2a); color: white; box-shadow: 0 6px 16px rgba(13,27,42,0.2); }
		.cli-pill:hover:not(.active) { background: #e2e8f0; color: #1e293b; transform: translateY(-1px); }

		/* ── CLIENT CARDS (Interactive & Logos Added) ── */
		.cli-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
		
		.cli-client-card {
		  background: #ffffff; border-radius: 18px; padding: 28px; border: 1px solid rgba(0,0,0,0.06);
		  display: flex; flex-direction: column; opacity: 0; transform: translateY(20px);
		  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
		}
		.cli-client-card.cli-visible { opacity: 1; transform: translateY(0); }
		
		.cli-client-card:hover {
		  transform: translateY(-8px);
		  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
		  border-color: rgba(212,175,55,0.4);
		}

		.cli-client-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
		.cli-client-logo-box { width: 56px; height: 56px; border-radius: 14px; border: 2px solid #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; background: #fff; }
		.cli-client-img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
		.cli-client-dot { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
		
		.cli-client-meta { flex: 1; }
		.cli-client-name { font-weight: 700; font-size: 1.1rem; color: var(--navy); margin: 0 0 4px 0; line-height: 1.2; }
		.cli-client-country { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
		
		.cli-client-body { flex: 1; margin-bottom: 20px; border-top: 1px dashed rgba(0,0,0,0.08); padding-top: 20px; }
		.cli-client-detail { font-size: 0.95rem; line-height: 1.6; color: #444; margin: 0; }

		.cli-client-footer { display: flex; }
		.cli-client-sector { display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 6px; color: white; }
	  `}</style>

	  <div className="cli-root">

		{/* ── HEADER ── */}
		<div className="cli-header">
		  <p className="cli-kicker">{t?.clientsKicker ?? 'Trust & Track Record'}</p>
		  <h1 className="cli-h1">{t?.clientsTitle ?? 'Clients & Partners'}</h1>
		  <p className="cli-sub">{t?.clientsSub ?? 'Trusted across the region by government ministries, international agencies, and private sector leaders.'}</p>
		</div>

		{/* ── HERO STATS ── */}
		<div className={`cli-hero ${statsVisible ? 'cli-visible' : ''}`} ref={statsRef}>
		  <div className="cli-stats-grid">
			{stats.map((s) => (
			  <div key={s.label} className={`cli-stat ${statsVisible ? 'cli-visible' : ''}`}>
				<div className="cli-stat-label">{s.label}</div>
				<div className="cli-stat-value">{s.value}</div>
				<div className="cli-stat-sub">{s.sub}</div>
			  </div>
			))}
		  </div>
		</div>

		{/* ── SECTION HEADER ── */}
		<h3 className="cli-section-title">{t?.clientsSectionTitle ?? 'Existing Clientele Base'}</h3>
		<div className="cli-section-divider" />

		{/* ── FILTER PILLS ── */}
		<div className="cli-filters">
		  {sectors.map((s) => (
			<button
			  key={s}
			  className={`cli-pill ${filter === s ? 'active' : ''}`}
			  onClick={() => setFilter(s)}
			>
			  {s}
			</button>
		  ))}
		</div>

		{/* ── CLIENT CARDS GRID ── */}
		<div className="cli-cards-grid" ref={clientsRef}>
		  {filtered.map((client, i) => {
			const bg = sectorColors[client.sector] || '#0d1b2a';
			return (
			  <ClientCard 
				key={client.name} 
				client={client} 
				bg={bg} 
				i={i} 
				visible={clientsVisible} 
			  />
			);
		  })}
		</div>

	  </div>
	</>
  );
}