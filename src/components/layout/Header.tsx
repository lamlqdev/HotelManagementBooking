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

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </Button>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            user.avatar && user.avatar.length > 0
                              ? user.avatar[0].url
                              : user.defaultAvatar ||
                                "/images/default-avatar.png"
                          }
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
