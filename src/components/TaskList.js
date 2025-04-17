import React, { useState, useEffect, useContext } from 'react';
import API from '../../../untitled2/src/api/axios';
import { AuthContext } from '../AuthContext';

const TaskList = () => {
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await API.get('/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(res.data);
            } catch (err) {
                console.error('Klaida gaunant užduotis:', err);
            }
        };

        fetchTasks();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await API.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Naudojame tokeną
                },
            });
            setTasks(tasks.filter((task) => task.id !== id)); // Pašaliname užduotį iš sąrašo
        } catch (err) {
            console.error('Klaida trinant užduotį:', err);
        }
    };

    const handleComplete = async (id) => {
        try {
            await API.put(
                `/tasks/${id}`,
                { completed: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: true } : task
                )
            ); // Pažymime užduotį kaip užbaigtą
        } catch (err) {
            console.error('Klaida pažymint užduotį kaip baigtą:', err);
        }
    };

    return (
        <div className="task-list">
            <h2>Užduotys</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <div>
              <span
                  style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                  }}
              >
                {task.title}
              </span>
                        </div>
                        <button onClick={() => handleComplete(task.id)}>
                            {task.completed ? 'Baigta' : 'Pažymėti kaip baigtą'}
                        </button>
                        <button onClick={() => handleDelete(task.id)}>Ištrinti</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
