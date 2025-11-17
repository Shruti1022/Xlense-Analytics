import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.visitiq.me/api',
  timeout: 10000,
});

export default instance;
