import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const addProduct = async (product) => {
  const response = await axios.post(`${API_URL}/products`, product, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteProducts = async (skus) => {
  await fetch(`${API_URL}/products`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skus: skus }),
  });
}

export const checkSkuUniqueness = async (sku) => {
  const response = await axios.get(`${API_URL}/products/check-sku/${sku}`);
  return response.data.isUnique;
};