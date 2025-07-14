// src/api/buySellApi.ts
import { apiService } from "./apiService";

export const getListingProducts = ({
  search = "",
  maxPrice = "",
  category = "",
  status = "",
  minPrice = "",
  sort = "",
  sellerId = "",
}: {
  search?: string;
  maxPrice?: number | string;
  category?: string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  sellerId?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (maxPrice !== "") queryParams.append("maxPrice", String(maxPrice));
  if (category) queryParams.append("category", category);
  if (status) queryParams.append("status", status);
  if (minPrice !== "") queryParams.append("minPrice", String(minPrice));
  if (sort !== "") queryParams.append("sort", String(sort));
  if (sellerId) queryParams.append("sellerId", sellerId);

  return apiService.get(`/buyAndSell/listing?${queryParams.toString()}`);
};

export const getMyListingProducts = ({
  search = "",
  maxPrice = "",
  category = "",
  status = "",
  minPrice = "",
  sort = "",
  sellerId = "",
}: {
  search?: string;
  maxPrice?: number | string;
  category?: string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  sellerId?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (maxPrice !== "") queryParams.append("maxPrice", String(maxPrice));
  if (category) queryParams.append("category", category);
  if (status) queryParams.append("status", status);
  if (minPrice !== "") queryParams.append("minPrice", String(minPrice));
  if (sort !== "") queryParams.append("sort", String(sort));
  if (sellerId) queryParams.append("sellerId", sellerId);

  return apiService.get(`/buyAndSell/my/listing?${queryParams.toString()}`);
};
export const getProductById = (id: string) => {
  return apiService.get(`/buyAndSell/get-product/${id}`);
};
//seller api
export const getProductByIdAsSeller = (id: string) => {
  return apiService.get(`/buyAndSell/get-product/seller/${id}`);
};

export const markingAsReserved = (id: string) => {
  return apiService.post(`/buyAndSell/reservation-listing/${id}`, {}); // ✅ send empty object
};

export const updateProductData = (id: string, data: Record<string, any>) => {
  return apiService.patch(`/buyAndSell/update/product/${id}`, data);
};

export const addImage = (id: string, data: Record<string, any>) => {
  return apiService.post(`/buyAndSell/listing/image/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteImage = (id: string, data: Record<string, any>) => {
  return apiService.post(`buyAndSell/listing/image/delete/${id}`, data);
};

export const markedAsSold = (id: string, data: Record<string, any>) => {
  return apiService.post(`/buyAndSell/marking-sold/${id}`, data);
};

//  get user
export const userData = (id: string) => {
  return apiService.get(`/auth/getUser/${id}`);
};

// my order

export const getMyListingsAsBuyer = ({
  search = "",
  maxPrice = "",
  status = "",
  minPrice = "",
  sort = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  maxPrice?: number | string;
  status?: string;
  minPrice?: number | string;
  sort?: number | string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (maxPrice !== "") queryParams.append("maxPrice", String(maxPrice));
  if (status) queryParams.append("status", status);
  if (minPrice !== "") queryParams.append("minPrice", String(minPrice));
  if (sort !== "") queryParams.append("sort", String(sort));
  if (page) queryParams.append("page", String(page));
  if (limit) queryParams.append("limit", String(limit));

  return apiService.get(
    `/buyAndSell/listing/my/order?${queryParams.toString()}`
  );
};

// my txn
export const myTxn = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));

  return apiService.get(`/buyAndSell/all/my/txn?${queryParams.toString()}`);
};

// create listing

export const createListing = (formData: FormData) => {
  return apiService.post("/buyAndSell/create-listing", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
