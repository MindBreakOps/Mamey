import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
	<footer style={{ background: 'var(--navy)', color: 'white', paddingTop: '60px', marginTop: 'auto' }}>
	  <div className="pro-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', paddingBottom: '40px' }}>
		
		{/* Brand Column */}
		<div>
		  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
			<img src="/mamey.png" alt="Mamey Logo" style={{ width: '40px' }} />
			<h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', margin: 0, color: '#ffffff' }}>MAMEY</h2>
		  </div>
		  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>
			A South Sudanese enterprise specializing in the import, distribution, and supply of foodstuffs, building materials, and logistics since 2014.
		  </p>
		</div>

		{/* Quick Links */}
		<div>
		  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--gold-pale)' }}>Quick Links</h3>
		  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<Link to="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</Link>
			<Link to="/services" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Our Services</Link>
			<Link to="/clients" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Clients & Partners</Link>
			<Link to="/projects" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Projects & Operations</Link>
		  </div>
		</div>

		{/* Contact Info */}
		<div>
		  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--gold-pale)' }}>Head Office</h3>
		  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
			<div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
			  <MapPin size={18} color="var(--gold-pale)" style={{ flexShrink: 0 }} />
			  <span>Kator Area, Near KCB Konyo Konyo Branch, Juba, South Sudan</span>
			</div>
			<div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
			  <Phone size={18} color="var(--gold-pale)" style={{ flexShrink: 0 }} />
			  <span>+211 956 777 759</span>
			</div>
			<div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
			  <Mail size={18} color="var(--gold-pale)" style={{ flexShrink: 0 }} />
			  <span>justermamy@gmail.com</span>
			</div>
		  </div>
		</div>
	  </div>

	  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
		© {new Date().getFullYear()} Mamey For General Trading & Investment Co. Ltd. All rights reserved.
	  </div>
	</footer>
  );
}