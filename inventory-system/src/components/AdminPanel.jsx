import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import InfoCard from './InfoCard';
import BarChart from './BarChart';
import DataTable from './DataTable';

const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
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
    fetchDashboardData();
    fetchYearlyProfits();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [productsResponse, soldResponse, profitResponse, monthlySalesResponse] = await Promise.all([
        axios.get('http://localhost:5000/products', { headers }),
        axios.get('http://localhost:5000/sold', { headers }),
        axios.get('http://localhost:5000/profits/yearly-all', { headers }),
        axios.get('http://localhost:5000/profits/monthly', { headers })
      ]);

      setTotalProducts(productsResponse.data.length);
      setTotalSold(soldResponse.data.soldItems.length);
      setTotalProfit(profitResponse.data.total_profit || 0);
      setMonthlySales(Array.isArray(monthlySalesResponse.data) ? monthlySalesResponse.data : []);
      setSoldItems(soldResponse.data.soldItems);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="flex">
      <SideMenu username={username} />
      <div className="h-screen overflow-auto pt-10 p-6 flex-grow bg-green-50">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <InfoCard title="Total Products" value={totalProducts} color="bg-green-600" />
          <InfoCard title="Total Sold" value={totalSold} color="bg-yellow-400" />
          {yearlyProfits.map((yearProfit, index) => (
            <InfoCard key={index} title={`Total Profit in ${yearProfit.year}`} value={`GHC ${yearProfit.total_profit.toFixed(2)}`} color="bg-purple-600" />
              ))}
          <InfoCard title="Monthly Sales" value={monthlySales.length} color="bg-red-600" />
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Sold Items</h2>
          <DataTable 
            headers={['Product Type', 'Size', 'Price per Unit', 'Quantity', 'Total Price', 'Date Sold']}
            data={soldItems.map(item => {
              return {
                product_type: item.product_type,
                size: item.size,
                price_per_unit: `GHC ${item.price_per_unit}`,
                quantity: item.quantity,
                total_price: `GHC ${item.total_price.toFixed(2)}`,
                date_sold: new Date(item.sale_date).toLocaleDateString(),
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
