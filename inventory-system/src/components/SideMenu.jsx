import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SideMenu = ({ username }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId'); // Remove tenant ID on logout
    navigate('/login');
  };

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenuVisibility}
        className="rounded-lg shadow-lg font-bold px-2 m-2 bg-green-900 text-white fixed top-0 left-0 z-20"
      >
        <i className={`bi ${isMenuVisible ? 'bi-x' : 'bi-list'}`} style={{ fontSize: '1.5rem' }}></i>
      </button>
      {isMenuVisible && (
        <div className="pt-16 bg-green-900 text-white w-64 h-screen p-4 top-0 left-0 z-10">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <p className="mb-4">Welcome, {username}!</p>
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="hover:bg-green-700 p-2 rounded flex items-center">
              <i className="bi bi-house-door-fill mr-2"></i> Home (FrontEnd)
            </Link>
            <Link to="/admin" className="hover:bg-green-700 p-2 rounded flex items-center">
              <i className="bi bi-speedometer2 mr-2"></i> Dashboard
            </Link>
            <Link to="/admin/products" className="hover:bg-green-700 p-2 rounded flex items-center">
              <i className="bi bi-box-seam mr-2"></i> Products
            </Link>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:bg-green-700 p-2 rounded w-full text-left flex justify-between items-center"
              >
                <span className="flex items-center">
                  <i className="bi bi-boxes mr-2"></i> Inventories
                </span>
                <i className={`bi bi-caret-${isDropdownOpen ? 'up' : 'down'}-fill`}></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full bg-green-800 rounded shadow-lg z-10">
                  <Link to="/admin/inventory" className="block hover:bg-green-700 p-2 rounded flex items-center">
                    <i className="bi bi-box-arrow-in-right mr-2"></i> Manage Inventory
                  </Link>
                  <Link to="/admin/manage-stocks" className="block hover:bg-green-700 p-2 rounded flex items-center">
                    <i className="bi bi-boxes mr-2"></i> Manage Stocks
                  </Link>
                  <Link to="/admin/all-stocks" className="block hover:bg-green-700 p-2 rounded flex items-center">
                    <i className="bi bi-box mr-2"></i> All Stocks
                  </Link>
                  <Link to="/admin/sold-stocks" className="block hover:bg-green-700 p-2 rounded flex items-center">
                    <i className="bi bi-box-arrow-in-left mr-2"></i> Sold Stocks
                  </Link>
                  <Link to="/admin/monthly-yearly-profits" className="hover:bg-green-700 p-2 rounded flex items-center">
                    <i className="bi bi-bar-chart-line-fill mr-2"></i> Monthly & Yearly Profits
                  </Link>
                </div>
              )}
            </div>
            <Link to="/admin/users" className="hover:bg-green-700 p-2 rounded flex items-center">
              <i className="bi bi-people-fill mr-2"></i> Users
            </Link>
            
            <button onClick={handleLogout} className="hover:bg-green-700 p-2 rounded text-left flex items-center">
              <i className="bi bi-box-arrow-right mr-2"></i> Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default SideMenu;

