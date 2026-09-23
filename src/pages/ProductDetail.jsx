import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaBox, FaTag, FaLayerGroup, FaInfoCircle, FaBarcode } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        toast.error('Ürün detayları yüklenirken hata oluştu.');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-gray-500">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-6 py-8 text-gray-500">Ürün bulunamadı.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition"
      >
        <FaArrowLeft /> Ürün Listesine Dön
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Ürün Detayı
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
          </div>
          <span className="text-2xl font-black text-emerald-600">{product.price} ₺</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <FaBarcode className="text-gray-400 text-xl" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Ürün ID</p>
              <p className="text-gray-700 font-semibold">{product.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <FaLayerGroup className="text-gray-400 text-xl" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Kategori</p>
              <p className="text-gray-700 font-semibold">{product.category ? product.category.name : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <FaBox className="text-gray-400 text-xl" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Stok Adedi</p>
              <p className={`font-semibold ${product.stockQuantity > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                {product.stockQuantity} adet {product.stockQuantity <= 0 && '(Stokta Yok)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <FaTag className="text-gray-400 text-xl" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Birim Fiyatı</p>
              <p className="text-gray-700 font-semibold">{product.price} ₺</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaInfoCircle className="text-emerald-500" /> Açıklama
          </h3>
          <p className="text-gray-600 leading-relaxed">{product.description || 'Bu ürün için açıklama bulunmamaktadır.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;