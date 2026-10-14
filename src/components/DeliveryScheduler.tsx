import React, { useState } from 'react';
import { CartItem, DeliveryBooking, DeliveryZone, VehicleOption, VehicleType } from '../types/store';
import { VEHICLE_OPTIONS, DELIVERY_ZONES, STORE_INFO } from '../data/storeData';
import { Truck, Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle, FileText, Share2, Printer, ChevronRight } from 'lucide-react';

interface DeliverySchedulerProps {
  cartItems: CartItem[];
  selectedLocation?: {
    lat: number;
    lng: number;
    villageArea: string;
    distanceKm: number;
    zone: DeliveryZone;
  };
  onBookingCreated: (booking: DeliveryBooking) => void;
  onClearCart?: () => void;
}

export const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({
  cartItems,
  selectedLocation,
  onBookingCreated,
  onClearCart
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [villageArea, setVillageArea] = useState(selectedLocation?.villageArea || 'Sonwadi Gavthan & Farms');
  const [landmarkAddress, setLandmarkAddress] = useState('');
  const [pincode, setPincode] = useState('413801');
  
  // Date selection: default to today or tomorrow
  const todayStr = new Date().toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('Morning Batch (07:30 AM - 10:30 AM)');
  
  // Vehicle selection: Default to Delivery Bike MH42AU5236
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [notes, setNotes] = useState('');
  const [customItemsText, setCustomItemsText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'upi_on_delivery'>('cash_on_delivery');
  
  // Form status & created booking modal
  const [confirmedBooking, setConfirmedBooking] = useState<DeliveryBooking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const distanceKm = selectedLocation?.distanceKm || 3.5;
  const currentZone = selectedLocation?.zone || DELIVERY_ZONES[0];

  // Calculate items total
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate dynamic vehicle delivery charge based on vehicle and distance
  const currentVehicleObj = VEHICLE_OPTIONS.find(v => v.type === selectedVehicle) || VEHICLE_OPTIONS[0];
  const calculatedDeliveryFee = Math.round(currentVehicleObj.baseCharge + (distanceKm * currentVehicleObj.perKmRate));
  const grandTotal = cartTotal + calculatedDeliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Please enter your full customer / farmer name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile contact number.');
      return;
    }
    if (!villageArea.trim()) {
      setFormError('Please specify the village or delivery destination area.');
      return;
    }
    if (!landmarkAddress.trim()) {
      setFormError('Please provide a landmark, Gat number, or farm gate directions for the driver.');
      return;
    }

    const orderNumber = `SHK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prepare items list
    let finalItems = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      unit: item.product.unit
    }));

    if (finalItems.length === 0 && customItemsText.trim()) {
      finalItems = [{
        productId: 'custom-notes',
        productName: customItemsText.trim(),
        quantity: 1,
        unitPrice: 0,
        unit: 'Consignment'
      }];
    }

    const assignedVehicleNumber = selectedVehicle === 'bike' 
      ? 'MH42AU5236' 
      : selectedVehicle === 'tata_ace'
      ? 'MH 42 T 5821'
      : selectedVehicle === 'pickup'
      ? 'MH 42 B 9012'
      : selectedVehicle === 'tractor'
      ? 'MH 42 AA 1099'
      : 'MH 42 T 2144';

    const newBooking: DeliveryBooking = {
      id: `booking-${Date.now()}`,
      orderNumber,
      customerName,
      phone,
      alternatePhone,
      villageArea,
      landmarkAddress,
      pincode,
      deliveryDate,
      timeSlot,
      vehicleType: selectedVehicle,
      notes,
      items: finalItems,
      itemsTotal: cartTotal,
      distanceKm,
      deliveryFee: calculatedDeliveryFee,
      grandTotal,
      paymentMethod,
      status: 'confirmed',
      driverName: selectedVehicle === 'bike' ? 'Express Courier' : 'Dispatch Driver',
      driverPhone: 'Number will be shared on WhatsApp',
      vehicleNumber: assignedVehicleNumber,
      destinationCoords: {
        lat: selectedLocation?.lat || 18.4811,
        lng: selectedLocation?.lng || 74.5557
      },
      createdAt: 'Just now'
    };

    setConfirmedBooking(newBooking);
    onBookingCreated(newBooking);
    if (onClearCart) onClearCart();
  };

  const getWhatsAppBookingText = (booking: DeliveryBooking) => {
    const itemsList = booking.items.length > 0
      ? booking.items.map(i => `• ${i.productName} (${i.quantity} ${i.unit})`).join('\n')
      : `• ${notes || 'Assorted hardware and agro materials'}`;

    const text = `*NEW DELIVERY BOOKING - SHANKAR HARDWARE & AGRO (SONWADI)*\n` +
      `Order ID: ${booking.orderNumber}\n` +
      `Customer: ${booking.customerName}\n` +
      `Phone: ${booking.phone}\n` +
      `Village/Area: ${booking.villageArea}\n` +
      `Landmark: ${booking.landmarkAddress}\n` +
      `Assigned Vehicle: ${booking.vehicleNumber} (${booking.vehicleType.toUpperCase()})\n` +
      `*Driver Contact:* Number of driver will be shared on WhatsApp upon dispatch.\n` +
      `Delivery Date: ${booking.deliveryDate} (${booking.timeSlot})\n` +
      `Estimated Distance: ${booking.distanceKm} km\n` +
      `Delivery Fee: ₹${booking.deliveryFee}\n` +
      `Total Payable: ₹${booking.grandTotal} (${booking.paymentMethod.replace(/_/g, ' ').toUpperCase()})\n\n` +
      `*Items Ordered:*\n${itemsList}\n\n` +
      `Notes: ${booking.notes || 'None'}\n` +
      `_Please confirm dispatch schedule._`;

    return encodeURIComponent(text);
  };

  return (
    <div id="delivery-scheduler" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="p-5 md:p-8 bg-stone-50 border-b border-stone-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8c4b3f] bg-[#bb948d]/20 px-2.5 py-1 rounded-md mb-2">
            <Truck className="w-3.5 h-3.5 text-[#8c4b3f]" />
            <span>Farm & Construction Site Transport</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Local Delivery Scheduling
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Fast, reliable transport directly to your farmland, barn, canal path, or construction site. Pick your preferred vehicle and delivery window below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8">
        {formError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Step 1: Customer & Address Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-full bg-[#8c4b3f] text-white text-xs flex items-center justify-center font-mono">
              1
            </span>
            <span>Customer Details & Delivery Destination</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer / Farmer Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Patil / Balasaheb Pawar"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Mobile Number (for driver coordination) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 070587 29696"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Village, Grampanchayat, or Town Area *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={villageArea}
                  onChange={e => setVillageArea(e.target.value)}
                  placeholder="e.g. Sonwadi Gavthan, Girim, Daund"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Tip: Selecting a pin on the Interactive Map above auto-syncs this village and exact road distance.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Landmark, Gat No., Farm Road Directions *
              </label>
              <input
                type="text"
                required
                value={landmarkAddress}
                onChange={e => setLandmarkAddress(e.target.value)}
                placeholder="e.g. Gat No. 84, Behind Primary School, Near Canal Bridge"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Choose Transport Vehicle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2 text-base font-bold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-[#8c4b3f] text-white text-xs flex items-center justify-center font-mono">
                2
              </span>
              <span>Select Transport Vehicle for Your Load</span>
            </div>
            <span className="text-xs font-medium text-stone-500">
              Calculated for ~{distanceKm} km trip
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {VEHICLE_OPTIONS.map((veh) => {
              const feeForVeh = Math.round(veh.baseCharge + (distanceKm * veh.perKmRate));
              const isSelected = selectedVehicle === veh.type;

              return (
                <div
                  key={veh.type}
                  onClick={() => setSelectedVehicle(veh.type)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#8c4b3f] bg-[#bb948d]/15 shadow-xs ring-1 ring-[#8c4b3f]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">
                        {veh.type === 'bike' ? '🏍️' : veh.type === 'rickshaw' ? '🛺' : veh.type === 'tata_ace' ? '🚚' : veh.type === 'pickup' ? '🛻' : '🚜'}
                      </span>
                      <span className="text-xs font-bold text-[#5c241b] bg-[#bb948d]/25 px-2 py-0.5 rounded font-mono">
                        ₹{feeForVeh}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">{veh.title}</h3>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{veh.subtitle}</p>
                    <div className="mt-2 text-[10px] text-stone-600 font-medium">
                      Max: {veh.maxWeightKg} kg
                    </div>
                  </div>

                  <p className="mt-2.5 pt-2 border-t border-stone-100 text-[10px] text-stone-500 leading-tight">
                    {veh.idealFor}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <span className="text-base leading-none">📱</span>
            <div>
              <strong>Driver Details via WhatsApp:</strong> Vehicle: Delivery Bike (<strong>MH42AU5236</strong>). The direct contact number of the driver will be shared on WhatsApp upon dispatch.
            </div>
          </div>
        </div>

        {/* Step 3: Date & Time Window */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-full bg-[#8c4b3f] text-white text-xs flex items-center justify-center font-mono">
              3
            </span>
            <span>Delivery Date & Preferred Time Window</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Farm / Site Delivery Slot
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                >
                  <option value="Early Morning Farm Batch (07:00 AM - 09:30 AM)">
                    Early Morning Farm Batch (07:00 AM - 09:30 AM)
                  </option>
                  <option value="Morning Batch (09:30 AM - 12:30 PM)">
                    Morning Batch (09:30 AM - 12:30 PM)
                  </option>
                  <option value="Afternoon Batch (02:00 PM - 05:00 PM)">
                    Afternoon Batch (02:00 PM - 05:00 PM)
                  </option>
                  <option value="Evening Sunset Batch (05:00 PM - 08:00 PM)">
                    Evening Sunset Batch (05:00 PM - 08:00 PM)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Items & Additional Instructions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-full bg-[#8c4b3f] text-white text-xs flex items-center justify-center font-mono">
              4
            </span>
            <span>Items & Delivery Instructions</span>
          </div>

          {cartItems.length > 0 ? (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-stone-700">
                <span>Selected Items from Store Catalog ({cartItems.length}):</span>
                <span className="font-mono">Subtotal: ₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-stone-800 bg-white p-2.5 rounded-lg border border-stone-100">
                    <div className="font-medium">
                      {item.product.name} <span className="text-stone-500 font-normal">({item.product.unit})</span>
                    </div>
                    <div className="font-mono text-stone-900 tabular-nums">
                      {item.quantity} × ₹{item.product.price} = ₹{(item.quantity * item.product.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Custom Materials / Items List (or add items from Catalog above)
              </label>
              <textarea
                rows={2}
                value={customItemsText}
                onChange={e => setCustomItemsText(e.target.value)}
                placeholder="e.g. 2 rolls 16mm drip lateral pipe, 5 lengths 63mm PVC pipes, 1 battery sprayer, 2 rolls barbed wire"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Driver Road Notes & Unloading Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Call when near canal bridge; farm entrance is next to grampanchayat well"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
            />
          </div>
        </div>

        {/* Step 5: Summary & Payment Choice */}
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-500">Payment Option</div>
              <div className="flex items-center gap-3 mt-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="accent-[#8c4b3f]"
                  />
                  <span>Cash on Delivery (Pay Driver upon Unloading)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi_on_delivery"
                    checked={paymentMethod === 'upi_on_delivery'}
                    onChange={() => setPaymentMethod('upi_on_delivery')}
                    className="accent-[#8c4b3f]"
                  />
                  <span>UPI / QR Scan upon Delivery</span>
                </label>
              </div>
            </div>

            {/* Total breakdown */}
            <div className="text-right">
              <div className="text-xs text-stone-500">
                Materials: ₹{cartTotal.toLocaleString('en-IN')} + Transport: ₹{calculatedDeliveryFee}
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              ✓ Verified Store Dispatch: Shankar Hardware & Agro Materials ({STORE_INFO.phoneMain})
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm & Schedule Delivery</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#bb948d]/25 text-[#8c4b3f] flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#8c4b3f] uppercase tracking-wider">
                    Booking Confirmed
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-display">
                    Order #{confirmedBooking.orderNumber}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="text-stone-400 hover:text-stone-600 p-1 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.villageArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-semibold text-stone-900">{confirmedBooking.deliveryDate} ({confirmedBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Assigned Transport:</span>
                <span className="font-semibold text-stone-900 font-mono">{confirmedBooking.vehicleNumber} ({confirmedBooking.vehicleType.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Driver Phone:</span>
                <span className="font-semibold text-[#8c4b3f]">Shared on WhatsApp upon dispatch</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-stone-600 font-bold">Payable on Delivery:</span>
                <span className="text-sm font-extrabold text-[#8c4b3f] font-mono">₹{confirmedBooking.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Your delivery order has been logged into our local store dispatch system. You can track this vehicle live in the <strong>Interactive Delivery Map</strong> above!
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${getWhatsAppBookingText(confirmedBooking)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#128C7E] hover:bg-[#0c6b60] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Send to WhatsApp Store Dispatch</span>
              </a>
              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
