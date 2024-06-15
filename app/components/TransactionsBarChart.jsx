// TransactionsBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const TransactionsBarChart = ({ creditData, debitData }) => {
  const chartData = {
    labels: ['Credit', 'Debit'],
    datasets: [
      {
        label: 'Transactions by Type',
        data: [creditData.length, debitData.length],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)', // Blue for credit
          'rgba(255, 99, 132, 0.6)', // Red for debit
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white p-4 shadow rounded">
     
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TransactionsBarChart;
