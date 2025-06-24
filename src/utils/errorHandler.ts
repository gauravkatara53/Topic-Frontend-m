import { toast } from "react-toastify";

interface ErrorHandler {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  handleError: (error: any) => void;
}

export function errorHandler(): ErrorHandler {
  const showError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const extractMainError = (htmlError: string): string => {
    try {
      const match = htmlError.match(/<pre>Error: (.*?)<br>/);
      if (match && match[1]) {
        return match[1].trim();
      }
      return "An unexpected error occurred.";
    } catch {
      return "An unexpected error occurred.";
    }
  };

  const handleError = (error: any) => {
    let message = "An unexpected error occurred.";

    if (typeof error === "string") {
      // If it's directly a string
      message = extractMainError(error);
    } else if (error?.response?.data) {
      // If it's a backend response (common in Axios)
      message = extractMainError(error.response.data);
    } else if (error?.message) {
      // If it's a JS error object
      message = error.message;
    }

    showError(message);
    console.error("Error:", error);
  };

  return { showError, showSuccess, handleError };
}

export function showError(error: any) {
  // You can customize this to use a toast, alert, or other UI
  console.error("Error:", error);
}

export function showSuccess(message: string) {
  // You can customize this to use a toast, alert, or other UI
  console.log("Success:", message);
}
