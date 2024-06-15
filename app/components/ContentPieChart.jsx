// ContentPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const ContentPieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'left',
      },
    },
    elements: {
      arc: {
        borderWidth: 4,
      },
    },
    radius: '100%',
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      
      <div className="h-64">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ContentPieChart;
