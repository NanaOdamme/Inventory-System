import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [tenantName, setTenantName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    const tenantName = localStorage.getItem('tenantName');

    if (token && tenantId && tenantName) {
      setTenantId(tenantId);
      setTenantName(tenantName);
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
      userData.modules = JSON.parse(userData.modules); // Parse the modules field
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = async (tenantName, name, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { tenantName, name, password });
      const { token, tenantId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('tenantName', tenantName);
      setTenantId(tenantId);
      setTenantName(tenantName);
      await fetchUser(token, tenantId);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('tenantName');
    setUser(null);
    setTenantId(null);
    setTenantName(null);
  };

  return {
    user,
    tenantId,
    tenantName,
    login,
    logout,
  };
};
