import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Heart,
  ShoppingBag,
  Sparkles,
  Camera,
  Eye,
  Check,
  Star,
  Tag
} from 'lucide-react';
import { Product, ProductCategory, FrameShape } from '../../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
    setActiveModal
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const categories = ['All', 'Men', 'Women', 'Kids', 'Unisex', 'Sunglasses'];
  const shapes = ['All', 'Rectangular', 'Round', 'Aviator', 'Wayfarer', 'Cat-Eye', 'Geometric'];

  // Filtering
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || (selectedCategory === 'Unisex' && product.gender === 'Unisex');
    const matchesShape = selectedShape === 'All' || product.frameShape === selectedShape;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.frameMaterial.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = !onlyInStock || product.inStock;

    return matchesCategory && matchesShape && matchesSearch && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveModal('product-detail');
  };

  const handleOpenTryOn = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setActiveModal('virtual-tryon');
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      lensType: 'standard-anti-glare',
      lensPrice: 600,
      prescriptionType: 'doctor-issued'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-8 text-white overflow-hidden mb-10 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated Clinical Eyewear Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Designer Frames with Doctor Precision Glazing
          </h1>
          <p className="text-sm text-teal-100 mt-2 leading-relaxed">
            Order premium optical spectacles crafted from Beta Titanium and Italian Bio-Acetate. 
            Directly link your clinical optometrist prescription to cart with anti-glare & blue-light coatings.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveModal('ai-frame-finder')}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Frame Recommendation (Face-Shape Tool)</span>
            </button>
            <span className="text-xs text-teal-200">
              ⚡ Free Doorstep Delivery across Delhi NCR & India
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by brand, frame model..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Secondary Filter Row: Frame Shape, Max Price, In Stock */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Frame Shape:</span>
            {shapes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedShape(s)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  selectedShape === s
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Under ₹{maxPrice.toLocaleString()}</span>
              <input
                type="range"
                min={1500}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-teal-600 cursor-pointer"
              />
            </div>

            {/* In stock toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-slate-700 font-medium">In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 outline-hidden font-medium"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isWishlisted = wishlist.includes(product.id);
          const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

          return (
            <div
              key={product.id}
              onClick={() => handleOpenDetail(product)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Product Image Box */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {product.isBestSeller && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] tracking-wide uppercase shadow-xs">
                      Best Seller
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-xs">
                      New Arrival
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 transition shadow-xs cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Virtual Try-On Badge Button */}
                <button
                  type="button"
                  onClick={e => handleOpenTryOn(product, e)}
                  className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5 transition opacity-90 group-hover:opacity-100 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-300" />
                  <span>Virtual Try-On</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-teal-700 uppercase tracking-wider text-[10px]">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {product.frameShape}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {product.frameMaterial}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {discountPercent}% OFF • Free Lenses
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={e => handleQuickAdd(product, e)}
                    className="p-2 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white transition cursor-pointer"
                    title="Quick Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
