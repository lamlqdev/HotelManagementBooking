import { useLocation, Outlet, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { UserCog, LogOut, Bell, Settings, Building2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Logo } from "@/components/ui/logo";
import { logout } from "@/features/auth/authSlice";

export default function AdminLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Hàm lấy chữ cái đầu tiên của tên người dùng
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Hàm lấy câu chào theo buổi
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t("greetings.morning");
    } else if (hour < 18) {
      return t("greetings.afternoon");
    } else {
      return t("greetings.evening");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <div className="relative">
          <Sidebar
            className="w-64 border-r border-sidebar-border bg-sidebar group"
            collapsible="icon"
          >
            <SidebarHeader className="px-6 py-4">
              <div className="flex flex-col items-center gap-3">
                <Link to="/">
                  <Logo className="group-data-[collapsible=icon]:scale-75 transition-transform" />
                </Link>
                <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-muted-foreground">
                    {getGreeting()}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {user?.name?.split(" ")[0] || ""}
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <div className="px-4 group-data-[collapsible=icon]:px-2">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarContent className="px-4 py-1 group-data-[collapsible=icon]:px-2">
              <SidebarMenu className="space-y-1">
                {/* Partner Account Management */}
                <SidebarMenuItem>
                  <Link to="/admin/partners">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/admin/partners")}
                      tooltip={t("admin.partners.approval.title")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    >
                      <UserCog className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t("admin.partners.approval.title")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                {/* Hotel Management */}
                <SidebarMenuItem>
                  <Link to="/admin/hotels">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith("/admin/hotels")}
                      tooltip={t("admin.hotels.title")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t("admin.hotels.title")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <div className="px-4 group-data-[collapsible=icon]:px-2">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarFooter className="px-4 py-3 group-data-[collapsible=icon]:px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-10 w-10 ring-2 ring-sidebar-ring/10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                      <AvatarImage
                        src={
                          user?.avatar && user.avatar.length > 0
                            ? user.avatar[0].url
                            : user?.defaultAvatar || "/avatar.png"
                        }
                        alt={user?.name || "Admin avatar"}
                      />
                      <AvatarFallback>
                        {user?.name ? getInitials(user.name) : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        {user?.name || "Admin Name"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "admin@example.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-sidebar border-sidebar-border"
                >
                  <DropdownMenuLabel className="text-sidebar-foreground">
                    {t("common.account")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <Link to="/admin/profile">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.personalInfo")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/settings">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/notifications">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Bell className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.notifications")}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                    {t("common.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
        </div>

        <main className="flex-1 flex flex-col p-4">
          <SidebarTrigger className="mb-4" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
