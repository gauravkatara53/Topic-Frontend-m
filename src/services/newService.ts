import { getNews } from "@/api/newsApi";
import { errorHandler } from "@/utils/errorHandler";

const { handleError } = errorHandler();

export const fetchNews = async () => {
  try {
    const response = await getNews();

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    handleError(error);
    return [];
  }
};
