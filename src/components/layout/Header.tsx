import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Notification } from "@/types/notification";

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotifications(user?.id);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header>
      <div className="container mx-auto bg-card rounded-lg p-2">
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center">
            <Logo className="h-8" showDot={false} />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.locations")}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/partnership"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.partnership")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative group"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white shadow z-10 transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-80 max-h-96 overflow-auto rounded-xl shadow-2xl border border-gray-200 bg-white p-0"
                    align="end"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                      <span className="font-semibold text-base text-gray-800">
                        {t("notification.title", "Thông báo")}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs text-primary underline hover:text-primary/80 transition-colors"
                          onClick={markAllAsRead}
                        >
                          {t(
                            "notification.markAllAsRead",
                            "Đánh dấu tất cả đã đọc"
                          )}
                        </button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                        {t("notification.empty", "Không có thông báo nào")}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className={`flex flex-col items-start w-full cursor-pointer px-4 py-3 gap-1 transition-all rounded-lg mb-1 last:mb-0 border-l-4 group
                            ${
                              n.status === "unread"
                                ? "bg-gray-50 border-primary"
                                : "bg-white border-transparent"
                            } focus:bg-transparent focus:text-inherit hover:bg-gray-100`}
                          onClick={() => {
                            markAsRead(n.id);
                            setSelectedNotification(n);
                          }}
                        >
                          <span className="font-medium line-clamp-1 text-gray-900">
                            {n.title}
                          </span>
                          <span className="text-xs text-gray-600 line-clamp-2">
                            {n.message}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dialog hiển thị chi tiết thông báo */}
                <Dialog
                  open={!!selectedNotification}
                  onOpenChange={(open) => {
                    if (!open) setSelectedNotification(null);
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedNotification?.title}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="mb-2 text-sm text-muted-foreground">
                        {selectedNotification?.status === "unread"
                          ? "Chưa đọc"
                          : "Đã đọc"}
                      </div>
                      <div className="mb-2 text-base text-foreground">
                        {selectedNotification?.message}
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedNotification &&
                          new Date(
                            selectedNotification.createdAt
                          ).toLocaleString()}
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.avatar?.url || "/images/default-avatar.png"}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/partners">
                            {t("dropdown.manage")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "partner" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/partner/hotels/info">
                            {t("dropdown.hotelInfo")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/partner/bookings/orders">
                            {t("dropdown.bookingOrders")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/partner/revenue">
                            {t("dropdown.revenue")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/favourite-hotels">
                            {t("dropdown.favouriteHotels")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "user" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">{t("dropdown.profile")}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/bookings">{t("dropdown.myBookings")}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/favourite-hotels">
                            {t("dropdown.favouriteHotels")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role !== "partner" && (
                      <DropdownMenuItem asChild>
                        <Link to="/settings">{t("dropdown.settings")}</Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("dropdown.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hover:bg-primary" asChild>
                  <Link to="/register">{t("auth.register_button")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">{t("auth.login_button")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
