// border-zinc-900 bg-zinc-900
// border-blue-900 bg-blue-950
// border-rose-900 bg-rose-950
// border-yellow-500 bg-yellow-500

import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  { label: "Blue", value: "blue", tw: "blue-950" },
  { label: "Rose", value: "rose", tw: "rose-950" },
  { label: "Yellow", value: "yellow", tw: "yellow-500" },
] as const;

export const MODELS = {
  name: "models",
  options: [
    {
      label: "iphone X",
      value: "iphoneX",
    },
    {
      label: "iphone 11",
      value: "iphone11",
    },
    {
      label: "iphone 12",
      value: "iphone12",
    },
    {
      label: "iphone 13",
      value: "iphone13",
    },
    {
      label: "iphone 14",
      value: "iphone14",
    },
    {
      label: "iphone 15",
      value: "iphone15",
    },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Polycarbonate",
      value: "polycarbonate",
      description: "smooth design and no scratches",
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth Finish",
      value: "smooth",
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured Finish",
      value: "textured",
      description: "Soft Grippy textures",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;
