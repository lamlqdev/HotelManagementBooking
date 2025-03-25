import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoomManagementPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Quản lý phòng</h1>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang quản lý phòng sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
