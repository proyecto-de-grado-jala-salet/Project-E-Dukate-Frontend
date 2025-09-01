import { toast } from "react-toastify";
import { ToastOptions } from "@/types/toast";

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const showNotification = (message: string, type: "success" | "error", options: Partial<ToastOptions> = {}) =>
  toast[type](message, { ...defaultOptions, position: "bottom-right",...options });