import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:9000/api',
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
});

export default API;
