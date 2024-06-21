"use client";
import React from 'react';
import 'chart.js/auto';
import PromptCard from './PromptCard';
import RewardCard from './RewardCard';
import ContentPieChart from './ContentPieChart';
import TransactionsBarChart from './TransactionsBarChart';
import LikesCard from './LikesCard';
import CardComponent from './CardComponent';
import BalenceCard from './BalenceCard';

const Dashboard = () => {
  // Sample data
  const totalPrompts = 500;
  const totalRewards = 250;
  const contentData = {
    Memes: 20,
    Logos: 15,
    Images: 30,
    Texts: 25,
    Resumes: 10,
  };
  const transactionsData = [
    { type: 'Credit', amount: 100 },
    { type: 'Debit', amount: 50 },
    { type: 'Credit', amount: 200 },
    { type: 'Debit', amount: 150 },
    // Add more data as needed
  ];

  // Filter transactions based on type
  const creditTransactions = transactionsData.filter(transaction => transaction.type === 'Credit');
  const debitTransactions = transactionsData.filter(transaction => transaction.type === 'Debit');


  return (
    <div className="flex mt-4 overflow-y-scroll bg-stone-50		">
      

      {/* Main content area */}
      <div className="flex-1 p-4">
       
        <div className="grid grid-cols-5 gap-4 mb-8">
          <CardComponent/>
          <PromptCard totalPrompts={totalPrompts} />
          <LikesCard />
          <RewardCard totalRewards={totalRewards} />
          <BalenceCard totalRewards={totalRewards} />
          
          
          
        </div>
        <div className="grid grid-cols-2 gap-4">
         <ContentPieChart data={contentData} />
         <TransactionsBarChart creditData={creditTransactions} debitData={debitTransactions} />
         
       </div>
      </div>
    </div>
  );
};

export default Dashboard;
