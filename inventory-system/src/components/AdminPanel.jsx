import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import InfoCard from './InfoCard';
import DataTable from './DataTable';
import ChartComponent from './ChartComponent';
import { useAuthContext } from '../context/AuthProvider';

const AdminPanel = () => {
  const { user, tenantId } = useAuthContext();
  const [username, setUsername] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [soldItems, setSoldItems] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !tenantId) {
      navigate('/login');
      return;
    }

    fetchUserDetails();
    fetchDashboardData();
    
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

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-ID': tenantId,
      };
      const [productsResponse, soldResponse] = await Promise.all([
        axios.get('http://localhost:5000/products', { headers }),
        axios.get('http://localhost:5000/sold', { headers }),
      ]);
  
      setTotalProducts(productsResponse.data.length);
      setTotalSold(soldResponse.data.soldItems.length);
      setSoldItems(soldResponse.data.soldItems);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const soldItemsData = {
    labels: soldItems.map(item => new Date(item.sale_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sold Stocks',
        data: soldItems.map(item => item.quantity),
        fill: false,
        borderColor: '#00ecc2', 
        backgroundColor: '#42A5F5',
        pointBorderColor: 'black',
        pointBackgroundColor: '#42A5F5',
        pointHoverBackgroundColor: '#42A5F5',
        pointHoverBorderColor: '#42A5F5',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sold Stocks Data',
      },
    },
  };

  return (
    <div className="flex">
      <SideMenu username={username} />
      <div className="h-screen overflow-auto pt-10 p-6 flex-grow bg-green-50">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <InfoCard title="Total Products" value={totalProducts} color="bg-green-600" />
          <InfoCard title="Total Sold" value={totalSold} color="bg-yellow-400" />
        </div>
        <div className="mb-6">
          <h1 className='font-bold my-5 text-2xl'>Stocks Perfomance </h1>
          <div className='chart-container flex justify-center align-center mx-auto p-4 w-full bg-teal-200 rounded-lg shadow-lg'>

          <ChartComponent  data={soldItemsData} options={chartOptions} />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Sold Items in Table</h2>
          <DataTable
            headers={['Product Type', 'Size', 'Price per Unit', 'Quantity', 'Total Price', 'Date Sold']}
            data={soldItems.map(item => ({
              product_type: item.product_type,
              size: item.size,
              price_per_unit: `GHC ${item.price_per_unit}`,
              quantity: item.quantity,
              total_price: `GHC ${item.total_price.toFixed(2)}`,
              date_sold: new Date(item.sale_date).toLocaleDateString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
