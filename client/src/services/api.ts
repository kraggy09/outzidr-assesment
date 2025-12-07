import axios from 'axios';
import type { ICard } from '../types';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const signup = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const guestLogin = async () => {
    const response = await api.post('/auth/guest-login');
    return response.data;
};

export const getCards = async (): Promise<ICard[]> => {
    const response = await api.get('/cards');
    return response.data;
};

export const createCard = async (card: Omit<ICard, "_id">): Promise<ICard> => {
    const response = await api.post('/cards', card);
    return response.data;
};

export const updateCard = async (id: string, updates: Partial<ICard>): Promise<ICard> => {
    const response = await api.put(`/cards/${id}`, updates);
    return response.data;
};

export const reorderCards = async (columnId: string, cardIds: string[]): Promise<{ message: string }> => {
    const response = await api.put('/cards/reorder', { columnId, cardIds });
    return response.data;
};

export const deleteCard = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
};
