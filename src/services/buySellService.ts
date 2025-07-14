import {
  addImage,
  createListing,
  deleteImage,
  getListingProducts,
  getMyListingProducts,
  getMyListingsAsBuyer,
  getProductById,
  getProductByIdAsSeller,
  markedAsSold,
  markingAsReserved,
  myTxn,
  updateProductData,
} from "@/api/buySellApi";
import { errorHandler, showSuccess } from "@/utils/errorHandler";

const { handleError } = errorHandler();

export const getListingProductsService = async (filters: {
  search?: string;
  maxPrice?: number | string;
  category?: string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  sellerId?: string;
}) => {
  try {
    const response = await getListingProducts(filters);
    const product = response?.data;

    if (!Array.isArray(product)) {
      console.warn("⚠️ `product` not found or not an array:", product);
      throw new Error("Invalid product response structure");
    }

    return product;
  } catch (error) {
    handleError(error);
    console.error("❌ Failed to fetch product", error);
    throw error;
  }
};

export const getMyListingProductsService = async (filters: {
  search?: string;
  maxPrice?: number | string;
  category?: string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  sellerId?: string;
}) => {
  try {
    const response = await getMyListingProducts(filters);
    const product = response?.data;

    if (!Array.isArray(product)) {
      console.warn("⚠️ `product` not found or not an array:", product);
      throw new Error("Invalid product response structure");
    }

    return product;
  } catch (error) {
    handleError(error);
    console.error("❌ Failed to fetch product", error);
    throw error;
  }
};

export const getProductDetailsService = async (id: string) => {
  try {
    const response = await getProductById(id);
    return response?.data; // product object
  } catch (error) {
    handleError(error);
    throw error;
  }
};
// seller api

export const getProductDetailsServiceAsSeller = async (id: string) => {
  try {
    const response = await getProductByIdAsSeller(id);
    return response?.data; // product object
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const markingAsReservedService = async (id: string) => {
  try {
    const response = await markingAsReserved(id);
    return response?.data;
  } catch (error) {
    console.error("❌ Reserve API error:", error);
    handleError(error);
    throw error;
  }
};

export const updateProductDataService = async (
  id: string,
  data: Record<string, any>
) => {
  try {
    const response = await updateProductData(id, data);
    return response?.data;
  } catch (error) {
    console.error("❌ Update product error:", error);
    handleError(error);
    throw error;
  }
};

export const addImageService = async (id: string, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await addImage(id, formData);
    return response.data.imageUrl;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteImageService = async (id: string, imageUrl: string) => {
  try {
    const response = await deleteImage(id, { imageUrl });
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const markedAsSoldService = async (
  id: string,
  finalSellingPrice: number,
  paymentMethod: string,
  transactionId: string
) => {
  try {
    const response = await markedAsSold(id, {
      finalSellingPrice,
      paymentMethod,
      transactionId,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getMyListingsAsBuyerService = async (filters: {
  search?: string;
  maxPrice?: number | string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await getMyListingsAsBuyer(filters);
    const product = response?.data;

    if (!Array.isArray(product)) {
      console.warn("⚠️ `product` not found or not an array:", product);
      throw new Error("Invalid product response structure");
    }

    const totalPages = response?.errors?.totalPages || 1;

    return {
      data: product,
      errors: {
        totalPages,
      },
    };
  } catch (error) {
    handleError(error);
    console.error("❌ Failed to fetch listings for buyer", error);
    throw error;
  }
};

export const getTxnrService = async (filters: {
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await myTxn(filters);
    const txn = response?.data;
    const totalPages = response?.errors?.totalPages || 1;

    if (!Array.isArray(txn)) {
      console.warn("⚠️ `txn` not found or not an array:", txn);
      throw new Error("Invalid txn response structure");
    }

    return {
      data: txn,
      errors: {
        totalPages,
      },
    };
  } catch (error) {
    handleError(error);
    console.error("❌ Failed to fetch transactions", error);
    throw error;
  }
};

export const createListingService = async (formData: FormData) => {
  try {
    const response = await createListing(formData);
    showSuccess(response.data?.message || "Listing created successfully");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // rethrow for optional additional handling
  }
};
