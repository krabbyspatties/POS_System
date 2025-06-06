import type { ItemCategories } from "../itemcategory/ItemCategory";

export interface Items {
  item_id: number;
  item_name: string;
  item_description: string;
  item_price: number;
  item_discount: number;
  item_quantity: number;
  item_image: string | File;
  stock_level: string;
  category: ItemCategories; // or just ItemCategories if always present
}