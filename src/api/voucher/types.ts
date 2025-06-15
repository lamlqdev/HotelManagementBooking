import { Voucher } from "@/types/voucher";

export interface CreateVoucherRequest {
  code: string;
  discount: number;
  startDate?: string;
  expiryDate: string;
  status?: "active" | "inactive" | "expired";
  usageLimit?: number;
  minOrderValue?: number;
  discountType: "percentage" | "fixed";
  maxDiscount?: number | null;
  applicableTiers?: string[];
}

export interface CreateVoucherResponse {
  success: boolean;
  data: Voucher;
}

export interface GetVouchersResponse {
  success: boolean;
  count: number;
  data: Voucher[];
}

export interface UpdateVoucherRequest {
  discount?: number;
  startDate?: string;
  expiryDate?: string;
  status?: "active" | "inactive" | "expired";
  usageLimit?: number;
  minOrderValue?: number;
  discountType?: "percentage" | "fixed";
  maxDiscount?: number | null;
}

export interface UpdateVoucherResponse {
  success: boolean;
  data: Voucher;
}

export interface GetAvailableVouchersRequest {
  roomId?: string;
  serviceId?: string;
  totalAmount?: number;
}

export interface AvailableVoucher extends Voucher {
  remainingUses: number | null;
  potentialDiscount: number | null;
}

export interface GetAvailableVouchersResponse {
  success: boolean;
  count: number;
  data: AvailableVoucher[];
}
