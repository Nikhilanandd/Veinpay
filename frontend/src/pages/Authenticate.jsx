import { useState } from 'react';
import { FiLogIn, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ImageCapture from '../components/ImageCapture';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusMessage from '../components/StatusMessage';
import { useImageCapture } from '../hooks/useImageCapture';
import { authenticateUser } from '../services/api';

export default function Authenticate() {
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

    if (!imageFile) {
      setError('Please upload or capture a vein image');
      return;
    }

    setLoading(true);
    try {
      const response = await authenticateUser(imageFile);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authData = result?.data;
  const isAuthenticated = authData?.authenticated;
  const similarityPercent = authData ? (authData.similarity_score * 100).toFixed(1) : null;

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiLogIn className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="section-title mb-0">Authenticate</h1>
          </div>
          <p className="section-subtitle mt-2 mb-0">
            Verify your identity by uploading or capturing your vein pattern image.
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={loading || !imageFile}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <FiLogIn className="h-5 w-5 mr-2" />
                  Authenticate
                </>
              )}
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="mt-6">
              <LoadingSpinner message="Analyzing vein pattern — this may take a moment..." />
            </div>
          )}

          {/* Authentication Result */}
          {authData && (
            <div className="mt-6">
              {/* Result Banner */}
              <div
                className={`rounded-xl p-6 text-center ${
                  isAuthenticated
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'
                }`}
              >
                {isAuthenticated ? (
                  <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
                ) : (
                  <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
                )}
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isAuthenticated ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {isAuthenticated ? 'Authenticated' : 'Rejected'}
                </h2>
                <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated
                    ? `Welcome back, ${authData.matched_user}!`
                    : 'No matching vein pattern found.'}
                </p>
              </div>

              {/* Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Similarity Score</dt>
                    <dd className="font-semibold text-gray-900">{similarityPercent}%</dd>
                  </div>
                  {/* Score Bar */}
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isAuthenticated ? 'bg-green-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, similarityPercent))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span className="text-gray-500">Threshold: 75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  {authData.matched_user && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Matched User</dt>
                      <dd className="font-semibold text-gray-900">{authData.matched_user}</dd>
                    </div>
                  )}
                </dl>
              </div>
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
