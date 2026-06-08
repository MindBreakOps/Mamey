import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/* ── Google Apps Script Webhook ── */
const GAS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxX3xGY3a3EBue0uactleGhOdzFgurAV-EeKNtIkKWn65Bhk1v03CVvUXGLalTGo27IlA/exec';

/* ────────────────────────────────────────────────────────────
   INLINE SVG ICONS — zero external dependency
──────────────────────────────────────────────────────────── */
const Ico = {
  LogOut: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
	  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
	</svg>
  ),
  Upload: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
	  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
	</svg>
  ),
  Edit: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
	  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
	</svg>
  ),
  Trash: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
	  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
	</svg>
  ),
  X: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
	  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
	</svg>
  ),
  File: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
	  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
	</svg>
  ),
  Image: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
	  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
	</svg>
  ),
  ImageSm: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" aria-hidden="true">
	  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
	</svg>
  ),
  List: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
	  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
	  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
	</svg>
  ),
  Check: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
	  <polyline points="20 6 9 17 4 12"/>
	</svg>
  ),
  Alert: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
	  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
	</svg>
  ),
  Lock: () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
	  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
	</svg>
  ),
};

/* ────────────────────────────────────────────────────────────
   GOOGLE DRIVE URL RESOLVER  — fixes the ? / broken preview
──────────────────────────────────────────────────────────── */
function resolveGoogleDriveUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (url.includes('export=download') || url.includes('uc?id')) return url;

  let fileId = null;
  const mFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (mFile) fileId = mFile[1];
  if (!fileId) {
	const mOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (mOpen) fileId = mOpen[1];
  }
  return fileId
	? `https://drive.google.com/uc?export=download&id=${fileId}`
	: url;
}

/* ────────────────────────────────────────────────────────────
   TOAST NOTIFICATION — replaces window.alert()
──────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
	<div style={{
	  position: 'fixed',
	  bottom: 'clamp(16px, 4vw, 32px)',
	  right:  'clamp(16px, 4vw, 32px)',
	  zIndex: 99999,
	  display: 'flex',
	  flexDirection: 'column',
	  gap: 10,
	  pointerEvents: 'none',
	  maxWidth: 'min(360px, calc(100vw - 32px))',
	}}>
	  {toasts.map(t => (
		<div
		  key={t.id}
		  style={{
			display: 'flex',
			alignItems: 'flex-start',
			gap: 12,
			background: t.type === 'error' ? '#1a0a0a' : '#0a1a12',
			border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.35)'}`,
			borderRadius: 12,
			padding: '14px 16px',
			boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
			color: 'white',
			fontSize: 13,
			fontWeight: 500,
			lineHeight: 1.4,
			pointerEvents: 'all',
			animation: 'toastIn 0.3s cubic-bezier(.34,1.56,.64,1) both',
		  }}
		>
		  <span style={{ color: t.type === 'error' ? '#f87171' : '#4ade80', flexShrink: 0, marginTop: 1 }}>
			{t.type === 'error' ? <Ico.Alert /> : <Ico.Check />}
		  </span>
		  <span>{t.msg}</span>
		</div>
	  ))}
	  <style>{`
		@keyframes toastIn {
		  from { opacity: 0; transform: translateY(12px) scale(0.95); }
		  to   { opacity: 1; transform: translateY(0) scale(1); }
		}
	  `}</style>
	</div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'success', duration = 3500) => {
	const id = Date.now();
	setToasts(prev => [...prev, { id, msg, type }]);
	setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  return { toasts, push };
}

/* ────────────────────────────────────────────────────────────
   CONFIRMATION DIALOG — replaces window.confirm()
──────────────────────────────────────────────────────────── */
function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
	<div style={{
	  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
	  backdropFilter: 'blur(4px)', zIndex: 99998,
	  display: 'flex', alignItems: 'center', justifyContent: 'center',
	  padding: 'clamp(16px, 4vw, 32px)',
	}}>
	  <div style={{
		background: 'white', borderRadius: 16,
		padding: 'clamp(24px, 4vw, 36px)',
		width: '100%', maxWidth: 400,
		boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
		animation: 'toastIn 0.25s cubic-bezier(.34,1.56,.64,1)',
	  }}>
		<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#c62828' }}>
		  <Ico.Alert />
		  <strong style={{ fontSize: '1rem', color: '#1a1a1a' }}>{title}</strong>
		</div>
		<p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
		<div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
		  <button className="adm-btn-edit" onClick={onCancel} style={{ padding: '9px 20px', fontSize: 13 }}>
			Cancel
		  </button>
		  <button
			className="adm-btn-delete"
			onClick={onConfirm}
			style={{ padding: '9px 20px', fontSize: 13, background: '#c62828', color: 'white', border: 'none', borderRadius: 'var(--r-sm)' }}
		  >
			Yes, Delete
		  </button>
		</div>
	  </div>
	</div>
  );
}

