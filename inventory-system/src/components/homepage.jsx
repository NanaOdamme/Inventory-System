import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  return (
    <>
      <section className='h-min-screen'>
        <header className="bg-green-900 shadow-lg text-white p-4 text-center">
          <h1 className="text-2xl">Welcome to The Poultry Farm Inventory Manager</h1>
          <Link to="/login" className="text-blue-400 hover:text-blue-600">Already Registered? Login</Link>
        </header>

        <div className='mx-auto flex flex-col items-center p-10 m-10 space-y-10'>
          <Link to="/register" className="bg-green-400 p-3 rounded-lg shadow-lg font-medium text-white hover:bg-green-600">
            Register Here
          </Link>
           <div className="grid gap-5  grid-cols-3">
          <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Who is this Service for?</h2>
            <p>This service is designed for poultry farmers who want to efficiently manage their inventory, track product sales, and monitor stock levels in real-time.</p>
          </div>

          <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p>If you have any questions or need support, please contact us at:</p>
            <ul className='mt-5'>
              <li className='m-2'><i className="bi bi-envelope-fill"></i> Email: eronastyles@gmail.com</li>
              <li className='m-2'><i className="bi bi-telephone-fill"></i> Phone: 0203817652</li>
            </ul>
          </div>

          <div className="bg-red-200 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">More Information</h2>
            <p>Our inventory manager offers features such as:</p>
            <ul className="list-disc list-inside">
              <li>Real-time stock monitoring</li>
              <li>Sales tracking</li>
              <li>Automated restocking alerts</li>
              <li>Comprehensive reporting tools</li>
            </ul>
          </div>
        </div>
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
