import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/api';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    
    // Clear the error for the changed field
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    // Clear type-specific errors when changing product type
    if (name === 'type') {
      setErrors(prevErrors => ({
        ...prevErrors,
        attribute: '',
        height: '',
        width: '',
        length: ''
      }));
    }
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors = {};

    if (!product.sku) newErrors.sku = 'SKU is required';
    if (!product.name) newErrors.name = 'Name is required';
    if (!product.price) newErrors.price = 'Price is required';
    if (!product.type) newErrors.type = 'Type is required';

    if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
      newErrors.price = 'Please provide a valid positive number for price';
    }

    if (product.type === PRODUCT_TYPES.DVD) {
      if (!product.attribute) {
        newErrors.attribute = 'Size is required for DVD';
      } else if (isNaN(parseInt(product.attribute)) || parseInt(product.attribute) <= 0) {
        newErrors.attribute = 'Please provide a valid positive integer for size';
      }
    }

    if (product.type === PRODUCT_TYPES.BOOK) {
      if (!product.attribute) {
        newErrors.attribute = 'Weight is required for Book';
      } else if (isNaN(parseFloat(product.attribute)) || parseFloat(product.attribute) <= 0) {
        newErrors.attribute = 'Please provide a valid positive number for weight';
      }
    }

    if (product.type === PRODUCT_TYPES.FURNITURE) {
      if (!product.height) newErrors.height = 'Height is required for Furniture';
      if (!product.width) newErrors.width = 'Width is required for Furniture';
      if (!product.length) newErrors.length = 'Length is required for Furniture';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    }

    try {
      await addProduct({
        ...productToSubmit,
        price: parseFloat(productToSubmit.price),
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.response?.data?.error || 'Failed to add product. Please try again.',
        skuError: true
      }));
    }
  }, [product, validateInputs, navigate]);

  const renderProductTypeFields = () => {
    switch (product.type) {
      case PRODUCT_TYPES.DVD:
        return (
          <div className="form-group">
            <label htmlFor="size">Size (MB)</label>
            <div className="input-wrapper">
              <input id="size" name="attribute" type="number" value={product.attribute} onChange={handleChange} required className={errors.attribute ? 'error' : product.attribute ? 'success' : ''} />
              {errors.attribute && (
                <span className="error-message">
                  <FaExclamationCircle /> {errors.attribute}
                </span>
              )}
              {!errors.attribute && product.attribute && (
                <span className="success-icon">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <p className="description">Please, provide size</p>
          </div>
        );
      case PRODUCT_TYPES.BOOK:
        return (
          <div className="form-group">
            <label htmlFor="weight">Weight (KG)</label>
            <div className="input-wrapper">
              <input id="weight" name="attribute" type="number" value={product.attribute} onChange={handleChange} required className={errors.attribute ? 'error' : product.attribute ? 'success' : ''} />
              {errors.attribute && (
                <span className="error-message">
                  <FaExclamationCircle /> {errors.attribute}
                </span>
              )}
              {!errors.attribute && product.attribute && (
                <span className="success-icon">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <p className="description">Please, provide weight</p>
          </div>
        );
      case PRODUCT_TYPES.FURNITURE:
        return (
          <>
            <div className="form-group">
              <label htmlFor="height">Height (CM)</label>
              <div className="input-wrapper">
                <input id="height" name="height" type="number" value={product.height} onChange={handleChange} required className={errors.height ? 'error' : product.height ? 'success' : ''} />
                {errors.height && (
                  <span className="error-message">
                    <FaExclamationCircle /> {errors.height}
                  </span>
                )}
                {!errors.height && product.height && (
                  <span className="success-icon">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="width">Width (CM)</label>
              <div className="input-wrapper">
                <input id="width" name="width" type="number" value={product.width} onChange={handleChange} required className={errors.width ? 'error' : product.width ? 'success' : ''} />
                {errors.width && (
                  <span className="error-message">
                    <FaExclamationCircle /> {errors.width}
                  </span>
                )}
                {!errors.width && product.width && (
                  <span className="success-icon">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="length">Length (CM)</label>
              <div className="input-wrapper">
                <input id="length" name="length" type="number" value={product.length} onChange={handleChange} required className={errors.length ? 'error' : product.length ? 'success' : ''} />
                {errors.length && (
                  <span className="error-message">
                    <FaExclamationCircle /> {errors.length}
                  </span>
                )}
                {!errors.length && product.length && (
                  <span className="success-icon">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>
            <p className="description">Please, provide dimensions</p>
          </>
        );
      default:
        return null;
    }
  };

  const renderInput = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={type}
          value={product[name]}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className={errors[name] || (name === 'sku' && errors.skuError) ? 'error' : product[name] ? 'success' : ''}
        />

        {!errors[name] && product[name] && !errors.skuError && (
          <span className="success-icon">
            <FaCheckCircle />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="add-product">
      <div className="header">
        <h1>Product Add</h1>
        <div className="actions">
          <button type="submit" form="product_form" onClick={handleSubmit}>Save</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </div>
      <div className="form-container">
        {errors.submit && <ErrorMessage message={errors.submit} />}
        <form id="product_form" onSubmit={handleSubmit}>
          {renderInput('sku', 'SKU')}
          {renderInput('name', 'Name')}
          {renderInput('price', 'Price ($)', 'number')}
          <div className="form-group">
            <label htmlFor="productType">Type Switcher</label>
            <select
              id="productType"
              name="type"
              value={product.type}
              onChange={handleChange}
              className={errors.type ? 'error' : product.type ? 'success' : ''}
            >
              <option value="">Type Switcher</option>
              <option value="dvd">DVD</option>
              <option value="book">Book</option>
              <option value="furniture">Furniture</option>
            </select>
            {errors.type && (
              <span className="error-message">
                <FaExclamationCircle /> {errors.type}
              </span>
            )}
          </div>
          {renderProductTypeFields()}
        </form>
      </div>
    </div>
  );
}

export default AddProduct;