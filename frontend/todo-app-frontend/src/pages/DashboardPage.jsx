// eslint-disable-next-line no-unused-vars
import React from "react";
import Dashboard from "../components/Dashboard";
import { Box } from "@mui/material";

export default function DashboardPage() {
    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Dashboard />
        </Box>
    );
}
