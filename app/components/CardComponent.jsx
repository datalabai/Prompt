import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import Help from '@mui/icons-material/Help';

const CustomCard = () => {
    return (
        <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                    {/* Left side (icon) */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Help sx={{ fontSize: '4.5rem', marginRight: 1 }} />
                    </Box>
                    <Box>
                    <Typography variant="button">
                            Suggestions
                        </Typography>
                    <Typography variant="h4">
                        50
                    </Typography>
                    </Box>  
                </Box>
                {/* Divider */}
                <Divider />
                {/* Bottom row */}
                <Box sx={{ p: 2 , textAlign: 'center'}}>
                    <Typography variant="button">
                        <span> Prompts Suggested</span> 
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
};

export default CustomCard;
