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
    const date = new Date(timestamp);

// Array to map month numbers to their abbreviations
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Extract individual components
const year = date.getFullYear();
const month = monthNames[date.getMonth()]; // Get the month abbreviation
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

// Format the date as YYYY-MMM-DD HH:MM:SS
const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

    return formattedDate;
  };



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
              <TableCell align="right" sx={{ color: '#333', width: '25%' }}>{row.date}</TableCell>
              <TableCell align="right" sx={{ color: '#333', width: '25%' }}>0.001 Sol</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
