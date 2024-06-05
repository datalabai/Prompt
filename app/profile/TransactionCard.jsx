"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes}`;
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
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
        Transaction History
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', position: 'relative' }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell variant="head" sx={{ fontWeight: 'bold', color: '#333' }}>Transaction ID</TableCell>
              <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333' }}>Prompt</TableCell>
              <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333' }}>Date</TableCell>
              <TableCell align="right" variant="head" sx={{ fontWeight: 'bold', color: '#333' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: '500', color: '#333' }}>
                  <Link href={`https://solana.fm/tx/${row.transactionId}`} target="_blank" rel="noopener noreferrer">
                    <Typography sx={{ color: 'blue', textDecoration: 'underline', '&:hover': { color: 'darkblue' } }}>
                      {sliceTransactionId(row.transactionId)}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell align="right" sx={{ color: '#333' }}>{row.prompt}</TableCell>
                <TableCell align="right" sx={{ color: '#333' }}>{row.date}</TableCell>
                <TableCell align="right" sx={{ color: '#333' }}>1.50 USDC</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
