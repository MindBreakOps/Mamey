import React, { useEffect, useState, useRef, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../context/AppContext'; // Imported Context

/* ── SVG Icons ── */
const FolderIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="52" height="52"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> );
const EyeIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> );
const DownloadIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> );
const PlayIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><polygon points="5 3 19 12 5 21 5 3" /></svg> );
const CloseIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> );
const CalendarIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> );

/* ────────────────────────────────────────────────
   GOOGLE DRIVE URL RESOLVER
──────────────────────────────────────────────── */
function resolveGoogleDriveUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (url.includes('export=download') || url.includes('uc?id')) return url;
  let fileId = null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) fileId = matchFile[1];
  if (!fileId) {
	const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (matchOpen) fileId = matchOpen[1];
  }
  if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
  return url;
}

function getDriveThumbnail(rawUrl) {
  const url = rawUrl?.trim();
  if (!url) return null;
  let fileId = null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) fileId = matchFile[1];
  if (!fileId) {
	const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (matchOpen) fileId = matchOpen[1];
  }
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  return null;
}

function detectMediaType(url) {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (lower.includes('.pdf') || lower.includes('application/pdf')) return 'pdf';
  if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) return 'image';
  if (/\.(mp4|webm|ogg|mov)/.test(lower)) return 'video';
  if (lower.includes('drive.google.com')) return 'drive';
  return 'download';
}

/* ── Lightbox Modal ── */
function LightboxModal({ proj, onClose }) {
  const { t } = useContext(AppContext); // Added context here
  const { title, description, media_url, created_at } = proj;
  const direct = resolveGoogleDriveUrl(media_url);
  const type = detectMediaType(media_url);
  const thumb = getDriveThumbnail(media_url);
  const date = created_at ? new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

  return (
	<div className="prj-overlay" onClick={onClose}>
	  <div className="prj-modal" onClick={(e) => e.stopPropagation()}>
		<div className="prj-modal-media">
		  {type === 'video' ? (
			<video src={direct} controls autoPlay className="prj-modal-video" />
		  ) : type === 'pdf' ? (
			<iframe src={direct} title={title} style={{ width: '100%', height: '100%', minHeight: '60vh', border: 'none' }} />
		  ) : (
			<img
			  src={thumb || direct}
			  alt={title}
			  className="prj-modal-img"
			  onError={(e) => { e.target.src = direct; }}
			/>
		  )}
		</div>
		<div className="prj-modal-info">
		  <button className="prj-modal-close" onClick={onClose}><CloseIcon /></button>
		  {date && (
			<div className="prj-modal-date">
			  <CalendarIcon /> {date}
			</div>
		  )}
		  <h2 className="prj-modal-title">{title}</h2>
		  {description && <p className="prj-modal-desc">{description}</p>}
		  <div className="prj-modal-actions">
			<a href={direct} target="_blank" rel="noreferrer" className="prj-btn prj-btn-primary" download>
			  <DownloadIcon /> {t?.downloadDocument ?? 'Download'}
			</a>
		  </div>
		</div>
	  </div>
	</div>
  );
}

