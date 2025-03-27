import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/Sidebar';

const FamilyPage = () => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box m="20px" ml="270px" flexGrow={1}>
                {/* Dodaj zawartość strony FamilyPage */}
                <h1>Family Page</h1>
            </Box>
        </Box>
    );
};

export default FamilyPage;