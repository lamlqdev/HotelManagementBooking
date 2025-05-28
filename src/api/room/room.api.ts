import axiosInstance from "@/lib/axios";
import {
  RoomResponse,
  RoomsResponse,
  RoomQueryParams,
  RoomSearchParams,
  RoomDiscountParams,
  CreateRoomFormData,
  UpdateRoomFormData,
  HotelResponse,
} from "./types";

const baseUrl = "/rooms";

export const roomApi = {
  // Lấy danh sách phòng của khách sạn
  getRooms: async (
    hotelId: string,
    params?: RoomQueryParams
  ): Promise<RoomsResponse> => {
    const response = await axiosInstance.get<RoomsResponse>(
      `${baseUrl}/hotels/${hotelId}/rooms`,
      {
        params,
      }
    );
    return response.data;
  },

  // Lấy thông tin chi tiết một phòng
  getRoom: async (id: string): Promise<RoomResponse> => {
    const response = await axiosInstance.get<RoomResponse>(`${baseUrl}/${id}`);
    return response.data;
  },

  // Tạo phòng mới
  createRoom: async (
    hotelId: string,
    data: CreateRoomFormData
  ): Promise<RoomResponse> => {
    const formData = new FormData();

    // Thêm các trường thông tin cơ bản
    formData.append("hotelId", hotelId);
    formData.append("roomName", data.roomName);
    formData.append("description", data.description);
    formData.append("floor", data.floor.toString());
    formData.append("roomType", data.roomType);
    formData.append("bedType", data.bedType);
    formData.append("price", data.price.toString());
    formData.append("capacity", data.capacity.toString());
    formData.append("squareMeters", data.squareMeters.toString());
    formData.append("cancellationPolicy", data.cancellationPolicy);
    if (data.status) {
      formData.append("status", data.status);
    }

    // Thêm amenities
    if (data.amenities && data.amenities.length > 0) {
      formData.append("amenities", JSON.stringify(data.amenities));
    }

    // Thêm ảnh nếu có
    if (data.images) {
      data.images.forEach((image: File) => {
        formData.append("images", image);
      });
    }

    const response = await axiosInstance.post<RoomResponse>(
      `${baseUrl}/hotels/${hotelId}/rooms`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Cập nhật thông tin phòng
  updateRoom: async (
    id: string,
    data: UpdateRoomFormData
  ): Promise<RoomResponse> => {
    const response = await axiosInstance.put<RoomResponse>(
      `${baseUrl}/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Xóa phòng
  deleteRoom: async (id: string): Promise<RoomResponse> => {
    const response = await axiosInstance.delete<RoomResponse>(
      `${baseUrl}/${id}`
    );
    return response.data;
  },

  // Tìm kiếm khách sạn theo tiêu chí
  searchRooms: async (params: RoomSearchParams): Promise<HotelResponse> => {
    const response = await axiosInstance.get<HotelResponse>(
      `/hotels/search`,
      {
        params: {
          ...params,
          sort: params.sort || "price",
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }
    );
    return response.data;
  },

  // Cài đặt giảm giá cho phòng
  setRoomDiscount: async (
    id: string,
    data: RoomDiscountParams
  ): Promise<RoomResponse> => {
    const response = await axiosInstance.put<RoomResponse>(
      `${baseUrl}/${id}/discount`,
      data
    );
    return response.data;
  },

  // Hủy giảm giá phòng
  removeRoomDiscount: async (id: string): Promise<RoomResponse> => {
    const response = await axiosInstance.delete<RoomResponse>(
      `${baseUrl}/${id}/discount`
    );
    return response.data;
  },
};
