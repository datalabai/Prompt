"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { transactions } from '../firebase';

function createData(transactionId, type, prompt, date, amount) {
  return { transactionId, type, prompt, date, amount };
}

export default function BasicTable() {
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactions();
        console.log("Transaction Data");
        console.log(data);
        setTransactionData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction data:', error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp._seconds * 1000);
    return dateObj.toLocaleString();
  };

  const formatDate= (dateString) => {
    const [datePart, timePart] = dateString.split(', '); // Split date and time
    const [day, month, year] = datePart.split('/').map(Number); // Parse day, month, and year
    const [hour, minute, second] = timePart.split(':').map(Number); // Parse hour, minute, and second
  
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthName = months[month - 1];
  
    // Determine AM or PM
    let period = 'AM';
    let formattedHour = hour;
    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) formattedHour -= 12;
    }
  
    return `${monthName} ${day}, ${year} at ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;  
  }


  const sliceTransactionId = (transactionId) => {
    return transactionId.slice(0, 5) + '...' + transactionId.slice(-5);
  };

  const rows = transactionData.map((transaction, index) =>
    createData(
      transaction.sig,
      transaction.type,
      transaction.prompt,
      formatTimestamp(transaction.time),
      transaction.amount
    )
  );


  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', position: 'relative' }}>
      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <CircularProgress color="primary" />
        </div>
      )}
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
          <TableRow>
            <TableCell variant="head" sx={{ fontWeight: 'bold', color: '#333', width: '25%' }}>Transaction ID</TableCell>
            <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333', width: '25%' }}>Prompt</TableCell>
            <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333', width: '25%' }}>Date</TableCell>
            <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333', width: '25%' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
              <TableCell sx={{ fontWeight: '500', color: '#333', width: '25%' }}>
              <Link href={`https://solana.fm/tx/${row.transactionId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {sliceTransactionId(row.transactionId)}
                </Link>
              </TableCell>
              <TableCell align="right" sx={{ color: '#333', width: '25%' }}>{row.prompt}</TableCell>
              <TableCell align="right" sx={{ color: '#333', width: '25%' }}>{formatDate(row.date)}</TableCell>
              <TableCell align="right" sx={{ color: '#333', width: '25%' }}>0.001 Sol</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
