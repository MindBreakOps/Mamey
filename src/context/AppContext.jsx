import React, { createContext, useState } from 'react';

// ✅ THE FIX: We use curly brackets to match your "export const en/ar"
import { en as enDict } from '../locales/en';
import { ar as arDict } from '../locales/ar';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  
  // Select the correct dictionary
  const t = lang === 'en' ? enDict : arDict;

  return (
	<AppContext.Provider value={{ lang, setLang, t }}>
	  {children}
	</AppContext.Provider>
  );
}