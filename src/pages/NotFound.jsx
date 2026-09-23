import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ fontSize: '72px', marginBottom: '10px' }}>404</h1>
      <h2>Sayfa Bulunamadı</h2>
      <p style={{ margin: '20px 0' }}>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}