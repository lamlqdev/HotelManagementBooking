import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Thông báo</h1>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang thông báo sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
