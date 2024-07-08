import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuthContext } from '../context/AuthProvider';

const UsersCrud = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', password: '', modules: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { user, tenantId, tenantName, logout } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers(token, tenantId);
    }
  }, [navigate, tenantId]);

  const fetchUsers = async (token, tenantId) => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId // Ensure to use the correct header
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response.status === 401) logout();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prevForm) => {
        const modules = checked
          ? [...prevForm.modules, value]
          : prevForm.modules.filter((module) => module !== value);
        return { ...prevForm, modules };
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const formData = { ...form, tenantId, tenantName }; // Include tenantId and tenantName
      if (isEditing) {
        await axios.put(`http://localhost:5000/users/${editingId}`, formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': tenantId // Ensure to use the correct header
          }
        });
      } else {
        await axios.post('http://localhost:5000/users', formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': tenantId // Ensure to use the correct header
          }
        });
      }
      setForm({ name: '', password: '', modules: [] });
      setIsEditing(false);
      setEditingId(null);
      setShowModal(false);
      fetchUsers(token, tenantId);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, password: '', modules: JSON.parse(user.modules) }); // Password will be updated separately
    setIsEditing(true);
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId // Ensure to use the correct header
        }
      });
      fetchUsers(token, tenantId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <section className="flex">
      <SideMenu username={user?.name} />
      <div className="h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Manage Users</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          <i className="bi bi-plus-lg"></i> Add User
        </button>
        <div>
          <h2 className="text-2xl font-bold mb-4">User List</h2>
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">
                    {user.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="bg-gray-800 text-white px-4 py-2">
                <h3 className="text-lg leading-6 font-medium text-white">{isEditing ? 'Edit User' : 'Add User'}</h3>
              </div>
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Modules</label>
                    <div className="flex flex-wrap">
                      {['Dashboard', 'Products', 'Manage Inventory', 'Manage Stocks', 'All Stocks', 'Sold Stocks', 'Monthly & Yearly Profits', 'Users', 'Audit Logs'].map((module) => (
                        <div key={module} className="mr-4 mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="modules"
                              value={module}
                              checked={form.modules.includes(module)}
                              onChange={handleChange}
                              className="form-checkbox h-5 w-5 text-green-600"
                            />
                            <span className="ml-2 text-gray-700">{module}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {isEditing ? 'Update User' : 'Add User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersCrud;

