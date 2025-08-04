import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/Sidebar';

const F1Page = () => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box m="20px" ml="270px" flexGrow={1}>
                {/* Dodaj zawartość strony F1Page */}
                <h1>F1 Page</h1>
            </Box>
        </Box>
    );
};

export default F1Page;