"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Plus, Search, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getListingProductsService } from "@/services/buySellService";

const categories = [
  "books",
  "electronics",
  "hostel",
  "furniture",
  "fashion",
  "stationery",
  "sports",
  "cycles",
  "misc",
  "other",
  "laptops",
  "mobiles",
  "earphones_headphones",
  "kitchen_appliances",
  "room_decor",
  "gaming_items",
  "project_components",
  "lab_coats_aprons",
  "college_uniforms",
  "bags_backpacks",
];

export default function MarketplaceTab() {
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 40000]);
  const [condition, setCondition] = useState<
    "All" | "new" | "like-new" | "used" | "heavily-used" | string
  >("All");
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getListingProductsService({
        search: searchText,
        category: selectedCategory ?? "",
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        status: "available",
      });

      // Optional local filters: condition + location
      const filtered = data.filter((item) => {
        const conditionMatch =
          condition === "All" ? true : item.condition === condition;

        const locationMatch = locationText
          ? item.location?.toLowerCase().includes(locationText.toLowerCase())
          : true;

        return conditionMatch && locationMatch;
      });

      setProducts(filtered);
    } catch (e) {
      console.error("❌ Failed to fetch listings", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchText, locationText, selectedCategory, priceRange, condition]);

  // Optional: local filter for condition
  const filteredProducts = products.filter((p) =>
    condition === "All" ? true : p.condition === condition
  );

  return (
    <>
      <section className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-black">
          Buy & Sell Everything Near You
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Find great deals on new and used items in your city.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-6 max-w-3xl mx-auto">
          <Input
            placeholder="Search items…"
            className="flex-1 bg-white shadow-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Input
            placeholder="Location"
            className="flex-1 bg-white shadow-sm"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            onClick={() => fetchData()}
          >
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
      </section>

      <section className="flex flex-wrap gap-3 justify-center mb-6">
        {categories.map((c) => (
          <Badge
            key={c}
            className={cn(
              "cursor-pointer px-3 py-1 rounded-full transition text-sm",
              selectedCategory === c
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-100"
            )}
            onClick={() =>
              setSelectedCategory(c === selectedCategory ? null : c)
            }
          >
            {c.replace(/_/g, " ")}
          </Badge>
        ))}
      </section>

      <Separator className="mb-6" />

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 w-full sm:w-[290px]">
          <h2 className="text-sm font-medium text-indigo-900 mb-2">
            Price range (₹)
          </h2>
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={0}
            max={100000}
            step={1000}
            onValueChange={(v) => setPriceRange(v as [number, number])}
          />
          <div className="mt-1 text-xs font-medium text-indigo-700">
            ₹{priceRange[0].toLocaleString()} – ₹
            {priceRange[1].toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {(["All", "new", "like-new", "used", "heavily-used"] as const).map(
            (c) => (
              <Badge
                key={c}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1 text-sm transition",
                  condition === c
                    ? "bg-violet-600 text-white"
                    : "bg-white text-violet-700 border border-violet-300 hover:bg-violet-100"
                )}
                onClick={() => setCondition(c)}
              >
                {c.replace("-", " ")}
              </Badge>
            )
          )}
        </div>
        <Link to={"/buy-sell/create/product"}>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white gap-2 px-4 py-2 rounded-full shadow-lg">
            <Plus className="w-5 h-5" />
            Create Listing
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white overflow-hidden shadow-sm animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-300 rounded w-20 mt-2" />
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center text-muted">
            <img
              src="http://cdn-icons-png.flaticon.com/512/9961/9961218.png"
              alt="No products"
              className="w-40 h-40 mb-6 opacity-70"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Listings Found
            </h3>
            <p className="text-sm text-gray-500">
              we don’t have any Product matching the selected filters.
            </p>
          </div>
        ) : (
          filteredProducts
            .slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )
            .map((p) => (
              <Link
                to={`/buy-sell/product/${p.id}`}
                key={p.id}
                className="group"
              >
                <Card className="relative rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={p.images?.[0] || "/placeholder.jpg"}
                    alt={p.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1 text-indigo-600 hover:text-pink-600">
                    <Heart className="w-4 h-4" />
                  </button>
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold text-indigo-900 line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="text-indigo-700 font-bold text-lg">
                      ₹{p.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-indigo-600">
                      <MapPin className="w-4 h-4" /> {p.location}
                    </div>
                    <Badge
                      className={cn(
                        "mt-2",
                        p.condition === "new"
                          ? "bg-emerald-600"
                          : p.condition === "like-new"
                          ? "bg-blue-500"
                          : p.condition === "used"
                          ? "bg-amber-500"
                          : "bg-rose-500",
                        "text-white"
                      )}
                    >
                      {p.condition}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
        )}
      </section>
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of{" "}
            {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
            }
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
