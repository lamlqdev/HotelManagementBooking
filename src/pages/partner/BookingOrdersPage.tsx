import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Quản lý đơn đặt phòng</h1>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn đặt phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang quản lý đơn đặt phòng sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
