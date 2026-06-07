import React from 'react';

export default function Home() {
  return (
	<div className="pro-container">
	  <div style={{ background: 'var(--accent)', borderRadius: 'var(--radius)', padding: '60px', color: 'white', marginBottom: '40px' }}>
		<h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'white' }}>Delivering Quality<br/>Across Africa & The Middle East</h1>
		<p style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.8', opacity: 0.9 }}>
		  A South Sudanese enterprise specializing in the import, distribution, and supply of foodstuffs, building materials, industrial gases, logistics, and essential services.
		</p>
	  </div>

	  <div className="grid-layout">
		<div className="content-card">
		  <h3 className="card-title">Our Mission</h3>
		  <p className="card-text">To continually exceed customer, producer, and supplier expectations with premium quality ingredients and unmatched professional service.</p>
		</div>
		<div className="content-card">
		  <h3 className="card-title">Our Vision</h3>
		  <p className="card-text">To become the benchmark for wholesale and retail distribution across Central Equatoria State and expand our enterprise footprint across the region.</p>
		</div>
	  </div>
	</div>
  );
}