function useReveal(threshold = 0.08) {
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

/* ── Single Project Card ── */
function ProjectCard({ proj, index, parentVisible, onClick }) {
  const { t } = useContext(AppContext); // Added context here
  const [imgSrc, setImgSrc] = useState(null);
  const [imgError, setImgError] = useState(false);
  const type = detectMediaType(proj.media_url);

  useEffect(() => {
	if (!proj.media_url) return;
	const thumb = getDriveThumbnail(proj.media_url);
	const direct = resolveGoogleDriveUrl(proj.media_url);
	setImgSrc(thumb || direct);
  }, [proj.media_url]);

  const date = proj.created_at
	? new Date(proj.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
	: null;

  return (
	<div
	  className={`prj-card ${parentVisible ? 'prj-visible' : ''}`}
	  style={{ transitionDelay: `${index * 80}ms` }}
	  onClick={() => proj.media_url && onClick(proj)}
	>
	  <div className="prj-card-media">
		{imgSrc && !imgError && type !== 'pdf' ? (
		  <>
			<img
			  src={imgSrc}
			  alt={proj.title}
			  className="prj-card-img"
			  onError={() => {
				const direct = resolveGoogleDriveUrl(proj.media_url);
				if (imgSrc !== direct) {
				  setImgSrc(direct);
				} else {
				  setImgError(true);
				}
			  }}
			/>
			{type === 'video' && <div className="prj-play-overlay"><PlayIcon /></div>}
		  </>
		) : type === 'pdf' ? (
		   <div className="prj-card-placeholder" style={{ background: '#082d49', color: '#c9a84c', fontWeight: 'bold' }}>
			 📄 {t?.pdfDocument ?? 'PDF Document'}
		   </div>
		) : (
		  <div className="prj-card-placeholder">
			<FolderIcon />
		  </div>
		)}
		
		{proj.media_url && (
		  <div className="prj-card-hover-overlay">
			<EyeIcon /> {t?.viewProject ?? 'View'}
		  </div>
		)}
	  </div>

	  <div className="prj-card-body">
		{date && (
		  <div className="prj-card-date">
			<CalendarIcon /> {date}
		  </div>
		)}
		<h3 className="prj-card-title">{proj.title}</h3>
		{proj.description && (
		  <p className="prj-card-desc">{proj.description}</p>
		)}
	  </div>
	</div>
  );
}

export default function Projects() {
  const { t } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [gridRef, gridVisible] = useReveal(0.08);

  useEffect(() => {
	supabase
	  .from('mamey_site_content')
	  .select('*')
	  .eq('category', 'projects')
	  .order('created_at', { ascending: false })
	  .then(({ data, error }) => {
		if (!error && data) setProjects(data);
		setLoading(false);
	  });
  }, []);

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600&display=swap');
		.prj-root { font-family: 'DM Sans', sans-serif; }

		.prj-header { margin-bottom: clamp(36px, 5vw, 56px); }
		.prj-kicker {
		  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
		  color: var(--gold, #d4af37); margin-bottom: 14px;
		  display: flex; align-items: center; gap: 10px;
		}
		.prj-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
		.prj-h1 {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.8rem, 4.5vw, 3rem);
		  font-weight: 900; line-height: 1.1;
		  color: var(--text-main, #1a1a1a); margin: 0 0 14px 0;
		}
		.prj-sub {
		  font-size: clamp(0.88rem, 1.8vw, 1rem); line-height: 1.75;
		  color: var(--text-muted, #666); max-width: 580px;
		}

		.prj-loading {
		  display: flex; flex-direction: column; align-items: center;
		  gap: 16px; padding: 80px 20px; color: var(--text-muted, #888);
		}
		.prj-spinner {
		  width: 36px; height: 36px;
		  border: 3px solid rgba(0,0,0,0.1);
		  border-top-color: var(--navy, #0d1b2a);
		  border-radius: 50%;
		  animation: prj-spin 0.8s linear infinite;
		}
		@keyframes prj-spin { to { transform: rotate(360deg); } }

		.prj-grid {
		  display: grid;
		  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		  gap: 24px;
		}

		.prj-card {
		  background: #ffffff; /* Pure white */
		  border-radius: 18px;
		  border: 1px solid rgba(0,0,0,0.06);
		  overflow: hidden;
		  transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
		  cursor: pointer;
		}
		.prj-card:hover {
		  box-shadow: 0 18px 52px rgba(0,0,0,0.08);
		  border-color: rgba(212,175,55,0.3);
		  transform: translateY(-4px);
		}

		.prj-card-media {
		  height: clamp(180px, 28vw, 240px);
		  position: relative;
		  overflow: hidden;
		  background: var(--navy, #0d1b2a);
		}
		.prj-card-img {
		  width: 100%; height: 100%;
		  object-fit: cover;
		  display: block;
		  transition: transform 0.45s cubic-bezier(.25,.46,.45,.94);
		}
		.prj-card:hover .prj-card-img { transform: scale(1.06); }
		.prj-card-placeholder {
		  width: 100%; height: 100%;
		  display: flex; align-items: center; justify-content: center;
		  color: rgba(255,255,255,0.18);
		}
		.prj-play-overlay {
		  position: absolute; inset: 0;
		  display: flex; align-items: center; justify-content: center;
		  color: white;
		  background: rgba(0,0,0,0.3);
		}
		.prj-card-hover-overlay {
		  position: absolute; inset: 0;
		  display: flex; align-items: center; justify-content: center;
		  gap: 8px;
		  background: rgba(13,27,42,0.6);
		  color: white;
		  font-size: 0.88rem;
		  font-weight: 600;
		  opacity: 0;
		  transition: opacity 0.25s;
		}
		.prj-card:hover .prj-card-hover-overlay { opacity: 1; }

		.prj-card-body { padding: clamp(18px, 2.5vw, 26px); }
		.prj-card-date {
		  display: flex; align-items: center; gap: 6px;
		  font-size: 0.76rem; color: var(--text-muted, #888);
		  margin-bottom: 8px;
		}
		.prj-card-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1rem, 2.2vw, 1.15rem);
		  font-weight: 700;
		  color: var(--text-main, #1a1a1a);
		  margin: 0 0 10px 0;
		  line-height: 1.3;
		}
		.prj-card-desc {
		  font-size: 0.84rem; line-height: 1.65;
		  color: var(--text-muted, #777); margin: 0;
		  display: -webkit-box;
		  -webkit-line-clamp: 3;
		  -webkit-box-orient: vertical;
		  overflow: hidden;
		}

		.prj-overlay {
		  position: fixed; inset: 0;
		  background: rgba(0,0,0,0.82);
		  backdrop-filter: blur(8px);
		  z-index: 9999;
		  display: flex; align-items: center; justify-content: center;
		  padding: 20px;
		  animation: prj-fade 0.22s ease;
		}
		@keyframes prj-fade { from { opacity: 0; } to { opacity: 1; } }
		.prj-modal {
		  background: white;
		  border-radius: 22px;
		  width: 100%;
		  max-width: clamp(320px, 92vw, 1000px);
		  max-height: 92vh;
		  display: flex;
		  flex-direction: column;
		  overflow: hidden;
		  animation: prj-up 0.28s cubic-bezier(.34,1.56,.64,1);
		}
		@keyframes prj-up { from { transform: translateY(32px); opacity: 0; } to { transform: none; opacity: 1; } }

		@media (min-width: 700px) {
		  .prj-modal { flex-direction: row; }
		}

		.prj-modal-media {
		  background: #111;
		  flex: 1;
		  min-height: 240px;
		  display: flex; align-items: center; justify-content: center;
		  overflow: hidden;
		}
		.prj-modal-img {
		  width: 100%; height: 100%;
		  object-fit: contain;
		  display: block;
		  max-height: 70vh;
		}
		.prj-modal-video { width: 100%; height: auto; max-height: 70vh; display: block; }
		.prj-modal-info {
		  width: 100%;
		  max-width: 340px;
		  padding: clamp(24px, 4vw, 40px);
		  position: relative;
		  display: flex; flex-direction: column;
		  overflow-y: auto;
		}
		@media (max-width: 699px) {
		  .prj-modal-info { max-width: 100%; }
		}
		.prj-modal-close {
		  position: absolute; top: 16px; right: 16px;
		  background: rgba(0,0,0,0.08); border: none;
		  border-radius: 50%; width: 36px; height: 36px;
		  display: flex; align-items: center; justify-content: center;
		  cursor: pointer; color: #333;
		  transition: background 0.2s;
		}
		.prj-modal-close:hover { background: rgba(0,0,0,0.15); }
		.prj-modal-date {
		  display: flex; align-items: center; gap: 6px;
		  font-size: 0.76rem; color: var(--text-muted, #888);
		  margin-bottom: 12px; margin-top: 8px;
		}
		.prj-modal-title {
		  font-family: 'Playfair Display', serif;
		  font-size: clamp(1.2rem, 3vw, 1.6rem);
		  font-weight: 700;
		  color: var(--navy, #0d1b2a);
		  margin: 0 0 14px 0;
		  line-height: 1.2;
		}
		.prj-modal-desc {
		  font-size: 0.88rem; line-height: 1.7;
		  color: var(--text-muted, #666);
		  flex: 1;
		}
		.prj-modal-actions { margin-top: 24px; }
		.prj-btn {
		  display: inline-flex; align-items: center; gap: 8px;
		  padding: 11px 22px; border-radius: 10px;
		  font-size: 0.85rem; font-weight: 600;
		  text-decoration: none; cursor: pointer; border: none;
		  transition: all 0.2s;
		}
		.prj-btn-primary {
		  background: var(--navy, #0d1b2a); color: white;
		}
		.prj-btn-primary:hover { background: #1a3050; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,27,42,0.3); }
	  `}</style>

	  <div className="prj-root">

		<div className="prj-header">
		  <p className="prj-kicker">{t?.projectsKicker ?? 'Track Record'}</p>
		  <h1 className="prj-h1">{t?.projectsTitle ?? 'Projects & Operations'}</h1>
		  <p className="prj-sub">{t?.projectsSub ?? 'A portfolio of executed contracts, logistics operations, and ongoing supply chain achievements across the region.'}</p>
		</div>

		{loading ? (
		  <div className="prj-loading">
			<div className="prj-spinner" />
			<p>{t?.projectsLoading ?? 'Loading project records…'}</p>
		  </div>
		) : projects.length === 0 ? (
		  <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted, #888)' }}>
			<div style={{ opacity: 0.2, marginBottom: 16 }}><FolderIcon /></div>
			<p>{t?.projectsEmpty ?? 'No active projects documented yet.'}</p>
		  </div>
		) : (
		  <div className="prj-grid" ref={gridRef}>
			{projects.map((proj, i) => (
			  <ProjectCard
				key={proj.id}
				proj={proj}
				index={i}
				parentVisible={gridVisible}
				onClick={setActive}
			  />
			))}
		  </div>
		)}

		{active && (
		  <LightboxModal proj={active} onClose={() => setActive(null)} />
		)}

	  </div>
	</>
  );
}