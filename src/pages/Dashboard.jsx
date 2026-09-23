import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryService';
import { getProducts } from '../api/productService';
import { FaTags, FaBoxes, FaChartPie, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([getCategories(), getProducts()]);
      
      // Kategorileri Dizi İse Say
      setCategoryCount(Array.isArray(catRes.data) ? catRes.data.length : 0);

      // Spring Boot Page Objesinden Toplam Eleman Sayısını (totalElements) Al
      if (prodRes.data && prodRes.data.totalElements !== undefined) {
        setProductCount(prodRes.data.totalElements);
      } else if (Array.isArray(prodRes.data)) {
        setProductCount(prodRes.data.length);
      } else if (prodRes.data && Array.isArray(prodRes.data.content)) {
        setProductCount(prodRes.data.content.length);
      } else {
        setProductCount(0);
      }
    } catch (err) {
      console.error('Veriler çekilirken hata oluştu:', err);
      const errMsg = err.response?.data?.message || 'Dashboard verileri yüklenirken sunucu hatası oluştu.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaChartPie className="text-blue-600" /> Kontrol Paneli
      </h1>

      {loading ? (
        <div className="text-gray-500 font-medium">Yükleniyor...</div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md text-red-700 flex flex-col items-center justify-center gap-4">
          <FaExclamationTriangle className="text-4xl text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-bold">Veriler Yüklenemedi</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <FaRedo /> Tekrar Dene
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Toplam Kategori Kartı */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Toplam Kategori</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{categoryCount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 text-3xl">
              <FaTags />
            </div>
          </div>

          {/* Toplam Ürün Kartı */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Toplam Ürün</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{productCount}</p>
            </div>
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 text-3xl">
              <FaBoxes />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;