import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const unauthorizedInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL_V2 });

