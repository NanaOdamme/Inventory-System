import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AuditLogs = () => {
  const [username, setUsername] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5000/user', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          navigate('/login');
        });
    }
    fetchAuditLogs();
  }, [navigate]);

  const fetchAuditLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/audit-logs', { headers: { Authorization: `Bearer ${token}` } });
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Audit Logs</h2>
        <div className="overflow-x-auto mb-20 w-full leading-normal shadow-md rounded-lg">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User Name</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Details</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{log.user_name}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{log.action}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{log.details}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AuditLogs;
