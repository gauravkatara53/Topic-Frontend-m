import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getMyListingProductsService } from "@/services/buySellService";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  price: number;
  status: string;
  image: string;
  images?: string[];
};

export default function MyListingsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = user?.isLoggedIn;
  const sellerId = user?.id;

  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const perPage = 6;

  // ⛔ Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ✅ Fetch listings only if logged in
  useEffect(() => {
    if (!isLoggedIn || !sellerId) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const filters: any = {
          sellerId,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sort:
            sort === "price_asc"
              ? "price_asc"
              : sort === "price_desc"
              ? "price_desc"
              : sort === "newest"
              ? "latest"
              : undefined,
        };

        const res = await getMyListingProductsService(filters);
        setListings(res);
      } catch (err) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [sellerId, statusFilter, sort, isLoggedIn]);

  const totalPages = Math.ceil(listings.length / perPage);
  const paginated = listings.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">My Listings</h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Filter */}
          <Select
            onValueChange={(val) => {
              setSort(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="latest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-44 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img
            src="http://cdn-icons-png.flaticon.com/512/9961/9961218.png"
            alt="No products"
            className="w-40 h-40 mb-6 opacity-70"
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Listings Found
          </h3>
          <p className="text-sm text-gray-500">
            You don’t have any listings matching the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((p) => (
            <Link
              to={`/buy-sell/seller/product/${p.id}`}
              key={p.id}
              className="block"
            >
              <Card className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={p.images?.[0] || "/fallback.jpg"}
                  alt={p.title}
                  className="h-44 w-full object-cover"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <div className="text-indigo-700 font-bold text-sm">
                    ₹{p.price.toLocaleString()}
                  </div>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full capitalize ${
                      p.status === "available"
                        ? "bg-green-100 text-green-700"
                        : p.status === "sold"
                        ? "bg-red-100 text-red-700"
                        : p.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && listings.length > perPage && (
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
