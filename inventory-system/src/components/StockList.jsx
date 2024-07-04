import { useAuthContext } from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideMenu from './SideMenu';

const StockList = () => {
  const { user, tenantId } = useAuthContext();
  const [username, setUsername] = useState('');
  const [availableStocks, setAvailableStocks] = useState([]);
  const [notInStock, setNotInStock] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !tenantId) {
      navigate('/login');
      return;
    }

    fetchUserDetails();
    fetchStocks();
  }, [navigate, user, tenantId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setUsername(response.data.name);
    } catch (error) {
      console.error('Error fetching user details:', error);
      navigate('/login');
    }
  };

  const fetchStocks = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-ID': tenantId,
      };
      const availableResponse = await axios.get('http://localhost:5000/inventory', { headers });
      setAvailableStocks(availableResponse.data);

      const notInStockResponse = await axios.get('http://localhost:5000/not-in-stock', { headers });
      setNotInStock(notInStockResponse.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Stock List</h2>
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Stocks</h2>
          <div className="overflow-x-auto mb-20 w-full leading-normal shadow-md rounded-lg">
            <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Product Type
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Price per Unit
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableStocks.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-300">
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.product_type}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.size}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.price_per_unit}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 mt-8">Not In Stock</h2>
          <div className="overflow-x-auto mb-20 w-full leading-normal shadow-md rounded-lg">
            <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Product Type
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Price per Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {notInStock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-300">
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.product_type}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.size}</td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">{item.price_per_unit}</td>
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

export default StockList;
