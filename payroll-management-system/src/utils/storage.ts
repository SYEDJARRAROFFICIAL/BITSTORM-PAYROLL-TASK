import { Employee } from '../types';

export const saveToLocalStorage = (key: string, data: Employee[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string): Employee[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};