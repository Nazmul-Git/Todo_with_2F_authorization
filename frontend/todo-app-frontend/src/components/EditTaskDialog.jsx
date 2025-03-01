/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';

const EditTaskDialog = ({ open, task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        dueDate: task?.dueDate || '',
        status: task?.status || 'Pending',
        priority: task?.priority || 'Medium',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                dueDate: task.dueDate,
                status: task.status,
                priority: task.priority,
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "dueDate") {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            setFormData({ ...formData, dueDate: selectedDate < today ? today.toISOString().split("T")[0] : value });
        } else {
            setFormData({ ...formData, [name]: value.trim() });
        }
    };

    const handleSave = () => {
        onSave({ ...task, ...formData });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTaskDialog;
