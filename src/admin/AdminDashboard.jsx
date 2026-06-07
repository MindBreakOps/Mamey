import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, UploadCloud, FileText, Trash2, Edit } from 'lucide-react';

const GAS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwmd1QUqvJ9FNIGDXAgIFFXUoKip3yeEkQqzbugfJtUsK7YHj8Ma0eMxDl6lLDtzL8f/exec';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // CMS State
  const [contentForm, setContentForm] = useState({ category: 'home', title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [liveContent, setLiveContent] = useState([]);

  useEffect(() => {
	supabase.auth.getSession().then(({ data: { session } }) => {
	  setSession(session);
	  if (session) fetchLiveContent();
	});

	const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
	  setSession(session);
	  if (session) fetchLiveContent();
	});
	return () => subscription.unsubscribe();
  }, []);

  // ─── CMS FUNCTIONS ───

  const fetchLiveContent = async () => {
	const { data, error } = await supabase
	  .from('mamey_site_content')
	  .select('*')
	  .order('created_at', { ascending: false });
	if (!error && data) setLiveContent(data);
  };

  const handleDelete = async (id) => {
	if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
	
	const { error } = await supabase.from('mamey_site_content').delete().eq('id', id);
	if (error) {
	  alert("Failed to delete: " + error.message);
	} else {
	  setLiveContent(liveContent.filter(item => item.id !== id));
	}
  };

  const uploadToDrive = (file) => {
	return new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.onload = async (e) => {
		const base64Data = e.target.result.split(',')[1];
		try {
		  const response = await fetch(GAS_WEBHOOK_URL, {
			method: 'POST',
			body: JSON.stringify({ name: file.name, mimeType: file.type, data: base64Data })
		  });
		  const result = await response.json();
		  resolve(result.url); 
		} catch (err) {
		  reject(err);
		}
	  };
	  reader.onerror = (error) => reject(error);
	  reader.readAsDataURL(file);
	});
  };

  const handleSubmitContent = async (e) => {
	e.preventDefault();
	if (!contentForm.title) return alert('A Title is required');
	setLoading(true);

	try {
	  let mediaUrl = null;
	  if (selectedFile) {
		mediaUrl = await uploadToDrive(selectedFile);
	  }

	  const { error } = await supabase.from('mamey_site_content').insert([{
		author_id: session.user.id,
		category: contentForm.category, // 'home', 'services', 'projects', 'legal'
		title: contentForm.title,
		description: contentForm.description,
		media_url: mediaUrl
	  }]);

	  if (error) throw error;
	  
	  // Reset form and refresh table
	  setContentForm({ category: 'home', title: '', description: '' });
	  setSelectedFile(null);
	  fetchLiveContent();
	  alert(`Successfully published!`);

	} catch (error) {
	  alert('Upload failed: ' + error.message);
	} finally {
	  setLoading(false);
	}
  };

  const handleLogin = async (e) => {
	e.preventDefault();
	setLoading(true);
	const { error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
	if (error) alert(error.message);
	setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  // ─── LOGIN SCREEN ───
  if (!session) {
	return (
	  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
		<form onSubmit={handleLogin} className="content-card" style={{ width: '100%', maxWidth: '400px' }}>
		  <h2 style={{ color: 'var(--navy)', marginBottom: '20px', textAlign: 'center' }}>Enterprise Access</h2>
		  <input type="email" placeholder="Administrator Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '15px' }} required />
		  <input type="password" placeholder="Secure Passphrase" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '25px' }} required />
		  <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>{loading ? 'Authenticating...' : 'Secure Login'}</button>
		</form>
	  </div>
	);
  }

  // ─── DASHBOARD UI ───
  return (
	<div className="pro-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
	  
	  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
		<div>
		  <h1 className="pro-heading" style={{ fontSize: '2rem' }}>CMS Control Panel</h1>
		  <p style={{ color: 'var(--text-muted)' }}>Logged in as: {session.user.email}</p>
		</div>
		<button onClick={handleLogout} className="btn-secure" style={{ marginTop: 0, background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>
		  <LogOut size={16}/> End Session
		</button>
	  </div>

	  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
		
		{/* LEFT COLUMN: PUBLISH */}
		<div className="content-card" style={{ height: 'fit-content' }}>
		  <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy)' }}><UploadCloud size={20} /> Publish Content</h3>
		  <form onSubmit={handleSubmitContent} style={{ display: 'grid', gap: '15px' }}>
			
			<select value={contentForm.category} onChange={e => setContentForm({...contentForm, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}>
			  <option value="home">Home Page</option>
			  <option value="services">Our Services</option>
			  <option value="projects">Projects & Operations</option>
			  <option value="legal">Legal Documents</option>
			</select>

			<input type="text" placeholder="Title" value={contentForm.title} onChange={e => setContentForm({...contentForm, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} required />
			
			<textarea placeholder="Description..." value={contentForm.description} onChange={e => setContentForm({...contentForm, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', height: '100px' }} />

			<label style={{ cursor: 'pointer', padding: '15px', border: '2px dashed var(--navy)', borderRadius: '6px', background: 'var(--bg-light)', textAlign: 'center', fontWeight: '600', color: 'var(--navy)' }}>
			  <input type="file" onChange={e => setSelectedFile(e.target.files[0])} style={{ display: 'none' }} />
			  {selectedFile ? selectedFile.name : '+ Attach Image / PDF'}
			</label>

			<button type="submit" disabled={loading} style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
			  {loading ? 'Publishing...' : 'Deploy to Live Site'}
			</button>
		  </form>
		</div>

		{/* RIGHT COLUMN: MANAGE */}
		<div className="content-card">
		  <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy)' }}><Edit size={20} /> Manage Live Content</h3>
		  
		  <div style={{ overflowX: 'auto' }}>
			<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
			  <thead>
				<tr style={{ borderBottom: '2px solid var(--bg-light)' }}>
				  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Section</th>
				  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Title</th>
				  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Media</th>
				  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Action</th>
				</tr>
			  </thead>
			  <tbody>
				{liveContent.length === 0 && <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No content found.</td></tr>}
				{liveContent.map(item => (
				  <tr key={item.id} style={{ borderBottom: '1px solid var(--bg-light)' }}>
					<td style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem' }}>{item.category}</td>
					<td style={{ padding: '12px', color: 'var(--navy)' }}>{item.title}</td>
					<td style={{ padding: '12px' }}>
					  {item.media_url ? <a href={item.media_url} target="_blank" rel="noreferrer" style={{ color: '#1C75BC' }}>View File</a> : <span style={{ color: '#ccc' }}>None</span>}
					</td>
					<td style={{ padding: '12px' }}>
					  <button onClick={() => handleDelete(item.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
						<Trash2 size={14} /> Delete
					  </button>
					</td>
				  </tr>
				))}
			  </tbody>
			</table>
		  </div>
		</div>

	  </div>
	</div>
  );
}