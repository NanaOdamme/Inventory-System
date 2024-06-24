import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MonthlyYearlyProfits = () => {
  const [username, setUsername] = useState('');
  const [monthlyProfits, setMonthlyProfits] = useState([]);
  const [yearlyProfits, setYearlyProfits] = useState([]);

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
    fetchMonthlyProfits();
    fetchYearlyProfits();
  }, [navigate]);

  const fetchMonthlyProfits = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profits/monthly-all', { headers: { Authorization: `Bearer ${token}` } });
      setMonthlyProfits(response.data);
    } catch (error) {
      console.error('Error fetching monthly profits:', error);
    }
  };

  const fetchYearlyProfits = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profits/yearly-all', { headers: { Authorization: `Bearer ${token}` } });
      setYearlyProfits(response.data);
    } catch (error) {
      console.error('Error fetching yearly profits:', error);
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
        <h2 className="text-4xl font-bold mb-4">Monthly and Yearly Profits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Monthly Profits</h3>
            <div className="grid grid-cols-1 gap-4">
              {monthlyProfits.map((monthProfit, index) => (
                <div key={index} className={`p-4 rounded shadow-lg text-white ${getRandomColor()}`}>
                  <h4 className="text-xl font-bold">Month: {monthProfit.month}</h4>
                  <p className="text-lg">Profit: GHC {monthProfit.total_profit.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Yearly Profits</h3>
            <div className="grid grid-cols-1 gap-4">
              {yearlyProfits.map((yearProfit, index) => (
                <div key={index} className={`p-4 rounded shadow-lg text-white ${getRandomColor()}`}>
                  <h4 className="text-xl font-bold">Year: {yearProfit.year}</h4>
                  <p className="text-lg">Profit: GHC {yearProfit.total_profit.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyYearlyProfits;
