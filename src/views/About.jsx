import React from 'react';
import { Target, Eye, Heart, Shield } from 'lucide-react';

export default function About() {
  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Built on Trust, Driven by Purpose</h1>
	  <p className="pro-subheading">
		Incorporated in 2014 as a wholly indigenous South Sudanese company, Mamey has grown from its Juba headquarters into a multi-national enterprise operating across Africa and the Middle East with a Sudan office established in 2019.
	  </p>

	  {/* ── Core Values Grid ── */}
	  <div className="grid-layout" style={{ marginBottom: '60px' }}>
		<div className="content-card">
		  <Target size={32} color="var(--navy)" style={{ marginBottom: '16px' }} />
		  <h3 className="card-title">Our Mission</h3>
		  <p className="card-text">Mamey is a results-oriented company that builds value for its stakeholders through its employees. Our mission is to continually exceed customer, producer, and supplier expectations with premium quality ingredients and service.</p>
		</div>

		<div className="content-card">
		  <Eye size={32} color="var(--navy)" style={{ marginBottom: '16px' }} />
		  <h3 className="card-title">Our Vision</h3>
		  <p className="card-text">Through an unequalled mode of operation, we aspire to become one of the country's leading enterprise companies, setting the benchmark for wholesale and retail distribution across Central Equatoria State and beyond.</p>
		</div>

		<div className="content-card">
		  <Heart size={32} color="var(--navy)" style={{ marginBottom: '16px' }} />
		  <h3 className="card-title">Our Passion</h3>
		  <p className="card-text">The Mamey brand is an epitome of our zeal to relentlessly deliver the much-needed food and goods for the sustenance of our community and nation. This passion drives every decision and every delivery.</p>
		</div>

		<div className="content-card">
		  <Shield size={32} color="var(--navy)" style={{ marginBottom: '16px' }} />
		  <h3 className="card-title">Our Values</h3>
		  <p className="card-text">We operate with the highest sense of professionalism, inculcating a culture of integrity, skill, and competence. Through our highly trained workforce, everything begins and ends with safety.</p>
		</div>
	  </div>

	  {/* ── Organization Chart ── */}
	  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '30px' }}>
		Structure & Management
	  </h3>
	  
	  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
		<div style={{ background: 'var(--navy)', color: 'white', padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold' }}>Board of Directors</div>
		<div style={{ width: '2px', height: '20px', background: '#ccc' }}></div>
		<div style={{ background: 'var(--text-main)', color: 'white', padding: '10px 24px', borderRadius: '6px' }}>Managing Director</div>
		<div style={{ width: '2px', height: '20px', background: '#ccc' }}></div>
		<div style={{ background: 'var(--text-main)', color: 'white', padding: '10px 24px', borderRadius: '6px' }}>Administrative Manager</div>
		<div style={{ width: '2px', height: '20px', background: '#ccc' }}></div>
		
		{/* Department Branches */}
		<div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', borderTop: '2px solid #ccc', paddingTop: '20px', width: '100%' }}>
		  <div style={{ textAlign: 'center' }}>
			<div style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>Field Manager</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>General Supervisor</div>
		  </div>
		  <div style={{ textAlign: 'center' }}>
			<div style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>Marketing Manager</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Procurement</div>
		  </div>
		  <div style={{ textAlign: 'center' }}>
			<div style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>Finance Manager</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Accountant</div>
		  </div>
		  <div style={{ textAlign: 'center' }}>
			<div style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>HR Manager</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Public Relations</div>
		  </div>
		  <div style={{ textAlign: 'center' }}>
			<div style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>Program Manager</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Operations Manager</div>
		  </div>
		</div>
	  </div>

	</div>
  );
}