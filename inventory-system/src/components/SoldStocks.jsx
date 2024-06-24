import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SoldStocks = () => {
  const [username, setUsername] = useState('');
  const [soldStocks, setSoldStocks] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5000/user', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          navigate('/login');
        });
    }
    fetchSoldStocks();
    fetchWeeklyProfit();
    fetchMonthlyProfit();
  }, [navigate]);

  const fetchSoldStocks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/sold', { headers: { Authorization: `Bearer ${token}` } });
      setSoldStocks(response.data.soldItems);
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      console.error('Error fetching sold stocks:', error);
    }
  };

  const fetchWeeklyProfit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profits/weekly', { headers: { Authorization: `Bearer ${token}` } });
      setWeeklyProfit(response.data.total_profit);
    } catch (error) {
      console.error('Error fetching weekly profit:', error);
    }
  };

  const fetchMonthlyProfit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profits/monthly', { headers: { Authorization: `Bearer ${token}` } });
      setMonthlyProfit(response.data.total_profit);
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
    }
  };

  // Helper function to get random colors
  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Sold Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded shadow-lg text-white ${getRandomColor()}`}>
            <h2 className="text-2xl font-bold mb-4">Total Profit: GHC {totalProfit.toFixed(2)}</h2>
          </div>
          <div className={`p-4 rounded shadow-lg text-white ${getRandomColor()}`}>
            <h2 className="text-2xl font-bold mb-4">Weekly Profit: GHC {weeklyProfit.toFixed(2)}</h2>
          </div>
          <div className={`p-4 rounded shadow-lg text-white ${getRandomColor()}`}>
            <h2 className="text-2xl font-bold mb-4">Monthly Profit: GHC {monthlyProfit.toFixed(2)}</h2>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Sold Stocks List</h2>
          <div className="overflow-x-auto mb-20  w-full leading-normal shadow-md rounded-lg">
       
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product Type</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Size</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price per Unit</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total Price</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {soldStocks.map(item => (
                <tr key={item.id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.product_type}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.size}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.price_per_unit}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.quantity}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">GHC {item.total_price.toFixed(2)}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{new Date(item.sale_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoldStocks;
