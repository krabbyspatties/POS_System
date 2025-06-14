import type { Items } from "../Item/Items"

export interface OrderItem {
  id?: number
  order_id?: number
  item_id: number
  item: Items
  quantity: number
  price: number 
  total_price:number
  original_price?: number 
  discount_percent?: number 
}
