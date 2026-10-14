import React, { useEffect, useRef, useState } from 'react';
import { STORE_INFO, DELIVERY_ZONES, VEHICLE_OPTIONS } from '../data/storeData';
import { DeliveryBooking, DeliveryZone } from '../types/store';
import { MapPin, Navigation, Truck, Phone, CheckCircle2, Clock, AlertCircle, Compass, Layers, ShieldCheck, MessageSquare } from 'lucide-react';
import L from 'leaflet';

interface InteractiveMapProps {
  selectedLocation?: { lat: number; lng: number; name?: string };
  onLocationSelect?: (loc: { lat: number; lng: number; villageArea: string; distanceKm: number; zone: DeliveryZone }) => void;
  activeBooking?: DeliveryBooking | null;
  interactiveMode?: 'select_destination' | 'track_order' | 'store_overview';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedLocation,
  onLocationSelect,
  activeBooking,
  interactiveMode = 'select_destination'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const trackingMarkerRef = useRef<L.Marker | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);

  const [activeTab, setActiveTab] = useState<'map' | 'track'>(activeBooking ? 'track' : 'map');
  const [currentDistance, setCurrentDistance] = useState<number>(activeBooking?.distanceKm || 7.5);
  const [currentZone, setCurrentZone] = useState<DeliveryZone>(DELIVERY_ZONES[1]);
  const [selectedVillageName, setSelectedVillageName] = useState<string>(activeBooking?.villageArea || 'Katewadi Rural Farm');
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number }>(
    selectedLocation || activeBooking?.destinationCoords || { lat: 18.182, lng: 74.625 }
  );

  // Haversine distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const getZoneForDistance = (dist: number): DeliveryZone => {
    if (dist <= 5) return DELIVERY_ZONES[0];
    if (dist <= 15) return DELIVERY_ZONES[1];
    return DELIVERY_ZONES[2];
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const storeLat = STORE_INFO.coordinates.lat;
    const storeLng = STORE_INFO.coordinates.lng;

    const map = L.map(mapContainerRef.current, {
      center: [storeLat, storeLng],
      zoom: 11,
      scrollWheelZoom: false
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Custom Store Marker Icon
    const storeIcon = L.divIcon({
      className: 'custom-store-pin',
      html: `
        <div style="background-color: #8c4b3f; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(140,75,63,0.4); border: 3px solid #ffffff; font-weight: bold; font-size: 16px;">
          🏪
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const storeMarker = L.marker([storeLat, storeLng], { icon: storeIcon }).addTo(map);
    storeMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; min-width: 200px;">
        <strong style="color: #8c4b3f; font-size: 14px;">${STORE_INFO.name}</strong><br/>
        <span style="color: #6b332a; font-weight: 600; font-size: 12px;">${STORE_INFO.regionalName}</span><br/>
        <div style="color: #b45309; font-weight: bold; font-size: 12px; margin: 2px 0;">⭐ 5.0 (1 Google Review) · Hardware store</div>
        <p style="margin: 4px 0; color: #334155; font-size: 12px;">${STORE_INFO.address}</p>
        <div style="color: #64748b; font-size: 11px;">Plus Code: ${STORE_INFO.plusCode}</div>
        <div style="margin-top: 6px; font-weight: 600; color: #8c4b3f;">📞 ${STORE_INFO.phoneMain}</div>
        <a href="https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra" target="_blank" rel="noreferrer" style="display: inline-block; margin-top: 6px; color: #2563eb; text-decoration: underline; font-size: 11px;">Open in Google Maps</a>
      </div>
    `);

    // Draw Delivery Radius Circles (Warm Terracotta / Rust Palette)
    const z1 = L.circle([storeLat, storeLng], {
      color: '#bb948d',
      fillColor: '#bb948d',
      fillOpacity: 0.16,
      weight: 2,
      dashArray: '4 4',
      radius: 5000
    }).addTo(map).bindTooltip("Zone 1: 0 - 5 km (Fast Bike MH42AU5236)", { sticky: true });

    const z2 = L.circle([storeLat, storeLng], {
      color: '#c2410c',
      fillColor: '#ea580c',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6 6',
      radius: 15000
    }).addTo(map).bindTooltip("Zone 2: 5 - 15 km", { sticky: true });

    const z3 = L.circle([storeLat, storeLng], {
      color: '#7c2d12',
      fillColor: '#991b1b',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '8 8',
      radius: 30000
    }).addTo(map).bindTooltip("Zone 3: 15 - 30 km", { sticky: true });

    circlesRef.current = [z1, z2, z3];

    // Destination Pin Custom Icon
    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div style="background-color: #dc2626; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220,38,38,0.4); border: 3px solid #ffffff; font-size: 14px;">
          📍
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const initDest = selectedLocation || destCoords;
    const destMarker = L.marker([initDest.lat, initDest.lng], {
      icon: destIcon,
      draggable: true
    }).addTo(map);

    destMarker.bindPopup(`<strong>Delivery Destination</strong><br/>${selectedVillageName}`).openPopup();
    destinationMarkerRef.current = destMarker;

    // Map Click Handler for Dropping Pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const dist = calculateDistance(storeLat, storeLng, lat, lng);
      const zone = getZoneForDistance(dist);

      destMarker.setLatLng([lat, lng]);
      destMarker.setPopupContent(`<strong>Selected Delivery Location</strong><br/>Distance: ${dist} km (${zone.name})`).openPopup();

      setDestCoords({ lat, lng });
      setCurrentDistance(dist);
      setCurrentZone(zone);
      setSelectedVillageName(`Selected Farm Point (${dist} km)`);

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          villageArea: `Selected Point (${dist} km from Market Yard)`,
          distanceKm: dist,
          zone
        });
      }
    });

    // Marker Drag Handler
    destMarker.on('dragend', () => {
      const pos = destMarker.getLatLng();
      const dist = calculateDistance(storeLat, storeLng, pos.lat, pos.lng);
      const zone = getZoneForDistance(dist);

      setDestCoords({ lat: pos.lat, lng: pos.lng });
      setCurrentDistance(dist);
      setCurrentZone(zone);
      setSelectedVillageName(`Dropped Pin (${dist} km)`);

      if (onLocationSelect) {
        onLocationSelect({
          lat: pos.lat,
          lng: pos.lng,
          villageArea: `Dropped Pin (${dist} km)`,
          distanceKm: dist,
          zone
        });
      }
    });

    // If active booking with in-transit status, add animated driver vehicle marker
    if (activeBooking && activeBooking.status === 'in_transit') {
      const driverLat = (storeLat * 0.35) + (activeBooking.destinationCoords.lat * 0.65);
      const driverLng = (storeLng * 0.35) + (activeBooking.destinationCoords.lng * 0.65);

      const isBike = activeBooking.vehicleType === 'bike' || activeBooking.vehicleNumber?.includes('MH42AU5236');
      const vehIconEmoji = isBike ? '🏍️' : '🚚';

      const truckIcon = L.divIcon({
        className: 'custom-truck-pin',
        html: `
          <div style="background-color: #2563eb; color: white; width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(37,99,235,0.5); border: 2.5px solid #ffffff; font-size: 20px;">
            ${vehIconEmoji}
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const truckMarker = L.marker([driverLat, driverLng], { icon: truckIcon }).addTo(map);
      truckMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; min-width: 180px;">
          <strong style="color: #1e40af;">Live Dispatch Vehicle</strong><br/>
          Vehicle: <strong>${activeBooking.vehicleNumber || 'MH42AU5236'}</strong><br/>
          <span style="color: #047857; font-size: 11px;">Driver number shared on WhatsApp upon dispatch</span><br/>
          <strong>Status: En Route (Approaching Farm Gate)</strong>
        </div>
      `).openPopup();

      trackingMarkerRef.current = truckMarker;

      // Draw route line from store to destination
      L.polyline([
        [storeLat, storeLng],
        [driverLat, driverLng],
        [activeBooking.destinationCoords.lat, activeBooking.destinationCoords.lng]
      ], {
        color: '#2563eb',
        weight: 4,
        dashArray: '8 6',
        opacity: 0.8
      }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeBooking]);

  // Handle Village Quick Select
  const handleSelectPredefinedVillage = (village: string, lat: number, lng: number) => {
    setSelectedVillageName(village);
    setDestCoords({ lat, lng });

    const storeLat = STORE_INFO.coordinates.lat;
    const storeLng = STORE_INFO.coordinates.lng;
    const dist = calculateDistance(storeLat, storeLng, lat, lng);
    const zone = getZoneForDistance(dist);

    setCurrentDistance(dist);
    setCurrentZone(zone);

    if (destinationMarkerRef.current && mapInstanceRef.current) {
      destinationMarkerRef.current.setLatLng([lat, lng]);
      destinationMarkerRef.current.setPopupContent(`<strong>${village}</strong><br/>Distance: ${dist} km (${zone.name})`).openPopup();
      mapInstanceRef.current.panTo([lat, lng]);
    }

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        villageArea: village,
        distanceKm: dist,
        zone
      });
    }
  };

  const sampleVillagesList = [
    { name: 'Sonwadi Gavthan & Store Hub', lat: 18.4811, lng: 74.5557, zone: 'Zone 1' },
    { name: 'Sonawadi Farm Gats / Canal', lat: 18.4890, lng: 74.5620, zone: 'Zone 1' },
    { name: 'Gopalwadi Phata', lat: 18.4680, lng: 74.5420, zone: 'Zone 1' },
    { name: 'Girim Agricultural Belt', lat: 18.5120, lng: 74.5680, zone: 'Zone 2' },
    { name: 'Daund APMC & Town', lat: 18.4650, lng: 74.5820, zone: 'Zone 2' },
    { name: 'Ravangaon Rural Belt', lat: 18.4350, lng: 74.6210, zone: 'Zone 2' },
    { name: 'Kurkumbh Agro & MIDC', lat: 18.4120, lng: 74.5240, zone: 'Zone 2' },
    { name: 'Patas Sugar Factory Road', lat: 18.4350, lng: 74.4120, zone: 'Zone 3' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 md:p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8c4b3f]">
            <Compass className="w-4 h-4 text-[#8c4b3f]" />
            <span>Geo-Tracking & Delivery Radar</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 mt-1">
            Store Location & Farm Delivery Coverage
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Interactive OpenStreetMap for instant distance calculation, radius coverage & live delivery status.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-[#8c4b3f] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Delivery Radius Map
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'track'
                ? 'bg-[#8c4b3f] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-200" />
            <span>Track Active Order</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Map Container Column */}
        <div className="lg:col-span-8 relative h-[420px] md:h-[500px] w-full bg-stone-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Controls Floating Overlay */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto">
            <a
              href="https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-lg shadow-md border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#8c4b3f]" />
              <span>Get Directions (Google Maps)</span>
            </a>
            <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-stone-200 text-[11px] text-stone-700 font-medium">
              <span className="text-amber-500 font-bold">★ 5.0</span> (1 review) · <span className="font-mono text-stone-500">{STORE_INFO.plusCode}</span>
            </div>
          </div>

          {/* Quick legend on bottom left of map */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-stone-200 shadow-md text-[11px] text-stone-700 space-y-1 hidden sm:block">
            <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>Coverage Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#bb948d]/50 border border-[#8c4b3f] inline-block" />
              <span>Zone 1 (0-5 km): ₹49 bike drop</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-600 inline-block" />
              <span>Zone 2 (5-15 km): ₹149 delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-600 inline-block" />
              <span>Zone 3 (15-30 km): ₹299 delivery</span>
            </div>
          </div>
        </div>

        {/* Info & Action Sidebar Column */}
        <div className="lg:col-span-4 p-5 md:p-6 bg-white border-t lg:border-t-0 lg:border-l border-stone-100 flex flex-col justify-between">
          {activeTab === 'map' ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Pin Selected Location
                </span>
                <div className="mt-1 flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-stone-900 leading-tight text-base">
                      {selectedVillageName}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Lat: {destCoords.lat.toFixed(4)}, Lng: {destCoords.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distance & Zone metrics card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                  <span className="text-xs text-stone-600 font-medium">Distance from Store:</span>
                  <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                    {currentDistance} km
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                  <span className="text-xs text-stone-600 font-medium">Calculated Zone:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-[#723026] bg-[#bb948d]/25">
                    {currentZone.name.split(':')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                  <span className="text-xs text-stone-600 font-medium">Standard Delivery Fee:</span>
                  <span className="text-sm font-bold text-[#8c4b3f] font-mono tabular-nums">
                    ₹{currentZone.standardFee}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-medium">Est. Dispatch Time:</span>
                  <span className="text-xs text-stone-700 font-medium">
                    {currentZone.estTime.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Quick Village Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Quick Select Common Village / Area:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {sampleVillagesList.map((village, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPredefinedVillage(village.name, village.lat, village.lng)}
                      className={`text-left p-2 rounded-lg text-xs transition-colors border ${
                        selectedVillageName === village.name
                          ? 'border-[#8c4b3f] bg-[#bb948d]/15 text-[#5c241b] font-semibold'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="truncate">{village.name}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{village.zone}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8c4b3f] shrink-0 mt-0.5" />
                <span>
                  <strong>Driver Tip:</strong> You can click or drag the red marker anywhere on the map to target your farm canal road or gate accurately.
                </span>
              </div>
            </div>
          ) : (
            /* Live Order Tracking view */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    Order Tracking Mode
                  </span>
                  <h3 className="font-bold text-stone-900 text-lg">
                    {activeBooking ? activeBooking.orderNumber : 'SHK-8921'}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  {activeBooking?.status === 'in_transit' ? 'En Route' : 'Packing & Inspection'}
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#8c4b3f] border-2 border-white flex items-center justify-center text-[9px] text-white">
                    ✓
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Order Placed & Confirmed</h4>
                  <p className="text-[11px] text-stone-500">Materials reserved at Shankar Hardware warehouse</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#8c4b3f] border-2 border-white flex items-center justify-center text-[9px] text-white">
                    ✓
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Quality Checked & Dispatched</h4>
                  <p className="text-[11px] text-stone-500">Loaded on Delivery Bike (MH42AU5236)</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white animate-pulse" />
                  <h4 className="text-xs font-bold text-blue-900">On The Road (In-Transit)</h4>
                  <p className="text-[11px] text-stone-500">Approaching destination along rural road</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-stone-300 border-2 border-white" />
                  <h4 className="text-xs font-bold text-stone-500">Farm Gate Drop & Unloading</h4>
                  <p className="text-[11px] text-stone-400">ETA: Within 25-35 minutes</p>
                </div>
              </div>

              {/* Driver Details Card */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-stone-500">Vehicle:</div>
                  <div className="text-xs font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {activeBooking?.vehicleNumber || 'MH42AU5236 (Delivery Bike)'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-stone-500">Delivery Address:</div>
                  <div className="text-xs font-medium text-stone-800 truncate max-w-[170px]">
                    {activeBooking?.villageArea || 'Sonwadi / Girim Farm'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
                  <strong>Driver Contact:</strong> Number of driver will be shared on WhatsApp upon order dispatch from Sonwadi store.
                </div>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`Namaste Shankar Hardware, please share driver phone and tracking details for Order ${activeBooking?.orderNumber || 'SHK-8921'} (Vehicle ${activeBooking?.vehicleNumber || 'MH42AU5236'}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#128C7E] hover:bg-[#0c6b60] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Driver Info on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Bottom store hotline */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Store Dispatch Line:</span>
            <a href={`tel:${STORE_INFO.phoneMain}`} className="font-semibold text-[#8c4b3f] hover:underline font-mono">
              {STORE_INFO.phoneMain}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
