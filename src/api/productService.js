import API from './axios';

export const getProducts = (params) => API.get('/api/products', { params });

export const getProductById = (id) => API.get(`/api/products/${id}`);

export const createProduct = (product) => API.post('/api/products', product);

export const updateProduct = (id, product) => API.put(`/api/products/${id}`, product);

export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

export const getProductsByCategory = (categoryId, params) => API.get(`/api/products/category/${categoryId}`, { params });

export const getInStockProducts = (params) => API.get('/api/products/in-stock', { params });

export const searchProducts = (name, params = {}) => API.get('/api/products/search', { params: { name, ...params } });