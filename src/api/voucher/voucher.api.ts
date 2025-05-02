import axiosInstance from "@/lib/axios";
import {
  CreateVoucherRequest,
  CreateVoucherResponse,
  GetVouchersResponse,
  UpdateVoucherRequest,
  UpdateVoucherResponse,
  GetAvailableVouchersRequest,
  GetAvailableVouchersResponse,
} from "./types";

const API_URL = "/vouchers";

export const voucherApi = {
  // Tạo voucher mới
  createVoucher: async (
    data: CreateVoucherRequest
  ): Promise<CreateVoucherResponse> => {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  },

  // Lấy danh sách voucher
  getVouchers: async (): Promise<GetVouchersResponse> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Cập nhật voucher
  updateVoucher: async (
    voucherId: string,
    data: UpdateVoucherRequest
  ): Promise<UpdateVoucherResponse> => {
    const response = await axiosInstance.put(`${API_URL}/${voucherId}`, data);
    return response.data;
  },

  // Lấy danh sách voucher có thể sử dụng
  getAvailableVouchers: async (
    params: GetAvailableVouchersRequest
  ): Promise<GetAvailableVouchersResponse> => {
    const response = await axiosInstance.get(`${API_URL}/available`, {
      params,
    });
    return response.data;
  },
};
