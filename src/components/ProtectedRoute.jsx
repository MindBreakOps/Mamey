import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/*
  ProtectedRoute — guards /admindashboard.
  
  The route is only reachable by typing /admindashboard in the URL.
  There is no nav link pointing here in the public UI.

  getSession() is async, so we wait for it before deciding
  whether to render children or redirect to /. While checking,
  we render nothing (null) to avoid a flash of wrong content.
*/
const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed]     = useState(false);

  useEffect(() => {
	supabase.auth.getSession().then(({ data }) => {
	  setAuthed(!!data?.session);
	  setChecking(false);
	});
  }, []);

  if (checking) return null;
  return authed ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;