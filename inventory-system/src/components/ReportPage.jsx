import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';
import SideMenu from './SideMenu';

const ReportPage = () => {
  const { tenantId } = useAuthContext();
  const [username, setUsername] = useState('');
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

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
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [tenantId]);

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchReport = async () => {
    let url = '';
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    if (reportType === 'daily') {
      url = 'http://localhost:5000/report/daily';
    } else if (reportType === 'monthly') {
      url = 'http://localhost:5000/report/monthly';
    } else {
      url = `http://localhost:5000/report/historical?year=${year}&month=${month}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Tenant-ID': tenantId,
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const generatePDF = (previewMode = false) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    let yOffset = 10;

    if (profile) {
      doc.text(`Company Name: ${profile.company_name}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Address: ${profile.address}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Contact Email: ${profile.contact_email}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Contact Phone: ${profile.contact_phone}`, 10, yOffset);
      yOffset += 20;
    }

    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 10, yOffset);
    yOffset += 10;

    doc.autoTable({
      head: [['Product Type', 'Size', 'Price per Unit', 'Quantity', 'Total Price', 'Sale Date']],
      body: reportData.map(item => [
        item.product_type,
        item.size,
        `GHC ${item.price_per_unit}`,
        item.quantity,
        `GHC ${item.total_price.toFixed(2)}`,
        new Date(item.sale_date).toLocaleDateString()
      ]),
      startY: yOffset,
      theme: 'striped',
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
    });

    if (previewMode) {
      setPdfBlob(doc.output('blob'));
    } else {
      doc.save(`${reportType}-report.pdf`);
    }
  };

  return (
    <section className="flex">
      <SideMenu username={username} />
      <div className="pt-20 h-screen overflow-auto container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-4">Sales Reports</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="historical">Historical</option>
          </select>
        </div>
        {reportType === 'historical' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="flex mb-4">
          <button
            onClick={() => generatePDF(false)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Print Report
          </button>
          <button
            onClick={() => {
              setPreview(true);
              generatePDF(true);
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Preview
          </button>
        </div>
        
        {profile && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
            <div className="flex justify-between mb-8">
              <div className="w-1/2">
                <p className="text-gray-700"><strong>Company Name:</strong> {profile.company_name}</p>
                <p className="text-gray-700"><strong>Contact Email:</strong> {profile.contact_email}</p>
              </div>
              <div className="w-1/2">
                <p className="text-gray-700"><strong>Address:</strong> {profile.address}</p>
                <p className="text-gray-700"><strong>Contact Phone:</strong> {profile.contact_phone}</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">{`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}</h2>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Type</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price per Unit</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-                  gray-600 uppercase tracking-wider">Sale Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.product_type}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.size}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">GHC {item.price_per_unit}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.quantity}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">GHC {item.total_price.toFixed(2)}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(item.sale_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
          
        )}
        {preview && pdfBlob && (
          <iframe
            src={URL.createObjectURL(pdfBlob)}
            style={{marginTop:'50px', width: '100%', height: '500px' }}
            title="PDF Preview"
          />
        )}
      </div>
      
    </section>
  );
};

export default ReportPage;

                    