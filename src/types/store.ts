export type ProductCategory = 
  | 'all'
  | 'agro_hardware'
  | 'irrigation'
  | 'power_tools'
  | 'hardware_plumbing'
  | 'farm_tools'
  | 'construction_fasteners';

export interface Product {
  id: string;
  name: string;
  regionalName?: string;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  unit: string;
  minOrderQty: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  iconType: 'irrigation' | 'sprayer' | 'drill' | 'pipes' | 'tools' | 'safety' | 'cement' | 'pump' | 'fasteners' | 'fencing';
  badge?: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  applications: string[];
  popular?: boolean;
}

export type VehicleType = 'bike' | 'rickshaw' | 'tata_ace' | 'pickup' | 'tractor';

export interface VehicleOption {
  type: VehicleType;
  title: string;
  subtitle: string;
  vehicleNumber?: string;
  maxWeightKg: number;
  baseCharge: number;
  perKmRate: number;
  icon: string;
  idealFor: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  radiusKm: number;
  minKm: number;
  maxKm: number;
  standardFee: number;
  estTime: string;
  villages: string[];
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryBooking {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  alternatePhone?: string;
  villageArea: string;
  landmarkAddress: string;
  pincode: string;
  deliveryDate: string;
  timeSlot: string;
  vehicleType: VehicleType;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unit: string;
  }[];
  itemsTotal: number;
  distanceKm: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'cash_on_delivery' | 'upi_on_delivery' | 'advance_booking';
  status: 'confirmed' | 'packing' | 'in_transit' | 'delivered';
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  destinationCoords: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface StoreContact {
  name: string;
  regionalName: string;
  shortName: string;
  proprietor: string;
  category: string;
  tagline: string;
  address: string;
  landmark: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  plusCode: string;
  phoneMain: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  website: string;
  googleMapsReviewScore: number;
  googleMapsReviewsCount: number;
  openingHours: string;
  holidays: string;
  gstin: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
