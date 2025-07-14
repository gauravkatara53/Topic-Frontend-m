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

  const extractMainError = (html: string): string => {
    try {
      // Extract content inside <pre> tag
      const preMatch = html.match(/<pre>(.*?)<\/pre>/s);
      if (!preMatch || !preMatch[1]) return "An unexpected error occurred.";

      // Decode HTML and extract first line after "Error: "
      const text = preMatch[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&");

      const errorMatch = text.match(/Error:\s*(.+)/);
      return (
        errorMatch?.[1]?.split("\n")[0]?.trim() ||
        "An unexpected error occurred."
      );
    } catch {
      return "An unexpected error occurred.";
    }
  };

  const handleError = (error: any) => {
    console.error("Full Error Object:", error);

    let message = "An unexpected error occurred.";

    if (typeof error === "string") {
      message = error;
    } else if (error?.response?.data) {
      const data = error.response.data;

      if (typeof data === "string") {
        message = extractMainError(data) || data;
      } else if (typeof data === "object") {
        message = data.message || data.error || message;
      }
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.statusText) {
      message = error.response.statusText;
    }

    showError(message);
    console.error("Parsed Error Message:", message);
  };

  return { showError, showSuccess, handleError };
}

// Optional direct exports
export function showError(error: any) {
  toast.error(
    typeof error === "string" ? error : "An unexpected error occurred."
  );
  console.error("Error:", error);
}

export function showSuccess(message: string) {
  toast.success(message);
  console.log("Success:", message);
}
