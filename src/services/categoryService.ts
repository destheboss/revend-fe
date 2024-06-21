import apiClient from './apiClient';

export const categoryService = {
    getAllCategories: () => {
        return apiClient.get('/categories');
    }
};