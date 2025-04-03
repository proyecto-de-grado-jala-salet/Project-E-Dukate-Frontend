import { toast } from "react-toastify";
import { ToastOptions } from "../types/toast";

const defaultOptions: ToastOptions = {
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
};

export const showSuccessNotification = (message: string, options: Partial<ToastOptions> = {}) => {
  toast.success(message, {
    ...defaultOptions,
    position: "bottom-right",
    ...options,
  });
};

export const showErrorNotification = (message: string, options: Partial<ToastOptions> = {}) => {
  toast.error(message, {
    ...defaultOptions,
    position: "bottom-right",
    ...options,
  });
};