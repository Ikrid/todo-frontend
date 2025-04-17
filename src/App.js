import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import TaskPage from './components/TaskPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/tasks" element={<TaskPage />} />
            </Routes>
        </Router>
    );
}

export default App;
