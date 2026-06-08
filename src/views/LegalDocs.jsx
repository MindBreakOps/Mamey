import React, { useEffect, useState, useRef, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../context/AppContext'; // Imported Context

/* ── SVG Icons ── */
const ShieldIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg> );
const DownloadIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> );
const EyeIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> );
const FileIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> );
const LockIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> );
const CloseIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );

/* ────────────────────────────────────────────────────────
   GOOGLE DRIVE URL FIXER
──────────────────────────────────────────────────────── */
function resolveGoogleDriveUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (url.includes('export=download') || url.includes('uc?id') || url.includes('drive.google.com/uc')) {
	return url;
  }
  let fileId = null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) fileId = matchFile[1];
  if (!fileId) {
	const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (matchOpen) fileId = matchOpen[1];
  }
  if (fileId) {
	return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

function detectMediaType(url) {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (lower.includes('.pdf') || lower.includes('application/pdf')) return 'pdf';
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)/.test(lower)) return 'image';
  if (/\.(mp4|webm|ogg|mov|avi)/.test(lower)) return 'video';
  if (lower.includes('export=download')) return 'download';
  return 'download';
}

/* ── Media Preview Modal ── */
 function MediaModal({ url, title, onClose }) {
   const { t } = useContext(AppContext); // Added context here
   const direct = resolveGoogleDriveUrl(url);
   const mediaType = detectMediaType(url);
 
   return (
	 <div className="lgl-modal-overlay" onClick={onClose}>
	   <div className="lgl-modal-box" onClick={(e) => e.stopPropagation()}>
		 <div className="lgl-modal-header">
		   <span className="lgl-modal-title">{title}</span>
		   <button className="lgl-modal-close" onClick={onClose}><CloseIcon /></button>
		 </div>
		 <div className="lgl-modal-body">
		   {mediaType === 'image' && (
			 <img src={direct} alt={title} className="lgl-modal-img" />
		   )}
		   {mediaType === 'video' && (
			 <video src={direct} controls className="lgl-modal-video" />
		   )}
		   {mediaType === 'pdf' && (
			 <iframe src={direct} title={title} className="lgl-modal-iframe" />
		   )}
		   {mediaType === 'download' && (
			 <div className="lgl-modal-download">
			   <FileIcon />
			   <p>{t?.legalNoPreview ?? 'This file cannot be previewed in-browser.'}</p>
			   <a href={direct} target="_blank" rel="noreferrer" className="lgl-dl-btn" download>
				 <DownloadIcon /> {t?.downloadFile ?? 'Download File'}
			   </a>
			 </div>
		   )}
		 </div>
	   </div>
	 </div>
   );
 }

