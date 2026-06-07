import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, UploadCloud, FileText, Trash2, Edit, Image as ImageIcon, X } from 'lucide-react';

// Replace with your actual OPERIX GAS Webhook URL
const GAS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxX3xGY3a3EBue0uactleGhOdzFgurAV-EeKNtIkKWn65Bhk1v03CVvUXGLalTGo27IlA/exec';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // CMS State
  const [editingId, setEditingId] = useState(null);
  // NOTE: Icon selection is tracked right here in the state
  const [contentForm, setContentForm] = useState({ category: 'services', title: '', description: '', icon_name: 'Briefcase' });
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

  // ─── 1. FETCH LIVE CONTENT ───
  const fetchLiveContent = async () => {
	const { data, error } = await supabase
	  .from('mamey_site_content')
	  .select('*')
	  .order('created_at', { ascending: false });
	if (!error && data) setLiveContent(data);
  };

  // ─── 2. DELETE CONTENT ───
  const handleDelete = async (id) => {
	if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
	
	const { error } = await supabase.from('mamey_site_content').delete().eq('id', id);
	if (error) {
	  alert("Failed to delete: " + error.message);
	} else {
	  setLiveContent(liveContent.filter(item => item.id !== id));
	  if (editingId === id) cancelEdit();
	}
  };

  // ─── 3. OPERIX GAS UPLOAD LOGIC ───
