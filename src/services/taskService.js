import axios from 'axios';


const createTask = async (taskData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Klaida kuriant užduotį:', error);
        throw error;
    }
};

export { createTask };
