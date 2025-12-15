import axios from 'axios';

//Membuat koneksi dasar ke backend python
const api = axios.create({
    baseURL: 'http://localhost:6543/api', //alamat server backend 
    headers: {
        'Content-Type': 'application/json'
    }
});

//Memasang interceptor 
//Pengecekan apakah ada token, setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        //if ada token, ditempelkan sebagai tiket masuk
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;