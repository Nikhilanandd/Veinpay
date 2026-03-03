import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing image upload and camera capture.
 */
export function useImageCapture() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [captureMode, setCaptureMode] = useState('upload'); // 'upload' | 'camera'
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or BMP)');
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10 MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleCameraCapture = useCallback((imageSrc) => {
    // Convert base64 data URL to File object
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        setImagePreview(imageSrc);
      });
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    imageFile,
    imagePreview,
    captureMode,
    setCaptureMode,
    handleFileSelect,
    handleCameraCapture,
    clearImage,
    fileInputRef,
  };
}
