import React from 'react';
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showLoading, 
  updateToast 
} from '../utils/toast';

const ToastExample = () => {
  const handleSuccessToast = () => {
    showSuccess('This is a success message!');
  };

  const handleErrorToast = () => {
    showError('This is an error message!');
  };

  const handleWarningToast = () => {
    showWarning('This is a warning message!');
  };

  const handleInfoToast = () => {
    showInfo('This is an info message!');
  };

  const handleLoadingToast = () => {
    const toastId = showLoading('Processing...');
    
    // Simulate async operation
    setTimeout(() => {
      updateToast(toastId, 'success', 'Operation completed successfully!');
    }, 2000);
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Toast Notification Examples</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSuccessToast}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Success Toast
        </button>
        <button
          onClick={handleErrorToast}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Error Toast
        </button>
        <button
          onClick={handleWarningToast}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
        >
          Warning Toast
        </button>
        <button
          onClick={handleInfoToast}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Info Toast
        </button>
        <button
          onClick={handleLoadingToast}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Loading Toast
        </button>
      </div>
    </div>
  );
};

export default ToastExample;
