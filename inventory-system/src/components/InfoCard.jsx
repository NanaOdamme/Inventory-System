import React from 'react';

const InfoCard = ({ title, value, color }) => (
  <div className={`p-4 rounded shadow-md text-white ${color}`}>
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

export default InfoCard;
