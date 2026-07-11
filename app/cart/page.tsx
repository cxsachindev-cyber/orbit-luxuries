// app/cart/page.tsx
"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/store-context";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

// ✅ Add this constant at the top of the file
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, toggleCartItemSelection, authLoading } = useStore();

  // Calculate totals with safe checks
  const selectedItems = cart.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + price * quantity;
  }, 0);
  const itemCount = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  // Handle loading state
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </div>
    );
  }

  // Handle empty cart
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Your bag is empty</h2>
          <p className="text-gray-500 mb-6">Let's fill it up shall we?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-6 py-3 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2a2a4e] transition-colors"
            >
              SHOP GLOBAL LUXURY
            </Link>
            <Link
              href="/catalog?cat=indiluxe"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              SHOP INDILUXE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif mb-6 text-gray-900">My Bag ({itemCount} items)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          {cart.map((item) => {
            // Safe fallback values
            const itemPrice = item?.price || 0;
            const itemQuantity = item?.quantity || 1;
            const itemName = item?.name || "Product";
            const itemBrand = item?.brand || "";
            // ✅ Use the constant placeholder
            const itemImage = item?.image || PLACEHOLDER_IMAGE;
            const itemId = item?.id || "unknown";
            const itemSize = item?.chosenSize || "N/A";

            return (
              <div
                key={itemId}
                className={`flex gap-4 py-4 border-b border-gray-100 ${
                  item.selected ? "opacity-100" : "opacity-50"
                }`}
              >
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleCartItemSelection(itemId)}
                    className="w-4 h-4 accent-[#c9a84c] cursor-pointer"
                  />
                </div>

                {/* Image */}
                <div className="w-24 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-full h-full object-cover"
                    // ✅ Use the constant placeholder as fallback
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{itemName}</p>
                      {itemBrand && (
                        <p className="text-sm text-gray-500">{itemBrand}</p>
                      )}
                    </div>
                    <p className="font-bold text-gray-900">
                      ₹{itemPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">Size: {itemSize}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(itemId, itemQuantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-700" />
                      </button>
                      <span className="w-8 text-center text-gray-900">{itemQuantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="text-sm text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className={`w-full mt-4 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                selectedItems.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#1a1a2e] text-white hover:bg-[#2a2a4e]"
              }`}
              onClick={(e) => {
                if (selectedItems.length === 0) {
                  e.preventDefault();
                  alert("Please select at least one item to checkout");
                }
              }}
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}