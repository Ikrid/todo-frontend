import React, { useState } from 'react';
import { createTask } from '../services/taskService';  // Importuojame service funkciją

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            userId: 1,  // Šį ID pakeiskite pagal prisijungusio vartotojo ID
        };

        try {
            const newTask = await createTask(taskData);
            console.log('Užduotis sukurta:', newTask);
        } catch (error) {
            console.error('Klaida kuriant užduotį:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Pavadinimas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Aprašymas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Sukurti užduotį</button>
        </form>
    );
};

export default TaskForm;
