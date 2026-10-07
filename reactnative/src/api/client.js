import axios from 'axios';

// Change this to your machine's IP if testing on a physical device
// e.g. 'http://192.168.1.100:9000/api'
// Android emulator: 10.0.2.2 maps to host machine localhost
// iOS simulator: localhost works directly
export const BASE_URL = 'http://10.0.2.2:9000/api';

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export default client;
