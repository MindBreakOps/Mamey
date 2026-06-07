import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Briefcase } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchServices = async () => {
	  const { data, error } = await supabase
		.from('mamey_site_content')
		.select('*')
		.eq('category', 'service')
		.order('created_at', { ascending: false });
	  
	  if (!error && data) setServices(data);
	  setLoading(false);
	};
	fetchServices();
  }, []);

  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Corporate Services</h1>
	  <p className="pro-subheading">Comprehensive operational divisions managed by Mamey Group across all geographic sectors.</p>

	  {loading ? (
		<p>Loading enterprise services...</p>
	  ) : (
		<div className="grid-layout">
		  {services.length === 0 ? <p className="card-text">No service entries found. Add them via the dashboard.</p> : null}
		  {services.map(svc => (
			<div key={svc.id} className="content-card">
			  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
				<Briefcase size={20} color="var(--navy)" />
			  </div>
			  <h3 className="card-title">{svc.title}</h3>
			  <p className="card-text">{svc.description}</p>
			</div>
		  ))}
		</div>
	  )}
	</div>
  );
}