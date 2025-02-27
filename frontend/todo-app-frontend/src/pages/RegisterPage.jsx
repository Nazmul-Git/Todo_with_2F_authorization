// eslint-disable-next-line no-unused-vars
import React from "react";
import Register from "../components/Register";
import { Box, Container } from "@mui/material";

export default function RegisterPage() {
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Register />
      </Box>
    </Container>
  );
}
