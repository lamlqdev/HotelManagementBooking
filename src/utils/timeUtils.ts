/**
 * Tạo mảng các giờ từ 00:00 đến 23:00
 * @returns string[] Mảng các giờ dạng "HH:00"
 */
export function generateTimeOptions(): string[] {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });
}

/**
 * Format thời gian từ "HH:00" sang định dạng hiển thị
 * @param time Thời gian dạng "HH:00"
 * @returns string Thời gian đã format
 */
export function formatTimeDisplay(time: string): string {
  const [hours] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

/**
 * Kiểm tra xem thời gian check-out có hợp lệ so với check-in
 * @param checkInTime Thời gian check-in
 * @param checkOutTime Thời gian check-out
 * @returns boolean
 */
export function isValidCheckOutTime(
  checkInTime: string,
  checkOutTime: string
): boolean {
  const [checkInHour] = checkInTime.split(":").map(Number);
  const [checkOutHour] = checkOutTime.split(":").map(Number);
  return checkOutHour > checkInHour;
}

/**
 * Tạo placeholder cho select time
 * @param type Loại placeholder ('check-in' | 'check-out')
 * @returns string Placeholder text
 */
export function getTimeSelectPlaceholder(
  type: "check-in" | "check-out"
): string {
  return type === "check-in" ? "Chọn giờ nhận phòng" : "Chọn giờ trả phòng";
}
