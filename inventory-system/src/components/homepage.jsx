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
        </header>
      

            <h1>Register Here</h1>
            <Link to='/register'>
            Register
            </Link>


      <footer className="bottom-0 absolute w-full bg-green-950 text-white p-4 text-center mt-8">
        <p>&copy; {new Date().getFullYear()} inventory-manager. All rights reserved.</p>
        <p>Created by: Nana Akosua Odame</p>
        <a href="/login" className="text-blue-400 hover:text-blue-600">Admin Panel</a>
      </footer>
      </section>
      </>
  );
};

export default Home;
