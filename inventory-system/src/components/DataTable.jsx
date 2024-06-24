import React from 'react';

const DataTable = ({ headers, data }) => (
  <div className="mt-10 rounded-lg shadow-lg overflow-x-auto">
    <table className="min-w-full h-96 bg-white">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4 bg-green-900 text-white">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((cell, cellIndex) => (
              <td key={cellIndex} className="py-2 px-4 border">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
