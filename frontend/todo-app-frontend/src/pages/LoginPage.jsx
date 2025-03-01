// eslint-disable-next-line no-unused-vars
import React from "react";
import Login from "../components/Login";
import { Box, Container } from "@mui/material";

export default function LoginPage() {
    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Login />
            </Box>
        </Container>
    );
}
