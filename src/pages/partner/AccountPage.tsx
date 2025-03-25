import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Quản lý tài khoản</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang quản lý tài khoản sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
