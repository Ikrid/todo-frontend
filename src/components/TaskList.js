import React, { useState, useEffect, useContext } from 'react';
import API from '../../../untitled2/src/api/axios';
import { AuthContext } from '../AuthContext';

const TaskList = () => {
    const { token } = useContext(AuthContext); // Imame tokeną iš AuthContext
    const [tasks, setTasks] = useState([]);

    // Užduočių gavimas iš API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await API.get('/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Užduotys gautos iš serverio:', res.data); // Patikrinkite serverio atsakymą
                setTasks(res.data); // Uždaviniai bus įrašyti į state
            } catch (err) {
                console.error('Klaida gaunant užduotis:', err);
            }
        };

        if (token) {
            fetchTasks(); // Jei tokenas yra, užklausimas vykdomas
        }
    }, [token]); // Tiksliname efektą priklausomybėje nuo tokeno

    // Užduoties ištrynimas
    const handleDelete = async (id) => {
        try {
            await API.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.filter((task) => task.id !== id)); // Pašaliname užduotį iš sąrašo
        } catch (err) {
            console.error('Klaida trinant užduotį:', err);
        }
    };

    // Užduoties pažymėjimas kaip baigtos
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
                {tasks.length === 0 ? (
                    <p>Užduočių nėra</p> // Jei nėra užduočių, rodomas pranešimas
                ) : (
                    tasks.map((task) => (
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
                            <div>
                                <strong>Vartotojas:</strong> {task.User?.username || 'Nežinomas'}
                            </div>
                            <div>
                                <strong>Sukūrimo data:</strong> {new Date(task.createdAt).toLocaleString()}
                            </div>
                            <button onClick={() => handleComplete(task.id)}>
                                {task.completed ? 'Baigta' : 'Pažymėti kaip baigtą'}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>Ištrinti</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TaskList;
