import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

const Home = () => {
 

 

  return (
    <>
      <section className='h-min-screen' >
      
        <header className="bg-green-900 shadow-lg text-white p-4 text-center">
          <h1 className="text-2xl">Welcome to The Poultry Farm Inventory Manager</h1>
          <Link to="/login" className="text-blue-400 hover:text-blue-600">Already Registerd? Login</Link>
        </header>
      
            <div className=' mx-auto flex justify-center p-20 m-20'>
            <Link to="/register" className="bg-green-400 p-3 rounded-lg shadow-lg font-medium text-white mt-20 hover:bg-green-600">
            Register Here
            </Link>
            </div>

      <footer className="bottom-0 absolute w-full bg-green-950 text-white p-4 text-center mt-8">
        <p>&copy; {new Date().getFullYear()} inventory-manager. All rights reserved.</p>
        <p>Created by: Nana Akosua Odame</p>
        <Link to="/login" className="text-blue-400 hover:text-blue-600">Admin Panel</Link>
      </footer>
      </section>
      </>
  );
};

export default Home;
