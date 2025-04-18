import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Būsenos kintamasis, kad žinotume, ar redaguojame
    const [editingTaskId, setEditingTaskId] = useState(null); // Saugo redaguojamos užduoties ID

    // Funkcija, skirta užduoties kūrimui
    const handleCreateTask = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('❌ Nėra prisijungimo tokeno');
            return;
        }

        if (!title || !description) {
            setMessage('❌ Užpildykite visus laukus');
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/tasks',
                { title, description },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('✅ Užduotis sukurta!');
            fetchTasks(); // Atgauname užduotis iš serverio po naujos užduoties sukūrimo
        } catch (err) {
            console.error('Error creating task:', err);
            setMessage('❌ Užduoties kūrimas nepavyko');
        }
    };

    // Funkcija, skirta gauti užduotis iš serverio
    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    // Funkcija užduoties redagavimui
    const handleEditTask = (task) => {
        setTitle(task.title);
        setDescription(task.description);
        setIsEditing(true);
        setEditingTaskId(task.id);
    };

    // Funkcija užduoties atnaujinimui
    const handleUpdateTask = async () => {
        const token = localStorage.getItem('token');
        if (!title || !description) {
            setMessage('❌ Užpildykite visus laukus');
            return;
        }

        try {
            const res = await axios.put(
                `http://localhost:5000/api/tasks/${editingTaskId}`,
                { title, description },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('✅ Užduotis atnaujinta!');
            setIsEditing(false); // Išjungiam redagavimo režimą
            fetchTasks(); // Atgauname užduotis iš serverio po atnaujinimo
        } catch (err) {
            console.error('Error updating task:', err);
            setMessage('❌ Užduoties atnaujinimas nepavyko');
        }
    };

    // Funkcija užduoties ištrynimui
    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('✅ Užduotis ištrinta!');
            fetchTasks(); // Atgauname užduotis iš serverio po ištrynimo
        } catch (err) {
            console.error('Error deleting task:', err);
            setMessage('❌ Užduoties ištrynimas nepavyko');
        }
    };

    useEffect(() => {
        fetchTasks(); // Gauti užduotis, kai komponentas įkeltas
    }, []);

    return (
        <div>
            <h2>{isEditing ? 'Redaguoti užduotį' : 'Sukurti naują užduotį'}</h2>
            <input
                type="text"
                placeholder="Užduoties pavadinimas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Aprašymas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={isEditing ? handleUpdateTask : handleCreateTask}>
                {isEditing ? 'Atnaujinti užduotį' : 'Sukurti užduotį'}
            </button>
            {message && <p>{message}</p>}

            <h2>Užduočių sąrašas</h2>
            <ul>
                {tasks.length === 0 ? (
                    <p>Užduočių nėra</p> // Jeigu užduočių nėra
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
                                <strong>Aprašymas:</strong> {task.description || 'Nėra aprašymo'}
                            </div>
                            <div>
                                <strong>Vartotojas:</strong> {task.User?.username || 'Nežinomas'}
                            </div>
                            <div>
                                <strong>Sukūrimo data:</strong> {new Date(task.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <button onClick={() => handleEditTask(task)}>Redaguoti</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Ištrinti</button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TaskPage;
