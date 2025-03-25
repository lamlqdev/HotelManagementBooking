import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Nhắn tin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Hộp thư</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nội dung trang nhắn tin sẽ được thêm sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}
