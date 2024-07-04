import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');

    if (token && tenantId) {
      setTenantId(tenantId);
      fetchUser(token, tenantId);
    }
  }, []);

  const fetchUser = async (token, tenantId) => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
      });
      const userData = response.data;
      console.log('Fetched user:', userData);
      userData.modules = JSON.parse(userData.modules); // Parse the modules field
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = async (tenantId, name, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { tenantId, name, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenantId', response.data.tenantId);
      setTenantId(response.data.tenantId);
      await fetchUser(response.data.token, response.data.tenantId);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    setUser(null);
    setTenantId(null);
  };

  return {
    user,
    tenantId,
    login,
    logout,
  };
};
