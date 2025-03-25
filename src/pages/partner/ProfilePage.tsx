import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang thông tin cá nhân sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
