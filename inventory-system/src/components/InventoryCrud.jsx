// src/components/InventoryCrud.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuthContext } from '../context/AuthProvider';

const InventoryCrud = () => {
  const { user, tenantId } = useAuthContext();
  const [username, setUsername] = useState('');
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ product_type: 'eggs', size: 'small', price_per_unit: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !tenantId) {
      navigate('/login');
      return;
    }

    fetchUserDetails();
    fetchInventory();
  }, [navigate, user, tenantId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setUsername(response.data.name);
    } catch (error) {
      console.error('Error fetching user details:', error);
      navigate('/login');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/inventory/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        });
      } else {
        await axios.post('http://localhost:5000/inventory', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        });
      }
      setForm({ product_type: 'eggs', size: 'small', price_per_unit: '', quantity: '' });
      setIsEditing(false);
      setEditingId(null);
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setIsEditing(true);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
    }
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Manage Inventory</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          <i className="bi bi-plus-lg"></i> Add Inventory
        </button>
        <div>
          <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
          <div className="overflow-x-auto mb-20 w-full leading-normal shadow-md rounded-lg">
            <table className="min-w-full leading-normal shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Product Type
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Price per Unit
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-300">
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.product_type}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.size}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.price_per_unit}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.quantity}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      <button
                        onClick={() => handleEdit(item)}
                        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="bg-gray-800 text-white px-4 py-2">
                <h3 className="text-lg leading-6 font-medium text-white">{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h3>
              </div>
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_type">
                      Product Type
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="product_type"
                      name="product_type"
                      value={form.product_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="eggs">Eggs</option>
                      <option value="manure">Manure</option>
                    </select>
                  </div>
                  {form.product_type === 'eggs' && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">
                        Size
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="size"
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        required
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_unit">
                      Price per Unit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="price_per_unit"
                      type="number"
                      name="price_per_unit"
                      value={form.price_per_unit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                      Quantity
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {isEditing ? 'Update Inventory' : 'Add Inventory'}
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

export default InventoryCrud;

