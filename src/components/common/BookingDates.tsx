interface BookingDatesProps {
  checkIn: {
    date: string;
    time: string;
  };
  checkOut: {
    date: string;
    time: string;
  };
  nights: number;
}

export const BookingDates = ({
  checkIn,
  checkOut,
  nights,
}: BookingDatesProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 rounded-lg border border-border dark:border-primary/30 p-4 text-center">
        <div className="text-sm text-muted-foreground mb-1">Nhận phòng</div>
        <div className="font-medium text-card-foreground">{checkIn.date}</div>
        <div className="text-sm text-muted-foreground mt-1">
          Từ {checkIn.time}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-16 h-[1px] bg-border dark:bg-primary/30"></div>
        <div className="text-sm text-muted-foreground">{nights} đêm</div>
        <div className="w-16 h-[1px] bg-border dark:bg-primary/30"></div>
      </div>
      <div className="flex-1 rounded-lg border border-border dark:border-primary/30 p-4 text-center">
        <div className="text-sm text-muted-foreground mb-1">Trả phòng</div>
        <div className="font-medium text-card-foreground">{checkOut.date}</div>
        <div className="text-sm text-muted-foreground mt-1">
          Trước {checkOut.time}
        </div>
      </div>
    </div>
  );
};
