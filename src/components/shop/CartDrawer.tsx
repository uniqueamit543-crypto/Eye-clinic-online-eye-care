import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal
  } = useApp();

  if (activeModal !== 'cart-drawer') return null;

  const handleProceedToCheckout = () => {
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-heading text-lg">Your Optical Cart</h3>
              <p className="text-xs text-slate-500">{cartTotal.itemCount} items ready for lens glazing</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-700">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our designer frames for Men, Women, and Kids with tailored prescription coatings.
              </p>
              <button
                onClick={() => {
                  setActiveModal(null);
                }}
                className="mt-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Browse Eyewear Catalogue
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3 relative"
              >
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-teal-700">
                          {item.product.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lens & Prescription summary badge */}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium border border-teal-200">
                        {item.lensType.replace(/-/g, ' ')}
                      </span>
                      {item.prescriptionId && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1 border border-indigo-200">
                          <FileText className="w-3 h-3" />
                          Rx: {item.prescriptionId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-bold font-mono bg-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      ₹{((item.product.price + item.lensPrice) * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (Frame: ₹{item.product.price} + Lens: ₹{item.lensPrice})
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Frames Subtotal</span>
                <span className="font-mono text-slate-800">₹{cartTotal.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Optical Lens Glazing</span>
                <span className="font-mono text-slate-800">₹{cartTotal.lensTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Academic Clinic Discount</span>
                <span className="font-mono">-₹300</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-mono text-slate-800">
                  ₹{Math.round((cartTotal.total - 300) * 0.18).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Final Order Amount</span>
                <span className="font-mono text-lg text-teal-700">
                  ₹{(cartTotal.total - 300 + Math.round((cartTotal.total - 300) * 0.18)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> UPI QR
              </span>
              <span>•</span>
              <span>Razorpay Gateway</span>
              <span>•</span>
              <span>Cash on Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
