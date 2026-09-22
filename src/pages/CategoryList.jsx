import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryService';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaTags, FaSave, FaTimes } from 'react-icons/fa';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Kategoriler yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Yeni Kategori Ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Kategori adı boş bırakılamaz!');
      return;
    }

    try {
      await createCategory({ name, description });
      toast.success('Kategori başarıyla eklendi!');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (error) {
      toast.error('Kategori eklenirken hata oluştu.');
    }
  };

  // Kategori Düzenleme Modunu Açma
  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditName(category.name || '');
    setEditDescription(category.description || '');
  };

  // Kategori Güncelleme (PUT)
  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      toast.warning('Kategori adı boş olamaz!');
      return;
    }

    try {
      await updateCategory(id, { name: editName, description: editDescription });
      toast.success('Kategori başarıyla güncellendi!');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error('Kategori güncellenirken hata oluştu.');
    }
  };

  // Kategori Silme (409 Conflict Yönetimi)
  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

    try {
      await deleteCategory(id);
      toast.success('Kategori silindi.');
      fetchCategories();
    } catch (error) {
      // Backend'den 409 Conflict dönerse
      if (error.response && error.response.status === 409) {
        toast.error('Bu kategoriye bağlı ürünler bulunduğu için kategori silinemedi!');
      } else {
        toast.error('Kategori silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaTags className="text-blue-600" /> Kategori Yönetimi
      </h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Yeni Kategori Ekle</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Kategori Adı *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FaPlus /> Ekle
          </button>
        </form>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Yükleniyor...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Kategori Adı</th>
                <th className="p-4">Açıklama</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm text-gray-500">{cat.id}</td>

                    {/* Düzenleme Modu Satırı */}
                    {editingId === cat.id ? (
                      <>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="border p-1 rounded w-full"
                          />
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                            title="Kaydet"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                            title="İptal"
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      /* Normal Görünüm Satırı */
                      <>
                        <td className="p-4 font-semibold text-gray-800">{cat.name}</td>
                        <td className="p-4 text-gray-600">{cat.description || '-'}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 transition"
                            title="Düzenle"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
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
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    Henüz kategori bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryList;