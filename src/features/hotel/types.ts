import { Hotel } from "@/types/hotel";

export interface HotelState {
  currentHotel: Hotel | null;
  isLoading: boolean;
  error: string | null;
}