/* ────────────────────────────────────────────────────────────
   CATEGORY CONFIG
──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: 'services',  label: 'Our Services' },
  { value: 'projects',  label: 'Projects & Operations' },
  { value: 'blog',      label: 'Blog & News' },
  { value: 'legal',     label: 'Legal Documents (PDFs)' },
  { value: 'clients',   label: 'Clients & Partners' },
];

const ICONS = [
  { value: 'Briefcase', label: 'Briefcase — Corporate / Services' },
  { value: 'Buildings', label: 'Buildings — Infrastructure / Projects' },
  { value: 'Globe',     label: 'Globe — Logistics / Import' },
  { value: 'Shield',    label: 'Shield — Legal / Security' },
  { value: 'Users',     label: 'Users — Clients / Team' },
  { value: 'Truck',     label: 'Truck — Transport / Supply' },
  { value: 'FileText',  label: 'Document — News / Reports' },
];

const CAT_COLORS = {
  services: { bg: '#e6f2fb', color: '#1f5c86' },
  projects: { bg: '#e8f5e9', color: '#2e7d32' },
  blog:     { bg: '#f3e5f5', color: '#6a1b9a' },
  legal:    { bg: '#fff3e0', color: '#e65100' },
  clients:  { bg: '#fce4ec', color: '#880e4f' },
};

const BLANK_FORM = { category: 'services', title: '', description: '', icon_name: 'Briefcase' };

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [session,       setSession]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [loginForm,     setLoginForm]     = useState({ email: '', password: '' });
  const [editingId,     setEditingId]     = useState(null);
  const [contentForm,   setContentForm]   = useState({ ...BLANK_FORM });
  const [selectedFile,  setSelectedFile]  = useState(null);
  const [liveContent,   setLiveContent]   = useState([]);
  const [filterCat,     setFilterCat]     = useState('all');
  const [confirm,       setConfirm]       = useState(null); // { id }
  const fileInputRef = useRef(null);
  const composerRef  = useRef(null);
  const { toasts, push: toast } = useToast();

  /* ── Auth ── */
  useEffect(() => {
	supabase.auth.getSession().then(({ data: { session } }) => {
	  setSession(session);
	  if (session) fetchLiveContent();
	});
	const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
	  setSession(s);
	  if (s) fetchLiveContent();
	});
	return () => subscription.unsubscribe();
  }, []);

  /* ── Fetch ── */
  const fetchLiveContent = async () => {
	const { data, error } = await supabase
	  .from('mamey_site_content')
	  .select('*')
	  .order('created_at', { ascending: false });
	if (!error && data) setLiveContent(data);
  };

  /* ── Delete ── */
  const handleDelete = (id) => {
	setConfirm({ id });
  };
  const confirmDelete = async () => {
	const { id } = confirm;
	setConfirm(null);
	const { error } = await supabase.from('mamey_site_content').delete().eq('id', id);
	if (error) {
	  toast('Failed to delete: ' + error.message, 'error');
	} else {
	  setLiveContent(prev => prev.filter(item => item.id !== id));
	  if (editingId === id) cancelEdit();
	  toast('Record deleted successfully.');
	}
  };

  /* ── Google Drive Upload ── */
  const uploadToDrive = (file) =>
	new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.onload = async (e) => {
		try {
		  const res = await fetch(GAS_WEBHOOK_URL, {
			method: 'POST',
			body: JSON.stringify({
			  fileName: file.name,
			  mimeType: file.type,
			  base64:   e.target.result,
			}),
		  });
		  const result = await res.json();
		  result.success ? resolve(result.url) : reject(new Error(result.error || 'GAS returned success: false'));
		} catch (err) { reject(err); }
	  };
	  reader.onerror = (err) => reject(err);
	  reader.readAsDataURL(file);
	});

  /* ── Edit Mode ── */
  const handleEditClick = (item) => {
	setEditingId(item.id);
	setContentForm({
	  category:    item.category    || 'services',
	  title:       item.title       || '',
	  description: item.description || '',
	  icon_name:   item.icon_name   || 'Briefcase',
	});
	setSelectedFile(null);
	if (fileInputRef.current) fileInputRef.current.value = '';
	// Scroll composer into view
	setTimeout(() => composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const cancelEdit = () => {
	setEditingId(null);
	setContentForm({ ...BLANK_FORM });
	setSelectedFile(null);
	if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Submit ── */
  const handleSubmitContent = async (e) => {
	e.preventDefault();
	if (!contentForm.title.trim()) { toast('A Title is required.', 'error'); return; }

	setLoading(true);
	setUploading(!!selectedFile);

	try {
	  let mediaUrl = null;
	  if (selectedFile) {
		mediaUrl = await uploadToDrive(selectedFile);
		if (!mediaUrl) throw new Error('Google Drive failed to return a valid URL.');
	  }

	  const payload = {
		category:    contentForm.category,
		title:       contentForm.title.trim(),
		description: contentForm.description.trim(),
		icon_name:   contentForm.icon_name,
	  };
	  if (mediaUrl) payload.media_url = mediaUrl;

	  if (editingId) {
		const { error } = await supabase.from('mamey_site_content').update(payload).eq('id', editingId);
		if (error) throw error;
		toast('Content updated successfully!');
	  } else {
		payload.author_id = session.user.id;
		const { error } = await supabase.from('mamey_site_content').insert([payload]);
		if (error) throw error;
		toast('Content published to live site!');
	  }

	  cancelEdit();
	  fetchLiveContent();
	} catch (err) {
	  console.error(err);
	  toast('Operation failed: ' + err.message, 'error');
	} finally {
	  setLoading(false);
	  setUploading(false);
	}
  };

  /* ── Login ── */
  const handleLogin = async (e) => {
	e.preventDefault();
	setLoading(true);
	const { error } = await supabase.auth.signInWithPassword({
	  email:    loginForm.email,
	  password: loginForm.password,
	});
	if (error) toast(error.message, 'error');
	setLoading(false);
  };

  const handleLogout = async () => {
	await supabase.auth.signOut();
	toast('Signed out successfully.');
  };

  /* ── Filtered content ── */
  const displayedContent = filterCat === 'all'
	? liveContent
	: liveContent.filter(item => item.category === filterCat);

  /* ─────────────────────────────────────────
	 LOGIN SCREEN
  ───────────────────────────────────────── */
  if (!session) {
	return (
	  <>
		<div className="adm-login-wrap">
		  <div className="adm-login-card">
			<div className="adm-login-logo">
			  <div style={{
				width: 56, height: 56, borderRadius: '50%',
				background: 'var(--blue-mid)',
				border: '1px solid var(--blue-glow)',
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				margin: '0 auto 16px',
				color: 'var(--navy)',
			  }}>
				<Ico.Lock />
			  </div>
			  <h2>Enterprise Access</h2>
			  <p>Mamey Content Management System</p>
			</div>

			<form onSubmit={handleLogin} noValidate>
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-email">Administrator Email</label>
				<input
				  id="adm-email"
				  type="email"
				  className="adm-input"
				  placeholder="admin@example.com"
				  value={loginForm.email}
				  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
				  required
				  autoComplete="email"
				/>
			  </div>
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-pass">Secure Passphrase</label>
				<input
				  id="adm-pass"
				  type="password"
				  className="adm-input"
				  placeholder="••••••••••••"
				  value={loginForm.password}
				  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
				  required
				  autoComplete="current-password"
				/>
			  </div>
			  <button
				type="submit"
				disabled={loading}
				className={`adm-submit mode-create`}
				style={{ marginTop: 8 }}
			  >
				{loading ? 'Authenticating…' : 'Secure Login'}
			  </button>
			</form>
		  </div>
		</div>
		<Toast toasts={toasts} />
	  </>
	);
  }

  /* ─────────────────────────────────────────
	 DASHBOARD UI
  ───────────────────────────────────────── */
  return (
	<>
	  <div className="adm-shell">

		{/* ── TOP BAR ── */}
		<div className="adm-topbar">
		  <div>
			<h1 className="adm-topbar-title">Content Management</h1>
			<p className="adm-topbar-meta">
			  Logged in as <strong>{session.user.email}</strong>
			  {' · '}
			  <span style={{ color: 'var(--fg-subtle)' }}>{liveContent.length} records</span>
			</p>
		  </div>
		  <button
			className="adm-btn-edit"
			onClick={handleLogout}
			style={{ padding: '9px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
		  >
			<Ico.LogOut /> Sign Out
		  </button>
		</div>

		{/* ── TWO-COLUMN GRID ── */}
		<div className="adm-grid">

		  {/* ────── LEFT: COMPOSER ────── */}
		  <div
			ref={composerRef}
			className={`adm-panel${editingId ? ' editing' : ''}`}
			style={{ position: 'sticky', top: 'calc(var(--navbar-h) + 20px)' }}
		  >
			<div className="adm-panel-header">
			  <div className={`adm-panel-title${editingId ? ' editing' : ''}`}>
				{editingId ? <Ico.Edit /> : <Ico.Upload />}
				<span>{editingId ? 'Edit Entry' : 'New Entry'}</span>
			  </div>
			  {editingId && (
				<button
				  type="button"
				  onClick={cancelEdit}
				  style={{
					background: 'none', border: 'none',
					color: 'var(--fg-muted)', cursor: 'pointer',
					display: 'flex', alignItems: 'center', gap: 4,
					fontSize: 12.5, fontWeight: 600,
				  }}
				  aria-label="Cancel editing"
				>
				  <Ico.X /> Cancel
				</button>
			  )}
			</div>

			<form className="adm-form" onSubmit={handleSubmitContent} noValidate>

			  {/* Category */}
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-cat">Category</label>
				<div style={{ position: 'relative' }}>
				  <select
					id="adm-cat"
					className="adm-select"
					value={contentForm.category}
					onChange={e => setContentForm({ ...contentForm, category: e.target.value })}
				  >
					{CATEGORIES.map(c => (
					  <option key={c.value} value={c.value}>{c.label}</option>
					))}
				  </select>
				  <span style={{
					position: 'absolute', right: 14, top: '50%',
					transform: 'translateY(-50%)', pointerEvents: 'none',
					color: 'var(--fg-muted)', fontSize: 10,
				  }}>▼</span>
				</div>
			  </div>

			  {/* Icon */}
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-icon">Display Icon</label>
				<div style={{ position: 'relative' }}>
				  <select
					id="adm-icon"
					className="adm-select"
					value={contentForm.icon_name}
					onChange={e => setContentForm({ ...contentForm, icon_name: e.target.value })}
				  >
					{ICONS.map(ic => (
					  <option key={ic.value} value={ic.value}>{ic.label}</option>
					))}
				  </select>
				  <span style={{
					position: 'absolute', right: 14, top: '50%',
					transform: 'translateY(-50%)', pointerEvents: 'none',
					color: 'var(--fg-muted)', fontSize: 10,
				  }}>▼</span>
				</div>
			  </div>

			  {/* Title */}
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-title">Title / Headline *</label>
				<input
				  id="adm-title"
				  type="text"
				  className="adm-input"
				  placeholder="Enter title…"
				  value={contentForm.title}
				  onChange={e => setContentForm({ ...contentForm, title: e.target.value })}
				  required
				/>
			  </div>

			  {/* Description */}
			  <div className="adm-field">
				<label className="adm-label" htmlFor="adm-desc">Description / Content</label>
				<textarea
				  id="adm-desc"
				  className="adm-textarea"
				  placeholder="Write your content here…"
				  value={contentForm.description}
				  onChange={e => setContentForm({ ...contentForm, description: e.target.value })}
				  rows={5}
				/>
			  </div>

			  {/* File upload */}
			  <div className="adm-field">
				<label className="adm-label">
				  Media Attachment
				  {editingId && (
					<span style={{ color: 'var(--gold)', fontWeight: 500, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>
					  — Leave blank to keep current
					</span>
				  )}
				</label>
				<label
				  className={`adm-upload-zone${selectedFile ? ' has-file' : ''}`}
				  htmlFor="file-upload"
				  aria-label="Click to attach file"
				>
				  <Ico.Image />
				  <span className={selectedFile ? 'adm-upload-filename' : 'adm-upload-hint'}>
					{selectedFile ? selectedFile.name : 'Click to attach Image / PDF / Video'}
				  </span>
				  {selectedFile && (
					<span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>
					  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
					</span>
				  )}
				  <input
					id="file-upload"
					ref={fileInputRef}
					type="file"
					accept="image/*,video/*,application/pdf"
					onChange={e => setSelectedFile(e.target.files[0] || null)}
					style={{ display: 'none' }}
				  />
				</label>
			  </div>

			  {/* Submit */}
			  <button
				type="submit"
				disabled={loading}
				className={`adm-submit ${editingId ? 'mode-update' : 'mode-create'}`}
			  >
				{uploading
				  ? 'Uploading to Drive…'
				  : loading
					? 'Processing…'
					: editingId
					  ? '✓ Update Live Content'
					  : '↑ Deploy to Live Site'
				}
			  </button>

			</form>
		  </div>

		  {/* ────── RIGHT: LIVE CONTENT TABLE ────── */}
		  <div className="adm-panel">
			<div className="adm-panel-header">
			  <div className="adm-panel-title">
				<Ico.List />
				<span>Live Content Database</span>
			  </div>
			  <span style={{ fontSize: 12, color: 'var(--fg-subtle)', fontWeight: 400 }}>
				{displayedContent.length} / {liveContent.length} records
			  </span>
			</div>

			{/* Category filter */}
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
			  {[{ value: 'all', label: 'All' }, ...CATEGORIES].map(c => (
				<button
				  key={c.value}
				  onClick={() => setFilterCat(c.value)}
				  style={{
					padding: '5px 14px',
					borderRadius: 'var(--r-full)',
					fontSize: 12,
					fontWeight: 600,
					border: '1.5px solid',
					cursor: 'pointer',
					transition: 'all 0.15s',
					...(filterCat === c.value
					  ? { background: 'var(--navy)', color: 'white', borderColor: 'var(--navy)' }
					  : { background: 'transparent', color: 'var(--fg-muted)', borderColor: 'var(--border)' }
					),
				  }}
				>
				  {c.label}
				</button>
			  ))}
			</div>

			<div className="adm-table-wrap">
			  <table className="adm-table" aria-label="Content database">
				<thead>
				  <tr>
					<th>Category</th>
					<th>Title</th>
					<th style={{ minWidth: 80 }}>Media</th>
					<th style={{ textAlign: 'right', minWidth: 120 }}>Actions</th>
				  </tr>
				</thead>
				<tbody>
				  {displayedContent.length === 0 && (
					<tr>
					  <td colSpan={4}>
						<div className="adm-empty">
						  {liveContent.length === 0
							? 'No content yet. Start publishing using the form.'
							: `No entries in "${filterCat}" category.`}
						</div>
					  </td>
					</tr>
				  )}
				  {displayedContent.map(item => {
					const catStyle = CAT_COLORS[item.category] || CAT_COLORS.services;
					const directUrl = resolveGoogleDriveUrl(item.media_url);
					return (
					  <tr key={item.id} className={editingId === item.id ? 'row-editing' : ''}>
						<td>
						  <span
							className="adm-badge"
							style={{ background: catStyle.bg, color: catStyle.color }}
						  >
							{item.category}
						  </span>
						</td>
						<td>
						  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg)', marginBottom: 2 }}>
							{item.title}
						  </div>
						  {item.description && (
							<div style={{
							  fontSize: 12, color: 'var(--fg-muted)',
							  display: '-webkit-box',
							  WebkitLineClamp: 2,
							  WebkitBoxOrient: 'vertical',
							  overflow: 'hidden',
							  lineHeight: 1.45,
							}}>
							  {item.description}
							</div>
						  )}
						</td>
						<td>
						  {directUrl ? (
							<a
							  href={directUrl}
							  target="_blank"
							  rel="noreferrer"
							  className="adm-media-link"
							  title={item.media_url}
							>
							  <Ico.ImageSm /> View
							</a>
						  ) : (
							<span className="adm-none">—</span>
						  )}
						</td>
						<td>
						  <div className="adm-action-row">
							<button
							  className="adm-btn-edit"
							  onClick={() => handleEditClick(item)}
							  aria-label={`Edit "${item.title}"`}
							>
							  <Ico.Edit /> Edit
							</button>
							<button
							  className="adm-btn-delete"
							  onClick={() => handleDelete(item.id)}
							  aria-label={`Delete "${item.title}"`}
							>
							  <Ico.Trash /> Trash
							</button>
						  </div>
						</td>
					  </tr>
					);
				  })}
				</tbody>
			  </table>
			</div>
		  </div>

		</div>
	  </div>

	  {/* Confirmation dialog */}
	  <ConfirmDialog
		open={!!confirm}
		title="Delete Record"
		message="This will permanently remove the record from the live database. This action cannot be undone."
		onConfirm={confirmDelete}
		onCancel={() => setConfirm(null)}
	  />

	  {/* Toast stack */}
	  <Toast toasts={toasts} />
	</>
  );
}