interface BookingDetails {
  roomType: string;
  guests: number;
  rooms: number;
  nightsStay: number;
  pricePerNight: number;
  totalPrice: number;
}

export const PricingSummary = ({
  roomType,
  guests,
  rooms,
  nightsStay,
  pricePerNight,
  totalPrice,
}: BookingDetails) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-card-foreground">Loại phòng</span>
        <span className="text-card-foreground">{roomType}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-card-foreground">Số khách</span>
        <span className="text-card-foreground">{guests} người</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-card-foreground">Số phòng</span>
        <span className="text-card-foreground">{rooms} phòng</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-card-foreground">Số đêm</span>
        <span className="text-card-foreground">{nightsStay} đêm</span>
      </div>
      <div className="border-t border-border dark:border-primary/30 pt-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-card-foreground">Giá mỗi đêm</span>
          <span className="text-card-foreground">
            {pricePerNight.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center font-bold">
          <span className="text-card-foreground">Tổng tiền</span>
          <span className="text-card-foreground">
            {totalPrice.toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  );
};
