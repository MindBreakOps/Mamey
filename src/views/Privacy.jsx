import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Privacy() {
  const { t } = useContext(AppContext);

  useEffect(() => {
	window.scrollTo(0, 0); // Scroll to top when page loads
  }, []);

  return (
	<>
	  <style>{`
		.legal-page-root { font-family: 'DM Sans', sans-serif; padding-bottom: 80px; max-width: 800px; margin: 0 auto; }
		.legal-header { margin-bottom: 40px; position: relative; padding-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.1); }
		.legal-h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: var(--navy, #0d1b2a); margin: 0 0 10px 0; }
		.legal-updated { font-size: 0.85rem; color: var(--text-muted, #666); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
		.legal-content h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy, #0d1b2a); margin: 32px 0 12px 0; }
		.legal-content p, .legal-content li { font-size: 0.95rem; line-height: 1.8; color: var(--text-main, #333); margin-bottom: 16px; }
		.legal-content ul { margin-left: 20px; margin-bottom: 20px; }
	  `}</style>

	  <div className="legal-page-root">
		<div className="legal-header">
		  <h1 className="legal-h1">{t?.footerPrivacy ?? 'Privacy Policy'}</h1>
		  <div className="legal-updated">Last Updated: October 2024</div>
		</div>

		<div className="legal-content">
		  <h2>1. Introduction</h2>
		  <p>Mamey For General Trading & Investment Co. Ltd. ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or interact with our services.</p>

		  <h2>2. Information We Collect</h2>
		  <p>We may collect, use, store, and transfer different kinds of personal data about you, including:</p>
		  <ul>
			<li><strong>Identity Data:</strong> First name, last name, title, and company name.</li>
			<li><strong>Contact Data:</strong> Email address, telephone numbers, and business address.</li>
			<li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location.</li>
		  </ul>

		  <h2>3. How We Use Your Information</h2>
		  <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
		  <ul>
			<li>To respond to your inquiries submitted via our contact forms.</li>
			<li>To process and manage supplier or distributor agreements.</li>
			<li>To improve our website, products/services, marketing, and customer relationships.</li>
		  </ul>

		  <h2>4. Data Security</h2>
		  <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to those employees, agents, and contractors who have a business need to know.</p>

		  <h2>5. Contact Us</h2>
		  <p>If you have any questions about this Privacy Policy or our privacy practices, please contact our administrative office at <strong>justermamy@gmail.com</strong>.</p>
		</div>
	  </div>
	</>
  );
}