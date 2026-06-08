import React, { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

/* ── Inline SVG Icons ── */
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
	<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
	<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function useReveal(threshold = 0.15) {
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

export default function About() {
  const { t } = useContext(AppContext);
  const [cardsRef, cardsVisible] = useReveal(0.1);
  const [orgRef, orgVisible] = useReveal(0.1);

  // Moved inside component to access 't' translations
  const values = [
	{ Icon: IconTarget, title: t?.aboutMissionTitle ?? 'Our Mission', text: t?.aboutMissionText ?? '...' },
	{ Icon: IconEye, title: t?.aboutVisionTitle ?? 'Our Vision', text: t?.aboutVisionText ?? '...' },
	{ Icon: IconHeart, title: t?.aboutPassionTitle ?? 'Our Passion', text: t?.aboutPassionText ?? '...' },
	{ Icon: IconShield, title: t?.aboutValuesTitle ?? 'Our Values', text: t?.aboutValuesText ?? '...' },
  ];

  const departments = [
	{ title: t?.deptField ?? 'Field Manager', sub: t?.deptFieldSub ?? 'General Supervisor' },
	{ title: t?.deptMarketing ?? 'Marketing Manager', sub: t?.deptMarketingSub ?? 'Procurement' },
	{ title: t?.deptFinance ?? 'Finance Manager', sub: t?.deptFinanceSub ?? 'Accountant' },
	{ title: t?.deptHR ?? 'HR Manager', sub: t?.deptHRSub ?? 'Public Relations' },
	{ title: t?.deptProgram ?? 'Program Manager', sub: t?.deptProgramSub ?? 'Operations Manager' },
  ];

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

		.abt-root { font-family: 'DM Sans', sans-serif; }

		/* ── HERO HEADER ── */
		.abt-header {
		  position: relative;
		  margin-bottom: clamp(40px, 6vw, 64px);
		  padding-bottom: 32px;
		}
		.abt-header::after {
		  content: '';
		  position: absolute;
		  bottom: 0; left: 0;
		  width: 56px; height: 3px;
		  background: var(--gold, #d4af37);
		  border-radius: 2px;
		}
		.abt-kicker {
		  font-size: 10px;
		  letter-spacing: 3px;
		  text-transform: uppercase;
		  color: var(--gold, #d4af37);
		  margin-bottom: 14px;
		  display: flex;
		  align-items: center;
		  gap: 10px;
		}
		.abt-kicker::before {
		  content: '';
		  display: block;
		  width: 24px; height: 1px;
		  background: currentColor;
		}
		.abt-h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4.5vw, 3.2rem);
		  font-weight: 900;
		  line-height: 1.1;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 20px 0;
		  max-width: 800px;
		}
		.abt-sub {
		  font-size: clamp(0.9rem, 1.8vw, 1rem);
		  line-height: 1.75;
		  color: var(--text-muted, #666);
		  max-width: 640px;
		  margin: 0;
		}

		/* ── VALUE CARDS ── */
		.abt-values-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		  gap: 20px;
		  margin-bottom: clamp(48px, 7vw, 80px);
		}
		.abt-card {
		  background: #ffffff;
		  border-radius: 18px;
		  padding: clamp(24px, 3.5vw, 36px);
		  border: 1px solid rgba(0,0,0,0.07);
		  position: relative;
		  overflow: hidden;
		  cursor: default;
		  opacity: 0;
		  transform: translateY(24px);
		  transition: opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s, background 0.3s;
		}
		.abt-card.abt-visible {
		  opacity: 1;
		  transform: translateY(0);
		}
		.abt-card:nth-child(1) { transition-delay: 0s; }
		.abt-card:nth-child(2) { transition-delay: 0.08s; }
		.abt-card:nth-child(3) { transition-delay: 0.16s; }
		.abt-card:nth-child(4) { transition-delay: 0.24s; }
		.abt-card:hover {
		  box-shadow: 0 16px 48px rgba(0,0,0,0.09);
		  background: white;
		}
		.abt-card::before {
		  content: '';
		  position: absolute;
		  top: 0; left: 0; right: 0;
		  height: 3px;
		  background: linear-gradient(90deg, var(--navy, #0d1b2a), var(--gold, #d4af37));
		  transform: scaleX(0);
		  transform-origin: left;
		  transition: transform 0.35s ease;
		}
		.abt-card:hover::before { transform: scaleX(1); }
		.abt-card-icon {
		  width: 54px; height: 54px;
		  border-radius: 14px;
		  background: var(--navy, #0d1b2a);
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  color: var(--gold, #d4af37);
		  margin-bottom: 20px;
		  transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
		}
		.abt-card:hover .abt-card-icon { transform: rotate(-8deg) scale(1.12); }
		.abt-card h3 {
		  font-family: 'Playfair Display', serif;
		  font-size: 1.1rem;
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 12px 0;
		}
		.abt-card p {
		  font-size: 0.88rem;
		  line-height: 1.7;
		  color: var(--text-muted, #666);
		  margin: 0;
		}

		/* ── ORG CHART ── */
		.abt-org-section {
		  opacity: 0;
		  transform: translateY(20px);
		  transition: opacity 0.6s ease, transform 0.6s ease;
		}
		.abt-org-section.abt-visible { opacity: 1; transform: translateY(0); }
		.abt-org-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.3rem, 3vw, 1.7rem);
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 8px 0;
		}
		.abt-org-divider {
		  width: 40px; height: 3px;
		  background: var(--gold, #d4af37);
		  border-radius: 2px;
		  margin-bottom: 36px;
		}
		.abt-org-tree {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  gap: 0;
		}
		.abt-org-node {
		  background: var(--navy, #0d1b2a);
		  color: white;
		  padding: clamp(10px, 2vw, 14px) clamp(20px, 4vw, 36px);
		  border-radius: 10px;
		  font-weight: 600;
		  font-size: clamp(0.8rem, 1.8vw, 0.92rem);
		  letter-spacing: 0.3px;
		  text-align: center;
		  min-width: clamp(180px, 40vw, 260px);
		  transition: transform 0.25s, box-shadow 0.25s;
		  cursor: default;
		  position: relative;
		}
		.abt-org-node:hover {
		  transform: scale(1.04);
		  box-shadow: 0 8px 30px rgba(13,27,42,0.35);
		}
		.abt-org-node.top {
		  background: linear-gradient(135deg, var(--navy, #0d1b2a), #1e3a5f);
		  border: 1px solid rgba(212,175,55,0.4);
		  font-size: clamp(0.85rem, 2vw, 1rem);
		  font-weight: 700;
		  letter-spacing: 1px;
		  text-transform: uppercase;
		}
		.abt-org-connector {
		  width: 2px;
		  height: 28px;
		  background: linear-gradient(to bottom, rgba(13,27,42,0.3), rgba(212,175,55,0.3));
		}
		.abt-org-branch-wrap {
		  width: 100%;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		}
		.abt-org-branch-line {
		  height: 2px;
		  width: 90%;
		  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);
		  margin-bottom: 20px;
		}
		.abt-org-depts {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		  gap: 16px;
		  width: 100%;
		  padding: 0 8px;
		}
		.abt-dept-card {
		  background: white;
		  border: 1px solid rgba(0,0,0,0.1);
		  border-radius: 12px;
		  padding: clamp(14px, 2.5vw, 20px) 16px;
		  text-align: center;
		  transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s, border-color 0.25s;
		  cursor: default;
		}
		.abt-dept-card:hover {
		  transform: translateY(-5px) scale(1.02);
		  box-shadow: 0 12px 36px rgba(0,0,0,0.1);
		  border-color: var(--gold, #d4af37);
		}
		.abt-dept-title {
		  font-weight: 700;
		  font-size: clamp(0.78rem, 1.6vw, 0.88rem);
		  color: var(--navy, #0d1b2a);
		  margin-bottom: 6px;
		}
		.abt-dept-sub {
		  font-size: clamp(0.7rem, 1.4vw, 0.78rem);
		  color: var(--text-muted, #888);
		}
		.abt-dept-dot {
		  width: 8px; height: 8px;
		  border-radius: 50%;
		  background: var(--gold, #d4af37);
		  margin: 0 auto 10px auto;
		}
	  `}</style>

	  <div className="abt-root">

		{/* ── HEADER ── */}
		<div className="abt-header">
		  <p className="abt-kicker">{t?.aboutSectionLabel ?? 'Who We Are'}</p>
		  <h1 className="abt-h1">{t?.aboutHeroTitle ?? 'Built on Trust, Driven by Purpose'}</h1>
		  <p className="abt-sub">{t?.aboutHeroSub ?? 'Incorporated in 2014 as a wholly indigenous South Sudanese company, Mamey has grown from its Juba headquarters into a multi-national enterprise operating across Africa and the Middle East.'}</p>
		</div>

		{/* ── VALUE CARDS ── */}
		<div className="abt-values-grid" ref={cardsRef}>
		  {values.map(({ Icon, title, text }, i) => (
			<div key={title} className={`abt-card ${cardsVisible ? 'abt-visible' : ''}`}>
			  <div className="abt-card-icon"><Icon /></div>
			  <h3>{title}</h3>
			  <p>{text}</p>
			</div>
		  ))}
		</div>

		{/* ── ORG CHART ── */}
		<div className={`abt-org-section ${orgVisible ? 'abt-visible' : ''}`} ref={orgRef}>
		  <h3 className="abt-org-title">{t?.orgTitle ?? 'Structure & Management'}</h3>
		  <div className="abt-org-divider" />

		  <div className="abt-org-tree">
			<div className="abt-org-node top">{t?.orgBoard ?? 'Board of Directors'}</div>
			<div className="abt-org-connector" />
			<div className="abt-org-node">{t?.orgMD ?? 'Managing Director'}</div>
			<div className="abt-org-connector" />
			<div className="abt-org-node">{t?.orgAdmin ?? 'Administrative Manager'}</div>
			<div className="abt-org-connector" />

			<div className="abt-org-branch-wrap">
			  <div className="abt-org-branch-line" />
			  <div className="abt-org-depts">
				{departments.map((d, i) => (
				  <div key={d.title} className="abt-dept-card" style={{ transitionDelay: `${i * 60}ms` }}>
					<div className="abt-dept-dot" />
					<div className="abt-dept-title">{d.title}</div>
					<div className="abt-dept-sub">{d.sub}</div>
				  </div>
				))}
			  </div>
			</div>
		  </div>
		</div>

	  </div>
	</>
  );
}