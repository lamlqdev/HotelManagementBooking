import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Cài đặt</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang cài đặt sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
