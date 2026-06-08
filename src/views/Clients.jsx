import React, { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

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

export default function Clients() {
  // Grab the translation dictionary
  const { t } = useContext(AppContext);

  const [statsRef, statsVisible] = useReveal(0.15);
  const [clientsRef, clientsVisible] = useReveal(0.1);
  const [filter, setFilter] = useState(t?.filterAll ?? 'All');

  // Listen for language changes to reset the filter to the correct "All" string
  useEffect(() => {
	setFilter(t?.filterAll ?? 'All');
  }, [t]);

  // Translate sectors inside the array
  const clientsData = [
	{ name: 'Kakira Sugar Company', country: t?.countryUganda ?? 'Uganda', sector: t?.sectorAgriculture ?? 'Agriculture' },
	{ name: 'Gulf for Sugar', country: t?.countryUAE ?? 'Dubai, UAE', sector: t?.sectorCommodities ?? 'Commodities' },
	{ name: 'Mopishi Extra Maize Millers', country: t?.countryKenya ?? 'Kenya', sector: t?.sectorMilling ?? 'Milling' },
	{ name: 'UNDP', country: t?.countryJuba ?? 'Juba, South Sudan', sector: t?.sectorIntAgency ?? 'International Agency' },
	{ name: 'UNIFIES', country: t?.countryJuba ?? 'Juba, South Sudan', sector: t?.sectorIntAgency ?? 'International Agency' },
	{ name: 'Ministry of Health', country: t?.countrySouthSudan ?? 'South Sudan', sector: t?.sectorGovt ?? 'Government' },
	{ name: 'Ministry of Economic Planning', country: t?.countrySouthSudan ?? 'South Sudan', sector: t?.sectorGovt ?? 'Government' },
  ];

  // Map dynamic translated sectors to their colors
  const sectorColors = {
	[t?.sectorAgriculture ?? 'Agriculture']: '#1a5c3a',
	[t?.sectorCommodities ?? 'Commodities']: '#7a4a1a',
	[t?.sectorMilling ?? 'Milling']: '#3a1a5c',
	[t?.sectorIntAgency ?? 'International Agency']: '#0d1b2a',
	[t?.sectorGovt ?? 'Government']: '#1a3a5c',
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
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600&display=swap');

		.cli-root { font-family: 'DM Sans', sans-serif; }

		/* HEADER */
		.cli-header { margin-bottom: clamp(36px, 5vw, 56px); }
		.cli-kicker {
		  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
		  color: var(--gold, #d4af37); margin-bottom: 14px;
		  display: flex; align-items: center; gap: 10px;
		}
		.cli-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
		.cli-h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4.5vw, 3rem);
		  font-weight: 900; line-height: 1.1;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 14px 0;
		}
		.cli-sub {
		  font-size: clamp(0.88rem, 1.8vw, 1rem); line-height: 1.75;
		  color: var(--text-muted, #666); max-width: 560px;
		}

		/* HERO STATS */
		.cli-hero {
		  background: linear-gradient(135deg, var(--navy, #0d1b2a) 0%, #1a3050 100%);
		  border-radius: 20px;
		  padding: clamp(32px, 5vw, 56px);
		  margin-bottom: clamp(36px, 5vw, 52px);
		  position: relative;
		  overflow: hidden;
		  opacity: 0;
		  transform: translateY(16px);
		  transition: opacity 0.6s ease, transform 0.6s ease;
		}
		.cli-hero.cli-visible { opacity: 1; transform: translateY(0); }
		.cli-hero::before {
		  content: '';
		  position: absolute;
		  top: -80px; right: -80px;
		  width: 260px; height: 260px;
		  border-radius: 50%;
		  border: 1px solid rgba(212,175,55,0.12);
		}
		.cli-hero::after {
		  content: '';
		  position: absolute;
		  top: -30px; right: -30px;
		  width: 160px; height: 160px;
		  border-radius: 50%;
		  border: 1px solid rgba(212,175,55,0.08);
		}
		.cli-stats-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		  gap: 24px;
		  position: relative;
		}
		.cli-stat {
		  border-left: 2px solid rgba(212,175,55,0.3);
		  padding-left: 20px;
		  opacity: 0;
		  transform: translateY(12px);
		  transition: opacity 0.5s ease, transform 0.5s ease;
		}
		.cli-stat.cli-visible { opacity: 1; transform: translateY(0); }
		.cli-stat:nth-child(1) { transition-delay: 0.1s; }
		.cli-stat:nth-child(2) { transition-delay: 0.2s; }
		.cli-stat:nth-child(3) { transition-delay: 0.3s; }
		.cli-stat:nth-child(4) { transition-delay: 0.4s; }
		.cli-stat-label {
		  font-size: 9px; text-transform: uppercase; letter-spacing: 2px;
		  color: rgba(255,255,255,0.5); margin-bottom: 8px;
		}
		.cli-stat-value {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4vw, 2.8rem);
		  font-weight: 900;
		  color: var(--gold, #d4af37);
		  line-height: 1;
		  margin-bottom: 6px;
		}
		.cli-stat-sub {
		  font-size: 0.78rem; color: rgba(255,255,255,0.5); line-height: 1.4;
		}

		/* FILTER PILLS */
		.cli-filters {
		  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
		}
		.cli-pill {
		  padding: 8px 18px; border-radius: 50px;
		  font-size: 0.8rem; font-weight: 500;
		  border: 1.5px solid rgba(0,0,0,0.12);
		  background: transparent;
		  color: var(--text-muted, #666);
		  cursor: pointer;
		  transition: all 0.2s;
		}
		.cli-pill.active {
		  background: var(--navy, #0d1b2a);
		  color: white; border-color: transparent;
		}
		.cli-pill:hover:not(.active) {
		  border-color: var(--navy, #0d1b2a);
		  color: var(--navy, #0d1b2a);
		}

		/* CLIENT CARDS */
		.cli-section-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin-bottom: 8px;
		}
		.cli-section-divider {
		  width: 36px; height: 3px;
		  background: var(--gold, #d4af37);
		  border-radius: 2px; margin-bottom: 28px;
		}
		.cli-cards-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		  gap: 16px;
		}
		.cli-client-card {
		  background: #ffffff;
		  border-radius: 14px;
		  padding: clamp(18px, 2.5vw, 26px);
		  border: 1px solid rgba(0,0,0,0.07);
		  display: flex;
		  align-items: flex-start;
		  gap: 16px;
		  opacity: 0;
		  transform: translateY(16px);
		  transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.25s, border-color 0.25s, background 0.25s;
		  cursor: default;
		}
		.cli-client-card.cli-visible { opacity: 1; transform: translateY(0); }
		.cli-client-card:hover {
		  box-shadow: 0 10px 32px rgba(0,0,0,0.09);
		  border-color: rgba(212,175,55,0.3);
		  background: white;
		}
		.cli-client-dot {
		  width: 36px; height: 36px;
		  border-radius: 10px;
		  flex-shrink: 0;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  font-size: 0.75rem;
		  font-weight: 700;
		  color: white;
		  letter-spacing: -0.5px;
		}
		.cli-client-name {
		  font-weight: 600;
		  font-size: clamp(0.82rem, 1.8vw, 0.92rem);
		  color: var(--text-main, #1a1a1a);
		  margin-bottom: 4px;
		  line-height: 1.3;
		}
		.cli-client-country {
		  font-size: 0.78rem;
		  color: var(--text-muted, #888);
		  margin-bottom: 4px;
		}
		.cli-client-sector {
		  display: inline-block;
		  font-size: 9px;
		  font-weight: 600;
		  letter-spacing: 1px;
		  text-transform: uppercase;
		  padding: 2px 8px;
		  border-radius: 3px;
		  color: white;
		}
	  `}</style>

	  <div className="cli-root">

		{/* HEADER */}
		<div className="cli-header">
		  <p className="cli-kicker">{t?.clientsKicker ?? 'Trust & Track Record'}</p>
		  <h1 className="cli-h1">{t?.clientsTitle ?? 'Clients & Partners'}</h1>
		  <p className="cli-sub">{t?.clientsSub ?? 'Trusted across the region by government ministries, international agencies, and private sector leaders.'}</p>
		</div>

		{/* HERO STATS */}
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

		{/* SECTION HEADER */}
		<h3 className="cli-section-title">{t?.clientsSectionTitle ?? 'Existing Clientele Base'}</h3>
		<div className="cli-section-divider" />

		{/* FILTER PILLS */}
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

		{/* CLIENT CARDS */}
		<div className="cli-cards-grid" ref={clientsRef}>
		  {filtered.map((client, i) => {
			const initials = client.name.split(' ').slice(0, 2).map(w => w[0]).join('');
			const bg = sectorColors[client.sector] || '#0d1b2a';
			return (
			  <div
				key={client.name}
				className={`cli-client-card ${clientsVisible ? 'cli-visible' : ''}`}
				style={{ transitionDelay: `${i * 50}ms` }}
			  >
				<div className="cli-client-dot" style={{ background: bg }}>{initials}</div>
				<div>
				  <div className="cli-client-name">{client.name}</div>
				  <div className="cli-client-country">{client.country}</div>
				  <span className="cli-client-sector" style={{ background: bg }}>{client.sector}</span>
				</div>
			  </div>
			);
		  })}
		</div>

	  </div>
	</>
  );
}