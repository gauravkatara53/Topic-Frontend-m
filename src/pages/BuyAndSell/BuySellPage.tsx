import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutGrid, Plus, ShoppingBag, Receipt } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footerd from "../Dashboard/Components/Footerd";
import MarketplaceTab from "./Product/Tab/marketplaceTab";
import MyListingsTab from "./Product/Tab/myListingTab";
import MyOrdersTab from "./Product/Tab/myOrder";
import TransactionsTab from "./Product/Tab/transactionTab";

const tabConfig = [
  { value: "marketplace", label: "Marketplace", icon: LayoutGrid },
  { value: "myListings", label: "My Listings", icon: Plus },
  { value: "myOrders", label: "My Orders", icon: ShoppingBag },
  { value: "transactions", label: "Transactions", icon: Receipt },
];

export default function BuySellPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current tab from URL query param or path
  const currentTab = location.pathname.split("/").pop();
  const defaultTab = tabConfig.some((t) => t.value === currentTab)
    ? currentTab
    : "marketplace";

  useEffect(() => {
    // Redirect to default tab if route is invalid
    if (!tabConfig.some((t) => t.value === currentTab)) {
      navigate("/buy-sell/marketplace", { replace: true });
    }
  }, [currentTab, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/buy-sell/${value}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-indigo-50 dark:bg-background px-4 sm:px-8 pb-12">
        <Tabs
          value={defaultTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="top-16 mt-4 z-10 bg-white overflow-x-auto flex gap-2 py-2 pl-48 sm:pl-0 sm:justify-center">
            {tabConfig.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1 whitespace-nowrap rounded-full border border-indigo-200 px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:bg-indigo-100"
              >
                <Icon className="w-4 h-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="marketplace">
            <MarketplaceTab />
          </TabsContent>

          <TabsContent value="myListings">
            <MyListingsTab />
          </TabsContent>

          <TabsContent value="myOrders">
            <MyOrdersTab />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footerd />
    </>
  );
}
