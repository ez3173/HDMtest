import { Check, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ newTaskName, setNewTaskName ] = useState('');
  const [ editedNames, setEditedNames ] = useState<{ [key: number]: string,}>({}); // Un objet pour gérer l'édition des tâches
  // Charger toutes les tâches
  console.log('tasks', tasks);
  const handleFetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      if (Array.isArray(response)) {
        setTasks(response);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Supprimer une tâche
  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    handleFetchTasks();
  };

  // Ajouter une nouvelle tâche
  const handleSave = async () => {
    if (!newTaskName.trim()) return;
    await api.post('/tasks', { name: newTaskName });
    setNewTaskName('');
    handleFetchTasks();
  };

  // Mettre à jour une tâche
  const handleUpdate = async (id: number, updatedName: string, oldName: string) => {
    if (!updatedName.trim() || updatedName === oldName) return; // Ne pas envoyer si pas de modification

    const updatedTask = {
      id,
      name: updatedName,
    };

    console.log('updatedTask', updatedTask);
    await api.patch(`/tasks/${id}`, updatedTask);
    handleFetchTasks();
  };
  // Gérer la modification du nom d'une tâche spécifique
  const handleChange = (id: number, value: string) => {
    setEditedNames((prev) => ({ ...prev, [id]: value }));
  };
  useEffect(() => {
    handleFetchTasks();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
            gap={1}
            width="100%"
          >
            <TextField
              size="small"
              value={editedNames[task.id] ?? task.name}
              fullWidth
              sx={{ maxWidth: 350 }}
              onChange={(e) => handleChange(task.id, e.target.value)}
            />
            <Box>
              <IconButton
                id="check"
                color="success"
                onClick={() => handleUpdate(task.id, editedNames[task.id] ?? task.name, task.name)}
              >
                <Check />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <TextField
            size="small"
            placeholder="Nouvelle tâche"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <Button variant="outlined" onClick={handleSave}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
