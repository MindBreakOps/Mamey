import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FolderOpen } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchProjects = async () => {
	  const { data, error } = await supabase
		.from('mamey_site_content')
		.select('*')
		.eq('category', 'projects') // MUST MATCH THE DROPDOWN EXACTLY
		.order('created_at', { ascending: false });
	  
	  if (!error && data) setProjects(data);
	  setLoading(false);
	};
	fetchProjects();
  }, []);

  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Projects & Operations</h1>
	  <p className="pro-subheading">A portfolio of our executed contracts, logistics operations, and ongoing supply chain achievements.</p>

	  {loading ? (
		<p>Loading project records...</p>
	  ) : (
		<div className="grid-layout">
		  {projects.length === 0 ? <p className="card-text">No active projects documented.</p> : null}
		  
		  {projects.map(proj => (
			<div key={proj.id} className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
			  
			  {/* TRUE MEDIA RENDERING */}
			  {proj.media_url ? (
				<div style={{ height: '220px', width: '100%', background: '#000' }}>
				   {/* We use an image tag. If your Google Script returns a drive link, it will render here. */}
				  <img src={proj.media_url} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
				</div>
			  ) : (
				<div style={{ height: '220px', width: '100%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				  <FolderOpen size={48} color="rgba(255,255,255,0.2)" />
				</div>
			  )}
			  
			  <div style={{ padding: '24px' }}>
				<h3 className="card-title">{proj.title}</h3>
				<p className="card-text" style={{ margin: 0 }}>{proj.description}</p>
			  </div>
			</div>
		  ))}
		</div>
	  )}
	</div>
  );
}