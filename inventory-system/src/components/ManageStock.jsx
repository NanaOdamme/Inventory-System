import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageStock = () => {
  const [username, setUsername] = useState('');
  const [inventory, setInventory] = useState([]);
  const [quantitySold, setQuantitySold] = useState({}); // Store quantities for each item
  const [saleDates, setSaleDates] = useState({}); // Store sale dates for each item

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
    fetchInventory();
  }, [navigate]);

  const fetchInventory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/inventory', { headers: { Authorization: `Bearer ${token}` } });
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const moveToNotInStock = async (item) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/inventory/not-in-stock', item, { headers: { Authorization: `Bearer ${token}` } });
      fetchInventory();
    } catch (error) {
      console.error('Error moving stock to not in stock:', error);
    }
  };

  const moveToSold = async (item) => {
    const token = localStorage.getItem('token');
    const quantity = quantitySold[item.id];
    const sale_date = saleDates[item.id];
    if (!quantity || quantity <= 0 || quantity > item.quantity) {
      alert('Please enter a valid quantity');
      return;
    }
    if (!sale_date) {
      alert('Please enter a valid sale date');
      return;
    }
    const total_price = item.price_per_unit * quantity;
    try {
      await axios.post('http://localhost:5000/inventory/sold', { ...item, quantity, total_price, sale_date }, { headers: { Authorization: `Bearer ${token}` } });
      fetchInventory();
    } catch (error) {
      console.error('Error moving stock to sold:', error);
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantitySold({
      ...quantitySold,
      [id]: value,
    });
  };

  const handleDateChange = (id, value) => {
    setSaleDates({
      ...saleDates,
      [id]: value,
    });
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Manage Stock</h2>
        <div>
          <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product Type</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Size</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price per Unit</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Sale Date</th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.product_type}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.size}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.price_per_unit}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.quantity}</td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">
                    <input
                      type="number"
                      value={quantitySold[item.id] || ''}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      min="1"
                      max={item.quantity}
                    />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">
                    <input
                      type="date"
                      value={saleDates[item.id] || ''}
                      onChange={(e) => handleDateChange(item.id, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-800 text-sm">
                    <button
                      onClick={() => moveToNotInStock(item)}
                      className="m-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      Move to Not In Stock
                    </button>
                    <button
                      onClick={() => moveToSold(item)}
                      className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Move to Sold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageStock;
