import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, FileDown } from 'lucide-react';

export default function LegalDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchDocs = async () => {
	  const { data, error } = await supabase
		.from('mamey_site_content')
		.select('*')
		.eq('category', 'legal')
		.order('created_at', { ascending: false });
	  
	  if (!error && data) setDocs(data);
	  setLoading(false);
	};
	fetchDocs();
  }, []);

  return (
	<div className="pro-container">
	  <h1 className="pro-heading">Legal Documents</h1>
	  <p className="pro-subheading">Secure registry of operational licenses, chamber of commerce certifications, and corporate compliance files.</p>

	  {loading ? (
		<p>Verifying secure document links...</p>
	  ) : (
		<div className="grid-layout">
		  {docs.length === 0 ? <p className="card-text">No legal documents currently available.</p> : null}
		  {docs.map(doc => (
			<div key={doc.id} className="content-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
			  <div style={{ background: 'var(--bg-light)', padding: '16px', borderRadius: '50%' }}>
				<ShieldCheck size={28} color="var(--navy)" />
			  </div>
			  <div style={{ flex: 1 }}>
				<h3 className="card-title" style={{ marginBottom: '4px' }}>{doc.title}</h3>
				<p className="card-text" style={{ fontSize: '0.85rem' }}>{doc.description}</p>
				{doc.media_url && (
				  <a href={doc.media_url} target="_blank" rel="noreferrer" className="btn-secure">
					<FileDown size={16} /> View Document
				  </a>
				)}
			  </div>
			</div>
		  ))}
		</div>
	  )}
	</div>
  );
}