import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getListingProductsService } from "@/services/buySellService";

type YouMayLikeProps = {
  category: string;
  currentProductId: string;
};

// Skeleton loader component
function SkeletonCard() {
  return (
    <Card className="rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />

      <CardContent className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-5 w-16 bg-gray-300 rounded" />
      </CardContent>
    </Card>
  );
}

export default function YouMayLikeSection({
  category,
  currentProductId,
}: YouMayLikeProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getListingProductsService({
        category,
        status: "available",
      });

      const filtered = data
        .filter((item: any) => {
          const itemId = item.id || item._id;
          return itemId !== currentProductId;
        })
        .slice(0, 8); // ✅ Limit to 8 results

      setProducts(filtered);
    } catch (e) {
      console.error("❌ Failed to fetch listings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [category, currentProductId]);

  if (!products.length && !loading) return null;

  return (
    <section className="mt-12 max-w-6xl mx-auto px-0">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p: any, i) => (
              <Link to={`/buy-sell/product/${p?.id || "#"}`} key={p?.id || i}>
                <Card className="group relative rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition">
                  {p?.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 animate-pulse" />
                  )}

                  <button
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1 text-indigo-600 hover:text-pink-600"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert("Favourited!");
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <CardContent className="p-3 space-y-1">
                    <h3 className="font-medium text-indigo-900 text-sm line-clamp-1">
                      {p?.title || "Loading..."}
                    </h3>
                    <div className="text-indigo-700 font-bold text-sm">
                      ₹{p?.price?.toLocaleString?.() ?? "--"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-indigo-600">
                      <MapPin className="w-3 h-3" /> {p?.location || "--"}
                    </div>
                    {p?.condition && (
                      <Badge
                        className={cn(
                          "mt-1 text-xs",
                          p.condition === "new"
                            ? "bg-emerald-600"
                            : "bg-amber-600",
                          "text-white"
                        )}
                      >
                        {p.condition}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </section>
  );
}
