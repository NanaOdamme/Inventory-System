import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from './SideMenu.jsx';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', size: 'small', price: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    if (!token || !tenantId) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5000/user', { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } })
        .then(response => {
          setUsername(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          navigate('/login');
        });
      fetchProducts();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    try {
      const response = await axios.get('http://localhost:5000/products', { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/products/${editingId}`, form, { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } });
      } else {
        await axios.post('http://localhost:5000/products', form, { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } });
      }
      setForm({ name: '', category: '', size: 'small', price: '', quantity: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    try {
      await axios.delete(`http://localhost:5000/products/${id}`, { headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': tenantId } });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <section className='flex'>
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Manage Products</h2>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">Size</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
              required
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="big">Big</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">Quantity</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
        <div>
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          <div className="overflow-x-auto mb-20 w-full leading-normal shadow-md rounded-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-300">
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      {product.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      {product.category}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      {product.size}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      GHC {product.price}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      {product.quantity}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-800 text-sm">
                      <button
                        onClick={() => handleEdit(product)}
                        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
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
  
  export default Products;
  

