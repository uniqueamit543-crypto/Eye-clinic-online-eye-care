import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Camera,
  RotateCw,
  Sparkles,
  ShoppingBag,
  Sliders,
  Check,
  Eye
} from 'lucide-react';

export const VirtualTryOnModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedProduct,
    products,
    setSelectedProduct,
    addToCart
  } = useApp();

  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [frameColor, setFrameColor] = useState('Default');
  const [lensTint, setLensTint] = useState<'Clear' | 'Blue-Block' | 'Transition Grey'>('Blue-Block');

  const models = [
    {
      id: 0,
      name: 'Aditya (Male, Oval Face)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 1,
      name: 'Priya (Female, Heart Face)',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 2,
      name: 'Rohan (Male, Square Face)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
    }
  ];

  if (activeModal !== 'virtual-tryon' || !selectedProduct) return null;

  const currentModel = models[selectedModel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-950 p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              AR Virtual Try-On Preview
            </span>
            <span className="text-teal-200 text-xs">• Section 1.4 Future Enhancement Prototype</span>
          </div>

          <h3 className="text-xl font-bold font-heading">{selectedProduct.name}</h3>
          <p className="text-xs text-teal-200 mt-1">
            Preview frame geometry, bridge fitment, and lens coatings on realistic face profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Virtual Camera View */}
          <div className="relative aspect-square sm:aspect-auto bg-slate-950 flex items-center justify-center overflow-hidden">
            <img
              src={currentModel.image}
              alt="Face Model"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Simulated Frame Overlay with precise optical placement */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-56 transform -translate-y-6 transition-all duration-300">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full drop-shadow-2xl mix-blend-multiply filter contrast-125"
                  style={{
                    filter: lensTint === 'Blue-Block' ? 'hue-rotate(180deg) drop-shadow(0 10px 15px rgba(0,0,0,0.5))' : 'none'
                  }}
                />
                {/* Visual pupil alignment crosshairs */}
                <div className="absolute top-1/2 left-1/4 w-3 h-3 border border-teal-400 rounded-full animate-ping opacity-60" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 border border-teal-400 rounded-full animate-ping opacity-60" />
              </div>
            </div>

            {/* Model switcher badge at bottom */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex items-center justify-between">
              <span>{currentModel.name}</span>
              <span className="text-[10px] text-teal-300 font-mono">PD: 63mm (Aligned)</span>
            </div>
          </div>

          {/* Controls & Options */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Select Face Model */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Switch Face Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2 rounded-xl border text-xs text-center transition cursor-pointer ${
                        selectedModel === m.id
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {m.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lens Coating Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Lens Coating Simulation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Clear', 'Blue-Block', 'Transition Grey'] as any[]).map(tint => (
                    <button
                      key={tint}
                      onClick={() => setLensTint(tint)}
                      className={`py-2 px-2 rounded-xl border text-[11px] text-center font-medium transition cursor-pointer ${
                        lensTint === tint
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {tint}
                    </button>
                  ))}
                </div>
              </div>

              {/* Try Other Frames from Catalogue */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Swap with Other Frames
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {products.slice(0, 5).map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`shrink-0 w-16 p-1 rounded-xl border transition cursor-pointer ${
                        selectedProduct.id === p.id
                          ? 'border-teal-600 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-10 object-cover rounded-lg" />
                      <span className="text-[9px] font-bold text-slate-700 block truncate mt-1">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Price & CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">{selectedProduct.name}</span>
                <span className="text-xl font-bold font-mono text-teal-700">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    product: selectedProduct,
                    quantity: 1,
                    lensType: 'blue-cut-digital',
                    lensPrice: 1200,
                    prescriptionType: 'doctor-issued'
                  });
                  setActiveModal('cart-drawer');
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy This Frame</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
