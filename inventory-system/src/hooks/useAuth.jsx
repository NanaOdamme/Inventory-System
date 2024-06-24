// src/hooks/useAuth.js

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Replace this with actual user fetching logic if necessary
      setUser({ token });
    } else {
      setUser(null);
    }
  }, []);

  return user;
};
