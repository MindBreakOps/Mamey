import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { supabase } from '../supabaseClient';

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
	if (!start) return;
	let startTime = null;
	const num = parseInt(target, 10);
	const step = (timestamp) => {
	  if (!startTime) startTime = timestamp;
	  const progress = Math.min((timestamp - startTime) / duration, 1);
	  const eased = 1 - Math.pow(1 - progress, 3);
	  setCount(Math.floor(eased * num));
	  if (progress < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({ value, label, suffix, animate }) {
  const num = useCountUp(value, 1600, animate);
  return (
	<div className="mmy-stat-card">
	  <div className="mmy-stat-val">
		{num}{suffix}
	  </div>
	  <div className="mmy-stat-label">{label}</div>
	</div>
  );
}

export default function Home() {
  const { t } = useContext(AppContext);
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visitorCount, setVisitorCount] = useState(0);

  const stats = [
	{ value: '2014', label: t?.statFounded ?? 'Founded', suffix: '' },
	{ value: '5', label: t?.statAssetValue ?? 'Asset Value', suffix: 'M+' },
	{ value: '100', label: t?.statContractSuccess ?? 'Contract Success', suffix: '%' },
	{ value: '2', label: t?.statCountries ?? 'Countries', suffix: '+' },
  ];

  const pillars = [
	{
	  icon: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
		  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	  ),
	  label: t?.pillar1Title ?? 'Integrity',
	  text: t?.pillar1Text ?? 'Every transaction, every delivery, every commitment — held to the highest standard.',
	},
	{
	  icon: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
		  <circle cx="12" cy="12" r="10" />
		  <line x1="2" y1="12" x2="22" y2="12" />
		  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	  ),
	  label: t?.pillar2Title ?? 'Regional Reach',
	  text: t?.pillar2Text ?? 'Operating across Africa and the Middle East with offices in Juba and Khartoum.',
	},
	{
	  icon: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
		  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
		  <circle cx="9" cy="7" r="4" />
		  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
		  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	  ),
	  label: t?.pillar3Title ?? 'Community First',
	  text: t?.pillar3Text ?? 'A wholly indigenous South Sudanese company built to serve and uplift its nation.',
	},
	{
	  icon: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
		  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
		</svg>
	  ),
	  label: t?.pillar4Title ?? 'Results Driven',
	  text: t?.pillar4Text ?? 'Exceeding customer, producer, and supplier expectations — every single time.',
	},
  ];

  useEffect(() => {
	const t = setTimeout(() => setHeroLoaded(true), 80);
	return () => clearTimeout(t);
  }, []);

  useEffect(() => {
	const handleVisitor = async () => {
	  try {
		const { data, error } = await supabase
		  .from('mamey_site_content')
		  .select('id, visitor_counter')
		  .eq('title', 'total_visitors')
		  .maybeSingle();
		if (error) throw error;
		if (!data) {
		  console.warn('Visitor row not found — add a row with title="total_visitors" in mamey_site_content');
		  return;
		}
		if (!sessionStorage.getItem('mamey_visited')) {
		  const newCount = (data.visitor_counter || 0) + 1;
		  setVisitorCount(newCount);
		  await supabase
			.from('mamey_site_content')
			.update({ visitor_counter: newCount })
			.eq('id', data.id);
		  sessionStorage.setItem('mamey_visited', 'true');
		} else {
		  setVisitorCount(data.visitor_counter);
		}
	  } catch (err) {
		console.error('Counter Error:', err.message);
	  }
	};
	handleVisitor();
  }, []);

  useEffect(() => {
	const el = statsRef.current;
	if (!el) return;
	const obs = new IntersectionObserver(
	  ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
	  { threshold: 0.3 }
	);
	obs.observe(el);
	return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e) => {
	const rect = heroRef.current?.getBoundingClientRect();
	if (!rect) return;
	setMousePos({
	  x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
	  y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
	});
  };

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

		.mmy-home { font-family: 'DM Sans', sans-serif; }

		/* ── HERO ── */
		.mmy-hero {
		  position: relative;
		  background: var(--navy, #0d1b2a);
		  border-radius: 20px;
		  padding: clamp(40px, 7vw, 90px) clamp(24px, 6vw, 80px);
		  margin-bottom: clamp(32px, 5vw, 56px);
		  overflow: hidden;
		  cursor: default;
		  min-height: clamp(340px, 50vw, 520px);
		  display: flex;
		  flex-direction: column;
		  justify-content: flex-end;
		}
		.mmy-hero-bg {
		  position: absolute; inset: 0;
		  background: 
			radial-gradient(ellipse 60% 60% at 80% 20%, rgba(212,175,55,0.12) 0%, transparent 70%),
			radial-gradient(ellipse 40% 50% at 10% 80%, rgba(255,255,255,0.04) 0%, transparent 70%);
		  transition: transform 0.1s linear;
		  pointer-events: none;
		}
		.mmy-hero-grid {
		  position: absolute; inset: 0;
		  background-image: 
			linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px);
		  background-size: 60px 60px;
		  pointer-events: none;
		}

		/* ── NEW: HERO TOP ROW FOR PROPER ALIGNMENT ── */
		.mmy-hero-top-row {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  flex-wrap: wrap;
		  gap: 16px;
		  margin-bottom: 20px;
		  position: relative;
		}

		.mmy-hero-kicker {
		  font-size: clamp(9px, 1.5vw, 11px);
		  letter-spacing: 3px;
		  text-transform: uppercase;
		  color: var(--gold, #d4af37);
		  font-weight: 700; /* Added for boldness */
		  margin: 0;
		  opacity: 0;
		  transform: translateY(12px);
		  transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
		  display: flex;
		  align-items: center;
		  gap: 12px;
		}
		.mmy-hero-kicker::before {
		  content: '';
		  display: block;
		  width: 28px; height: 1px;
		  background: var(--gold, #d4af37);
		  flex-shrink: 0;
		}

		/* ── VISITOR COUNTER PILL (FIXED) ── */
		.mmy-visitor-pill {
		  display: flex;
		  align-items: center;
		  gap: 7px;
		  background: rgba(255, 255, 255, 0.15); /* Increased opacity for better visibility */
		  border: 1px solid rgba(212, 175, 55, 0.5); /* Stronger border */
		  backdrop-filter: blur(8px);
		  border-radius: 50px;
		  padding: 6px 14px 6px 10px;
		  color: white; /* Changed to white for better contrast */
		  font-size: 0.75rem;
		  font-weight: 600; /* Made text bolder */
		  letter-spacing: 0.5px;
		  pointer-events: none;
		  opacity: 1; /* Forced visibility */
		  z-index: 10; /* Ensures it stays on top */
		}
		.mmy-visitor-pill.visible { opacity: 1; }
		.mmy-visitor-dot {
		  width: 6px; height: 6px;
		  border-radius: 50%;
		  background: var(--gold, #d4af37);
		  flex-shrink: 0;
		  animation: mmy-pulse 2s infinite;
		}
		.mmy-visitor-count {
		  color: var(--gold, #d4af37);
		  font-weight: 600;
		}
		@keyframes mmy-pulse {
		  0%, 100% { opacity: 1; transform: scale(1); }
		  50% { opacity: 0.5; transform: scale(0.8); }
		}

		.mmy-hero h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(2rem, 5.5vw, 4.2rem);
		  font-weight: 900;
		  line-height: 1.08;
		  color: white;
		  margin: 0 0 24px 0;
		  opacity: 0;
		  transform: translateY(20px);
		  transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
		  position: relative;
		}
		.mmy-hero h1 em {
		  font-style: italic;
		  color: var(--gold, #d4af37);
		}
		.mmy-hero-sub {
		  font-size: clamp(0.9rem, 2vw, 1.05rem);
		  line-height: 1.75;
		  color: rgba(255,255,255,0.72);
		  max-width: 580px;
		  opacity: 0;
		  transform: translateY(16px);
		  transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
		  position: relative;
		  margin-bottom: 36px;
		}
		.mmy-hero-cta {
		  display: inline-flex;
		  align-items: center;
		  gap: 10px;
		  background: var(--gold, #d4af37);
		  color: var(--navy, #0d1b2a);
		  font-weight: 600;
		  font-size: 0.88rem;
		  letter-spacing: 0.5px;
		  padding: 14px 28px;
		  border-radius: 50px;
		  border: none;
		  cursor: pointer;
		  opacity: 0;
		  transform: translateY(14px);
		  transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s, background 0.2s, box-shadow 0.2s;
		  position: relative;
		  text-decoration: none;
		}
		.mmy-hero-cta:hover {
		  background: #c49b2a;
		  box-shadow: 0 8px 32px rgba(212,175,55,0.4);
		  transform: translateY(-2px) !important;
		}
		.mmy-hero-cta svg { transition: transform 0.2s; }
		.mmy-hero-cta:hover svg { transform: translateX(4px); }

		.mmy-hero-loaded .mmy-hero-kicker,
		.mmy-hero-loaded .mmy-hero h1,
		.mmy-hero-loaded .mmy-hero-sub,
		.mmy-hero-loaded .mmy-hero-cta { opacity: 1; transform: translateY(0) !important; }

		/* ── STATS ── */
		.mmy-stats-row {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		  gap: 16px;
		  margin-bottom: clamp(40px, 6vw, 64px);
		}
		.mmy-stat-card {
		  background: #ffffff;
		  border-radius: 14px;
		  padding: clamp(20px, 3vw, 32px) 20px;
		  text-align: center;
		  border: 1px solid rgba(0,0,0,0.06);
		  transition: transform 0.25s, box-shadow 0.25s;
		}
		.mmy-stat-card:hover {
		  transform: translateY(-4px);
		  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
		}
		.mmy-stat-val {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4vw, 2.8rem);
		  font-weight: 900;
		  color: var(--navy, #0d1b2a);
		  line-height: 1;
		  margin-bottom: 6px;
		}
		.mmy-stat-label {
		  font-size: 0.78rem;
		  text-transform: uppercase;
		  letter-spacing: 1.5px;
		  color: var(--text-muted, #888);
		}

		/* ── PILLARS ── */
		.mmy-pillars-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.4rem, 3vw, 2rem);
		  font-weight: 700;
		  margin-bottom: 8px;
		  color: var(--text-main, #1a1a1a);
		}
		.mmy-pillars-divider {
		  width: 48px; height: 3px;
		  background: var(--gold, #d4af37);
		  border-radius: 2px;
		  margin-bottom: 32px;
		}
		.mmy-pillars-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		  gap: 20px;
		}
		.mmy-pillar {
		  background: #ffffff;
		  border-radius: 16px;
		  padding: clamp(24px, 3.5vw, 36px);
		  border: 1px solid rgba(0,0,0,0.06);
		  transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s;
		  cursor: default;
		}
		.mmy-pillar:hover {
		  transform: translateY(-6px) scale(1.01);
		  box-shadow: 0 20px 50px rgba(0,0,0,0.09);
		}
		.mmy-pillar-icon {
		  width: 52px; height: 52px;
		  border-radius: 12px;
		  background: var(--navy, #0d1b2a);
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  margin-bottom: 20px;
		  color: var(--gold, #d4af37);
		  transition: transform 0.3s;
		}
		.mmy-pillar:hover .mmy-pillar-icon { transform: rotate(-5deg) scale(1.1); }
		.mmy-pillar h4 {
		  font-family: 'Playfair Display', serif;
		  font-size: 1.05rem;
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 10px 0;
		}
		.mmy-pillar p {
		  font-size: 0.88rem;
		  line-height: 1.65;
		  color: var(--text-muted, #666);
		  margin: 0;
		}

		/* ── ORIGIN BANNER ── */
		.mmy-origin {
		  background: linear-gradient(135deg, var(--navy, #0d1b2a) 0%, #1a2f45 100%);
		  border-radius: 16px;
		  padding: clamp(28px, 4vw, 48px) clamp(24px, 5vw, 60px);
		  margin-top: clamp(32px, 5vw, 56px);
		  display: flex;
		  flex-wrap: wrap;
		  align-items: center;
		  gap: 24px;
		  position: relative;
		  overflow: hidden;
		}
		.mmy-origin::before {
		  content: '';
		  position: absolute;
		  right: -60px; top: -60px;
		  width: 220px; height: 220px;
		  border-radius: 50%;
		  border: 1px solid rgba(212,175,55,0.15);
		}
		.mmy-origin::after {
		  content: '';
		  position: absolute;
		  right: -20px; top: -20px;
		  width: 140px; height: 140px;
		  border-radius: 50%;
		  border: 1px solid rgba(212,175,55,0.1);
		}
		.mmy-origin-text { flex: 1; min-width: 240px; position: relative; }
		.mmy-origin-text span {
		  display: block;
		  font-size: 10px;
		  text-transform: uppercase;
		  letter-spacing: 3px;
		  color: var(--gold, #d4af37);
		  margin-bottom: 12px;
		}
		.mmy-origin-text p {
		  font-size: clamp(0.88rem, 1.8vw, 1rem);
		  line-height: 1.75;
		  color: rgba(255,255,255,0.78);
		  margin: 0;
		}
		.mmy-origin-badge {
		  flex-shrink: 0;
		  text-align: center;
		  position: relative;
		}
		.mmy-origin-badge-inner {
		  width: clamp(100px, 16vw, 130px);
		  height: clamp(100px, 16vw, 130px);
		  border-radius: 50%;
		  border: 2px solid rgba(212,175,55,0.5);
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  color: white;
		  transition: transform 0.4s;
		}
		.mmy-origin:hover .mmy-origin-badge-inner { transform: rotate(5deg) scale(1.05); }
		.mmy-origin-badge-inner strong {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.4rem, 3.5vw, 2rem);
		  color: var(--gold, #d4af37);
		  font-weight: 700; /* Added for boldness */
		  line-height: 1;
		}
		.mmy-origin-badge-inner small {
		  font-size: 0.65rem;
		  text-transform: uppercase;
		  letter-spacing: 2px;
		  color: rgba(255,255,255,0.6);
		  margin-top: 4px;
		}
	  `}</style>

	  <div className={`mmy-home ${heroLoaded ? 'mmy-hero-loaded' : ''}`}>

		{/* ── HERO ── */}
		<div
		  className="mmy-hero"
		  ref={heroRef}
		  onMouseMove={handleMouseMove}
		  onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
		>
		  <div
			className="mmy-hero-bg"
			style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }}
		  />
		  <div className="mmy-hero-grid" />

		  {/* ── ALIGNED TOP ROW: KICKER & VISITOR PILL ── */}
		  <div className="mmy-hero-top-row">
			<div className="mmy-hero-kicker">{t?.heroEyebrow ?? 'Mamey Group — Est. 2014'}</div>
			
			{visitorCount > 0 && (
			  <div className={`mmy-visitor-pill ${heroLoaded ? 'visible' : ''}`}>
				<span className="mmy-visitor-dot" />
				<span className="mmy-visitor-count">{visitorCount.toLocaleString()}</span>
				<span>{t?.visitorLabel ?? 'site visitors'}</span>
			  </div>
			)}
		  </div>

		  <h1>{t?.heroTitle ?? 'Delivering Quality Across Africa & The Middle East'}</h1>
		  <p className="mmy-hero-sub">
			{t?.heroSubtitle ?? 'A South Sudanese enterprise specialising in the import, distribution, and supply of foodstuffs, building materials, industrial gases, logistics, and essential services.'}
		  </p>
		  
		  <div style={{ position: 'relative' }}>
			<Link to="/services" className="mmy-hero-cta">
			  {t?.heroCta ?? 'Explore Our Services'}
			  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
				<line x1="5" y1="12" x2="19" y2="12" />
				<polyline points="12 5 19 12 12 19" />
			  </svg>
			</Link>
		  </div>
		</div>

		{/* ── STATS ── */}
		<div className="mmy-stats-row" ref={statsRef}>
		  {stats.map((s) => (
			<StatCard key={s.label} {...s} animate={statsVisible} />
		  ))}
		</div>

		{/* ── PILLARS ── */}
		<div style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
		  <h2 className="mmy-pillars-title">{t?.homePillarsTitle ?? 'What We Stand For'}</h2>
		  <div className="mmy-pillars-divider" />
		  <div className="mmy-pillars-grid">
			{pillars.map((p) => (
			  <div className="mmy-pillar" key={p.label}>
				<div className="mmy-pillar-icon">{p.icon}</div>
				<h4>{p.label}</h4>
				<p>{p.text}</p>
			  </div>
			))}
		  </div>
		</div>

		{/* ── ORIGIN BANNER ── */}
		<div className="mmy-origin">
		  <div className="mmy-origin-text">
			<span>{t?.homeOriginTag ?? 'Our Story'}</span>
			<p>
			  {t?.homeOriginText ?? 'Incorporated as a wholly indigenous South Sudanese company, Mamey has grown from its Juba headquarters into a multi-national enterprise operating across Africa and the Middle East — with a Sudan office established in 2019.'}
			</p>
		  </div>
		  <div className="mmy-origin-badge">
			<div className="mmy-origin-badge-inner">
			  <strong>10+</strong>
			  <small>{t?.homeOriginBadge ?? 'Years of Excellence'}</small>
			</div>
		  </div>
		</div>

	  </div>
	</>
  );
}