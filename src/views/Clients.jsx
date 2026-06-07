import React from 'react';

export default function Clients() {
  const clientsList = [
	{ name: 'Kakira Sugar Company', country: 'Uganda' },
	{ name: 'Gulf for Sugar', country: 'Dubai, UAE' },
	{ name: 'Mopishi Extra Maize Millers', country: 'Kenya' },
	{ name: 'UNDP', country: 'Juba, South Sudan' },
	{ name: 'UNIFIES', country: 'Juba, South Sudan' },
	{ name: 'Ministry of Health', country: 'Juba, South Sudan' },
	{ name: 'Ministry of Economic Planning', country: 'South Sudan' },
  ];

  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Clients & Partners</h1>
	  <p className="pro-subheading">Trusted across the region by government ministries, international agencies, and private sectors.</p>

	  {/* Hero Stats */}
	  <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: '50px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '40px', color: 'white', justifyContent: 'space-between' }}>
		<div style={{ maxWidth: '600px' }}>
		  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '16px' }}>Asset Base & Financial Strength</h3>
		  <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
			Our total asset base is currently valued at over $5 million. We are sufficiently equipped to handle major transactions locally and internationally, backed by formal term contracts and MOUs.
		  </p>
		</div>
		<div style={{ textAlign: 'right' }}>
		  <div style={{ fontSize: '48px', fontFamily: 'Playfair Display', fontWeight: 'bold', color: 'var(--gold)' }}>$5M+</div>
		  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Total Asset Value</div>
		  <div style={{ height: '2px', width: '40px', background: 'var(--gold)', margin: '15px 0 15px auto' }}></div>
		  <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', fontWeight: 'bold' }}>100%</div>
		  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Contract Success Rate</div>
		</div>
	  </div>

	  {/* Grid */}
	  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px' }}>Existing Clientele Base</h3>
	  <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
		{clientsList.map((client, i) => (
		  <div key={i} className="content-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '20px' }}>
			<div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--navy)' }}></div>
			<div>
			  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{client.name}</div>
			  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{client.country}</div>
			</div>
		  </div>
		))}
	  </div>
	</div>
  );
}