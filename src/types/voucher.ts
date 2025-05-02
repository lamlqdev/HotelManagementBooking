export interface Voucher {
  id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  maxDiscount?: number;
  expiryDate: Date;
  status: "active" | "inactive" | "expired";
  usageLimit?: number;
  usageCount: number;
  minOrderValue?: number;
  type: "room" | "hotel" | "all";
  createdAt: Date;
  updatedAt: Date;
}