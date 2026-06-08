import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/* ── Google Apps Script Webhook ── */
const GAS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbypki4pdp9XHSkang32V3UI54NydVak3ULGLHzafGwwxnjSyoNtT1SYQ5uFHYYOlwPzXQ/exec';

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

  /* ── Upload progress ── */
  const [uploadProgress, setUploadProgress] = useState(0);

  /* ── Pre-upload size gate ── */
  // GAS has ~50MB payload cap; base64 inflates by ~33%, so raw limit is ~35MB.
  // Images get compressed so they're fine. PDFs/videos can't be compressed in-browser.
  const MAX_IMAGE_MB  = 20;  // before compression — caught just in case
  const MAX_OTHER_MB  = 8;   // PDFs, videos — hard cap (can't compress these)

  const checkFileSize = (file) => {
	const mb = file.size / 1024 / 1024;
	if (file.type.startsWith('image/') && mb > MAX_IMAGE_MB)
	  throw new Error(`Image is ${mb.toFixed(1)} MB. Max allowed is ${MAX_IMAGE_MB} MB.`);
	if (!file.type.startsWith('image/') && mb > MAX_OTHER_MB)
	  throw new Error(`File is ${mb.toFixed(1)} MB. PDFs and videos must be under ${MAX_OTHER_MB} MB (GAS limit). Try compressing the PDF first.`);
  };

  /* ── Compress images before uploading to GAS ── */
  const compressImage = (file) =>
	new Promise((resolve) => {
	  if (!file.type.startsWith('image/')) { resolve(file); return; }

	  const img = new Image();
	  const url = URL.createObjectURL(file);

	  img.onload = () => {
		URL.revokeObjectURL(url);

		// Scale down to max 1200px on the long edge
		const MAX_PX  = 1200;
		const longest = Math.max(img.width, img.height);
		const scale   = longest > MAX_PX ? MAX_PX / longest : 1;

		const canvas  = document.createElement('canvas');
		canvas.width  = Math.round(img.width  * scale);
		canvas.height = Math.round(img.height * scale);
		canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

		// Start at 0.80 quality; if still >500 KB try 0.65, then 0.50
		const tryEncode = (q) => {
		  canvas.toBlob((blob) => {
			if (blob.size > 500 * 1024 && q > 0.50) {
			  tryEncode(Math.max(q - 0.15, 0.50));
			} else {
			  resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
			}
		  }, 'image/jpeg', q);
		};
		tryEncode(0.80);
	  };

	  img.onerror = () => resolve(file); // fallback: send original
	  img.src = url;
	});

