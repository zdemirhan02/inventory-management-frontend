import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBoxes, FaTags, FaChartBar } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-gray-300 hover:bg-slate-700 hover:text-white';
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <FaBoxes className="text-blue-400" /> Stok Yönetim Sistemi
        </Link>
        <div className="flex gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${isActive('/')}`}
          >
            <FaChartBar /> Kontrol Paneli
          </Link>
          <Link
            to="/categories"
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${isActive('/categories')}`}
          >
            <FaTags /> Kategoriler
          </Link>
          <Link
            to="/products"
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${isActive('/products')}`}
          >
            <FaBoxes /> Ürünler
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;