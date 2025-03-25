import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HotelInfoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Thông tin khách sạn</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết khách sạn</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang thông tin khách sạn sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
