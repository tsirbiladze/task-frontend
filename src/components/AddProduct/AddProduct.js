import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, checkSkuUniqueness } from '../../services/api';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './AddProduct.scss';

const PRODUCT_TYPES = {
  DVD: 'dvd',
  BOOK: 'book',
  FURNITURE: 'furniture',
};

const INITIAL_PRODUCT_STATE = {
  sku: '',
  name: '',
  price: '',
  type: '',
  attribute: '',
  height: '',
  width: '',
  length: '',
};

function AddProduct() {
  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  }, []);

  const validateInputs = useCallback(() => {
    if (!product.sku || !product.name || !product.price || !product.type) {
      setError('Please, submit required data');
      return false;
    }

    if (product.type === PRODUCT_TYPES.FURNITURE && (!product.height || !product.width || !product.length)) {
      setError('Please, provide dimensions');
      return false;
    }

    if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
      setValidationError('Please, provide a valid positive number for price');
      return false;
    }

    if (product.type === PRODUCT_TYPES.DVD && (isNaN(parseInt(product.attribute)) || parseInt(product.attribute) <= 0)) {
      setValidationError('Please, provide a valid positive integer for size');
      return false;
    }

    if (product.type === PRODUCT_TYPES.BOOK && (isNaN(parseFloat(product.attribute)) || parseFloat(product.attribute) <= 0)) {
      setValidationError('Please, provide a valid positive number for weight');
      return false;
    }

    setError('');
    setValidationError('');
    return true;
  }, [product]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    let productToSubmit = { ...product };

    if (product.type === PRODUCT_TYPES.FURNITURE) {
      productToSubmit.attribute = JSON.stringify({
        height: product.height,
        width: product.width,
        length: product.length
      });
    } else if (product.type === PRODUCT_TYPES.DVD || product.type === PRODUCT_TYPES.BOOK) {
      productToSubmit.attribute = product.attribute || '0';
    }

    try {
      const isUnique = await checkSkuUniqueness(productToSubmit.sku);
      if (!isUnique) {
        setError('SKU must be unique. This SKU already exists.');
        return;
      }

      await addProduct({
        ...productToSubmit,
        price: parseFloat(productToSubmit.price),
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.response?.data?.error || 'Failed to add product. Please try again.');
    }
  }, [product, validateInputs, navigate]);

  const renderProductTypeFields = () => {
    switch (product.type) {
      case PRODUCT_TYPES.DVD:
        return (
          <div className="form-group">
            <label htmlFor="size">Size (MB)</label>
            <input id="size" name="attribute" type="number" value={product.attribute} onChange={handleChange} required />
            <p className="description">Please, provide size</p>
          </div>
        );
      case PRODUCT_TYPES.BOOK:
        return (
          <div className="form-group">
            <label htmlFor="weight">Weight (KG)</label>
            <input id="weight" name="attribute" type="number" value={product.attribute} onChange={handleChange} required />
            <p className="description">Please, provide weight</p>
          </div>
        );
      case PRODUCT_TYPES.FURNITURE:
        return (
          <>
            <div className="form-group">
              <label htmlFor="height">Height (CM)</label>
              <input id="height" name="height" type="number" value={product.height} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="width">Width (CM)</label>
              <input id="width" name="width" type="number" value={product.width} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="length">Length (CM)</label>
              <input id="length" name="length" type="number" value={product.length} onChange={handleChange} required />
            </div>
            <p className="description">Please, provide dimensions</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-product">
      <div className="header">
        <h1>Product Add</h1>
        <div className="actions">
          <button type="submit" form="product_form">Save</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </div>
      <div className="form-container">
        {error && <ErrorMessage message={error} />}
        {validationError && <ErrorMessage message={validationError} />}
        <form id="product_form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sku">SKU</label>
            <input id="sku" name="sku" value={product.sku} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input id="price" name="price" type="number" value={product.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="productType">Type Switcher</label>
            <select id="productType" name="type" value={product.type} onChange={handleChange} required>
              <option value="">Type Switcher</option>
              <option value="dvd">DVD</option>
              <option value="book">Book</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
          {renderProductTypeFields()}
        </form>
      </div>
    </div>
  );
}

export default AddProduct;