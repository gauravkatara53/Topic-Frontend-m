"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footerd from "@/pages/Dashboard/Components/Footerd";
import { createListingService } from "@/services/buySellService";

const categories = [
  "Mobile",
  "Electronics",
  "Vehicles",
  "Furniture",
  "Real Estate",
  "Fashion",
  "Books",
  "Services",
  "Other",
];

const conditions = ["New", "Like-new", "Used", "Refurbished"];

export default function CreateListingPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "",
    location: "",
    upiId: "",
    allowCash: true,
    whatsappNumber: "",
    images: [] as File[],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleChange("images", Array.from(files));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    try {
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("condition", form.condition.toLowerCase());
      formData.append("category", form.category.toLowerCase());
      formData.append("location", form.location);
      formData.append("upiId", form.upiId);
      formData.append("allowCash", JSON.stringify(form.allowCash));
      formData.append("whatsappNumber", form.whatsappNumber);

      form.images.forEach((img) => {
        formData.append("images", img);
      });

      await createListingService(formData);

      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        condition: "",
        location: "",
        upiId: "",
        allowCash: true,
        whatsappNumber: "",
        images: [],
      });
    } catch (err) {
      // already handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#f8f9fa] min-h-screen px-4 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Create a Listing
            </h1>
            <Button disabled={loading} className="bg-[#81d0c7] text-white">
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form inputs */}
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select onValueChange={(v) => handleChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select onValueChange={(v) => handleChange("condition", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond} value={cond.toLowerCase()}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    handleChange("whatsappNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>UPI ID</Label>
                <Input
                  value={form.upiId}
                  onChange={(e) => handleChange("upiId", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="allowCash"
                  type="checkbox"
                  checked={form.allowCash}
                  onChange={(e) => handleChange("allowCash", e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="allowCash" className="text-sm">
                  Accept Cash on Delivery
                </Label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Upload Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className="w-full aspect-square overflow-hidden rounded-md border"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#81d0c7] text-white px-6"
            >
              {loading ? "Posting..." : "Post Listing"}
            </Button>
          </div>
        </div>
      </main>
      <Footerd />
    </>
  );
}
