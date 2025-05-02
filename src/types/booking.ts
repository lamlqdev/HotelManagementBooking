export interface BookingContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface BookingGuestInfo {
  name: string;
  email?: string;
  phone: string;
}

export interface BookingSpecialRequests {
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  additionalRequests?: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  bookingFor: "self" | "other";
  contactInfo: BookingContactInfo;
  guestInfo?: BookingGuestInfo;
  specialRequests?: BookingSpecialRequests;
  checkIn: Date;
  checkOut: Date;
  voucherId?: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentMethod: "zalopay" | "vnpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}