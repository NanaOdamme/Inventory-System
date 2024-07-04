// src/components/ProtectedRoute.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, tenantId } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || tenantId === null) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user, tenantId]);

  return user && tenantId ? children : null;
}
