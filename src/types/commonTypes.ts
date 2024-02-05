export type TShopkeeper = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
};

export type TAuthInitialState = {
  shopkeeper: object | null;
  token: string | null;
};

export type TCurrentShopkeeper = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type TProduct = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  bloomdate: string;
  discount: string;
  type: string;
  fragrance: string;
  colors: string[];
  sizes: string[];
  arrangementStyles: string[];
  occasions: string[];
  createdBy: string;
  creatorsEmail: string;
};

export type TSoldProduct = {
  _id: string;
  productID: string;
  productName: string;
  productPrice: number;
  quantityToBeSold: number;
  buyerName: string;
  dateOfSell: string;
  totalBill: number;
};

export type TAllFilters = {
  minPrice: number;
  maxPrice: number;
  bloomdatefrom: string;
  bloomdateto: string;
  color: string;
  size: string;
  arrangementStyle: string;
  occasion: string;
  fragrance: string;
  discount: string;
  type: string;
};

export type TTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'alltime';
