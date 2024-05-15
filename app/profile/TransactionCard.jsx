import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  transactionId,
  type,
  promt,
  Date,
  Action,
) {
  return { transactionId, type, promt, Date, Action };
}

const rows = [
  createData('ymxudirsoxotnkanlle', 'Debited', 'Great wall', 'May 10th, 2024', 'click to view'),
  createData('ymxudirsoxotnkanlle', 'Debited', 'Great wall', 'May 10th, 2024', 'click to view'),
  createData('ymxudirsoxotnkanlle', 'Debited', 'Great wall', 'May 10th, 2024', 'click to view'),
  createData('ymxudirsoxotnkanlle', 'Debited', 'Great wall', 'May 10th, 2024', 'click to view'),
  createData('ymxudirsoxotnkanlle', 'Debited', 'Great wall', 'May 10th, 2024', 'click to view'),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Transaction Id</TableCell>
            <TableCell align="right">Debit/Credit</TableCell>
            <TableCell align="right">Promt</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.transactionId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.transactionId}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.promt}</TableCell>
              <TableCell align="right">{row.Date}</TableCell>
              <TableCell align="right">{row.Action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
