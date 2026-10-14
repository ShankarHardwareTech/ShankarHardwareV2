import React from 'react';
import { CartItem } from '../types/store';
import { ProductVisual } from './ProductVisual';
import { X, Trash2, Plus, Minus, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToDelivery: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onProceedToDelivery
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#8c4b3f]" />
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                Delivery Order Items
              </h3>
              <p className="text-xs text-stone-500">
                {cartItems.length} {cartItems.length === 1 ? 'material' : 'materials'} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 stroke-[1.5]" />
              <div>
                <p className="font-semibold text-stone-800 text-sm">Your delivery order is empty</p>
                <p className="text-xs text-stone-500 mt-1">
                  Browse hardware, drip pipes, fencing wire, or power tools from the catalog and click "Add to Delivery Order".
                </p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-stone-50/70 border border-stone-200/80 rounded-xl flex gap-3 items-center justify-between"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200">
                  <ProductVisual product={item.product} className="w-full h-full" size="sm" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-medium">
                    ₹{item.product.price} {item.product.unit}
                  </div>
                  <div className="text-xs font-bold text-stone-900 font-mono mt-0.5">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs font-mono text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Materials Subtotal:</span>
              <span className="text-base font-bold text-stone-900 font-mono">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-stone-500">
              * Local transport fee is calculated in the next step based on chosen vehicle & village distance.
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onProceedToDelivery();
                }}
                className="w-full py-3 px-4 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Truck className="w-4 h-4" />
                <span>Proceed to Schedule Local Delivery</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2 text-stone-500 hover:text-stone-700 text-xs font-medium"
              >
                Clear all items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
