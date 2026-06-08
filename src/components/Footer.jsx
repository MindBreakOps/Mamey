import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

/* ─────────────────────────────────────────────────────────────
   PHOSPHOR ICONS — inline SVG
───────────────────────────────────────────────────────────── */
const Ph = {
  MapPin: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M128,24a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,24Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,200Zm0-112a32,32,0,1,0,32,32A32,32,0,0,0,128,88Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,136Z"/>
	</svg>
  ),
  Phone: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/>
	</svg>
  ),
  Envelope: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"/>
	</svg>
  ),
  ArrowUp: ({ size = 14 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"/>
	</svg>
  ),
  Clock: ({ size = 16 }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
	  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/>
	</svg>
  ),
};

export default function Footer() {
  const { t, lang } = useContext(AppContext);

  const quickLinks = [
	{ path: '/',         label: t?.home      ?? 'Home'                  },
	{ path: '/about',    label: t?.about     ?? 'About Us'              },
	{ path: '/services', label: t?.services  ?? 'Our Services'          },
	{ path: '/projects', label: t?.projects  ?? 'Projects & Operations' },
	{ path: '/legal',    label: t?.legal     ?? 'Legal Documents'       },
	{ path: '/clients',  label: t?.clients   ?? 'Clients & Partners'    },
	{ path: '/contact',  label: t?.contact   ?? 'Contact'               },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
	<footer className="site-footer" role="contentinfo">
	  <div className="footer-main">
		<div className="container">
		  <div className="footer-grid">

			{/* ── Brand column ── */}
			<div>
			  <div className="footer-brand-logo">
				<img src="/mamey.png" alt="Mamey logo" width="40" height="40" />
				<span className="footer-brand-name">
				  {t?.siteName ?? 'MAMEY'}
				</span>
			  </div>

			  <p className="footer-tagline">
				{t?.footerTagline ?? 'A South Sudanese enterprise specializing in the import, distribution, and supply of foodstuffs, building materials, and logistics since 2014.'}
			  </p>

			  {/* Back to top */}
			  <button
				onClick={scrollToTop}
				aria-label={t?.backToTop ?? 'Scroll back to top of page'}
				className="footer-back-top"
			  >
				<Ph.ArrowUp size={13} />
				<span>{t?.backToTop ?? 'Back to Top'}</span>
			  </button>
			</div>

			{/* ── Quick links column ── */}
			<div>
			  <h3 className="footer-heading">
				{t?.footerQuickLinks ?? 'Quick Links'}
			  </h3>
			  <nav className="footer-links" aria-label="Footer navigation">
				{quickLinks.map(link => (
				  <Link key={link.path} to={link.path} className="footer-link">
					{link.label}
				  </Link>
				))}
			  </nav>
			</div>

			{/* ── Contact column ── */}
			<div>
			  <h3 className="footer-heading">
				{t?.footerContact ?? 'Head Office'}
			  </h3>
			  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>

				<div className="footer-contact-row">
				  <span className="footer-contact-icon">
					<Ph.MapPin size={15} />
				  </span>
				  <span>
					{t?.contactAddress ?? 'Kator Area, Near KCB Konyo Konyo Branch, Juba, South Sudan'}
				  </span>
				</div>

				<div className="footer-contact-row">
				  <span className="footer-contact-icon">
					<Ph.Phone size={15} />
				  </span>
				  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<a
					  href="tel:+211956777759"
					  className="footer-contact-link"
					>
					  {t?.contactPhoneNum ?? '+211 956 777 759'}
					</a>
					<a
					  href="tel:+211267777759"
					  className="footer-contact-link"
					>
					  +211 267 777 759
					</a>
				  </div>
				</div>

				<div className="footer-contact-row">
				  <span className="footer-contact-icon">
					<Ph.Envelope size={15} />
				  </span>
				  <a
					href="mailto:justermamy@gmail.com"
					className="footer-contact-link"
				  >
					{t?.contactEmailAddr ?? 'justermamy@gmail.com'}
				  </a>
				</div>

				<div className="footer-contact-row">
				  <span className="footer-contact-icon">
					<Ph.Clock size={15} />
				  </span>
				  <div>
					<strong style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600, marginBottom: 2 }}>
					  {t?.contactHours ?? 'Business Hours'}
					</strong>
					<span>
					  {t?.contactHoursText ?? 'Sunday – Thursday, 8:00 AM – 5:00 PM (EAT)'}
					</span>
				  </div>
				</div>

			  </div>
			</div>

		  </div>
		</div>
	  </div>

	  {/* ── Footer bar ── */}
	  <div className="container">
		<div className="footer-bar">
		  <span className="footer-bar-copy">
			© {new Date().getFullYear()}{' '}
			{t?.footerCopyright ?? 'Mamey For General Trading & Investment Co. Ltd. All rights reserved.'}
		  </span>
		  <div className="footer-bar-links">
			<a href="/privacy" className="footer-bar-link">
			  {t?.footerPrivacy ?? 'Privacy Policy'}
			</a>
			<a href="/terms" className="footer-bar-link">
			  {t?.footerTerms ?? 'Terms of Use'}
			</a>
		  </div>
		</div>
	  </div>

	  {/* Inline styles for footer-specific elements not in App.css */}
	  <style>{`
		.footer-back-top {
		  margin-top: var(--sp-24);
		  display: inline-flex;
		  align-items: center;
		  gap: var(--sp-6);
		  background: rgba(255,255,255,0.08);
		  border: 1px solid rgba(255,255,255,0.15);
		  color: rgba(255,255,255,0.7);
		  padding: 8px 16px;
		  border-radius: var(--r-full);
		  font-size: 12px;
		  font-weight: 600;
		  cursor: pointer;
		  font-family: var(--font-body);
		  transition: background var(--t-fast), color var(--t-fast), transform var(--t-fast);
		}
		.footer-back-top:hover {
		  background: rgba(255,255,255,0.18);
		  color: white;
		  transform: translateY(-2px);
		}
		.footer-contact-link {
		  color: rgba(255,255,255,0.65);
		  font-size: 13px;
		  line-height: 1.5;
		  transition: color var(--t-fast);
		  text-decoration: none;
		}
		.footer-contact-link:hover { color: white; }
	  `}</style>
	</footer>
  );
}