import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import ImageCapture from '../components/ImageCapture';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusMessage from '../components/StatusMessage';
import { useImageCapture } from '../hooks/useImageCapture';
import { registerUser } from '../services/api';

export default function Register() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const {
    imageFile,
    imagePreview,
    captureMode,
    setCaptureMode,
    handleFileSelect,
    handleCameraCapture,
    clearImage,
    fileInputRef,
  } = useImageCapture();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation
    if (!userId.trim()) {
      setError('Please enter a User ID');
      return;
    }
    if (!imageFile) {
      setError('Please upload or capture a vein image');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(userId.trim(), imageFile);
      setResult(response);
      // Reset form
      setUserId('');
      clearImage();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiUserPlus className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="section-title mb-0">Register</h1>
          </div>
          <p className="section-subtitle mt-2 mb-0">
            Create your biometric profile by uploading or capturing your vein pattern image.
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter a unique user ID"
                className="input-field"
                maxLength={100}
                disabled={loading}
              />
            </div>

            {/* Image Capture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vein Image
              </label>
              <ImageCapture
                captureMode={captureMode}
                setCaptureMode={setCaptureMode}
                imagePreview={imagePreview}
                onFileSelect={handleFileSelect}
                onCameraCapture={handleCameraCapture}
                onClear={clearImage}
                fileInputRef={fileInputRef}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !userId.trim() || !imageFile}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FiUserPlus className="h-5 w-5 mr-2" />
                  Register User
                </>
              )}
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="mt-6">
              <LoadingSpinner message="Processing vein pattern — this may take a moment..." />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6">
              <StatusMessage
                type="success"
                message={result.message || 'Registration successful!'}
              />
              {result.data && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">User ID</dt>
                      <dd className="font-medium text-gray-900">{result.data.user_id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Embedding Size</dt>
                      <dd className="font-medium text-gray-900">{result.data.embedding_length} dimensions</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6">
              <StatusMessage type="error" message={error} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
