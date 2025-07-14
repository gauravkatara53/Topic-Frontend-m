"use client";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, CheckCircle, ShieldCheck, X as CloseIcon } from "lucide-react";
import QRCode from "react-qr-code";
import Navbar from "@/components/Navbar";
import Footerd from "@/pages/Dashboard/Components/Footerd";
import YouMayLikeSection from "../Product/YouMayLikeSection";
import ReviewSection from "../Product/ReviewSection";
import { getProductDetailsService } from "@/services/buySellService";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function MyOrderProfile() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [reserved, setReserved] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [mTimeLeft, setMTimeLeft] = useState(24);
  const [timeLeft, setTimeLeft] = useState(120);
  const [paymentFailed, setPaymentFailed] = useState(false);

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

        const isReserved = res.status === "reserved";
        setReserved(isReserved);

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
          {/* LEFT */}
          <div className="space-y-6">
            <div className="max-w-3xl aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImg || undefined}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

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

            <div className="text-2xl font-semibold text-indigo-700 flex gap-2 items-center">
              {product.status === "sold" && product.finalPrice ? (
                <>
                  <span className="line-through text-gray-400">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span>₹{product.finalPrice?.toLocaleString()}</span>
                </>
              ) : (
                <>₹{product.price?.toLocaleString()}</>
              )}
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

          {/* RIGHT */}
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
            {product.status === "sold" && (
              <div className="mt-4 text-center">
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
            {product.status === "reserved" && (
              <>
                <DotLottieReact
                  src="https://lottie.host/21991446-c317-422d-88ea-6b0b78ed6cbb/GuzMJ8tnbh.lottie"
                  loop
                  autoplay
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    margin: "auto",
                    paddingTop: "10px",
                  }}
                />
                <p className="text-center text-sm text-gray-700">
                  Reservation active —{" "}
                  {mTimeLeft > 3600
                    ? `${Math.floor(mTimeLeft / 3600)} hr left`
                    : mTimeLeft > 60
                    ? `${Math.floor(mTimeLeft / 60)} min left`
                    : `${mTimeLeft} sec left`}
                </p>
              </>
            )}

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

            {reserved && !showQR && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-violet-600 text-white">
                    Pay Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Before Paying</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make sure to confirm the product with the seller before
                      proceeding to pay.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setShowQR(true);
                        setTimeLeft(120);
                        setPaymentFailed(false);
                      }}
                    >
                      Confirm & Show QR
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                {paymentFailed && (
                  <p className="text-red-600 text-sm mt-2">
                    ❌ Payment failed or timed out
                  </p>
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
