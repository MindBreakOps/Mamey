import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Terms() {
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
		  <h1 className="legal-h1">{t?.footerTerms ?? 'Terms of Use'}</h1>
		  <div className="legal-updated">Last Updated: October 2024</div>
		</div>

		<div className="legal-content">
		  <h2>1. Agreement to Terms</h2>
		  <p>By accessing or using the Mamey For General Trading & Investment Co. Ltd. website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

		  <h2>2. Use License</h2>
		  <p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
		  <ul>
			<li>Modify or copy the materials;</li>
			<li>Use the materials for any commercial purpose, or for any public display;</li>
			<li>Attempt to decompile or reverse engineer any software contained on the website;</li>
			<li>Remove any copyright or other proprietary notations from the materials.</li>
		  </ul>

		  <h2>3. Disclaimer</h2>
		  <p>The materials on Mamey's website are provided on an 'as is' basis. Mamey makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

		  <h2>4. Limitations</h2>
		  <p>In no event shall Mamey or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mamey's website, even if Mamey or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>

		  <h2>5. Governing Law</h2>
		  <p>These terms and conditions are governed by and construed in accordance with the laws of the Republic of South Sudan and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
		</div>
	  </div>
	</>
  );
}