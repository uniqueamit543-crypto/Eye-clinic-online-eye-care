import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sliders,
  ShoppingBag
} from 'lucide-react';
import { FrameShape } from '../../types';

export const AIFrameRecommendationModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    products,
    setSelectedProduct
  } = useApp();

  const [faceShape, setFaceShape] = useState<'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond'>('Round');
  const [screenHours, setScreenHours] = useState<'low' | 'moderate' | 'high'>('high');
  const [framePreference, setFramePreference] = useState<'lightweight' | 'bold' | 'classic'>('lightweight');

  if (activeModal !== 'ai-frame-finder') return null;

  // Recommendation logic based on optometry aesthetic principles
  let recommendedShape: FrameShape = 'Rectangular';
  let advice = '';

  if (faceShape === 'Round') {
    recommendedShape = 'Rectangular';
    advice = 'Rectangular & geometric angular frames create visual contrast, elongating softer facial contours and providing structure.';
  } else if (faceShape === 'Square') {
    recommendedShape = 'Round';
    advice = 'Curved circular and oval silhouettes soften strong jawlines and bring pleasant balance to prominent cheekbones.';
  } else if (faceShape === 'Oval') {
    recommendedShape = 'Wayfarer';
    advice = 'Oval face proportions are universally versatile! Classic wayfarers or wide geometric shapes maintain natural facial harmony.';
  } else if (faceShape === 'Heart') {
    recommendedShape = 'Cat-Eye';
    advice = 'Winged cat-eye or bottom-heavy wireframes balance a wider forehead with a tapering chin line.';
  } else {
    recommendedShape = 'Aviator';
    advice = 'Aviators or rimless frames accentuate your distinctive cheekbones and soften narrower temples.';
  }

  const matchingProducts = products.filter(
    p => p.frameShape === recommendedShape || (faceShape === 'Oval' && p.frameShape === 'Rectangular')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Face-Shape Diagnostic
            </span>
            <span className="text-teal-200 text-xs">• Optical Morphology Engine</span>
          </div>

          <h3 className="text-xl font-bold font-heading">AI Frame Recommendation</h3>
          <p className="text-xs text-teal-100 mt-1">
            Discover tailored optical eyewear matching your facial structure and daily visual demands.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Question 1: Face Shape */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. What is your dominant face shape?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['Round', 'Square', 'Oval', 'Heart', 'Diamond'] as const).map(shape => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setFaceShape(shape)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    faceShape === shape
                      ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">
                    {shape === 'Round' && '⚪'}
                    {shape === 'Square' && '⬛'}
                    {shape === 'Oval' && '🥚'}
                    {shape === 'Heart' && '💛'}
                    {shape === 'Diamond' && '💎'}
                  </span>
                  <span className="text-xs">{shape}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Daily Screen Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Average Daily Screen Time
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'low', label: 'Under 4 Hours (Casual)' },
                  { id: 'moderate', label: '4 - 8 Hours (Office Work)' },
                  { id: 'high', label: '8+ Hours (Developer/Power User)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScreenHours(opt.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      screenHours === opt.id
                        ? 'border-teal-600 bg-teal-50/70 font-semibold text-teal-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {screenHours === opt.id && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Frame Feel Preference
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'lightweight', label: 'Featherlight Titanium (Sub-10g)' },
                  { id: 'bold', label: 'Bold Italian Bio-Acetate' },
                  { id: 'classic', label: 'Vintage Wire Rims' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFramePreference(opt.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      framePreference === opt.id
                        ? 'border-teal-600 bg-teal-50/70 font-semibold text-teal-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {framePreference === opt.id && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Diagnostic Output */}
          <div className="bg-teal-50/80 rounded-2xl p-4 border border-teal-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Recommended Silhouette:
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-600 text-white font-bold text-xs font-heading">
                {recommendedShape} Frames
              </span>
              {screenHours === 'high' && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                  + Blue-Cut 420nm Lens
                </span>
              )}
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">{advice}</p>
          </div>

          {/* Top Matching Products */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Flattering Matches in EyeClinic Inventory:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {matchingProducts.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setActiveModal('product-detail');
                  }}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 bg-white transition cursor-pointer shadow-xs group"
                >
                  <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-xl mb-2" />
                  <span className="text-[10px] font-bold text-teal-700 block uppercase">{p.brand}</span>
                  <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-700">{p.name}</h5>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold font-mono text-slate-900">₹{p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-teal-600 font-semibold">View →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition cursor-pointer"
          >
            Close Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};
