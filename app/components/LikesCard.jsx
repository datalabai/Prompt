import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';

const CustomCard = () => {
    return (
        <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                    {/* Left side (icon) */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUpAlt sx={{ fontSize: '4.5rem', marginRight: 1 }} />
                    </Box>
                    <Box>
                    <Typography variant="button">
                            Likes
                        </Typography>
                    <Typography variant="h4">
                        100 
                    </Typography>
                    </Box>  
                </Box>
                {/* Divider */}
                <Divider />
                {/* Bottom row */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="button">
                        <span>Total Likes</span> 
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
};

export default CustomCard;