// ─── 3. MAMEY GAS UPLOAD LOGIC ───
	const uploadToDrive = (file) => {
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
		  const base64String = e.target.result;
		  
		  try {
			const response = await fetch(GAS_WEBHOOK_URL, {
			  method: 'POST',
			  body: JSON.stringify({
				fileName: file.name,
				mimeType: file.type,
				base64: base64String // Send exactly what the new script expects
			  })
			});
			
			const result = await response.json();
			
			if (result.success) {
			  resolve(result.url); // The new script always returns 'url'
			} else {
			  reject(new Error(result.error || "GAS returned success: false"));
			}
		  } catch (err) {
			reject(err);
		  }
		};
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	  });
	};

  // ─── 4. EDIT MODE HANDLERS ───
  const handleEditClick = (item) => {
	setEditingId(item.id);
	setContentForm({
	  category: item.category || 'services',
	  title: item.title || '',
	  description: item.description || '',
	  icon_name: item.icon_name || 'Briefcase'
	});
	setSelectedFile(null);
	document.getElementById('file-upload').value = '';
	window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
	setEditingId(null);
	setContentForm({ category: 'services', title: '', description: '', icon_name: 'Briefcase' });
	setSelectedFile(null);
	document.getElementById('file-upload').value = '';
  };

  // ─── 5. SUBMIT CONTENT (CREATE OR UPDATE) ───
  const handleSubmitContent = async (e) => {
	e.preventDefault();
	if (!contentForm.title) return alert('A Title is required');
	
	setLoading(true);
	setUploading(true);

	try {
	  let mediaUrl = null;
	  
	  // Upload to OPERIX GAS if a new file is attached
	  if (selectedFile) {
		mediaUrl = await uploadToDrive(selectedFile);
		if (!mediaUrl) throw new Error("Google Drive failed to return a valid URL.");
	  }

	  const payload = {
		category: contentForm.category,
		title: contentForm.title,
		description: contentForm.description,
		icon_name: contentForm.icon_name // Pushes selected icon to Supabase
	  };

	  if (mediaUrl) payload.media_url = mediaUrl;

	  if (editingId) {
		// UPDATE EXISTING
		const { error } = await supabase.from('mamey_site_content').update(payload).eq('id', editingId);
		if (error) throw error;
		alert(`Content Updated Successfully!`);
	  } else {
		// CREATE NEW
		payload.author_id = session.user.id;
		const { error } = await supabase.from('mamey_site_content').insert([payload]);
		if (error) throw error;
		alert(`Content Published Successfully!`);
	  }
	  
	  cancelEdit(); 
	  fetchLiveContent(); 

	} catch (error) {
	  console.error(error);
	  alert('Operation failed: ' + error.message);
	} finally {
	  setLoading(false);
	  setUploading(false);
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
		<form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
		  <h2 style={{ color: 'var(--navy)', marginBottom: '20px', textAlign: 'center', fontFamily: 'Playfair Display' }}>Enterprise Access</h2>
		  <input type="email" placeholder="Administrator Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '15px' }} required />
		  <input type="password" placeholder="Secure Passphrase" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '25px' }} required />
		  <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>{loading ? 'Authenticating...' : 'Secure Login'}</button>
		</form>
	  </div>
	);
  }

  // ─── DASHBOARD UI ───
  return (
	<div className="pro-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
	  
	  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
		<div>
		  <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', color: 'var(--text-dark)', margin: 0 }}>Content Management</h1>
		  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Logged in as: <strong>{session.user.email}</strong></p>
		</div>
		<button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ccc', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
		  <LogOut size={16}/> Logout
		</button>
	  </div>

	  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
		
		{/* LEFT COLUMN: PUBLISH COMPOSER */}
		<div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content', border: editingId ? '2px solid var(--blue)' : 'none' }}>
		  
		  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
			<h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: editingId ? 'var(--blue)' : 'var(--navy)', fontSize: '1.2rem', margin: 0 }}>
			  {editingId ? <Edit size={20} /> : <UploadCloud size={20} />}
			  {editingId ? 'Edit Entry' : 'New Entry'}
			</h3>
			{editingId && (
			  <button type="button" onClick={cancelEdit} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
				<X size={16} /> Cancel
			  </button>
			)}
		  </div>

		  <form onSubmit={handleSubmitContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			
			<div>
			  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category</label>
			  <select value={contentForm.category} onChange={e => setContentForm({...contentForm, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}>
				<option value="services">Our Services</option>
				<option value="projects">Projects & Operations</option>
				<option value="blog">Blog & News</option>
				<option value="legal">Legal Documents (PDFs)</option>
				<option value="clients">Clients & Partners</option>
			  </select>
			</div>

			{/* ── ICON SELECTION IS RIGHT HERE ── */}
			<div>
			  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Display Icon</label>
			  <select value={contentForm.icon_name} onChange={e => setContentForm({...contentForm, icon_name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}>
				<option value="Briefcase">Briefcase (Corporate / Services)</option>
				<option value="Buildings">Buildings (Infrastructure / Projects)</option>
				<option value="Globe">Globe (Logistics / Import)</option>
				<option value="Shield">Shield (Legal / Security)</option>
				<option value="Users">Users (Clients / Team)</option>
				<option value="Truck">Truck (Transport / Supply)</option>
				<option value="FileText">Document (News / Reports)</option>
			  </select>
			</div>

			<div>
			  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Title / Headline</label>
			  <input type="text" placeholder="Enter title..." value={contentForm.title} onChange={e => setContentForm({...contentForm, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} required />
			</div>
			
			<div>
			  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Description / Content</label>
			  <textarea placeholder="Write your content here..." value={contentForm.description} onChange={e => setContentForm({...contentForm, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', height: '140px', outline: 'none', resize: 'vertical' }} />
			</div>

			<div>
			  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
				Media Attachment {editingId && <span style={{color: '#f57c00'}}>(Optional: Leave blank to keep current media)</span>}
			  </label>
			  <label style={{ cursor: 'pointer', padding: '15px', border: '2px dashed #ccc', borderRadius: '6px', background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--navy)', transition: '0.2s' }}>
				<ImageIcon size={24} color="#999" />
				<span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
				  {selectedFile ? selectedFile.name : 'Click to attach new Image / PDF'}
				</span>
				<input id="file-upload" type="file" onChange={e => setSelectedFile(e.target.files[0])} style={{ display: 'none' }} />
			  </label>
			</div>

			<button type="submit" disabled={loading} style={{ background: editingId ? 'var(--blue)' : 'var(--navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>
			  {uploading ? 'Processing...' : editingId ? 'Update Live Content' : 'Deploy to Live Site'}
			</button>
		  </form>
		</div>

		{/* RIGHT COLUMN: MANAGE LIVE CONTENT */}
		<div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
		  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy)', fontSize: '1.2rem' }}>
			<FileText size={20} /> Live Content Database
		  </h3>
		  
		  <div style={{ overflowX: 'auto' }}>
			<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
			  <thead>
				<tr style={{ borderBottom: '2px solid #eee' }}>
				  <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
				  <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600' }}>Title</th>
				  <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600' }}>Media</th>
				  <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
				</tr>
			  </thead>
			  <tbody>
				{liveContent.length === 0 && <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No content found. Start publishing!</td></tr>}
				
				{liveContent.map(item => (
				  <tr key={item.id} style={{ borderBottom: '1px solid #eee', transition: '0.2s', backgroundColor: editingId === item.id ? '#f0f7ff' : 'transparent' }}>
					<td style={{ padding: '16px 12px' }}>
					  <span style={{ background: '#e6f2fb', color: 'var(--navy)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
						{item.category}
					  </span>
					</td>
					<td style={{ padding: '16px 12px', color: 'var(--text-dark)', fontWeight: '500' }}>{item.title}</td>
					<td style={{ padding: '16px 12px' }}>
					  {item.media_url ? (
						<a href={item.media_url} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
						  <ImageIcon size={14} /> View
						</a>
					  ) : <span style={{ color: '#ccc', fontSize: '0.85rem' }}>None</span>}
					</td>
					<td style={{ padding: '16px 12px', textAlign: 'right' }}>
					  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
						<button onClick={() => handleEditClick(item)} style={{ background: '#f5f5f5', color: '#333', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', transition: '0.2s' }}>
						  <Edit size={14} /> Edit
						</button>
						<button onClick={() => handleDelete(item.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', transition: '0.2s' }}>
						  <Trash2 size={14} /> Trash
						</button>
					  </div>
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