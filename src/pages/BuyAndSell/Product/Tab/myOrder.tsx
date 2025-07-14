import { useEffect, useState } from "react";
import { getMyListingsAsBuyerService } from "@/services/buySellService";
import { errorHandler } from "@/utils/errorHandler";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const { handleError } = errorHandler();

const PAGE_SIZE = 5;

interface Listing {
  id: string;
  title: string;
  images: string[];
  price: number;
  status: "sold" | "reserved" | string;
  soldAt?: string;
  reservedAt?: string;
  finalPrice?: string;
}

export default function MyOrdersTab() {
  const [orders, setOrders] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, statusFilter, minPrice, maxPrice, sortOption]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = user?.isLoggedIn;

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchOrders = async () => {
    try {
      if (!isLoggedIn) return; // ⛔ Prevent API call

      setLoading(true);
      const res: any = await getMyListingsAsBuyerService({
        page,
        limit: PAGE_SIZE,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sortOption || "latest",
      });

      const orders = res?.data;
      const totalPages = res?.errors?.totalPages;

      if (Array.isArray(orders) && typeof totalPages === "number") {
        setOrders(orders);
        setTotalPages(totalPages);
      } else {
        console.error("Invalid response structure", { res });
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [
    page,
    searchTerm,
    statusFilter,
    minPrice,
    maxPrice,
    sortOption,
    isLoggedIn,
  ]);

  return (
    <div className="w-full px-1 md:px-2 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

      {/* Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search title or order ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">All Status</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setMinPrice("");
              setMaxPrice("");
              setSortOption("latest");
              setPage(1);
            }}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded px-3 py-2 w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <>
          <div className="hidden md:grid grid-cols-12 bg-white p-3 font-semibold text-gray-600 border-b rounded-t-lg">
            <div className="col-span-1">Image</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Payment</div>
          </div>
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <OrderSkeletonRow key={idx} />
          ))}
        </>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img
            src="http://cdn-icons-png.flaticon.com/512/9961/9961218.png"
            alt="No products"
            className="w-40 h-40 mb-6 opacity-70"
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Order Found
          </h3>
          <p className="text-sm text-gray-500">
            You don’t have any order matching the selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-white p-3 font-semibold text-gray-600 border-b rounded-t-lg">
            <div className="col-span-1">Image</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Payment</div>
          </div>

          {/* Order List */}

          {orders.map((order) => {
            const isPaid = order.finalPrice !== null;
            return (
              <Link to={`/buy-sell/my/order/${order.id}`} key={order.id}>
                {/* Mobile View */}
                <div className="flex md:hidden bg-white p-4 rounded-lg mb-4 shadow-sm border">
                  <div className="w-1/3 pr-3">
                    <img
                      src={order.images?.[0] || "/placeholder.jpg"}
                      alt={order.title}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                  <div className="w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="text-gray-800 font-semibold">
                        {order.title}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Order ID: {order.id}
                      </div>
                      <div className="text-indigo-700 font-semibold mt-1">
                        ₹{order.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold capitalize ${
                          order.status === "sold"
                            ? "bg-green-100 text-green-700"
                            : order.status === "reserved"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`font-semibold ${
                          isPaid ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {isPaid ? "Payment Done" : "Payment Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 bg-white items-center p-4 border-b text-sm md:text-base">
                  <div className="col-span-1">
                    <img
                      src={order.images?.[0] || "/placeholder.jpg"}
                      alt={order.title}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </div>
                  <div className="col-span-4">
                    <div className="text-gray-800 font-medium">
                      {order.title}
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm">
                      Order ID: {order.id}
                    </div>
                  </div>
                  <div className="col-span-2 font-semibold text-indigo-700">
                    ₹{(order.finalPrice ?? order.price).toLocaleString()}
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        order.status === "sold"
                          ? "bg-green-100 text-green-700"
                          : order.status === "reserved"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span
                      className={`text-sm font-semibold ${
                        isPaid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isPaid ? "Payment Done" : "Payment Pending"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  page === idx + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function OrderSkeletonRow() {
  return (
    <div className="grid grid-cols-12 bg-white items-center p-4 border-b animate-pulse">
      <div className="col-span-1">
        <div className="w-12 h-12 bg-gray-200 rounded" />
      </div>
      <div className="col-span-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="col-span-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="col-span-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="col-span-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
