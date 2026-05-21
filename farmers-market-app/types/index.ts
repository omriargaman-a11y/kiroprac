export type Category =
  | 'produce'
  | 'meat_dairy'
  | 'baked_goods'
  | 'prepared_foods'
  | 'plants'
  | 'specialty';

export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten_free'
  | 'organic'
  | 'dairy_free'
  | 'nut_free'
  | 'raw'
  | 'paleo'
  | 'keto'
  | 'non_gmo'
  | 'sugar_free'
  | 'local';

export interface Market {
  id: string;
  name: string;
  organizer: string;
  address: string;
  schedule: string;
  nextDate: string;
  preOrderCutoff: string;
  vendorCount: number;
  heroImage: string;
  latitude: number;
  longitude: number;
  supported: boolean;
  city: string;
  state: string;
}

export interface Vendor {
  id: string;
  marketId: string;
  name: string;
  booth: string;
  category: Category;
  tagline: string;
  bio: string;
  location: string;
  coverImage: string;
  avatarImage: string;
  rating: number;
  reviewCount: number;
  certifications: string[];
  instagram?: string;
  email?: string;
  yearsAtMarket: number;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: Category;
  image: string;
  inStock: boolean;
  availableQty?: number;
  tags?: DietaryTag[];
}

export interface CartItem {
  productId: string;
  vendorId: string;
  quantity: number;
}

export interface Order {
  id: string;
  marketId: string;
  items: CartItem[];
  pickupWindow: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'picked_up';
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
}
