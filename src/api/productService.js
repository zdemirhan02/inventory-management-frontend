import API from './axios';

// Tüm ürünleri çekme (Opsiyonel pagination & sorting parametreleri ile)
export const getProducts = (params) => API.get('/api/products', { params });

// ID ile tek ürün detayını çekme (404 kontrolü için)
export const getProductById = (id) => API.get(`/api/products/${id}`);

// Yeni ürün oluşturma
export const createProduct = (product) => API.post('/api/products', product);

// Ürün güncelleme
export const updateProduct = (id, product) => API.put(`/api/products/${id}`, product);

// Ürün silme
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

// --- DOKÜMANDA İSTENEN EK FİLTRE SERVİSLERİ ---

// Kategorisine göre ürünleri çekme
export const getProductsByCategory = (categoryId) => API.get(`/api/products/category/${categoryId}`);

// Yalnızca stokta olan ürünleri çekme
export const getInStockProducts = () => API.get('/api/products/in-stock');

// İsme göre arama yapma
export const searchProducts = (name) => API.get('/api/products/search', { params: { name } });