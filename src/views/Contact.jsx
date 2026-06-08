import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Your exact Google Apps Script Webhook URL
const GAS_URL = "https://script.google.com/macros/s/AKfycbxzwlFPfOFiUS5atnjkAuXDcr-L_-LSY33_S9d6t12P36qmTWthc00ywCKpReFxzLY/exec";

/* ── Inline SVG Icons ── */
const MapPinIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> );
const PhoneIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 1-1.7 2z" /></svg> );
const MailIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> );

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
	navigator.clipboard.writeText(text);
	setCopied(true);
	setTimeout(() => setCopied(false), 2000);
  };
  return (
	<button onClick={handleCopy} className="cnt-copy-btn" title="Copy to clipboard">
	  {copied ? '✓' : 'Copy'}
	</button>
  );
};

export default function Contact() {
  const { t } = useContext(AppContext);

  // Active Office for the Map Tabs
  const [activeOffice, setActiveOffice] = useState(0);

  // Form & Submission State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  // Handle Form Submission using your GAS 'sendEmail' action
  const handleSubmit = async (e) => {
	e.preventDefault();
	setStatus('submitting');
	
	try {
	  const payload = {
		action: "sendEmail",
		to: "operixsolution@gmail.com", // Where the email gets sent
		subject: `New Website Inquiry: ${formData.subject}`,
		body: `You have received a new message from the Mamey Website Contact Form.\n\nMessage Details:\n"${formData.message}"`,
		senderName: formData.name,
		senderTitle: "Website Visitor",
		senderEmail: formData.email,
		senderPhone: "N/A"
	  };

	  await fetch(GAS_URL, {
		method: 'POST',
		// 'no-cors' allows the request to bypass CORS blocks, though it makes the response opaque.
		// It successfully executes the script on the Google side.
		mode: 'no-cors', 
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	  });
	  
	  setStatus('success');
	  setFormData({ name: '', email: '', subject: '', message: '' });
	  setTimeout(() => setStatus('idle'), 5000);
	  
	} catch (error) {
	  console.error("Form submission error:", error);
	  setStatus('error');
	  setTimeout(() => setStatus('idle'), 5000);
	}
  };

  const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData(prev => ({ ...prev, [name]: value }));
  };

  const offices = [
	{
	  name: t?.contactHQ ?? 'Headquarters',
	  country: t?.contactHQCountry ?? 'South Sudan',
	  address: t?.contactHQAddress ?? 'Kator Area, Near KCB Konyo Konyo Branch, Juba',
	  phones: ['+211 956 777 759', '+211 267 777 759'],
	  emails: ['justermamy@gmail.com'],
	  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15933.28434771217!2d31.597500!3d4.851610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1712818a7a016fcd%3A0x6b44ccedb201104e!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
	},
	{
	  name: t?.contactSudan ?? 'Sudan Office',
	  country: t?.contactSudanCountry ?? 'Sudan',
	  address: t?.contactSudanAddress ?? 'Khartoum, Sudan',
	  phones: ['+249 912 345 678'],
	  emails: ['sudan@mameygroup.com'],
	  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122340.5401923184!2d32.4431!3d15.5007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x168e8f2c3a50d271%3A0x2f11181284d72023!2sKhartoum%2C%20Sudan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
	}
  ];

  return (
	<>
	  <style>{`
		.cnt-root { font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
		.cnt-header { margin-bottom: 40px; position: relative; padding-bottom: 32px; }
		.cnt-header::after { content: ''; position: absolute; bottom: 0; left: 0; width: 56px; height: 3px; background: var(--gold, #d4af37); border-radius: 2px; }
		.cnt-kicker { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold, #d4af37); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
		.cnt-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
		.cnt-h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4.5vw, 3.2rem); font-weight: 900; line-height: 1.1; color: var(--text-main, #1a1a1a); margin: 0 0 20px 0; }
		.cnt-sub { font-size: clamp(0.9rem, 1.8vw, 1rem); line-height: 1.75; color: var(--text-muted, #666); max-width: 640px; margin: 0; }
		
		.cnt-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(32px, 6vw, 64px); margin-top: 40px; }
		@media(max-width: 900px) { .cnt-grid { grid-template-columns: 1fr; } }
		
		/* Form Styles */
		.cnt-form-card { background: #ffffff; border-radius: 18px; padding: clamp(24px, 4vw, 40px); border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 12px 40px rgba(0,0,0,0.04); height: fit-content; position: sticky; top: 100px; }
		.cnt-form-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; color: var(--navy); }
		.cnt-field { margin-bottom: 20px; }
		.cnt-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
		.cnt-input, .cnt-textarea { width: 100%; padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border-md, #cbd5e1); font-family: inherit; font-size: 0.95rem; background: var(--bg-light, #f8fafc); transition: all 0.2s; }
		.cnt-input:focus, .cnt-textarea:focus { outline: none; border-color: var(--blue, #1C75BC); background: white; box-shadow: 0 0 0 4px var(--blue-glow, rgba(28,117,188,0.15)); }
		
		.cnt-btn { background: var(--navy); color: white; border: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; width: 100%; }
		.cnt-btn:hover:not(:disabled) { background: var(--navy-mid, #112240); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(10,25,47,0.25); }
		.cnt-btn:disabled { opacity: 0.7; cursor: not-allowed; }
		
		/* Message Toasts */
		.cnt-msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; }
		.cnt-msg-success { background: rgba(34,197,94,0.1); color: #166534; border: 1px solid rgba(34,197,94,0.2); }
		.cnt-msg-error { background: rgba(239,68,68,0.1); color: #991b1b; border: 1px solid rgba(239,68,68,0.2); }

		/* Left Info Cards */
		.cnt-info-card { background: #ffffff; border-radius: 18px; padding: clamp(24px, 4vw, 40px); border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 12px 40px rgba(0,0,0,0.04); margin-bottom: 24px; }
		.cnt-info-row { display: flex; gap: 16px; margin-bottom: 24px; }
		.cnt-info-row:last-child { margin-bottom: 0; }
		.cnt-info-icon { flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; background: var(--blue-mid, rgba(28,117,188,0.12)); color: var(--blue); display: flex; align-items: center; justify-content: center; }
		.cnt-info-title { font-weight: 700; font-size: 1.1rem; color: var(--text-main); margin-bottom: 4px; }
		.cnt-info-text { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0; }
		.cnt-info-link { color: var(--text-main); text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: color 0.2s; }
		.cnt-info-link:hover { color: var(--blue); }
		.cnt-copy-btn { background: transparent; border: 1px solid var(--border-md); border-radius: 6px; font-size: 0.7rem; padding: 2px 8px; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
		.cnt-copy-btn:hover { background: var(--bg-muted); color: var(--text-main); }
		
		/* Map Styles */
		.cnt-tabs { display: flex; gap: 12px; margin-bottom: 20px; }
		.cnt-tab { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border-md); background: transparent; cursor: pointer; font-weight: 600; color: var(--text-muted); transition: all 0.2s; font-size: 0.9rem; }
		.cnt-tab.active { background: var(--navy); color: white; border-color: var(--navy); }
		.cnt-map-wrap { border-radius: 18px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 12px 40px rgba(0,0,0,0.04); height: 350px; background: #e0e0e0; }
		.cnt-map-iframe { width: 100%; height: 100%; border: none; }
	  `}</style>

	  <div className="cnt-root">
		
		<div className="cnt-header">
		  <p className="cnt-kicker">{t?.contactKicker ?? 'Get In Touch'}</p>
		  <h1 className="cnt-h1">{t?.contactTitle ?? 'Contact Us'}</h1>
		  <p className="cnt-sub">{t?.contactSub ?? 'Whether you have an inquiry, a supply request, or want to explore a partnership — our team is ready to respond.'}</p>
		</div>

		<div className="cnt-grid">
		  
		  {/* LEFT COLUMN: Map and Info */}
		  <div className="cnt-info">
			
			{/* The Map */}
			<div style={{ marginBottom: '32px' }}>
			  <div className="cnt-tabs">
				{offices.map((off, idx) => (
				  <button 
					key={off.name} 
					className={`cnt-tab ${activeOffice === idx ? 'active' : ''}`}
					onClick={() => setActiveOffice(idx)}
				  >
					{off.name}
				  </button>
				))}
			  </div>
			  <div className="cnt-map-wrap">
				<iframe 
				  src={offices[activeOffice].mapUrl} 
				  className="cnt-map-iframe" 
				  allowFullScreen="" 
				  loading="lazy" 
				  referrerPolicy="no-referrer-when-downgrade"
				  title="Office Location Map"
				></iframe>
			  </div>
			</div>

			{/* Office Details */}
			{offices.map((office, idx) => (
			  <div key={idx} className="cnt-info-card" style={{ display: activeOffice === idx ? 'block' : 'none' }}>
				<h3 className="cnt-form-title" style={{ marginBottom: 16 }}>{office.name}</h3>
				
				<div className="cnt-info-row">
				  <span className="cnt-info-icon"><MapPinIcon /></span>
				  <div>
					<div className="cnt-info-title">{office.country}</div>
					<p className="cnt-info-text">{office.address}</p>
				  </div>
				</div>

				<div className="cnt-info-row">
				  <span className="cnt-info-icon"><PhoneIcon /></span>
				  <div>
					{office.phones.map(p => (
					  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
						<a href={`tel:${p.replace(/\s/g, '')}`} className="cnt-info-link">{p}</a>
						<CopyButton text={p} />
					  </div>
					))}
				  </div>
				</div>

				<div className="cnt-info-row">
				  <span className="cnt-info-icon"><MailIcon /></span>
				  <div>
					{office.emails.map(e => (
					  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
						<a href={`mailto:${e}`} className="cnt-info-link">{e}</a>
						<CopyButton text={e} />
					  </div>
					))}
				  </div>
				</div>
			  </div>
			))}
		  </div>

		  {/* RIGHT COLUMN: Contact Form */}
		  <div>
			<form className="cnt-form-card" onSubmit={handleSubmit}>
			  <h2 className="cnt-form-title">{t?.contactFormTitle ?? 'Send a Message'}</h2>
			  
			  {status === 'success' && (
				<div className="cnt-msg cnt-msg-success">
				  {t?.contactSuccess ?? 'Your message has been sent successfully!'}
				</div>
			  )}
			  {status === 'error' && (
				<div className="cnt-msg cnt-msg-error">
				  {t?.contactError ?? 'Something went wrong. Please try again later.'}
				</div>
			  )}

			  <div className="cnt-field">
				<label className="cnt-label">{t?.contactNameLabel ?? 'Full Name'}</label>
				<input 
				  type="text" 
				  name="name"
				  value={formData.name}
				  onChange={handleChange}
				  required
				  className="cnt-input" 
				  placeholder={t?.contactNamePlaceholder ?? 'John Doe'} 
				/>
			  </div>
			  
			  <div className="cnt-field">
				<label className="cnt-label">{t?.contactEmailLabel ?? 'Email Address'}</label>
				<input 
				  type="email" 
				  name="email"
				  value={formData.email}
				  onChange={handleChange}
				  required
				  className="cnt-input" 
				  placeholder="name@example.com" 
				/>
			  </div>
			  
			  <div className="cnt-field">
				<label className="cnt-label">{t?.contactSubjectLabel ?? 'Subject'}</label>
				<input 
				  type="text" 
				  name="subject"
				  value={formData.subject}
				  onChange={handleChange}
				  required
				  className="cnt-input" 
				  placeholder={t?.contactSubjectPlaceholder ?? 'How can we help you?'} 
				/>
			  </div>
			  
			  <div className="cnt-field">
				<label className="cnt-label">{t?.contactMessageLabel ?? 'Message'}</label>
				<textarea 
				  name="message"
				  value={formData.message}
				  onChange={handleChange}
				  required
				  className="cnt-textarea" 
				  rows="5" 
				  placeholder={t?.contactMessagePlaceholder ?? 'Write your message here...'}
				></textarea>
			  </div>
			  
			  <button type="submit" className="cnt-btn" disabled={status === 'submitting'}>
				{status === 'submitting' 
				  ? (t?.contactSending ?? 'Sending...') 
				  : (t?.contactSubmit ?? 'Send Message')}
			  </button>
			</form>
		  </div>

		</div>
	  </div>
	</>
  );
}