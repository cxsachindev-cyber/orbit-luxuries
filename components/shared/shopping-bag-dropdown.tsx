// components/shared/shopping-bag-dropdown.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/store-context";

interface ShoppingBagDropdownProps {
  onClose: () => void;
}

export function ShoppingBagDropdown({ onClose }: ShoppingBagDropdownProps) {
  const { cart, removeFromCart, updateQuantity, cartCount } = useStore();

  // Calculate total
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div
        className="absolute right-0 top-full mt-2 w-[380px] bg-white border border-gray-200 rounded-2xl shadow-2xl animate-fade-in z-50"
        onMouseLeave={onClose}
      >
        <div className="p-6 text-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
              MY BAG
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition-colors border-0 bg-transparent cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-700 text-sm font-medium">Your bag is empty</p>
            <p className="text-gray-400 text-xs mt-1">Let's fill it up shall we?</p>
          </div>

          <div className="space-y-2">
            <Link
              href="/catalog"
              onClick={onClose}
              className="block w-full py-3 bg-[#c9a84c] text-[#1a1a2e] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#d4b85c] transition-colors text-center"
            >
              SHOP GLOBAL LUXURY
            </Link>
            <Link
              href="/catalog?cat=indiluxe"
              onClick={onClose}
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors text-center"
            >
              SHOP INDILUXE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart has items
  return (
    <div
      className="absolute right-0 top-full mt-2 w-[420px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl animate-fade-in z-50 flex flex-col"
      onMouseLeave={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#c9a84c]" />
          MY BAG ({cartCount})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 transition-colors border-0 bg-transparent cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {cart.map((item) => (
          <div key={`${item.id}-${item.chosenSize}`} className="flex gap-3 bg-gray-50 rounded-xl p-3">
            {/* Product Image */}
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.brand}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Size: {item.chosenSize || "N/A"}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-gray-200 rounded text-xs text-gray-700 hover:bg-gray-300 transition-colors border-0 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs text-gray-900 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-gray-200 rounded text-xs text-gray-700 hover:bg-gray-300 transition-colors border-0 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
        </div>
        <Link
          href="/cart"
          onClick={onClose}
          className="block w-full py-3 bg-[#c9a84c] text-[#1a1a2e] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#d4b85c] transition-colors text-center flex items-center justify-center gap-2"
        >
          View Bag <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}