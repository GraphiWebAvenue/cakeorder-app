// src/api/api.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export const searchPostalCode = async (postalCode: string, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/postal_code.php`, {
      postal_code: postalCode,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📦 API Response:', response.data); // این خطو اضافه کن

    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.message);
    throw error;
  }
};

