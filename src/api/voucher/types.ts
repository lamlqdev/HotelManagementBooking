import { Voucher } from "@/types/voucher";

export interface CreateVoucherRequest {
  code: string;
  discount: number;
  expiryDate: string;
  usageLimit?: number;
  minOrderValue?: number;
}

export interface CreateVoucherResponse {
  success: boolean;
  data: Voucher;
}

export interface GetVouchersResponse {
  success: boolean;
  data: Voucher[];
}

export interface UpdateVoucherRequest {
  discount?: number;
  expiryDate?: string;
  status?: "active" | "inactive" | "expired";
  usageLimit?: number;
  minOrderValue?: number;
}

export interface UpdateVoucherResponse {
  success: boolean;
  data: Voucher;
}

export interface GetAvailableVouchersRequest {
  roomId?: string;
  totalAmount?: number;
}

export interface AvailableVoucher extends Voucher {
  remainingUses: number | null;
  potentialDiscount: number | null;
}

export interface GetAvailableVouchersResponse {
  success: boolean;
  data: AvailableVoucher[];
}
