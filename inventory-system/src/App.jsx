import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginForm } from './components/login';
import AdminPanel from './components/AdminPanel';
import RegisterForm from './components/register';
import Home from './components/homepage';
import Products from './components/Products';
import Users from './components/UsersCrud';
import InventoryCrud from './components/InventoryCrud';
import ManageStock from './components/ManageStock';
import StockList from './components/StockList';
import SoldStocks from './components/SoldStocks';
import MonthlyYearlyProfits from './components/MonthlyYearlyProfits';
import AuditLogs from './components/AuditLog'
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
    <Route path="/admin/products" element={<PrivateRoute><Products /></PrivateRoute>} />
    <Route path="/admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
    <Route path="/admin/inventory" element={<PrivateRoute><InventoryCrud /></PrivateRoute>} />
    <Route path="/admin/manage-stocks" element={<PrivateRoute><ManageStock /></PrivateRoute>} />
    <Route path="/admin/all-stocks" element={<PrivateRoute><StockList /></PrivateRoute>} />
    <Route path="/admin/sold-stocks" element={<PrivateRoute><SoldStocks /></PrivateRoute>} />
    <Route path="/admin/monthly-yearly-profits" element={<PrivateRoute><MonthlyYearlyProfits /></PrivateRoute>} />
    <Route path="/admin/audit-logs" element={<PrivateRoute><AuditLogs /></PrivateRoute>} />
  </Routes>
);

export default App;
