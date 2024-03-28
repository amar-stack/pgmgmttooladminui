import axios from 'axios';

const instance = axios.create({
    timeout: 0,
    baseURL: '/v1',
    headers:{
        'Content-Type': 'application/json',
    }
})

export default instance;