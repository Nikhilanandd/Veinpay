import { useRef, useCallback } from 'react';
import { FiUpload, FiCamera, FiX } from 'react-icons/fi';
import Webcam from 'react-webcam';

export default function ImageCapture({
  captureMode,
  setCaptureMode,
  imagePreview,
  onFileSelect,
  onCameraCapture,
  onClear,
  fileInputRef,
}) {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCameraCapture(imageSrc);
      }
    }
  }, [onCameraCapture]);

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setCaptureMode('upload')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            captureMode === 'upload'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <FiUpload className="h-4 w-4" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setCaptureMode('camera')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            captureMode === 'camera'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <FiCamera className="h-4 w-4" />
          <span>Camera</span>
        </button>
      </div>

      {/* Capture Area */}
      <div className="relative">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Captured vein"
              className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
              aria-label="Clear image"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ) : captureMode === 'upload' ? (
          <label className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, or BMP (max 10MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/bmp"
              onChange={onFileSelect}
            />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                className="w-full"
              />
            </div>
            <button
              type="button"
              onClick={capture}
              className="btn-primary"
            >
              <FiCamera className="h-4 w-4 mr-2" />
              Capture Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
