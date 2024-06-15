import React from 'react';
import { Line } from 'react-chartjs-2';

const LineGraph = () => {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Memes',
        data: [20, 25, 30, 35, 40, 45],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Logos',
        data: [15, 18, 20, 22, 25, 28],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Text',
        data: [30, 35, 40, 45, 50, 55],
        fill: false,
        borderColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Resumes',
        data: [10, 12, 15, 18, 20, 22],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Images',
        data: [5, 8, 10, 12, 15, 18],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
