export interface Voucher {
  _id: string;
  code: string;
  discount: number;
  discountType: "fixed" | "percentage";
  maxDiscount?: number;
  expiryDate: Date;
  status: "active" | "inactive";
  usageLimit?: number;
  usageCount: number;
  minOrderValue: number;
  type: "room" | "service";
  applicableTiers: ("Bronze" | "Silver" | "Gold")[];
  createdAt: Date;
  updatedAt: Date;
}
