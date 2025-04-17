import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Naudojame useNavigate

const AuthForm = () => {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Sukuriame navigate funkciją

    // Prisijungimo funkcija
    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/login', {
                username: nickname,
                password,
            });
            localStorage.setItem('token', res.data.token);  // Išsaugome tokeną localStorage
            setMessage('✅ Prisijungta sėkmingai!');
            navigate('/tasks'); // Po prisijungimo nukreipiame į užduočių puslapį
        } catch (err) {
            setMessage('❌ Prisijungimas nepavyko');
        }
    };

    // Registracijos funkcija
    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/register', {
                username: nickname,
                password,
            });
            setMessage('✅ Registracija sėkminga!');
        } catch (err) {
            setMessage('❌ Registracija nepavyko');
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '0 auto', padding: '2rem' }}>
            <h2>Prisijungimas / Registracija</h2>
            <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleLogin}>Prisijungti</button>
                <button onClick={handleRegister}>Registruotis</button>
            </div>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
    );
};

export default AuthForm;
