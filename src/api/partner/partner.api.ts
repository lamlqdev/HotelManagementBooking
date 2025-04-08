import axiosInstance from "@/lib/axios";
import { PartnerFormData } from "./types";
const API_URL = "/users";

export const partnerApi = {
  registerPartner: async (data: PartnerFormData) => {
    const response = await axiosInstance.post(
      `${API_URL}/register-partner`,
      data
    );
    return response.data;
  },
};
