import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotifications(user?.id);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Thông báo</h1>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mt-2">
              Danh sách các thông báo mới nhất dành cho bạn.
            </p>
          </div>
          <Card className="shadow-none border-0">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Không có thông báo nào
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-lg border-l-4 p-4 cursor-pointer transition-all ${
                        n.status === "unread"
                          ? "bg-gray-50 border-primary shadow"
                          : "bg-white border-transparent"
                      } hover:bg-gray-100`}
                      onClick={() => n.status === "unread" && markAsRead(n.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 line-clamp-1">
                          {n.title}
                        </span>
                        {n.status === "unread" && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-primary text-white">
                            Mới
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {n.message}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Card>
      </div>
    </div>
  );
}
