import React, { useState, useEffect } from 'react';
import './ProductCard.scss';

function ProductCard({ product, onSelect, onDeselect }) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    console.log('Product in ProductCard:', product);
  }, [product]);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsSelected(checked);
    if (checked) {
      onSelect(product.sku);
    } else {
      onDeselect(product.sku);
    }
  };

  const renderProductSpecificAttribute = () => {
    const { type, attributes } = product;
    console.log('Rendering attributes for type:', type, 'Attributes:', attributes);
    switch (type.toLowerCase()) {
      case 'dvd':
        return <p>Size: {attributes.size} MB</p>;
      case 'book':
        return <p>Weight: {attributes.weight} KG</p>;
      case 'furniture':
        return <p>Dimension: {attributes.height}x{attributes.width}x{attributes.length}</p>;
      default:
        console.warn('Unknown product type:', type);
        return null;
    }
  };

  return (
    <div className="product-card">
      <input
        type="checkbox"
        className="delete-checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
      />
      <div className="product-info">
        <p>{product.sku}</p>
        <p>{product.name}</p>
        <p>${product.price}</p>
        {renderProductSpecificAttribute()}
      </div>
    </div>
  );
}

export default ProductCard;