"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  ShieldCheck,
  Pencil,
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // ⬅️ NEW
import Navbar from "@/components/Navbar";
import Footerd from "@/pages/Dashboard/Components/Footerd";
import { toast } from "react-toastify";
import {
  addImageService,
  deleteImageService,
  getProductDetailsServiceAsSeller,
  markedAsSoldService,
  updateProductDataService,
} from "@/services/buySellService";
import { useParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { userData } from "@/api/buySellApi";

export default function SellerProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [soldData, setSoldData] = useState({
    finalSellingPrice: "",
    paymentMethod: "upi",
    transactionId: "",
  });
  const [buyer, setBuyer] = useState<any | null>(null);

  /* ------------------------------------------------------------------ */
  /*  Simulated fetch                                                   */
  /* ------------------------------------------------------------------ */
  const fetchProduct = async () => {
    if (!id) return;
    try {
      const data = await getProductDetailsServiceAsSeller(id);
      setProduct(data);
      setCurrentImg(data.images?.[0] || null);
      setEditData(data); // Set for editing use
      if (data.status === "sold" || data.status === "reserved") {
        if (data.reservedBy) {
          try {
            const res = await userData(data.reservedBy);
            setBuyer(res?.data);
          } catch (err) {
            console.error("Failed to fetch buyer info");
          }
        }
      }
    } catch (err) {
      toast.error("Failed to fetch product");
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */

  const handleMarkSold = async () => {
    if (!soldData.finalSellingPrice || !soldData.transactionId) {
      toast.error("Enter price and transaction ID");
      return;
    }

    try {
      const response = await markedAsSoldService(
        id!,
        Number(soldData.finalSellingPrice),
        soldData.paymentMethod,
        soldData.transactionId
      );
      console.log(response);
      if (response) {
        toast.success("Product marked as sold!");

        await fetchProduct();

        // Optional: reset form
        setSoldData({
          finalSellingPrice: "",
          paymentMethod: "upi",
          transactionId: "",
        });
      }
    } catch (err) {
      toast.error("Failed to mark as sold");
    }
  };

  /* ------------------------------------------------------------------ */
  /*  updating code                                         */
  /* ------------------------------------------------------------------ */
  const [isLoading, setIsLoading] = useState(false); // for loader on update
  const categoryOptions = ["laptops", "mobiles", "books", "electronics"];
  const conditionOptions = ["new", "like-new", "used"];
  const statusOptions = ["available", "pending", "reserved"]; // ⛔️ exclude 'sold'

  const handleUpdate = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const updated = await updateProductDataService(id, {
        title: editData.title,
        description: editData.description,
        price: Number(editData.price),
        category: editData.category,
        condition: editData.condition,
        location: editData.location,
        upiId: editData.upiId,
        allowCash: editData.allowCash,
        whatsappNumber: editData.whatsappNumber,
        status: editData.status,
      });

      setProduct(updated); // set new data
      setIsEditing(false);
      toast.success("Listing updated successfully!");
    } catch (error) {
      toast.error("Failed to update listing");
    } finally {
      setIsLoading(false);
    }
  };

  // update images
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setImageLoading(true);
    try {
      const imageUrl = await addImageService(id, file);
      setProduct((prev: any) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      toast.success("Image added successfully");
    } catch (err) {
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!id) return;
    setImageLoading(true);
    setSelectedImg(imageUrl);
    try {
      await deleteImageService(id, imageUrl);
      setProduct((prev: any) => ({
        ...prev,
        images: prev.images.filter((img: string) => img !== imageUrl),
      }));
      if (currentImg === imageUrl) {
        setCurrentImg(product.images?.[0] || null);
      }
      toast.success("Image deleted");
    } catch (err) {
    } finally {
      setImageLoading(false);
      setSelectedImg(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Loading skeleton                                                  */
  /* ------------------------------------------------------------------ */
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen px-4 sm:px-10 py-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
            {/* Left column skeleton */}
            <div className="space-y-6">
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-20 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            {/* Right column skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </main>
        <Footerd />
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Main UI                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen px-4 sm:px-10 py-10 text-indigo-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          {/* ---------------- LEFT SECTION ---------------- */}
          <div className="space-y-6">
            {/* ↓↓↓  Image height reduced (aspect‑[4/3]) ↓↓↓ */}
            <div className="aspect-[2.5/1.5] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImg || undefined}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {product.images?.map((img: string) => (
                <div key={img} className="relative group">
                  <button
                    onClick={() => setCurrentImg(img)}
                    className={`h-14 w-20 rounded-md overflow-hidden border-2 ${
                      img === currentImg
                        ? "border-violet-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                  {/* 🗑️ Delete button */}
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded-full hidden group-hover:block"
                    disabled={imageLoading}
                  >
                    {imageLoading && selectedImg === img ? "..." : "×"}
                  </button>
                </div>
              ))}

              {/* ➕ Add new image */}
              <label className="cursor-pointer h-14 w-20 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  hidden
                />
                {imageLoading ? "⏳" : "+"}
              </label>
            </div>

            {/* Editable or read‑only fields (unchanged) */}
            {isEditing ? (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8 border border-indigo-100">
                  <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
                    Edit Product
                  </h2>

                  {/* Product Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <Input
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        placeholder="Enter product title"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        value={editData.category}
                        onChange={(e) =>
                          setEditData({ ...editData, category: e.target.value })
                        }
                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: e.target.value })
                        }
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Condition
                      </label>
                      <select
                        value={editData.condition}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            condition: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Condition</option>
                        {conditionOptions.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond.charAt(0).toUpperCase() + cond.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <Input
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  {/* Description (full width) */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Seller Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        UPI ID
                      </label>
                      <Input
                        value={editData.upiId}
                        onChange={(e) =>
                          setEditData({ ...editData, upiId: e.target.value })
                        }
                        placeholder="e.g. example@upi"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        WhatsApp Number
                      </label>
                      <Input
                        value={editData.whatsappNumber}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Allow Cash
                      </label>
                      <select
                        value={editData.allowCash ? "true" : "false"}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            allowCash: e.target.value === "true",
                          })
                        }
                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="true">Cash: Allowed</option>
                        <option value="false">Cash: Not Allowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({ ...editData, status: e.target.value })
                        }
                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleUpdate}
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-base font-medium rounded-md"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <div className="text-indigo-700 text-2xl font-semibold">
                  ₹{product.price?.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="hover:bg-yellow-500 hover:text-yellow-100 capitalize bg-yellow-100 text-yellow-800 rounded-md border-red text-sm px-3 py-1 shadow-sm">
                    {product.category}
                  </Badge>
                  <Badge className="hover:bg-emerald-500 hover:text-emerald-100 capitalize bg-emerald-100 text-emerald-800 rounded-md border-red text-sm px-3 py-1 shadow-sm">
                    {product.condition}
                  </Badge>
                  <Badge className="hover:bg-blue-500 hover:text-blue-100 capitalize bg-blue-100 text-blue-800 rounded-md border-red text-sm px-3 py-1 shadow-sm">
                    {product.status}
                  </Badge>
                  {product.allowCash ? (
                    <Badge className=" hover:bg-gray-500 hover:text-gray-100 capitalize bg-gray-100 text-gray-800 rounded-md border-red text-sm px-3 py-1 shadow-sm">
                      cash : Allowed
                    </Badge>
                  ) : (
                    <Badge className="hover:bg-red-500 hover:text-red-100 capitalize bg-red-100 text-red-800 rounded-md border-red text-sm px-3 py-1 shadow-sm">
                      cash : Not Allowed
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />
                <p className="text-gray-700">{product.description}</p>
              </>
            )}

            <Button
              variant="ghost"
              className="flex gap-2 items-center text-violet-700"
              onClick={() => setIsEditing((v) => !v)}
            >
              <Pencil className="w-4 h-4" />
              {isEditing ? "Cancel Editing" : "Edit Listing"}
            </Button>
          </div>

          {/* ---------------- RIGHT SECTION ---------------- */}
          <aside className="space-y-6 bg-indigo-50 p-6 rounded-xl shadow-sm h-fit">
            <div>
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              <Badge
                className={`capitalize ${
                  product.status === "sold"
                    ? "bg-green-600"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {product.status}
              </Badge>
            </div>

            {product.status !== "sold" && (
              <>
                <h2 className="font-semibold text-lg mt-4 flex gap-2 items-center">
                  <ShoppingCart className="w-4 h-4" />
                  Mark as Sold
                </h2>
                <Input
                  type="number"
                  placeholder="Final Selling Price"
                  value={soldData.finalSellingPrice}
                  onChange={(e) =>
                    setSoldData({
                      ...soldData,
                      finalSellingPrice: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Transaction ID / UTR"
                  value={soldData.transactionId}
                  onChange={(e) =>
                    setSoldData({
                      ...soldData,
                      transactionId: e.target.value,
                    })
                  }
                />
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleMarkSold}
                >
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  Confirm as Sold
                </Button>
              </>
            )}
            {product.status === "sold" && (
              <div className="mt-4">
                <DotLottieReact
                  src="https://lottie.host/85a7f043-3181-44d9-b835-a8f8cf396628/ownEIFgL6F.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", maxWidth: "300px", margin: "auto" }}
                />
                <p className="text-sm text-center text-green-700 mt-2">
                  Sold on {new Date(product.soldAt).toLocaleString()}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-600 mt-4">
              <ShieldCheck className="inline w-4 h-4 mr-1 text-indigo-600" />
              UPI ID: <strong>{product.upiId}</strong>
            </div>
            <div className="text-xs text-gray-600">
              Seller WhatsApp: {product.whatsappNumber}
            </div>
            {(product.status === "sold" || product.status === "reserved") &&
              buyer && (
                <div className="bg-gradient-to-br from-white via-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-md border border-indigo-200 mt-6">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    {product.status === "sold"
                      ? "Buyer Information"
                      : "Reserved By"}
                  </h2>

                  <ul className="space-y-3 text-sm text-gray-800">
                    <li className="flex items-start gap-3">
                      <span className="font-medium w-24 text-gray-600">
                        Name:
                      </span>
                      <span className="text-indigo-900">{buyer.name}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium w-24 text-gray-600">
                        Email:
                      </span>
                      <span>{buyer.email}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium w-24 text-gray-600">
                        Phone:
                      </span>
                      <span>{buyer.phone}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium w-24 text-gray-600">
                        College ID:
                      </span>
                      <span>{buyer.collegeId || "N/A"}</span>
                    </li>
                  </ul>

                  {/* WhatsApp Button with Pre-Filled Message */}
                  <div className="mt-6 text-right">
                    <a
                      href={`https://wa.me/91${
                        buyer.phone
                      }?text=${encodeURIComponent(
                        `Hi ${buyer.name},\n\nYou have reserved the product "${
                          product.title
                        }" priced at ₹${product.price?.toLocaleString()}.\nReservation Date: ${new Date(
                          product.reservedAt || product.soldAt || Date.now()
                        ).toLocaleString()}\n\nPlease feel free to reach out if you have any questions.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-full transition duration-200 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12a11.94 11.94 0 001.64 6.06L0 24l6.25-1.64A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12a11.94 11.94 0 00-3.48-8.52zm-2.2 15.64c-.55.55-2.98 1.07-4.2 1.14-1.15.06-2.62.02-5.48-2.17-2.86-2.18-3.42-4.39-3.55-5.15-.13-.75-.16-1.62.09-2.3.25-.67 1.17-1.09 1.52-1.19.36-.1.68-.19.96.06.28.25 1.09 1.37 1.19 1.53.1.17.17.37.05.6-.12.22-.18.36-.34.57-.17.2-.37.44-.53.59-.15.15-.31.3-.14.59.17.29.77 1.26 1.64 2.04 1.13 1.03 2.08 1.36 2.36 1.5.28.15.45.12.62-.07.17-.2.71-.84.9-1.13.2-.29.39-.24.66-.14.27.09 1.72.82 2.01.97.3.15.49.22.56.34.08.12.08.71-.47 1.26z" />
                      </svg>
                      Message
                    </a>
                  </div>
                </div>
              )}
          </aside>
        </div>
      </main>
      <Footerd />
    </>
  );
}