/* ── Small Thumbnail for card ── */
function DocThumbnail({ url }) {
  const direct = resolveGoogleDriveUrl(url);
  const type = detectMediaType(url);

  if (type === 'image') {
	return <img src={direct} alt="preview" className="lgl-thumb-img" />;
  }
  if (type === 'pdf') {
	return (
	  <div className="lgl-thumb-placeholder lgl-thumb-pdf">
		<span>PDF</span>
	  </div>
	);
  }
  if (type === 'video') {
	return (
	  <div className="lgl-thumb-placeholder lgl-thumb-vid">
		<span>▶</span>
	  </div>
	);
  }
  return (
	<div className="lgl-thumb-placeholder">
	  <FileIcon />
	</div>
  );
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
	const el = ref.current;
	if (!el) return;
	const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
	obs.observe(el);
	return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function LegalDocs() {
  const { t } = useContext(AppContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); 
  const [gridRef, gridVisible] = useReveal(0.1);

  useEffect(() => {
	supabase
	  .from('mamey_site_content')
	  .select('*')
	  .eq('category', 'legal')
	  .order('created_at', { ascending: false })
	  .then(({ data, error }) => {
		if (!error && data) setDocs(data);
		setLoading(false);
	  });
  }, []);

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600&display=swap');
		.lgl-root { font-family: 'DM Sans', sans-serif; }

		/* HEADER */
		.lgl-header { margin-bottom: clamp(36px, 5vw, 56px); }
		.lgl-kicker {
		  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
		  color: var(--gold, #d4af37); margin-bottom: 14px;
		  display: flex; align-items: center; gap: 10px;
		}
		.lgl-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
		.lgl-h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4.5vw, 3rem);
		  font-weight: 900; line-height: 1.1;
		  color: var(--text-main, #1a1a1a); margin: 0 0 14px 0;
		}
		.lgl-sub {
		  font-size: clamp(0.88rem, 1.8vw, 1rem); line-height: 1.75;
		  color: var(--text-muted, #666); max-width: 560px;
		}

		/* SECURITY BADGE */
		.lgl-security-bar {
		  display: flex; align-items: center; gap: 10px;
		  padding: 12px 20px;
		  background: rgba(13,27,42,0.06);
		  border-radius: 10px;
		  border-left: 3px solid var(--navy, #0d1b2a);
		  margin-bottom: 36px;
		  font-size: 0.82rem;
		  color: var(--text-muted, #555);
		}
		.lgl-security-bar span { color: var(--navy, #0d1b2a); font-weight: 600; }

		/* LOADING */
		.lgl-loading {
		  display: flex; flex-direction: column; align-items: center;
		  gap: 16px; padding: 80px 20px; color: var(--text-muted, #888);
		}
		.lgl-spinner {
		  width: 36px; height: 36px;
		  border: 3px solid rgba(0,0,0,0.1);
		  border-top-color: var(--navy, #0d1b2a);
		  border-radius: 50%;
		  animation: lgl-spin 0.8s linear infinite;
		}
		@keyframes lgl-spin { to { transform: rotate(360deg); } }

		/* EMPTY */
		.lgl-empty {
		  text-align: center; padding: 80px 20px;
		  color: var(--text-muted, #888);
		}
		.lgl-empty-icon { opacity: 0.25; margin-bottom: 16px; }

		/* DOC GRID */
		.lgl-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		  gap: 24px;
		}
		.lgl-doc-card {
		  background: #ffffff; /* Pure white */
		  border-radius: 16px;
		  border: 1px solid rgba(0,0,0,0.06);
		  overflow: hidden;
		  transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
		  cursor: default;
		}
		.lgl-doc-card:hover {
		  box-shadow: 0 14px 40px rgba(0,0,0,0.08);
		  border-color: rgba(13,27,42,0.2);
		  transform: translateY(-4px);
		}

		/* THUMBNAIL */
		.lgl-thumb {
		  height: 140px;
		  background: var(--navy, #0d1b2a);
		  position: relative;
		  overflow: hidden;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}
		.lgl-thumb-img {
		  width: 100%; height: 100%;
		  object-fit: cover;
		  transition: transform 0.4s;
		}
		.lgl-doc-card:hover .lgl-thumb-img { transform: scale(1.04); }
		.lgl-thumb-placeholder {
		  display: flex; flex-direction: column;
		  align-items: center; justify-content: center;
		  color: rgba(255,255,255,0.25);
		  gap: 8px;
		}
		.lgl-thumb-pdf {
		  color: rgba(255,255,255,0.9);
		  font-size: 1.6rem; font-weight: 800;
		  font-family: 'Playfair Display', serif;
		  letter-spacing: 2px;
		  background: linear-gradient(135deg, #c62828, #b71c1c);
		}
		.lgl-thumb-vid {
		  font-size: 2.5rem;
		  background: linear-gradient(135deg, #1a237e, #0d47a1);
		  color: rgba(255,255,255,0.8);
		}

		/* BODY */
		.lgl-doc-body { padding: clamp(18px, 2.5vw, 24px); }
		.lgl-doc-icon-row {
		  display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
		}
		.lgl-doc-icon {
		  width: 42px; height: 42px;
		  border-radius: 10px;
		  background: var(--navy, #0d1b2a);
		  display: flex; align-items: center; justify-content: center;
		  color: var(--gold, #d4af37);
		  flex-shrink: 0;
		}
		.lgl-doc-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(0.95rem, 2vw, 1.05rem);
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  line-height: 1.3;
		}
		.lgl-doc-desc {
		  font-size: 0.82rem;
		  line-height: 1.6;
		  color: var(--text-muted, #777);
		  margin-bottom: 18px;
		}
		.lgl-doc-actions {
		  display: flex; gap: 10px; flex-wrap: wrap;
		}
		.lgl-btn {
		  display: inline-flex; align-items: center; gap: 7px;
		  padding: 9px 18px; border-radius: 8px;
		  font-size: 0.8rem; font-weight: 600;
		  text-decoration: none; cursor: pointer;
		  border: none; transition: all 0.2s;
		}
		.lgl-btn-primary {
		  background: var(--navy, #0d1b2a);
		  color: white;
		}
		.lgl-btn-primary:hover { background: #1a3050; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,27,42,0.3); }
		.lgl-btn-outline {
		  background: transparent;
		  color: var(--navy, #0d1b2a);
		  border: 1.5px solid rgba(13,27,42,0.2);
		}
		.lgl-btn-outline:hover { border-color: var(--navy, #0d1b2a); background: rgba(13,27,42,0.04); }

		/* MODAL */
		.lgl-modal-overlay {
		  position: fixed; inset: 0;
		  background: rgba(0,0,0,0.7);
		  backdrop-filter: blur(6px);
		  z-index: 9999;
		  display: flex; align-items: center; justify-content: center;
		  padding: 20px;
		  animation: lgl-fade-in 0.2s ease;
		}
		@keyframes lgl-fade-in { from { opacity: 0; } to { opacity: 1; } }
		.lgl-modal-box {
		  background: white;
		  border-radius: 20px;
		  width: 100%;
		  max-width: clamp(320px, 90vw, 900px);
		  max-height: 90vh;
		  display: flex; flex-direction: column;
		  overflow: hidden;
		  animation: lgl-slide-up 0.25s cubic-bezier(.34,1.56,.64,1);
		}
		@keyframes lgl-slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: none; opacity: 1; } }
		.lgl-modal-header {
		  display: flex; align-items: center; justify-content: space-between;
		  padding: 18px 24px;
		  border-bottom: 1px solid rgba(0,0,0,0.1);
		  flex-shrink: 0;
		}
		.lgl-modal-title {
		  font-family: 'Playfair Display', serif;
		  font-weight: 700; font-size: 1rem;
		  color: var(--navy, #0d1b2a);
		}
		.lgl-modal-close {
		  background: none; border: none; cursor: pointer;
		  color: var(--text-muted, #666);
		  padding: 4px;
		  transition: color 0.2s;
		}
		.lgl-modal-close:hover { color: #111; }
		.lgl-modal-body { flex: 1; overflow: auto; padding: 0; }
		.lgl-modal-img {
		  width: 100%; height: auto;
		  display: block; max-height: 80vh; object-fit: contain;
		}
		.lgl-modal-video { width: 100%; max-height: 70vh; display: block; }
		.lgl-modal-iframe { width: 100%; height: 70vh; border: none; display: block; }
		.lgl-modal-download {
		  display: flex; flex-direction: column;
		  align-items: center; justify-content: center;
		  padding: 60px 24px; gap: 16px;
		  color: var(--text-muted, #888);
		}
		.lgl-modal-download p { font-size: 0.9rem; }
		.lgl-dl-btn {
		  display: inline-flex; align-items: center; gap: 8px;
		  background: var(--navy, #0d1b2a); color: white;
		  padding: 12px 24px; border-radius: 10px;
		  font-weight: 600; font-size: 0.88rem;
		  text-decoration: none;
		  transition: background 0.2s;
		}
		.lgl-dl-btn:hover { background: #1a3050; }
	  `}</style>

	  <div className="lgl-root">

		{/* HEADER */}
		<div className="lgl-header">
		  <p className="lgl-kicker">{t?.legalKicker ?? 'Compliance & Verification'}</p>
		  <h1 className="lgl-h1">{t?.legalTitle ?? 'Legal Documents'}</h1>
		  <p className="lgl-sub">{t?.legalSub ?? 'Secure registry of operational licences, chamber of commerce certifications, and corporate compliance files.'}</p>
		</div>

		{/* SECURITY BAR */}
		<div className="lgl-security-bar">
		  <LockIcon />
		  <span>{t?.legalVerified ?? 'Verified Registry'}</span> — {t?.legalVerifiedDesc ?? 'All documents are official and current. Files open directly via secure viewer.'}
		</div>

		{/* CONTENT */}
		{loading ? (
		  <div className="lgl-loading">
			<div className="lgl-spinner" />
			<p>{t?.legalLoading ?? 'Loading secure document registry…'}</p>
		  </div>
		) : docs.length === 0 ? (
		  <div className="lgl-empty">
			<div className="lgl-empty-icon"><FileIcon /></div>
			<p>{t?.legalEmpty ?? 'No legal documents currently available.'}</p>
		  </div>
		) : (
		  <div className="lgl-grid" ref={gridRef}>
			{docs.map((doc, i) => (
			  <div
				key={doc.id}
				className={`lgl-doc-card ${gridVisible ? 'lgl-visible' : ''}`}
				style={{ transitionDelay: `${i * 70}ms` }}
			  >
				{/* THUMBNAIL */}
				{doc.media_url && (
				  <div className="lgl-thumb">
					<DocThumbnail url={doc.media_url} />
				  </div>
				)}

				<div className="lgl-doc-body">
				  <div className="lgl-doc-icon-row">
					<div className="lgl-doc-icon"><ShieldIcon /></div>
					<div className="lgl-doc-title">{doc.title}</div>
				  </div>
				  {doc.description && (
					<p className="lgl-doc-desc">{doc.description}</p>
				  )}
				  {doc.media_url && (
					<div className="lgl-doc-actions">
					  <button
						className="lgl-btn lgl-btn-primary"
						onClick={() => setModal({ url: doc.media_url, title: doc.title })}
					  >
						<EyeIcon /> {t?.viewDocument ?? 'View Document'}
					  </button>
					  <a
						href={resolveGoogleDriveUrl(doc.media_url)}
						target="_blank"
						rel="noreferrer"
						className="lgl-btn lgl-btn-outline"
						download
					  >
						<DownloadIcon /> {t?.downloadDocument ?? 'Download'}
					  </a>
					</div>
				  )}
				</div>
			  </div>
			))}
		  </div>
		)}

		{/* MODAL */}
		{modal && (
		  <MediaModal
			url={modal.url}
			title={modal.title}
			onClose={() => setModal(null)}
		  />
		)}

	  </div>
	</>
  );
}