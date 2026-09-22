import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryService';
import { getProducts } from '../api/productService';
import { FaTags, FaBoxes, FaChartPie } from 'react-icons/fa';

const Dashboard = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (error) {
        console.error('Veriler çekilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaChartPie className="text-blue-600" /> Kontrol Paneli
      </h1>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
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