import { useEffect, useState } from "react";
import { getTxnrService } from "@/services/buySellService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Transaction {
  _id: string;
  listingId: {
    title: string;
    images: string[];
    price: number;
  };
  finalSellingPrice: number;
  soldAt: string;
  transactionId: string;
  credit: boolean;
  debit: boolean;
}

const PAGE_SIZE = 10;

export default function TransactionsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = user?.isLoggedIn;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchTxns = async () => {
      if (!isLoggedIn) return; // ⛔ Prevent API call if not logged in

      setLoading(true);
      try {
        const res = await getTxnrService({ page, limit: PAGE_SIZE });
        setTransactions(res.data);
        setTotalPages(res.errors.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTxns();
  }, [page, isLoggedIn]);
  return (
    <div className="w-full max-w-6xl mx-auto px-1 py-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        My Transactions
      </h2>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-xl shadow-sm space-y-2 flex items-center gap-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="w-full bg-white rounded-xl shadow-md p-4 sm:p-6  transition-shadow border flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-shrink-0">
                {t.credit ? (
                  <ArrowDownLeft className="text-green-600 w-6 h-6" />
                ) : (
                  <ArrowUpRight className="text-red-500 w-6 h-6" />
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between w-full">
                  <div>
                    <p className="font-medium text-gray-700 text-sm sm:text-base">
                      Transaction ID:{" "}
                      <span className="text-gray-900">{t.transactionId}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(t.soldAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        t.credit ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {t.credit ? "Credit" : "Debit"}
                    </span>
                    <span className="text-indigo-700 font-bold text-base">
                      {t.credit ? "+" : "-"}₹
                      {Math.abs(t.finalSellingPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
