import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthProvider';

const ProfileForm = ({ profile, onSave, onDelete }) => {
  const { tenantId, tenantName } = useAuthContext();
  const [form, setForm] = useState(profile || {
    company_name: '',
    address: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    setForm(profile || {
      company_name: '',
      address: '',
      contact_email: '',
      contact_phone: ''
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/profile', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      onSave();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the profile?')) {
      try {
        await axios.delete('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-Tenant-ID': tenantId,
          },
        });
        onDelete();
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Error deleting profile.');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-teal-100 shadow-lg rounded-lg p-8 ">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="company_name" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact_email" className="block text-gray-700 text-sm font-bold mb-2">Contact Email</label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={form.contact_email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="contact_phone" className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
            <input
              type="text"
              id="contact_phone"
              name="contact_phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Profile
            </button>
            {profile && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
