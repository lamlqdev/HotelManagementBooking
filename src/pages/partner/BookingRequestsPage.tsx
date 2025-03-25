import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingRequestsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Yêu cầu huỷ/đổi</h1>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang yêu cầu huỷ/đổi sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
