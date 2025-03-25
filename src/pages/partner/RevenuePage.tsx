import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevenuePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Quản lý doanh thu</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thống kê doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang quản lý doanh thu sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
