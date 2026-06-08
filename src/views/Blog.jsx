import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../context/AppContext';

/* ── Drive URL Helpers (Upgraded for Iframes) ── */
function resolveGoogleDriveUrl(rawUrl, asPreview = false) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  
  let fileId = null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) fileId = matchFile[1];
  
  if (!fileId) {
	const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (matchOpen) fileId = matchOpen[1];
  }
  
  if (fileId) {
	if (asPreview) return `https://drive.google.com/file/d/${fileId}/preview`;
	return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
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
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800` : null;
}

/* ── Detect Media Type ── */
function detectMediaType(url) {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  
  if (lower.includes('.pdf') || lower.includes('application/pdf')) return 'pdf';
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)/.test(lower)) return 'image';
  if (/\.(mp4|webm|ogg|mov|avi)/.test(lower)) return 'video';
  if (lower.includes('drive.google.com')) return 'drive-preview';
  
  return 'unknown';
}

/* ── Full Article Modal ── */
function ArticleModal({ article, onClose }) {
  const previewUrl = resolveGoogleDriveUrl(article.media_url, true);
  const directUrl = resolveGoogleDriveUrl(article.media_url, false);
  const mediaType = detectMediaType(article.media_url);
  const thumb = getDriveThumbnail(article.media_url);
  
  const date = new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
	<div className="blg-overlay" onClick={onClose}>
	  <div className="blg-modal" onClick={(e) => e.stopPropagation()}>
		<button className="blg-modal-close" onClick={onClose}>✕</button>
		
		{/* MEDIA SECTION - NOW SUPPORTS PDFs & VIDEO */}
		{article.media_url && (
		  <div className="blg-modal-hero">
			{mediaType === 'video' ? (
			  <video src={directUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
			) : (mediaType === 'pdf' || mediaType === 'drive-preview') ? (
			  <iframe src={previewUrl} title={article.title} style={{ width: '100%', height: '100%', border: 'none' }} />
			) : (
			  <img 
				src={thumb || directUrl} 
				alt={article.title} 
				style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
				onError={(e) => { e.target.src = directUrl; }} 
			  />
			)}
		  </div>
		)}
		
		<div className="blg-modal-content">
		  <div className="blg-modal-date">{date}</div>
		  <h2 className="blg-modal-title">{article.title}</h2>
		  <div className="blg-modal-body" style={{ whiteSpace: 'pre-wrap' }}>
			{article.description}
		  </div>
		  
		  {/* Download Button for Documents */}
		  {(mediaType === 'pdf' || mediaType === 'drive-preview') && (
			<a href={directUrl} target="_blank" rel="noreferrer" className="blg-dl-btn" download>
			  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ marginRight: '8px' }}>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
			  </svg>
			  Download Attached Document
			</a>
		  )}
		</div>
	  </div>
	</div>
  );
}

export default function Blog() {
  const { t } = useContext(AppContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
	supabase
	  .from('mamey_site_content')
	  .select('*')
	  .eq('category', 'blog')
	  .order('created_at', { ascending: false })
	  .then(({ data, error }) => {
		if (!error && data) setArticles(data);
		setLoading(false);
	  });
  }, []);

  return (
	<>
	  <style>{`
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
		.blg-root { font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }

		.blg-header { margin-bottom: clamp(40px, 6vw, 64px); }
		
		/* FIX 1: Enhanced Contrast for Gold Kicker */
		.blg-kicker { 
		  font-size: 11px; 
		  font-weight: 700; /* Made it bold */
		  letter-spacing: 2.5px; 
		  text-transform: uppercase; 
		  color: #b8860b; /* Darkened the gold slightly for better visibility */
		  margin-bottom: 14px; 
		  display: flex; 
		  align-items: center; 
		  gap: 10px; 
		}
		.blg-kicker::before { content: ''; display: block; width: 24px; height: 2px; background: currentColor; }
		
		.blg-h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 900; line-height: 1.1; color: var(--text-main, #1a1a1a); margin: 0 0 16px 0; }
		.blg-sub { font-size: clamp(0.9rem, 1.8vw, 1.05rem); line-height: 1.75; color: var(--text-muted, #666); max-width: 600px; }

		.blg-loading, .blg-empty { text-align: center; padding: 80px 20px; color: var(--text-muted, #888); }
		.blg-spinner { width: 36px; height: 36px; border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--navy, #0d1b2a); border-radius: 50%; animation: blg-spin 0.8s linear infinite; margin: 0 auto 16px auto; }
		@keyframes blg-spin { to { transform: rotate(360deg); } }

		.blg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
		
		/* FIX 2: Darkened border and added a baseline shadow to separate card from background */
		.blg-card { 
		  background: #ffffff; 
		  border-radius: 16px; 
		  overflow: hidden; 
		  border: 1px solid rgba(0,0,0,0.15); /* Deepened border opacity from 0.06 to 0.15 */
		  box-shadow: 0 4px 12px rgba(0,0,0,0.06); /* Added baseline shadow */
		  cursor: pointer; display: flex; flex-direction: column; 
		  opacity: 0; transform: translateY(30px);
		  animation: fadeUpCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
		}
		@keyframes fadeUpCard {
		  to { opacity: 1; transform: translateY(0); }
		}
		
		.blg-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); border-color: rgba(212,175,55,0.4); }
		
		.blg-media { height: 220px; background: #f0f2f5; overflow: hidden; position: relative; }
		.blg-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
		.blg-card:hover .blg-media img { transform: scale(1.05); }
		
		/* Improved PDF Placeholder */
		.blg-media-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--navy), #1a3050); display: flex; align-items: center; justify-content: center; color: var(--gold); font-family: 'Playfair Display', serif; font-size: 1.5rem; font-style: italic; opacity: 0.9; }

		.blg-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
		.blg-date { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: 600; }
		.blg-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; line-height: 1.3; }
		.blg-excerpt { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 20px; }
		.blg-read-more { margin-top: auto; font-size: 0.85rem; font-weight: 700; color: var(--navy); display: inline-flex; align-items: center; gap: 6px; }
		.blg-card:hover .blg-read-more { color: #b8860b; }

		/* Modal Styles */
		.blg-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s; }
		.blg-modal { background: #ffffff; border-radius: 20px; width: 100%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: row; overflow: hidden; position: relative; animation: slideUp 0.3s cubic-bezier(.34,1.56,.64,1); }
		
		/* Side-by-side Modal Layout */
		.blg-modal-hero { width: 55%; background: #111; }
		.blg-modal-content { width: 45%; padding: clamp(24px, 4vw, 40px); overflow-y: auto; display: flex; flex-direction: column; }
		
		@media (max-width: 768px) {
		  .blg-modal { flex-direction: column; overflow-y: auto; }
		  .blg-modal-hero { width: 100%; height: 300px; }
		  .blg-modal-content { width: 100%; overflow-y: visible; }
		}

		.blg-modal-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.08); color: #333; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 10; transition: background 0.2s; }
		.blg-modal-close:hover { background: rgba(0,0,0,0.15); }
		
		.blg-modal-date { font-size: 0.85rem; color: #b8860b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 12px; }
		.blg-modal-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 900; color: var(--navy); margin: 0 0 20px 0; line-height: 1.2; }
		.blg-modal-body { font-size: 0.95rem; line-height: 1.7; color: #444; margin-bottom: 24px; flex: 1; }
		
		.blg-dl-btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 20px; background: var(--navy); color: white; border-radius: 8px; font-weight: 600; font-size: 0.9rem; text-decoration: none; transition: background 0.2s; margin-top: auto; }
		.blg-dl-btn:hover { background: #1a3050; }

		@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
		@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }
	  `}</style>

	  <div className="blg-root">
		<div className="blg-header">
		  <p className="blg-kicker">{t?.blogKicker ?? 'News & Updates'}</p>
		  <h1 className="blg-h1">{t?.blogTitle ?? 'Mamey Insights'}</h1>
		  <p className="blg-sub">{t?.blogSub ?? 'Stay updated with the latest news, operational highlights, and corporate announcements from across our network.'}</p>
		</div>

		{loading ? (
		  <div className="blg-loading">
			<div className="blg-spinner" />
			<p>{t?.loadingBlog ?? 'Loading latest articles…'}</p>
		  </div>
		) : articles.length === 0 ? (
		  <div className="blg-empty">
			<p>{t?.emptyBlog ?? 'No news articles have been published yet.'}</p>
		  </div>
		) : (
		  <div className="blg-grid">
			{articles.map((article, i) => {
			  const thumb = getDriveThumbnail(article.media_url);
			  const isPdf = detectMediaType(article.media_url) === 'pdf' || detectMediaType(article.media_url) === 'drive-preview';
			  const date = new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
			  
			  return (
				<div key={article.id} className="blg-card" style={{ animationDelay: `${i * 100}ms` }} onClick={() => setActiveArticle(article)}>
				  <div className="blg-media">
					{thumb ? (
					  <img src={thumb} alt={article.title} />
					) : isPdf ? (
					  <div className="blg-media-placeholder">View Document</div>
					) : (
					  <div className="blg-media-placeholder">Mamey</div>
					)}
				  </div>
				  <div className="blg-body">
					<div className="blg-date">{date}</div>
					<h3 className="blg-title">{article.title}</h3>
					<div className="blg-excerpt">{article.description}</div>
					<div className="blg-read-more">{t?.readArticle ?? 'Read Article'} →</div>
				  </div>
				</div>
			  );
			})}
		  </div>
		)}

		{activeArticle && (
		  <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
		)}
	  </div>
	</>
  );
}