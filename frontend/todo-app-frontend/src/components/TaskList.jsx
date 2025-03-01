/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, CircularProgress } from "@mui/material";
import EditTaskDialog from "./EditTaskDialog";

const TaskList = ({ refreshTaskList }) => {
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState(null); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/tasks`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTaskList]); 

    const deleteTask = async (taskId) => {
        setDeletingTaskId(taskId);
        try {
            await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error.response?.data || error.message);
        } finally {
            setDeletingTaskId(null);
        }
    };

    const handleSaveEdit = async (updatedTask) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/tasks/${updatedTask._id}`,
                updatedTask,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === updatedTask._id ? response.data : task))
            );
            setEditTask(null);
        } catch (error) {
            console.error("Failed to update task:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <List>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <ListItem key={task._id}>
                                <ListItemText
                                    primary={task.title}
                                    secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()} | Status: ${task.status}`}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginRight: 1 }}
                                    onClick={() => setEditTask(task)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => deleteTask(task._id)}
                                    disabled={deletingTaskId === task._id} 
                                >
                                    {deletingTaskId === task._id ? <CircularProgress size={20} /> : "Delete"}
                                </Button>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No tasks available. Add some!" />
                        </ListItem>
                    )}
                </List>
            )}
            <EditTaskDialog open={Boolean(editTask)} task={editTask} onClose={() => setEditTask(null)} onSave={handleSaveEdit} />
        </div>
    );
};

export default TaskList;
