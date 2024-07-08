import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthProvider';
import ProfileForm from './ProfileForm';
import SideMenu from './SideMenu';
import ProfileDisplay from './ProfileDisplay';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const { tenantId, tenantName } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    if (!token || !tenantId) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5000/user', { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } })
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          navigate('/login');
        });
    }
    
  }, [navigate]);


  useEffect(() => {
    fetchProfile();
  }, [tenantId, tenantName]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = () => {
    fetchProfile();
  };

  const handleDelete = () => {
    setProfile(null);
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Company Profile</h2>
        <ProfileForm profile={profile} onSave={handleSave} onDelete={handleDelete} />
        <ProfileDisplay profile={profile} />
      </div>
    </section>
  );
};

export default ProfilePage;
