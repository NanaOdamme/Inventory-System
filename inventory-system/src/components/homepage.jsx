import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to get random colors for product cards
  const getRandomColor = () => {
    const colors = [
      'bg-red-200',
      'bg-yellow-200',
      'bg-green-200',
      'bg-blue-200',
      'bg-purple-200',
      'bg-pink-200',
      'bg-indigo-200',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="App">
      <section className="hero relative w-full h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <video className="absolute inset-0 w-full h-full object-cover opacity-50" autoPlay muted loop>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 bg-black bg-opacity-50">
          <h1 className="text-5xl font-bold mb-4">Welcome to Ebenezer Farm</h1>
          <p className="text-2xl mb-6">Your trusted source for fresh eggs and poultry products</p>
          <a href="#products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <i className="bi bi-eye"></i> See Products
          </a>
        </div>
      </section>

      <section id="about" className="container mx-auto p-8 bg-green-100 rounded-lg shadow-md mt-8">
        <div className="flex flex-col md:flex-row items-center">
          <img src="/assets/about.jpg" alt="About Us" className="w-96 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4" />
          <div className='mx-7'>
            <h2 className="text-4xl font-bold mb-4 text-green-700">About Us</h2>
            <p className="text-lg mb-4 text-gray-800">
              <i className="bi bi-info-circle"></i> Ebenezer Farm, located in Assin Fosu in the Central Region of Ghana, has been a pillar of quality poultry farming since 2017. Our farm is dedicated to providing the highest quality eggs and poultry products to our customers. We have grown significantly over the years, thanks to our commitment to excellence and our loyal customer base.
            </p>
            <p className="text-lg mb-4 text-gray-800">
              <i className="bi bi-truck"></i> Starting from humble beginnings, we have expanded our operations to include a wide variety of poultry products. Our farm is equipped with modern facilities to ensure the best care for our poultry, and we adhere to strict health and safety standards to provide you with the freshest products possible.
            </p>
            <p className="text-lg text-gray-800">
              <i className="bi bi-heart"></i> Our mission is to continue growing and serving the community with top-quality products, contributing to the local economy and promoting healthy eating habits.
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="container mx-auto p-8 mt-8">
        <h2 className="text-4xl font-bold mb-4 text-green-700">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className={`p-4 rounded shadow-md transition-transform transform hover:scale-105 ${getRandomColor()}`}>
              <h2 className="text-xl font-bold text-green-700">{product.name}</h2>
              <p className="text-gray-800"><i className="bi bi-tag"></i> Category: {product.category}</p>
              <p className="text-gray-800"><i className="bi bi-arrows-angle-expand"></i> Size: {product.size}</p>
              <p className="text-gray-800"><i className="bi bi-currency-exchange"></i> Price: GHC {product.price}</p>
              
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="container mx-auto p-8 bg-zinc-200 rounded-lg shadow-md mt-8">
      <h2 className="text-center text-4xl font-bold mb-4 text-zinc-700">Contact Us</h2>
        <div className="flex flex-col md:flex-row items-center ">
          <img src="/assets/contact.jpg" alt="Contact Us" className="w-96  rounded-lg shadow-md mb-4 md:mb-0 md:mr-4" />
          <div className="mx-auto h-full w-full bg-green-900 text-white p-10 rounded-lg">
           
            <div className='m-5'>
              <label className="block  text-sm font-bold mb-2"><i className="bi bi-geo-alt"></i> Location</label>
              <p className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline">Assin Fosu, Central Region, Ghana</p>
            </div>
            <div className='m-5'>
              <label className="block  text-sm font-bold mb-2"><i className="bi bi-telephone"></i> Phone Number</label>
              <p className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline">0203817652</p>
              
            </div>
            <div className='m-5'>
              <label className="block  text-sm font-bold mb-2"><i className="bi bi-person"></i> Owner</label>
              <p className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline">Ebenezer Odame Anti</p>
            </div>
            <a href="tel:0203817652" className=" flex justify-end hover:text-blue-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block">
                <i className="mx-2 bi bi-telephone-forward"></i> Call Now
              </a>
          </div>
          
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>&copy; {new Date().getFullYear()} Ebenezer Farm. All rights reserved.</p>
        <p>Created by: Nana Akosua Odame</p>
        <a href="/login" className="text-blue-400 hover:text-blue-600">Admin Panel</a>
      </footer>
    </div>
  );
};

export default Home;