/* ── Google Drive Upload via GAS ── */
	  const uploadToDrive = (file) =>
		new Promise((resolve, reject) => {
		  // 🚀 FIXED: Increased timeout to 3 full minutes (180,000 ms). 
		  // Large PDFs take Google Apps Script a long time to parse as JSON.
		  const timer = setTimeout(
			() => reject(new Error('Google Drive took too long (> 3 mins). Please compress your PDF to a smaller size and try again.')),
			180_000
		  );
		  
		  const reader = new FileReader();
		  reader.onload = async (e) => {
			try {
			  setUploadProgress(10);
			  
			  // Slower progress bar to accurately match Google's processing speed for large files
			  const progressInterval = setInterval(() => {
				setUploadProgress(prev => prev < 92 ? prev + 3 : prev);
			  }, 3000);
	 
			  const res = await fetch(GAS_WEBHOOK_URL, {
				method: 'POST',
				headers: {
				  'Content-Type': 'text/plain;charset=utf-8',
				},
				body: JSON.stringify({
				  fileName: file.name,
				  mimeType: file.type,
				  base64:   e.target.result,
				}),
			  });
			  
			  clearInterval(progressInterval);
			  clearTimeout(timer);
			  setUploadProgress(96);
			  
			  const result = await res.json();
			  
			  if (result.success) {
				setUploadProgress(100);
				resolve(result.url); 
			  } else {
				reject(new Error(result.error || 'GAS returned success: false'));
			  }
			} catch (err) {
			  clearTimeout(timer);
			  reject(err);
			}
		  };
		  reader.onerror = (err) => { clearTimeout(timer); reject(err); };
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
	  setUploadProgress(0);
  
	  try {
		let mediaUrl = null;
		if (selectedFile) {
		  // Gate: reject oversized files before wasting time
		  checkFileSize(selectedFile);
		  // Compress images before sending to GAS (PDFs/videos pass through unchanged)
		  toast('Preparing file…');
		  const fileToUpload = await compressImage(selectedFile);
		  const originalMB   = (selectedFile.size  / 1024 / 1024).toFixed(1);
		  const compressedMB = (fileToUpload.size  / 1024 / 1024).toFixed(1);
		  const label = selectedFile.type.startsWith('image/')
			? `Uploading ${compressedMB} MB (compressed from ${originalMB} MB)…`
			: `Uploading ${compressedMB} MB…`;
		  toast(label);
		  
		  // Upload to Google Drive and get the live URL back
		  mediaUrl = await uploadToDrive(fileToUpload);
		  if (!mediaUrl) throw new Error('Google Drive did not return a URL.');
		}
  
		// ── FIXED: We use 'mediaUrl' here, not 'result.url', and added 'icon_name' ──
		const payload = {
		  category: contentForm.category,
		  title: contentForm.title,
		  description: contentForm.description,
		  icon_name: contentForm.icon_name 
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
		setUploadProgress(0);
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
		<style>{`
		  :root {
			--navy: #0d1b2a; --gold: #d4af37;
			--blue-mid: #d4af37; --blue-glow: rgba(212,175,55,0.35);
			--fg: #1a1a1a; --fg-muted: #666; --fg-subtle: #999;
			--border: rgba(0,0,0,0.09); --bg: #f4f6f9; --panel-bg: #ffffff;
			--navbar-h: 64px; --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-full: 999px;
		  }
		  .adm-login-wrap {
			min-height: 100vh; display: flex; align-items: center; justify-content: center;
			background: var(--bg); padding: clamp(16px,4vw,32px);
			font-family: 'DM Sans', system-ui, sans-serif;
		  }
		  .adm-login-card {
			background: white; border-radius: var(--r-lg); border: 1px solid var(--border);
			box-shadow: 0 8px 40px rgba(0,0,0,0.1);
			padding: clamp(28px,5vw,48px); width: 100%; max-width: 400px;
		  }
		  .adm-login-logo { text-align: center; margin-bottom: 28px; }
		  .adm-login-logo h2 { font-size: 1.3rem; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
		  .adm-login-logo p  { font-size: 13px; color: var(--fg-muted); margin: 0; }
		  .adm-form { display: flex; flex-direction: column; gap: 16px; }
		  .adm-field { display: flex; flex-direction: column; gap: 6px; }
		  .adm-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--fg-muted); }
		  .adm-input {
			width: 100%; padding: 10px 13px; border: 1.5px solid var(--border);
			border-radius: var(--r-sm); font-size: 13.5px; color: var(--fg);
			background: #fdfdfd; outline: none; box-sizing: border-box; font-family: inherit;
			transition: border-color 0.15s, box-shadow 0.15s;
		  }
		  .adm-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,175,55,0.15); }
		  .adm-submit {
			width: 100%; padding: 13px 20px; border: none; border-radius: var(--r-md);
			font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
			transition: opacity 0.2s, transform 0.15s;
		  }
		  .adm-submit:disabled { opacity: 0.55; cursor: not-allowed; }
		  .adm-submit.mode-create { background: var(--navy); color: white; }
		  .adm-submit:hover:not(:disabled) { opacity: 0.88; }
		  @keyframes toastIn {
			from { opacity: 0; transform: translateY(12px) scale(0.95); }
			to   { opacity: 1; transform: translateY(0) scale(1); }
		  }
		`}</style>
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
	  <style>{`
		/* ── CSS VARIABLES ── */
		:root {
		  --navy:      #0d1b2a;
		  --gold:      #d4af37;
		  --blue-mid:  #d4af37;
		  --blue-glow: rgba(212,175,55,0.35);
		  --fg:        #1a1a1a;
		  --fg-muted:  #666;
		  --fg-subtle: #999;
		  --border:    rgba(0,0,0,0.09);
		  --bg:        #f4f6f9;
		  --panel-bg:  #ffffff;
		  --navbar-h:  64px;
		  --r-sm:      8px;
		  --r-md:      12px;
		  --r-lg:      16px;
		  --r-full:    999px;
		}

		/* ── SHELL ── */
		.adm-shell {
		  min-height: 100vh;
		  background: var(--bg);
		  padding: clamp(16px, 3vw, 32px);
		  font-family: 'DM Sans', system-ui, sans-serif;
		  color: var(--fg);
		}

		/* ── TOP BAR ── */
		.adm-topbar {
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  flex-wrap: wrap;
		  gap: 12px;
		  margin-bottom: clamp(20px, 3vw, 32px);
		  padding-bottom: 20px;
		  border-bottom: 1px solid var(--border);
		}
		.adm-topbar-title {
		  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		  font-weight: 700;
		  color: var(--navy);
		  margin: 0 0 4px 0;
		}
		.adm-topbar-meta {
		  font-size: 13px;
		  color: var(--fg-muted);
		  margin: 0;
		}

		/* ── TWO-COLUMN GRID ── */
		.adm-grid {
		  display: grid;
		  grid-template-columns: 360px 1fr;
		  gap: clamp(16px, 2.5vw, 28px);
		  align-items: start;
		}
		@media (max-width: 860px) {
		  .adm-grid { grid-template-columns: 1fr; }
		}

		/* ── PANELS ── */
		.adm-panel {
		  background: var(--panel-bg);
		  border-radius: var(--r-lg);
		  border: 1px solid var(--border);
		  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
		  overflow: hidden;
		}
		.adm-panel.editing {
		  border-color: rgba(212,175,55,0.5);
		  box-shadow: 0 0 0 3px rgba(212,175,55,0.12), 0 4px 20px rgba(0,0,0,0.08);
		}
		.adm-panel-header {
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  padding: 16px 20px;
		  border-bottom: 1px solid var(--border);
		  background: #fafafa;
		}
		.adm-panel-title {
		  display: flex;
		  align-items: center;
		  gap: 8px;
		  font-weight: 700;
		  font-size: 13.5px;
		  color: var(--navy);
		  text-transform: uppercase;
		  letter-spacing: 0.5px;
		}
		.adm-panel-title.editing { color: #8a6800; }

		/* ── FORM ── */
		.adm-form { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
		.adm-field { display: flex; flex-direction: column; gap: 6px; }
		.adm-label {
		  font-size: 11.5px;
		  font-weight: 700;
		  text-transform: uppercase;
		  letter-spacing: 0.6px;
		  color: var(--fg-muted);
		}
		.adm-input, .adm-select, .adm-textarea {
		  width: 100%;
		  padding: 10px 13px;
		  border: 1.5px solid var(--border);
		  border-radius: var(--r-sm);
		  font-size: 13.5px;
		  color: var(--fg);
		  background: #fdfdfd;
		  transition: border-color 0.15s, box-shadow 0.15s;
		  outline: none;
		  box-sizing: border-box;
		  font-family: inherit;
		}
		.adm-input:focus, .adm-select:focus, .adm-textarea:focus {
		  border-color: var(--gold);
		  box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
		}
		.adm-select { appearance: none; cursor: pointer; padding-right: 32px; }
		.adm-textarea { resize: vertical; min-height: 100px; line-height: 1.55; }

		/* ── UPLOAD ZONE ── */
		.adm-upload-zone {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  gap: 8px;
		  padding: 22px 16px;
		  border: 2px dashed var(--border);
		  border-radius: var(--r-md);
		  cursor: pointer;
		  text-align: center;
		  transition: border-color 0.2s, background 0.2s;
		  color: var(--fg-subtle);
		  background: #fafafa;
		}
		.adm-upload-zone:hover, .adm-upload-zone.has-file {
		  border-color: var(--gold);
		  background: #fffdf0;
		  color: var(--fg);
		}
		.adm-upload-hint { font-size: 13px; color: var(--fg-muted); }
		.adm-upload-filename { font-size: 13px; font-weight: 600; color: var(--navy); word-break: break-all; }

		/* ── SUBMIT BUTTON ── */
		.adm-submit {
		  width: 100%;
		  padding: 13px 20px;
		  border: none;
		  border-radius: var(--r-md);
		  font-size: 14px;
		  font-weight: 700;
		  cursor: pointer;
		  letter-spacing: 0.3px;
		  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
		  font-family: inherit;
		}
		.adm-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
		.adm-submit:disabled { opacity: 0.55; cursor: not-allowed; }
		.adm-submit.mode-create { background: var(--navy); color: white; }
		.adm-submit.mode-update { background: linear-gradient(135deg, #8a6800, #d4af37); color: white; }

		/* ── ACTION BUTTONS ── */
		.adm-btn-edit {
		  display: inline-flex; align-items: center; gap: 5px;
		  padding: 6px 12px; border-radius: var(--r-sm);
		  border: 1.5px solid var(--border);
		  background: white; color: var(--fg);
		  font-size: 12px; font-weight: 600; cursor: pointer;
		  transition: all 0.15s; font-family: inherit;
		}
		.adm-btn-edit:hover { border-color: var(--navy); color: var(--navy); background: #f0f4ff; }
		.adm-btn-delete {
		  display: inline-flex; align-items: center; gap: 5px;
		  padding: 6px 12px; border-radius: var(--r-sm);
		  border: 1.5px solid transparent;
		  background: #fef2f2; color: #c62828;
		  font-size: 12px; font-weight: 600; cursor: pointer;
		  transition: all 0.15s; font-family: inherit;
		}
		.adm-btn-delete:hover { background: #c62828; color: white; }
		.adm-action-row { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; }

		/* ── TABLE ── */
		.adm-table-wrap { overflow-x: auto; }
		.adm-table {
		  width: 100%;
		  border-collapse: collapse;
		  font-size: 13px;
		}
		.adm-table thead tr {
		  background: #f8f9fb;
		  border-bottom: 2px solid var(--border);
		}
		.adm-table th {
		  padding: 11px 14px;
		  text-align: left;
		  font-size: 11px;
		  font-weight: 700;
		  text-transform: uppercase;
		  letter-spacing: 0.6px;
		  color: var(--fg-muted);
		  white-space: nowrap;
		}
		.adm-table td {
		  padding: 12px 14px;
		  border-bottom: 1px solid var(--border);
		  vertical-align: middle;
		}
		.adm-table tbody tr { transition: background 0.12s; }
		.adm-table tbody tr:hover { background: #f9fafb; }
		.adm-table tbody tr.row-editing { background: #fffdf0; }
		.adm-table tbody tr:last-child td { border-bottom: none; }

		/* ── BADGE ── */
		.adm-badge {
		  display: inline-block;
		  padding: 3px 9px;
		  border-radius: var(--r-full);
		  font-size: 11px;
		  font-weight: 700;
		  text-transform: capitalize;
		  white-space: nowrap;
		}

		/* ── MISC ── */
		.adm-media-link {
		  display: inline-flex; align-items: center; gap: 4px;
		  font-size: 12px; font-weight: 600; color: var(--navy);
		  text-decoration: none; padding: 4px 8px;
		  border-radius: var(--r-sm); border: 1px solid var(--border);
		  transition: all 0.15s;
		}
		.adm-media-link:hover { background: var(--navy); color: white; }
		.adm-none { color: var(--fg-subtle); font-size: 13px; }
		.adm-empty {
		  padding: 40px 20px; text-align: center;
		  color: var(--fg-subtle); font-size: 13.5px;
		}

		/* ── LOGIN ── */
		.adm-login-wrap {
		  min-height: 100vh;
		  display: flex; align-items: center; justify-content: center;
		  background: var(--bg);
		  padding: clamp(16px, 4vw, 32px);
		}
		.adm-login-card {
		  background: white;
		  border-radius: var(--r-lg);
		  border: 1px solid var(--border);
		  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
		  padding: clamp(28px, 5vw, 48px);
		  width: 100%; max-width: 400px;
		}
		.adm-login-logo { text-align: center; margin-bottom: 28px; }
		.adm-login-logo h2 { font-size: 1.3rem; font-weight: 700; color: var(--navy); margin: 0 0 6px; }
		.adm-login-logo p  { font-size: 13px; color: var(--fg-muted); margin: 0; }
		.adm-login-card .adm-form { padding: 0; }

		@keyframes toastIn {
		  from { opacity: 0; transform: translateY(12px) scale(0.95); }
		  to   { opacity: 1; transform: translateY(0) scale(1); }
		}
	  `}</style>
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

			  {uploading && (
				<div style={{ marginTop: 8 }}>
				  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>
					<span>Uploading to Supabase Storage…</span>
					<span>{uploadProgress}%</span>
				  </div>
				  <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
					<div style={{
					  height: '100%',
					  width: `${uploadProgress || 30}%`,
					  background: 'linear-gradient(90deg, var(--navy), var(--gold))',
					  borderRadius: 99,
					  transition: 'width 0.4s ease',
					}} />
				  </div>
				</div>
			  )}
			  {/* Submit */}
			  <button
				type="submit"
				disabled={loading}
				className={`adm-submit ${editingId ? 'mode-update' : 'mode-create'}`}
			  >
				{uploading
				  ? `Uploading… ${uploadProgress}%`
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