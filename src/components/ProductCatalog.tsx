import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, CartItem } from '../types/store';
import { ProductVisual } from './ProductVisual';
import { Search, Filter, ShoppingBag, Eye, Star, Check, Plus, Minus, Share2, Info, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

interface ProductCatalogProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onOpenScheduleDelivery: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenScheduleDelivery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Categories list
  const categories: { id: ProductCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Materials', count: products.length },
    { id: 'agro_hardware', label: 'Agro Hardware & Spares', count: products.filter(p => p.category === 'agro_hardware').length },
    { id: 'irrigation', label: 'Drip & Sprinklers', count: products.filter(p => p.category === 'irrigation').length },
    { id: 'power_tools', label: 'Power Tools & Sprayers', count: products.filter(p => p.category === 'power_tools').length },
    { id: 'hardware_plumbing', label: 'Pipes & Fittings', count: products.filter(p => p.category === 'hardware_plumbing').length },
    { id: 'farm_tools', label: 'Fencing Wire & Hand Tools', count: products.filter(p => p.category === 'farm_tools').length },
    { id: 'construction_fasteners', label: 'Cement & Fasteners', count: products.filter(p => p.category === 'construction_fasteners').length }
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (inStockOnly && !item.inStock) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchRegional = item.regionalName?.toLowerCase().includes(q) || false;
          const matchBrand = item.brand.toLowerCase().includes(q);
          const matchSubcat = item.subcategory.toLowerCase().includes(q);
          const matchDesc = item.shortDescription.toLowerCase().includes(q);
          return matchName || matchRegional || matchBrand || matchSubcat || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default popular
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const getCartQuantity = (productId: string) => {
    const found = cartItems.find(i => i.product.id === productId);
    return found ? found.quantity : 0;
  };

  const getProductWhatsAppInquiry = (product: Product) => {
    const text = `Namaste Shankar Hardware & Agro (Sonwadi),\nI would like to inquire about:\n*${product.name}*\nPrice: ₹${product.price} (${product.unit})\nIs this available for immediate local delivery?`;
    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="product-catalog" className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#8c4b3f] uppercase tracking-wider">
              Wholesale & Retail Counter
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 font-display mt-0.5">
              Hardware & Agro Materials Catalog
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              ISI certified pipes, drip irrigation hardware, power tools, farm sprayers, high-tensile GI barbed wire & fasteners.
            </p>
          </div>

          {/* Search box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search drip, spray lance, drill, barbed wire..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#8c4b3f] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Sub-toolbar: In stock toggle & sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#8c4b3f] focus:ring-[#8c4b3f] border-stone-300"
              />
              <span>In-Stock Ready for Same-Day Dispatch</span>
            </label>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#8c4b3f]"
            >
              <option value="popular">Most Popular in Farming</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Farmer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-600 font-medium">No materials found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-3 px-4 py-2 bg-[#8c4b3f] text-white rounded-lg text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentQty = getCartQuantity(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Header */}
                  <div className="h-52 w-full relative bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                    <ProductVisual product={product} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" />
                    
                    {product.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white bg-[#8c4b3f]/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs">
                        {product.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-stone-700 text-xs px-2.5 py-1.5 rounded-lg shadow-sm border border-stone-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Specifications</span>
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    {/* Unboxed clean metadata (zero-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span className="font-semibold text-[#8c4b3f] uppercase tracking-wider">{product.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.subcategory}</span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    {product.regionalName && (
                      <p className="text-xs text-stone-600 mt-1 font-medium font-serif italic line-clamp-1">
                        {product.regionalName}
                      </p>
                    )}

                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Stock and rating unboxed text */}
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                      <span className={product.inStock ? "text-[#8c4b3f] font-semibold" : "text-red-600 font-medium"}>
                        {product.inStock ? `In Stock (${product.stockCount} ${product.unit.split(' ')[0]})` : 'Out of Stock'}
                      </span>
                      <div className="flex items-center gap-1 text-stone-700 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-mono">{product.rating}</span>
                        <span className="text-stone-400">({product.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price & Actions */}
                <div className="p-5 pt-0">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xl font-extrabold text-stone-900 font-mono tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-xs text-stone-400 line-through font-mono">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      <span className="block text-[11px] text-stone-500">
                        {product.unit}
                      </span>
                    </div>

                    <a
                      href={getProductWhatsAppInquiry(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-[#8c4b3f] hover:text-[#6e2e24] flex items-center gap-1"
                      title="Direct WhatsApp Inquiry"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Add to Delivery Stepper or Button */}
                  {currentQty === 0 ? (
                    <button
                      onClick={() => onAddToCart(product, product.minOrderQty || 1)}
                      className="w-full py-2.5 px-4 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Delivery Order</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#bb948d]/15 border border-[#bb948d]/40 rounded-xl p-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateCartQuantity(product.id, currentQty - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs text-[#5c241b] font-mono px-1">
                          {currentQty} in order
                        </span>
                        <button
                          onClick={() => onUpdateCartQuantity(product.id, currentQty + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={onOpenScheduleDelivery}
                        className="text-[11px] font-bold text-[#8c4b3f] hover:underline pr-2"
                      >
                        Schedule Delivery →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Specifications Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#8c4b3f] uppercase tracking-wider">
                  {quickViewProduct.brand} · {quickViewProduct.subcategory}
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
                  {quickViewProduct.name}
                </h3>
                {quickViewProduct.regionalName && (
                  <p className="text-xs text-stone-600 font-serif italic mt-0.5">
                    {quickViewProduct.regionalName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-stone-400 hover:text-stone-600 p-1 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-56 rounded-xl overflow-hidden bg-stone-100">
                <ProductVisual product={quickViewProduct} className="w-full h-full" size="lg" />
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-stone-900 font-mono">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500 ml-2">
                      ({quickViewProduct.unit})
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-900">Recommended Farm Applications:</div>
                  <ul className="text-xs text-stone-600 space-y-1">
                    {quickViewProduct.applications.map((app, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#8c4b3f] shrink-0" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Technical Specifications & Standards
              </h4>
              <div className="rounded-xl border border-stone-200 overflow-hidden text-xs">
                {quickViewProduct.specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 ${
                      i % 2 === 0 ? 'bg-stone-50/70' : 'bg-white'
                    }`}
                  >
                    <span className="text-stone-600 font-medium">{spec.label}</span>
                    <span className="text-stone-900 font-semibold font-mono">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={getProductWhatsAppInquiry(quickViewProduct)}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
              >
                <Share2 className="w-4 h-4 text-[#8c4b3f]" />
                <span>Ask Store via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  onAddToCart(quickViewProduct, quickViewProduct.minOrderQty || 1);
                  setQuickViewProduct(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Delivery Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
