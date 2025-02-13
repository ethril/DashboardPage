import React from 'react';
import {
    Box,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    DownloadOutlined,
} from "@mui/icons-material";

import Header from "../../components/Header";
import {tokens} from "../../theme";


const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(min-width: 724px)");

    return (<Box m="20px">
        <Box display="flex" justifyContent="space-between">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            {<Box>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: colors.blueAccent[700],
                            color: "#fcfcfc",
                            fontSize: isMdDevices ? "14px" : "10px",
                            fontWeight: "bold",
                            p: "10px 20px",
                            mt: "18px",
                            transition: ".3s ease",
                            ":hover": {
                                bgcolor: colors.blueAccent[800],
                            },
                        }}
                        startIcon={<DownloadOutlined />}
                    >
                        DOWNLOAD REPORTS
                    </Button>
                </Box>
            }
        </Box>
        </Box>
        )
}

export default Dashboard;