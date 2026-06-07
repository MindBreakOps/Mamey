import React, { createContext, useState } from 'react';
import enDict from '../locales/en';
import arDict from '../locales/ar';

// 1. Export the Context itself (This fixes the "binding name not found" error)
export const AppContext = createContext();

// 2. Export the Provider component (Used in App.jsx)
export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Dynamically select the correct dictionary based on the state
  const t = lang === 'en' ? enDict : arDict;

  return (
	<AppContext.Provider value={{ lang, setLang, t }}>
	  {children}
	</AppContext.Provider>
  );
}