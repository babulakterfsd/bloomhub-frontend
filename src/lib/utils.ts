import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const flowerColors = [
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'blue', label: 'Blue' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
];

export const flowerSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export const flowerArrangementStyle = [
  { value: 'single', label: 'Single' },
  { value: 'bouquet', label: 'Bouquet' },
  { value: 'vase', label: 'Vase' },
  { value: 'basket', label: 'Basket' },
];

export const flowerOccasions = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'wedding', label: 'Wedding' },
];
