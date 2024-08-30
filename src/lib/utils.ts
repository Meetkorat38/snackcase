import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatePrice = (price: number) => {
  const formator = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return formator.format(price);
};
