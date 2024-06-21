import { useState } from 'react';
import { convertImageToBase64 } from '../utils/imageUtils';

export const useImageHandler = () => {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const base64 = await convertImageToBase64(file);
        setImageBase64(base64);
        setError(null);
      } catch (err) {
        setError('Failed to convert image.');
        console.error('Error converting image:', err);
      }
    }
  };

  return {
    imageBase64,
    error,
    handleImageChange
  };
};