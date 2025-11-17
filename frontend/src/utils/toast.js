import { toast } from 'react-toastify';

// Success notification
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Error notification
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Warning notification
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Info notification
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Loading notification (returns toast ID for dismissal)
export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    position: "top-right",
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
  });
};

// Update loading toast to success/error
export const updateToast = (toastId, type, message) => {
  toast.update(toastId, {
    render: message,
    type: type, // 'success', 'error', 'warning', 'info'
    isLoading: false,
    autoClose: type === 'error' ? 5000 : 3000,
  });
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
