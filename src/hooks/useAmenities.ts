import { useQuery } from "@tanstack/react-query";
import { amenitiesApi } from "@/api/amenities/amenities.api";

export const useAmenities = () => {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await amenitiesApi.getAmenities();
      return response.data;
    },
  });
};
