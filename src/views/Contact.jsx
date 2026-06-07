import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Reach Us</h1>
	  <p className="pro-subheading">Operating out of headquarters in Juba, South Sudan and our Sudan office in Khartoum.</p>

	  <div className="grid-layout" style={{ gap: '40px', marginBottom: '60px' }}>
		
		{/* Juba Office */}
		<div className="content-card" style={{ background: 'var(--navy)', color: 'white', border: 'none' }}>
		  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)' }}>Head Office</span>
		  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '28px', color: 'white', margin: '10px 0' }}>Juba, South Sudan</h3>
		  <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '30px' }}>Since 2014</p>

		  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
			<MapPin color="var(--gold)" />
			<span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Kator Area, Near KCB Konyo Konyo Branch<br/>Juba, Republic of South Sudan</span>
		  </div>
		  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
			<Phone color="var(--gold)" />
			<span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>+211 956 777 759<br/>+211 267 777 759</span>
		  </div>
		  <div style={{ display: 'flex', gap: '15px' }}>
			<Mail color="var(--gold)" />
			<span style={{ fontSize: '0.9rem' }}>justermamy@gmail.com</span>
		  </div>
		</div>

		{/* Khartoum Office */}
		<div className="content-card" style={{ background: 'var(--navy)', color: 'white', border: 'none' }}>
		  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)' }}>Sudan Office</span>
		  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '28px', color: 'white', margin: '10px 0' }}>Khartoum, Sudan</h3>
		  <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '30px' }}>Since 2019</p>

		  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
			<MapPin color="var(--gold)" />
			<span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>AL-Naseem City, Property No. 565<br/>Khartoum, Sudan</span>
		  </div>
		  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
			<Phone color="var(--gold)" />
			<span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>+249 915 073 736<br/>+249 918 146 254</span>
		  </div>
		  <div style={{ display: 'flex', gap: '15px' }}>
			<Mail color="var(--gold)" />
			<span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>mameygroup3@gmail.com<br/>justermamy@gmail.com</span>
		  </div>
		</div>

	  </div>
	</div>
  );
}