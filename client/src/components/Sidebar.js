import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <Box
            sx={{
                width: 250,
                bgcolor: 'background.paper',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                boxShadow: 3,
                padding: '10px',
                '& .MuiListItem-root': {
                    marginBottom: '10px',
                    '&:hover': {
                        bgcolor: 'primary.light',
                    },
                },
                '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                },
            }}
        >
            <List>
                <ListItem button component={Link} to="/DashboardPage">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/FamilyPage">
                    <ListItemText primary="Drzewo genealogiczne" />
                </ListItem>
                {/* Dodaj więcej elementów listy według potrzeb */}
            </List>
        </Box>
    );
};

export default Sidebar;