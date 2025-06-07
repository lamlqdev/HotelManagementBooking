import { useLocation, Outlet, Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Building2,
  Hotel,
  DoorOpen,
  CalendarCheck,
  FileEdit,
  Settings,
  LogOut,
  DollarSign,
  ClipboardList,
  UserCog,
  ChevronDown,
  Bell,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";

export default function PartnerLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    hotels: location.pathname.startsWith("/partner/hotels"),
    bookings: location.pathname.startsWith("/partner/bookings"),
  });

  const { currentHotel } = useAppSelector((state) => state.hotel);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <div className="relative">
          <Sidebar
            className="w-64 border-r border-sidebar-border bg-sidebar group"
            collapsible="icon"
          >
            <SidebarHeader className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentHotel?.featuredImage?.url}
                  alt="Hotel Featured Image"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-sidebar-ring/10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-xs text-muted-foreground">
                    {t("welcome")},
                  </span>
                  <span className="text-sm font-medium text-sidebar-foreground">
                    {currentHotel?.name}
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <div className="px-4 group-data-[collapsible=icon]:px-2">
              <SidebarSeparator className="my-1" />
            </div>

            <SidebarContent className="px-4 py-1 group-data-[collapsible=icon]:px-2">
              <SidebarMenu className="space-y-1">
                {/* Revenue Management */}
                <SidebarMenuItem>
                  <Link to="/partner/revenue">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(
                        "/partner/revenue"
                      )}
                      tooltip={t("partner.dashboard.revenue")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t("partner.dashboard.revenue")}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                {/* Hotel Management */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith("/partner/hotels")}
                    tooltip={t("partner.dashboard.hotels")}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    onClick={() => toggleMenu("hotels")}
                  >
                    <Hotel className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {t("partner.dashboard.hotels")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                        openMenus.hotels ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openMenus.hotels && (
                    <SidebarMenuSub className="mt-2 space-y-1 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/info" className="block">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/info"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg w-full"
                          >
                            <Building2 className="h-4 w-4" />
                            <span>{t("partner.hotels.info")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/rooms" className="block">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/rooms"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg w-full"
                          >
                            <DoorOpen className="h-4 w-4" />
                            <span>{t("partner.hotels.rooms")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link to="/partner/hotels/status">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/hotels/status"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <ClipboardList className="h-4 w-4" />
                            <span>{t("partner.hotels.status")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Booking Management */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith("/partner/bookings")}
                    tooltip={t("partner.dashboard.bookings")}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    onClick={() => toggleMenu("bookings")}
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {t("partner.dashboard.bookings")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                        openMenus.bookings ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openMenus.bookings && (
                    <SidebarMenuSub className="mt-2 space-y-1 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSubItem>
                        <Link to="/partner/bookings/orders">
                          <SidebarMenuSubButton
                            isActive={
                              location.pathname === "/partner/bookings/orders"
                            }
                            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
                          >
                            <FileEdit className="h-4 w-4" />
                            <span>{t("partner.bookings.orders")}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Messages */}
                <SidebarMenuItem>
                  <Link to="/partner/messages">
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(
                        "/partner/messages"
                      )}
                      tooltip={t("partner.dashboard.messages")}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg group-data-[collapsible=icon]:justify-center"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t("partner.dashboard.messages")}
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
                        src={user?.avatar?.url}
                        alt="Partner avatar"
                      />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
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
                  <Link to="/partner/profile">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.personalInfo")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/partner/settings">
                    <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent-foreground" />
                      {t("common.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/partner/notifications">
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
