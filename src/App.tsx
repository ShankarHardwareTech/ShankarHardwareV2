import React, { useState, useEffect } from 'react';
import { STORE_INFO, INITIAL_PRODUCTS, SAMPLE_BOOKINGS, DELIVERY_ZONES } from './data/storeData';
import { Product, CartItem, DeliveryBooking, DeliveryZone } from './types/store';
import { InteractiveMap } from './components/InteractiveMap';
import { ProductCatalog } from './components/ProductCatalog';
import { DeliveryScheduler } from './components/DeliveryScheduler';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Github, 
  Menu, 
  X,
  ArrowRight,
  PackageCheck,
  CalendarCheck
} from 'lucide-react';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shankar_cart');
      return saved ? JSON.parse(saved) : [
        { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Jain Drip Lateral Pipe
        { product: INITIAL_PRODUCTS[1], quantity: 1 }  // 2-Inch Disc Filter
      ];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState<DeliveryBooking[]>(() => {
    try {
      const saved = localStorage.getItem('shankar_bookings');
      return saved ? JSON.parse(saved) : SAMPLE_BOOKINGS;
    } catch {
      return SAMPLE_BOOKINGS;
    }
  });

  const [activeTrackingBooking, setActiveTrackingBooking] = useState<DeliveryBooking | null>(() => {
    return SAMPLE_BOOKINGS[0];
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    villageArea: string;
    distanceKm: number;
    zone: DeliveryZone;
  }>({
    lat: 18.4811,
    lng: 74.5557,
    villageArea: 'Sonwadi Gavthan & Store Hub',
    distanceKm: 1.2,
    zone: DELIVERY_ZONES[0]
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGhModalOpen, setIsGhModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shankar_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shankar_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleBookingCreated = (newBooking: DeliveryBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    setActiveTrackingBooking(newBooking);

    // Scroll to interactive map for visual live tracking feedback
    const mapEl = document.getElementById('delivery-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Top Banner: Local Store Notice & Hours */}
      <div className="bg-stone-900 text-stone-200 text-[11px] px-4 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#bb948d]">AT Post Sonawadi, Maharashtra 413801</span>
            <span className="text-stone-600">·</span>
            <span className="text-amber-400 font-bold">★ 5.0 (1 Review)</span>
            <span className="text-stone-600">·</span>
            <span className="text-stone-300 font-medium">Open · Closes 5 pm</span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <a href={`tel:${STORE_INFO.phoneMain}`} className="hidden sm:inline hover:underline">
              Call Store: <strong className="text-white font-mono">{STORE_INFO.phoneMain}</strong>
            </a>
            <button
              onClick={() => setIsGhModalOpen(true)}
              className="text-[#bb948d] hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Pages Ready</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar: Compliant with Top Bar Contract (Strict 1-row, 3-zone contract) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark in display face */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg md:text-xl font-extrabold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-[#8c4b3f] text-white flex items-center justify-center text-sm font-bold shadow-xs">
              S
            </span>
            <span>Shankar Hardware & Agro</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links with subtle hover underlines */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
            <button
              onClick={() => scrollToSection('product-catalog')}
              className="hover:text-[#8c4b3f] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Materials Catalog
            </button>
            <button
              onClick={() => scrollToSection('delivery-map-section')}
              className="hover:text-[#8c4b3f] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Delivery Radar Map
            </button>
            <button
              onClick={() => scrollToSection('delivery-scheduler')}
              className="hover:text-[#8c4b3f] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Schedule Delivery
            </button>
            <button
              onClick={() => scrollToSection('contact-info')}
              className="hover:text-[#8c4b3f] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Store & Contact
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
              aria-label="View delivery cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Delivery Order</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 text-[11px] font-bold font-mono flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 text-sm font-semibold">
            <button
              onClick={() => scrollToSection('product-catalog')}
              className="block w-full text-left py-2 text-stone-700 hover:text-[#8c4b3f]"
            >
              Materials Catalog
            </button>
            <button
              onClick={() => scrollToSection('delivery-map-section')}
              className="block w-full text-left py-2 text-stone-700 hover:text-[#8c4b3f]"
            >
              Delivery Radar Map & Tracking
            </button>
            <button
              onClick={() => scrollToSection('delivery-scheduler')}
              className="block w-full text-left py-2 text-stone-700 hover:text-[#8c4b3f]"
            >
              Schedule Local Delivery
            </button>
            <button
              onClick={() => scrollToSection('contact-info')}
              className="block w-full text-left py-2 text-stone-700 hover:text-[#8c4b3f]"
            >
              Store Contact & Sonwadi Location
            </button>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Helpline: {STORE_INFO.phoneMain}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGhModalOpen(true);
                }}
                className="text-[#8c4b3f] font-bold"
              >
                GitHub Pages Guide
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-12">
        {/* Storefront Hero Section - background-color: #bb948d */}
        <section
          style={{ backgroundColor: '#bb948d' }}
          className="rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md relative overflow-hidden text-stone-950"
        >
          {/* Subtle textured grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#261816_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            {/* Google Maps Profile Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-100 bg-stone-900/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-stone-800 shadow-xs">
              <span className="text-amber-400 font-bold">★ 5.0 (1 Review)</span>
              <span aria-hidden="true">·</span>
              <span>Hardware store</span>
              <span aria-hidden="true">·</span>
              <span>Sonwadi 413801</span>
              <span aria-hidden="true">·</span>
              <span className="text-white font-mono">{STORE_INFO.plusCode}</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-[1.15] text-balance text-stone-950">
                Shankar Hardware and Agro Materials
              </h1>
              <div className="text-xl sm:text-2xl text-[#3d1e17] font-serif font-bold mt-1">
                शंकर हार्डवेयर एंड एग्रो मैटेरियल्स
              </div>
            </div>

            <p className="text-stone-900 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
              Located at AT Post Sonawadi TAL, Sonwadi, Maharashtra 413801. Providing premium drip irrigation hardware, disc filters, PVC/CPVC plumbing pipes, power tools, farm sprayers, high-tensile GI barbed wire fencing, and fast local delivery with our Delivery Bike (MH42AU5236) and transport fleet. Driver contact details shared on WhatsApp upon dispatch.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection('product-catalog')}
                className="px-6 py-3 bg-stone-950 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('delivery-scheduler')}
                className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-900 font-bold rounded-xl text-xs sm:text-sm transition-colors border border-stone-300 flex items-center gap-2 shadow-xs"
              >
                <Truck className="w-4 h-4 text-[#8c4b3f]" />
                <span>Schedule Local Delivery</span>
              </button>

              <a
                href="https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-transparent hover:bg-stone-900/10 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 underline underline-offset-4"
              >
                <Compass className="w-4 h-4" />
                <span>Google Maps Directions</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phoneMain}`}
                className="px-4 py-3 bg-transparent hover:bg-stone-900/10 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 font-mono"
              >
                <Phone className="w-4 h-4 text-[#8c4b3f]" />
                <span>{STORE_INFO.phoneMain}</span>
              </a>
            </div>
          </div>

          {/* 4-Item Proof Bar */}
          <div className="mt-8 pt-6 border-t border-stone-900/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-extrabold text-stone-950 text-sm">Delivery Bike (MH42AU5236)</div>
              <div className="text-[#3b1d16] font-semibold">Express village drop; driver number on WhatsApp</div>
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-stone-950 text-sm">Agro Hardware & Machinery</div>
              <div className="text-[#3b1d16] font-semibold">Drip lateral, disc filters, sprayers & fencing</div>
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-stone-950 text-sm">Open · Closes 5 pm</div>
              <div className="text-[#3b1d16] font-semibold">7 days a week · Sonwadi 413801</div>
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-stone-950 text-sm">30 km Delivery Radius</div>
              <div className="text-[#3b1d16] font-semibold">Sonwadi, Daund, Girim, Kurkumbh & Patas</div>
            </div>
          </div>
        </section>

        {/* Section 1: Product Catalog */}
        <section>
          <ProductCatalog
            products={products}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenScheduleDelivery={() => scrollToSection('delivery-scheduler')}
          />
        </section>

        {/* Section 2: Interactive Map for Location & Delivery Radius Tracking */}
        <section id="delivery-map-section" className="scroll-mt-20">
          <InteractiveMap
            selectedLocation={selectedLocation}
            onLocationSelect={(loc) => {
              setSelectedLocation(loc);
            }}
            activeBooking={activeTrackingBooking}
            interactiveMode="select_destination"
          />
        </section>

        {/* Section 3: Local Delivery Scheduler */}
        <section className="scroll-mt-20">
          <DeliveryScheduler
            cartItems={cartItems}
            selectedLocation={selectedLocation}
            onBookingCreated={handleBookingCreated}
            onClearCart={handleClearCart}
          />
        </section>

        {/* Section 4: Contact Details & Store Info */}
        <section className="scroll-mt-20">
          <ContactSection />
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onProceedToDelivery={() => scrollToSection('delivery-scheduler')}
      />

      {/* GitHub Pages Modal */}
      <GitHubPagesModal
        isOpen={isGhModalOpen}
        onClose={() => setIsGhModalOpen(false)}
      />

      {/* Floating Sticky Cart Indicator on Mobile */}
      {totalCartCount > 0 && (
        <div className="sm:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 py-3 px-4 bg-[#8c4b3f] text-white rounded-full shadow-xl border-2 border-white text-xs font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order ({totalCartCount})</span>
          </button>
        </div>
      )}

      {/* Clean Footer (Compliant with frontend-design: quiet copyright, site links, zero fake telemetry tickers) */}
      <footer className="mt-16 bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2 md:col-span-2">
              <div className="text-base font-bold text-white font-display">
                Shankar Hardware & Agro Materials
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-md">
                Serving the agricultural and construction community with genuine hardware, drip irrigation sets, farm sprayers, power tools, fencing wire, and dedicated village delivery dispatch.
              </p>
              <div className="pt-2 text-[11px] text-stone-500 font-mono">
                Proprietor: Shankar Pawar & Family · GSTIN: {STORE_INFO.gstin}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-white">Store Sections</div>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => scrollToSection('product-catalog')} className="hover:text-white transition-colors">Product Catalog</button></li>
                <li><button onClick={() => scrollToSection('delivery-map-section')} className="hover:text-white transition-colors">Interactive Delivery Radar</button></li>
                <li><button onClick={() => scrollToSection('delivery-scheduler')} className="hover:text-white transition-colors">Schedule Farm Delivery</button></li>
                <li><button onClick={() => scrollToSection('contact-info')} className="hover:text-white transition-colors">Contact Details & Map</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-white">Hosting & Technical</div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setIsGhModalOpen(true)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-[#bb948d]"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Pages Deployment Guide</span>
                  </button>
                </li>
                <li><span>Client-side SPA with Leaflet Maps</span></li>
                <li><span>Relative Vite Build: <code>base: './'</code></span></li>
                <li><span>Standalone OpenStreetMap</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>
              © {new Date().getFullYear()} Shankar Hardware and Agro Materials ({STORE_INFO.regionalName}).
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>AT Post Sonawadi TAL, Sonwadi, Maharashtra 413801</span>
              <span>·</span>
              <span className="font-mono text-[#bb948d]">Plus Code: {STORE_INFO.plusCode}</span>
              <span>·</span>
              <a href={`tel:${STORE_INFO.phoneMain}`} className="font-mono text-white hover:underline">{STORE_INFO.phoneMain}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
