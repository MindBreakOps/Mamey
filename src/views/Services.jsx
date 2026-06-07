import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

/* ─────────────────────────────────────────────────────────────
   PHOSPHOR ICONS (Native SVGs)
───────────────────────────────────────────────────────────── */
const Ph = {
  Briefcase: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z"/>
	</svg>
  ),
  Buildings: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M240,208h-8V96a16,16,0,0,0-16-16H160V40a16,16,0,0,0-16-16H40A16,16,0,0,0,24,40V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM216,96V208H160V96ZM40,40H144V208H104V168a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v40H40ZM80,208v-32h16v32Z"/>
	</svg>
  ),
  Globe: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.6-28.06-10.85-51-24-67.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-18.9,0-37.07-25.67-40-72H168C165.07,190.33,146.9,216,128,216Zm-40-88c2.93-46.33,21.1-72,40-72s37.07,25.67,40,72Zm15.2-67.11C90.85,77,81.6,99.94,80,128H40.37A88.17,88.17,0,0,1,103.2,60.89ZM40.37,144H80c1.6,28.06,10.85,51,24,67.11A88.17,88.17,0,0,1,40.37,144Zm111.43,67.11C164.85,195,174.1,172.06,175.8,144h39.83A88.17,88.17,0,0,1,151.8,211.11Z"/>
	</svg>
  ),
  Shield: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M208,40H48A16,16,0,0,0,32,56V112c0,91.4,83.3,122.28,84.1,122.58a8,8,0,0,0,7.8,0C124.7,234.28,208,203.4,208,112V56A16,16,0,0,0,208,40Zm0,72c0,78.42-66.35,109.4-80,114.94C114.35,221.4,48,190.42,48,112V56H208Z"/>
	</svg>
  ),
  Users: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
	</svg>
  ),
  Truck: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M240,112H232V64a16,16,0,0,0-16-16H24A16,16,0,0,0,8,64V192h15.22A24,24,0,0,0,48,216a23.84,23.84,0,0,0,23.61-20H152.39A24,24,0,0,0,176,216a23.84,23.84,0,0,0,23.61-20H240a8,8,0,0,0,8-8V120A8,8,0,0,0,240,112ZM48,200a8,8,0,1,1,8-8A8,8,0,0,1,48,200Zm128,0a8,8,0,1,1,8-8A8,8,0,0,1,176,200ZM24,64H216V112H24ZM232,180H200.78A24,24,0,0,0,176,168a23.84,23.84,0,0,0-23.61,20H72.61A24,24,0,0,0,48,168a23.84,23.84,0,0,0-23.61,20H24V128H232Z"/>
	</svg>
  ),
  FileText: ({ size = 15, color = "currentColor" }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill={color}>
	  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216ZM88,128a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,128Zm0,40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,168Z"/>
	</svg>
  )
};

// Map the string from DB to the component
const DynamicIcon = ({ name }) => {
  const SelectedIcon = Ph[name] || Ph.Briefcase; // Fallback to Briefcase
  return <SelectedIcon size={20} color="var(--navy)" />;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchServices = async () => {
	  const { data, error } = await supabase
		.from('mamey_site_content')
		.select('*')
		.eq('category', 'services')
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
				
				{/* Dynamically render your Phosphor SVGs */}
				<DynamicIcon name={svc.icon_name} />
				
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