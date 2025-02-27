/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { TextField, Button, Container, Typography, MenuItem, CircularProgress } from "@mui/material";

const TaskForm = ({ task, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        dueDate: task?.dueDate || "",
        status: task?.status || "Pending",
        priority: task?.priority || "Medium",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return alert("Title is required.");
        if (new Date(formData.dueDate) < new Date()) return alert("Due date must be in the future.");

        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                {task ? "Edit Task" : "Add Task"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    select
                    value={formData.status}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label="Priority"
                    name="priority"
                    select
                    value={formData.priority}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={20} /> : task ? "Update Task" : "Add Task"}
                </Button>
            </form>
        </Container>
    );
};

export default TaskForm;
