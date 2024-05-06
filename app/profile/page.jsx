"use client";

import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, IconButton, Tooltip, Tab, Tabs, Box } from '@mui/material';
import { FileCopyOutlined as FileCopyOutlinedIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'; // Importing icons

const Profile = () => {
    const profileData = {
        name: 'Kishore Challapalli',
        email: 'johndoe@example.com',
        walletBalance: 5000,
        walletAddress: '0x1234567890abcdef',
        tokens: 100,
        transactions: [
            { id: 1, amount: 10, type: 'Deposit' },
            { id: 2, amount: 20, type: 'Withdrawal' },
            { id: 3, amount: 5, type: 'Deposit' },
        ],
    };

    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('tokens');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileData.walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Shortened address for display
    const shortenedAddress = `${profileData.walletAddress.slice(0, 6)}...${profileData.walletAddress.slice(-4)}`;

    return (
        <Container maxWidth="md" sx={{ mt: 8 }} className='ml-96 mt-24'>
            <Typography variant="h3" align="center" className='ml-10' sx={{ mb: 4 }}>
                {profileData.name}
            </Typography>
            <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                    aria-label="export"
                    onClick={() => {
                        // Add logic to open the wallet in Solana explorer
                        window.open(`https://solanaexplorer.com/address/${profileData.walletAddress}`, '_blank');
                    }}
                    sx={{ color: '#007bff', mr: 1 }}
                >
                    {/* Export icon */}
                    <OpenInNewIcon />
                </IconButton>
            </Box>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h3" className='space-x-2' align="center" sx={{ color: '#007bff' }}>
                                <span>$</span>
                                <span>{profileData.walletBalance}</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" gutterBottom align="center">
                                <Tooltip title={profileData.walletAddress} arrow placement="right">
                                    <Typography variant='h4' className='ml-10'>
                                        {shortenedAddress}
                                         <IconButton
                                    aria-label="copy"
                                    onClick={copyToClipboard}
                                    sx={{ ml: 1, color: '#333333' }}
                                >
                                    <FileCopyOutlinedIcon />
                                </IconButton>
                                    </Typography>
                                </Tooltip>
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth" sx={{ mt: 4, backgroundColor: '#f0f0f0', borderRadius: '12px' }}>
                <Tab label="Tokens" value="tokens" sx={{ color: '#007bff' }} />
                <Tab label="Transactions" value="transactions" sx={{ color: '#007bff' }} />
            </Tabs>

            <Box sx={{ mt: 2 }}>
    {activeTab === 'tokens' && (
        <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: '#333333' }}>
                    Tokens
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#007bff' }}>
                    <strong>Total Tokens:</strong> {profileData.tokens}
                </Typography>
                {/* Display two Solana tokens */}
                <Typography variant="body1" gutterBottom>
                    Solana Token 1: 50 Tokens
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Solana Token 2: 50 Tokens
                </Typography>
            </CardContent>
        </Card>
    )}



                {activeTab === 'transactions' && (
                    <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: '#333333' }}>
                                Transactions
                            </Typography>
                            <ul>
                                {profileData.transactions.map((transaction) => (
                                    <li key={transaction.id} sx={{ color: '#007bff' }}>
                                        {transaction.type}: {transaction.amount} Tokens
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Container>
    );
};

export default Profile;
