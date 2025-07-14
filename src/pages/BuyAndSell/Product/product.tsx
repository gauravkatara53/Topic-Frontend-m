"use client";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, CheckCircle, ShieldCheck, X as CloseIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { errorHandler } from "@/utils/errorHandler";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const { handleError } = errorHandler();
import Navbar from "@/components/Navbar";
import Footerd from "@/pages/Dashboard/Components/Footerd";
import YouMayLikeSection from "./YouMayLikeSection";
import ReviewSection from "./ReviewSection";
import {
  getProductDetailsService,
  markingAsReservedService,
} from "@/services/buySellService";
import { toast } from "react-toastify";

export default function ProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [reserved, setReserved] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [utr, setUtr] = useState("");
  const [mTimeLeft, setMTimeLeft] = useState(24);
  const [timeLeft, setTimeLeft] = useState(120);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const { isLoggedIn } = user;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductDetailsService(id);
        const productData = {
          ...res,
          seller: {
            name: res.contactName,
            email: res.contactEmail,
            whatsapp: res.whatsappNumber,
          },
        };

        setProduct(productData);
        setCurrentImg(productData?.images?.[0]);

        // ✅ Automatically set reserved state based on product status
        const isReserved = res.status === "reserved";
        setReserved(isReserved);

        // ✅ If reserved and reservationExpiresAt exists, start timer
        if (isReserved && res.reservationExpiresAt) {
          const expiresAt = new Date(res.reservationExpiresAt).getTime();
          const now = Date.now();
          const remainingSeconds = Math.floor((expiresAt - now) / 1000);
          setMTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
        }
      } catch (err) {
        console.error("❌ Failed to load product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!showQR || timeLeft === 0) {
      if (showQR && timeLeft === 0) setPaymentFailed(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showQR]);
  useEffect(() => {
    if (!reserved || mTimeLeft <= 0) return;

    const timer = setTimeout(() => setMTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [reserved, mTimeLeft]);

  // WhatsApp + UPI links (only if product is ready)
  const whatsappNumber = product?.seller?.whatsapp?.startsWith("+")
    ? product?.seller?.whatsapp?.replace(/\D/g, "")
    : "91" + product?.seller?.whatsapp;
  const waText = encodeURIComponent(
    `Hi ${product?.seller?.name}, I'm interested in your "${
      product?.title
    }" listed for ₹${product?.price?.toLocaleString()} on Buy & Sell. Is it still available?`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

  const upiURL = product
    ? `upi://pay?pa=${product.upiId}&pn=${encodeURIComponent(
        product.seller.name
      )}&am=${product.price}&cu=INR&tn=${encodeURIComponent(
        `Payment for ${product.title}`
      )}`
    : "";

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen px-4 sm:px-10 py-10 text-indigo-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 animate-pulse">
            {/* LEFT COLUMN SKELETON */}
            <div className="space-y-6">
              <div className="max-w-md aspect-[5/4] bg-gray-200 rounded-lg" />
              <div className="flex gap-3 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-24 bg-gray-200 rounded-md border"
                  />
                ))}
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mt-4" />
              <div className="h-6 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-20 bg-gray-300 rounded-full" />
                <div className="h-6 w-20 bg-gray-300 rounded-full" />
              </div>
              <div className="h-[1px] bg-gray-200 my-4" />
              <div className="h-5 bg-gray-300 w-1/4 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>

            {/* RIGHT COLUMN SKELETON */}
            <aside className="space-y-6 bg-indigo-50 p-6 rounded-xl shadow-sm h-fit">
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="h-4 bg-gray-300 w-3/4 rounded" />
              <div className="h-10 bg-gray-300 w-full rounded" />
              <div className="h-10 bg-gray-200 w-full rounded" />
            </aside>
          </div>
        </main>
        <Footerd />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-screen px-4 sm:px-10 py-10 text-indigo-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Main image */}
            <div className="max-w-3xl aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImg || undefined}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 flex-wrap">
              {product.images?.map((img: string) => (
                <button
                  key={img}
                  onClick={() => setCurrentImg(img)}
                  className={`h-16 w-24 rounded-md overflow-hidden border-2 ${
                    img === currentImg
                      ? "border-violet-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover aspect-[2.5/1.5]"
                  />
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
            <div className="text-indigo-700 text-2xl font-semibold">
              ₹{product.price?.toLocaleString()}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              {product.location}
            </div>

            <div className="flex gap-2 mt-3">
              <Badge className="capitalize bg-emerald-600 text-white">
                {product.condition}
              </Badge>
              <Badge className="capitalize bg-blue-600 text-white">
                {product.status}
              </Badge>
            </div>

            <Separator className="my-4" />

            <h2 className="font-semibold text-lg mb-1">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6 bg-indigo-50 p-6 rounded-xl shadow-sm h-fit">
            <div>
              <h2 className="text-lg font-semibold">Seller Info</h2>
              <p className="font-medium text-black mt-1">
                <CheckCircle className="inline-block w-4 h-4 text-green-500 mr-1" />
                {product.seller.name}
              </p>
              <p className="text-sm text-gray-600">
                Email: {product.seller.email}
              </p>
              <p className="text-sm text-gray-600">
                WhatsApp: {product.seller.whatsapp}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              <ShieldCheck className="inline w-4 h-4 mr-1 text-indigo-500" />
              Verified Seller · UPI: <strong>{product.upiId}</strong>
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                Contact Seller
              </Button>
            </a>

            {!reserved && (
              <Button
                variant="outline"
                className="w-full border-violet-600 text-violet-700 hover:bg-violet-50"
                disabled={product.status !== "available" || isReserving}
                onClick={async () => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  try {
                    setIsReserving(true);
                    const res = await markingAsReservedService(product.id);
                    if (!res) return;

                    toast.success("Reserved successfully!");
                    setReserved(true);
                    setMTimeLeft(24 * 60 * 60);
                  } catch (err) {
                    handleError(err);
                  } finally {
                    setIsReserving(false);
                  }
                }}
              >
                {isReserving ? "Reserving..." : "Reserve Now"}
              </Button>
            )}

            {reserved && (
              <>
                <div className="relative w-full group">
                  <div className="w-full text-center bg-gray-100 border border-gray-300 rounded-md p-2">
                    {mTimeLeft > 0 ? (
                      <span className="text-sm text-gray-800">
                        ⏳ Reservation active —{" "}
                        {mTimeLeft > 3600
                          ? `${Math.floor(mTimeLeft / 3600)} hr left`
                          : mTimeLeft > 60
                          ? `${Math.floor(mTimeLeft / 60)} min left`
                          : `${mTimeLeft} sec left`}
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ❌ Reservation expired
                      </span>
                    )}
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full w-max bg-white text-gray-800 border border-gray-200 shadow-md rounded-md px-3 py-1.5 text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
                    Contact seller within 24 hr or they'll reach out to you.
                  </div>
                </div>
                {!showQR && (
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => {
                      setShowQR(true);
                      setTimeLeft(120);
                      setPaymentFailed(false);
                    }}
                  >
                    Pay Now
                  </Button>
                )}
              </>
            )}

            {showQR && (
              <div className="space-y-3 text-center">
                <div className="relative inline-block">
                  <QRCode
                    value={upiURL}
                    size={180}
                    title="UPI Payment QR Code"
                  />
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full p-1"
                  >
                    <CloseIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <p className="text-sm">
                  Scan to pay ₹{product.price?.toLocaleString()}
                </p>

                <Badge className="bg-amber-500 text-white">
                  Expires in {timeLeft} sec
                </Badge>

                {paymentFailed ? (
                  <p className="text-red-600 text-sm mt-2">
                    ❌ Payment failed or timed out
                  </p>
                ) : (
                  <div className="space-y-2 mt-4">
                    <input
                      type="text"
                      placeholder="Enter UTR / Transaction ID"
                      disabled={timeLeft === 0}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                    />
                    <Button
                      disabled={timeLeft === 0 || !utr.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        alert("Transaction ID submitted!");
                      }}
                    >
                      Submit UTR
                    </Button>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        <YouMayLikeSection
          category={product.category}
          currentProductId={product.id}
        />

        <ReviewSection />
      </main>
      <Footerd />
    </>
  );
}
