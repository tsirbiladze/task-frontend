import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { getProducts, deleteProducts } from '../../services/api';
import './ProductList.scss';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleMassDelete = async () => {
    try {
      await deleteProducts(selectedProducts);
      await loadProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Failed to delete products:', error);
    }
  };

  return (
    <div className="product-list">
      <div className="header">
        <h1>Product List</h1>
        <div className="actions">
          <Link to="/add-product">
            <button className="add-button">ADD</button>
          </Link>
          <button id="delete-product-btn" className="mass-delete-button" onClick={handleMassDelete}>MASS DELETE</button>
        </div>
      </div>
      <div className="products">
        {products.map(product => (
          <ProductCard 
            key={product.sku} 
            product={product}
            onSelect={(sku) => setSelectedProducts(prevSelected => [...prevSelected, sku])}
            onDeselect={(sku) => setSelectedProducts(prevSelected => prevSelected.filter(pSku => pSku !== sku))}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;