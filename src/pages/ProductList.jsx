import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getInStockProducts,
  searchProducts
} from '../api/productService';
import { getCategories } from '../api/categoryService';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaTrash, FaEdit, FaBoxes, FaSearch, 
  FaFilter, FaCheckCircle, FaSort, FaSave, FaTimes, FaEye
} from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Düzenleme (Edit) State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', stockQuantity: '', categoryId: '' });

  // Filtreleme, Arama, Pagination & Sorting State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const catRes = await getCategories();
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);

      let prodRes;
      const pageParams = {
        page: currentPage,
        size: pageSize,
        sort: `name,${sortOrder}`
      };

      if (searchTerm.trim()) {
        prodRes = await searchProducts(searchTerm.trim(), pageParams);
      } else if (selectedCategoryFilter) {
        prodRes = await getProductsByCategory(selectedCategoryFilter, pageParams);
      } else if (onlyInStock) {
        prodRes = await getInStockProducts(pageParams);
      } else {
        prodRes = await getProducts(pageParams);
      }

      if (prodRes.data && Array.isArray(prodRes.data.content)) {
        setProducts(prodRes.data.content);
        setTotalPages(prodRes.data.totalPages || 1);
      } else if (Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
        setTotalPages(1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error('Ürünler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortOrder, selectedCategoryFilter, onlyInStock]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.warning('Ürün adı boş bırakılamaz!');
    if (!categoryId) return toast.warning('Lütfen bir kategori seçin!');
    if (price === '' || isNaN(price) || Number(price) < 0) return toast.warning('Geçerli ve pozitif bir fiyat giriniz!');
    if (stockQuantity === '' || isNaN(stockQuantity) || Number(stockQuantity) < 0) return toast.warning('Geçerli ve pozitif bir stok adedi giriniz!');

    try {
      await createProduct({
        name: name.trim(),
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        categoryId: Number(categoryId)
      });
      toast.success('Ürün başarıyla eklendi!');
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity('');
      setCategoryId('');
      fetchData();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Geçersiz ürün bilgileri!');
      } else {
        toast.error('Ürün eklenirken bir hata oluştu.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      stockQuantity: product.stockQuantity ?? '',
      categoryId: product.category ? product.category.id : ''
    });
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) return toast.warning('Ürün adı boş olamaz!');
    if (editForm.price === '' || isNaN(editForm.price) || Number(editForm.price) < 0) return toast.warning('Geçerli ve pozitif bir fiyat giriniz!');
    if (editForm.stockQuantity === '' || isNaN(editForm.stockQuantity) || Number(editForm.stockQuantity) < 0) return toast.warning('Geçerli ve pozitif bir stok adedi giriniz!');

    try {
      await updateProduct(id, {
        ...editForm,
        name: editForm.name.trim(),
        price: Number(editForm.price),
        stockQuantity: Number(editForm.stockQuantity),
        categoryId: Number(editForm.categoryId)
      });
      toast.success('Ürün güncellendi!');
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error('Ürün güncellenemedi.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteProduct(id);
      toast.success('Ürün silindi.');
      fetchData();
    } catch (error) {
      toast.error('Ürün silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBoxes className="text-emerald-600" /> Ürün Yönetimi
      </h1>

      {/* YENİ ÜRÜN EKLEME FORMU */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Yeni Ürün Ekle</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Ürün Adı *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <input
            type="number"
            placeholder="Fiyat (₺) *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="border p-2 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <input
            type="number"
            placeholder="Stok Adedi *"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            min="0"
            className="border p-2 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="border p-2 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="">Kategori Seçin *</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none md:col-span-2"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition md:col-span-3"
          >
            <FaPlus /> Ürün Ekle
          </button>
        </form>
      </div>

      {/* ARAMA, FİLTRELEME & SIRALAMA PANELİ */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ürün adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg w-full outline-none text-sm"
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
            <FaSearch />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setSearchTerm('');
              setOnlyInStock(false);
              setCurrentPage(0);
            }}
            className="border p-2 rounded-lg w-full text-sm outline-none"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setOnlyInStock(!onlyInStock);
            setSelectedCategoryFilter('');
            setSearchTerm('');
            setCurrentPage(0);
          }}
          className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm border font-medium transition ${
            onlyInStock ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-gray-50 text-gray-600'
          }`}
        >
          <FaCheckCircle /> Sadece Stoktakiler
        </button>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center gap-2 p-2 rounded-lg text-sm border bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
        >
          <FaSort /> Sırala: İsme Göre ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>
      </div>

      {/* TABLO */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Yükleniyor...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Ürün Adı</th>
                <th className="p-4">Açıklama</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm text-gray-500">{currentPage * pageSize + index + 1}</td>

                    {editingId === p.id ? (
                      <>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="border p-1 rounded w-full"
                            placeholder="Açıklama"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                            className="border p-1 rounded w-20"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={editForm.stockQuantity}
                            onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
                            required
                            min="0"
                            className="border p-1 rounded w-20"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            value={editForm.categoryId}
                            onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                            required
                            className="border p-1 rounded"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => handleUpdate(p.id)} className="bg-green-600 text-white p-2 rounded">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white p-2 rounded">
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 font-semibold text-gray-800">{p.name}</td>
                        <td className="p-4 text-gray-600 text-sm">{p.description || '-'}</td>
                        <td className="p-4 text-emerald-600 font-bold">{p.price} ₺</td>
                        <td className="p-4 text-gray-600">{p.stockQuantity} adet</td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {p.category ? p.category.name : '-'}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <Link
                            to={`/products/${p.id}`}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 inline-flex items-center justify-center"
                            title="Detay Göster"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => handleEditClick(p)}
                            className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600"
                            title="Düzenle"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            title="Sil"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    Henüz ürün bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Önceki
          </button>
          <span className="text-gray-600 font-medium">
            Sayfa {currentPage + 1} / {totalPages}
          </span>
          <button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;