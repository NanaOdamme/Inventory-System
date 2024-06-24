// src/components/ProtectedRoute.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider'; // If using AuthProvider

export default function ProtectedRoute({ children }) {
  const user = useAuthContext(); // If using AuthProvider
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  return user ? children : null;
}
