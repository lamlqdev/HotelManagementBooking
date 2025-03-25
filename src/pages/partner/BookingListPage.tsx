import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Danh sách đặt phòng</h1>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách các đơn đặt phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang danh sách đặt phòng sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
