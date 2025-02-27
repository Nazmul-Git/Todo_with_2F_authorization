/* eslint-disable no-undef */
import React, { useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTaskList, setRefreshTaskList] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleAddTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowForm(false);
      setRefreshTaskList((prev) => !prev);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add task. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Paper elevation={0} sx={{ padding: 4, width: "100%", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : showForm ? "Hide Form" : "Add Task"}
          </Button>
          {showForm && <TaskForm onSubmit={handleAddTask} />}
        </Paper>

        <Paper elevation={0} sx={{ padding: 4, width: "100%", marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Task List
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <TaskList refreshTaskList={refreshTaskList} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
