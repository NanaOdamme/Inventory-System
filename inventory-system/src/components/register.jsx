import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Assuming you have a backend endpoint to get user details from the token
      axios.get('http://localhost:5000/user', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          navigate('/login');
        });
    }
  }, [navigate]);
  return (
    <section className='flex'>
      <SideMenu username={username} />
      <section className='p-6 flex-grow'>
        <p className='text-2xl m-5'>
          Register a new user
        </p>
        <br />
      
      <section className='App-body bg-green-700 mx-auto w-96 rounded mt-10 p-5'>
        <form className='p-2' onSubmit={handleSubmit}>
          <h1 className='text-white text-2xl font-bold text-center mb-4'>Register</h1>
          <div className="flex justify-center p-3">
            <label htmlFor="name" className='mx-2 font-bold text-2xl text-white bg-zinc-700 p-2 rounded'>
              <i className="bi bi-person"></i>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className='p-2 font-bold w-full rounded'
              required
            />
          </div>
          <div className="flex justify-center p-3 relative">
            <label htmlFor="password" className='mx-2 font-bold text-2xl text-white bg-zinc-700 p-2 rounded'>
              <i className="bi bi-lock-fill"></i>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 rounded w-full font-bold"
              required
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} absolute right-6 top-6 cursor-pointer`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <div className="flex justify-center p-2 mt-5">
            <button type="submit" className='w-1/2 text-white bg-zinc-800 p-2 rounded font-bold hover:bg-zinc-900'>Register User</button>
          </div>
        </form>
      </section>
      </section>
      </section>
  );
};
export default RegisterForm;