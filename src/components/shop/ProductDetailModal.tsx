import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  Star,
  ShieldCheck,
  Camera,
  ShoppingBag,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedProduct,
    prescriptions,
    addToCart,
    wishlist,
    toggleWishlist
  } = useApp();

  const product = selectedProduct;

  const [selectedLensType, setSelectedLensType] = useState<
    'frame-only' | 'standard-anti-glare' | 'blue-cut-digital' | 'photochromic-trans' | 'thin-high-index'
  >('blue-cut-digital');

  const [selectedRxType, setSelectedRxType] = useState<'doctor-issued' | 'manual' | 'zero-power'>('doctor-issued');
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  if (activeModal !== 'product-detail' || !product) return null;

  const lensOptions = [
    {
      id: 'frame-only',
      title: 'Frame Only (Demo Lenses)',
      price: 0,
      description: 'Zero optical correction. Ready for glazing at your local optical store.'
    },
    {
      id: 'standard-anti-glare',
      title: 'Standard Anti-Reflective (AR)',
      price: 600,
      description: 'Multi-layer anti-reflective coating reduces glare and halo effect for clear night driving.'
    },
    {
      id: 'blue-cut-digital',
      title: 'Blue-Cut Screen Defense Pro',
      price: 1200,
      description: 'Filters 99% harmful blue-violet light (415-455nm) from monitors, tablets, and phones.'
    },
    {
      id: 'photochromic-trans',
      title: 'Photochromic Transitions Smart',
      price: 1800,
      description: 'Clear crystal indoors, rapidly turns dark gray/brown outdoors under UV sunlight.'
    },
    {
      id: 'thin-high-index',
      title: 'Ultra-Thin High-Index 1.67',
      price: 2400,
      description: 'Up to 40% thinner and lighter for medium to high powers (above -3.00D or +2.50D).'
    }
  ];

  const currentLensPrice = lensOptions.find(l => l.id === selectedLensType)?.price || 0;
  const totalPrice = (product.price + currentLensPrice) * quantity;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      lensType: selectedLensType,
      lensPrice: currentLensPrice,
      prescriptionType: selectedRxType,
      prescriptionId: selectedRxType === 'doctor-issued' ? selectedRxId : undefined
    });
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Specifications Section */}
          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-white shadow-inner mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('virtual-tryon');
                  }}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-950 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span>Launch Virtual Try-On</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 font-heading">{product.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Material</span>
                  <span className="font-semibold text-slate-800">{product.frameMaterial}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Shape</span>
                  <span className="font-semibold text-slate-800">{product.frameShape}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Frame Size</span>
                  <span className="font-semibold text-slate-800">{product.frameSize} Fitting</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Color</span>
                  <span className="font-semibold text-slate-800">{product.color}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 1-Year Clinic Warranty
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="text-slate-600 hover:text-rose-500 font-medium cursor-pointer"
              >
                {isWishlisted ? '❤️ In Wishlist' : '🤍 Save to Wishlist'}
              </button>
            </div>
          </div>

          {/* Right Section: Lens & Prescription Customization */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Lens Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Precision Optical Lens Package
                </label>
                <div className="space-y-2">
                  {lensOptions.map(lens => (
                    <div
                      key={lens.id}
                      onClick={() => setSelectedLensType(lens.id as any)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                        selectedLensType === lens.id
                          ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{lens.title}</span>
                          {lens.id === 'blue-cut-digital' && (
                            <span className="text-[10px] bg-teal-600 text-white px-2 py-0.2 rounded-full font-bold">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{lens.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-teal-700">
                          {lens.price === 0 ? 'FREE' : `+₹${lens.price.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Attachment Section */}
              {selectedLensType !== 'frame-only' && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    2. Link Eye Prescription Values
                  </label>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRxType('doctor-issued')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedRxType === 'doctor-issued'
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Doctor Issued Rx
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRxType('manual')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedRxType === 'manual'
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Manual Power
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRxType('zero-power')}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedRxType === 'zero-power'
                          ? 'bg-teal-50 border-teal-500 text-teal-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Zero Power
                    </button>
                  </div>

                  {selectedRxType === 'doctor-issued' && (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                      {prescriptions.length > 0 ? (
                        <div>
                          <label className="block font-medium text-slate-600 mb-1">
                            Select Consultation Prescription:
                          </label>
                          <select
                            value={selectedRxId}
                            onChange={e => setSelectedRxId(e.target.value)}
                            className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono text-xs outline-hidden"
                          >
                            {prescriptions.map(rx => (
                              <option key={rx.id} value={rx.id}>
                                {rx.id} • {rx.doctorName} (OD: {rx.od.sph}, OS: {rx.os.sph}, PD: {rx.pd}mm)
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-teal-700 mt-1 font-medium">
                            ✓ Lab technicians will glaze precision lenses according to this clinical Rx.
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500">
                          No doctor prescriptions found. Book an eye appointment or choose manual power.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedRxType === 'manual' && (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <p className="font-semibold text-slate-700">Enter your SPH power:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Right Eye (OD)</span>
                          <input
                            type="text"
                            defaultValue="-1.50"
                            className="w-full px-2 py-1 bg-white rounded-lg border border-slate-300 font-mono text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Left Eye (OS)</span>
                          <input
                            type="text"
                            defaultValue="-1.50"
                            className="w-full px-2 py-1 bg-white rounded-lg border border-slate-300 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRxType === 'zero-power' && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl">
                      Plain anti-glare / computer protection lenses without refractive power.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Price Calculation & Add to Cart Footer */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Qty:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900 bg-white font-mono">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Bundle</span>
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add Custom Glasses to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
