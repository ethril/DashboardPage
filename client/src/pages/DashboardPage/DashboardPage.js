import React from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {

    return (
        <Box display="flex">
            <Sidebar />
            <Box m="20px" ml="270px" flexGrow={1}>
                <Box display="flex" justifyContent="space-between">
                    <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
                    {/*<Box>*/}
                    {/*    <Button*/}
                    {/*        variant="contained"*/}
                    {/*        sx={{*/}
                    {/*            bgcolor: colors.blueAccent[700],*/}
                    {/*            color: '#fcfcfc',*/}
                    {/*            fontSize: isMdDevices ? '14px' : '10px',*/}
                    {/*            fontWeight: 'bold',*/}
                    {/*            p: '10px 20px',*/}
                    {/*            mt: '18px',*/}
                    {/*            transition: '.3s ease',*/}
                    {/*            ':hover': {*/}
                    {/*                bgcolor: colors.blueAccent[800],*/}
                    {/*            },*/}
                    {/*        }}*/}
                    {/*        startIcon={<DownloadOutlined />}*/}
                    {/*    >*/}
                    {/*        DOWNLOAD REPORTS*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;