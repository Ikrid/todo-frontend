import React, { useState } from 'react';
import axios from 'axios';

const TaskPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateTask = async () => {
        // Patikriname, ar tokenas egzistuoja
        const token = localStorage.getItem('token');
        console.log('Token:', token);  // Patikrinkite, ar tokenas yra
        if (!token) {
            setMessage('❌ Nėra prisijungimo tokeno');
            return;
        }

        // Patikriname, ar abu laukai užpildyti
        if (!title || !description) {
            setMessage('❌ Užpildykite visus laukus');
            return;
        }

        try {
            // Siunčiame užklausą su užduoties duomenimis
            const res = await axios.post(
                'http://localhost:5000/api/tasks',
                {
                    title,
                    description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            console.log('Task created:', res.data);  // Patikrinkite atsakymą
            setMessage('✅ Užduotis sukurta!');
        } catch (err) {
            console.error('Error creating task:', err);
            setMessage('❌ Užduoties kūrimas nepavyko');

            // Patikriname, jei serveris grąžina klaidą
            if (err.response) {
                console.log('Serverio klaida:', err.response.data);  // Patikrinkite atsakymą iš serverio
                setMessage(`❌ Klaida: ${err.response.data.error || 'Nežinoma klaida'}`);
            } else if (err.request) {
                console.log('Klaida su užklausa:', err.request);  // Patikrinkite užklausos problemas
            } else {
                console.log('Klaida:', err.message);  // Patikrinkite klaidos žinutę
            }
        }
    };

    return (
        <div>
            <h2>Sukurti naują užduotį</h2>
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
            <button onClick={handleCreateTask}>Sukurti užduotį</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TaskPage;
