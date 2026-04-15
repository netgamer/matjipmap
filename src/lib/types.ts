export type PlaceStatus = 'pending' | 'verified' | 'eliminated' | 'reviewing';

export type Category = 'korean' | 'japanese' | 'chinese' | 'western' | 'bunsik' | 'cafe' | 'other';

export interface Menu {
  name: string;
  price: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: Category;
  status: PlaceStatus;
  menus: Menu[];
  phone?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  reportCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  placeId: string;
  nickname: string;
  rating: number;
  text: string;
  visitedAt: string;
  isOnsite: boolean;
  photos: string[];
  revisitIntention: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  placeId?: string;
  nickname: string;
  menuName: string;
  price: number;
  description?: string;
  photo?: string;
  createdAt: string;
}
